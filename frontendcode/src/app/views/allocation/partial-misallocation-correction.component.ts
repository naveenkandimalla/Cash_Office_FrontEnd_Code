// Partial MisAllocation Correction - Allocation Module
// initially policy code & period details are ccoming from VW_PARTIAL_MISALLOCATED_POLICY 
// vmp.PolicyCode =4001526282 and vmp.period="2019-03-01 00:00:00"
// after saving  existing policy coming from VW_PARTIAL_MISALLOCATED_POLICY a record is generated in the table [T_POL_PARTIAL_MISALLOC_HDR] ,T_POL_PARTIAL_MISALL_FROM_DET 
// testing policy code -- 4007552269,//4007552188

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { HttpClient, HttpParams} from '@angular/common/http';
import { PagerService, GlobalServices } from './../../services/index';
import { apiURL } from '../../_nav';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { LoadingSpinnerComponent } from '../../services/loading-spinner/loading-spinner.component';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';



@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators,
    FormArray,
    FormBuilder
]
})

@Component({
  templateUrl: './partial-misallocation-correction.component.html',
  styleUrls: ['../../services/loading-spinner/loading-spinner.component.css']
})
export class PartialMisallocationCorrectionComponent {
 
  constructor(private http:HttpClient,private pagerService: PagerService,
                private fb: FormBuilder,private modalService: BsModalService,
                private router:Router,
                 private tokendetails:TokenStorageService){}


   viewMisallocations = false ;
   makeCorrections = false ; 
   isReadOnly:any=true;
   newmanualrecord:any=[];
   insertrecordhdr:any=[];
   insertrecordfromdetpartial:any=[]
   totalallocatedamount:any;
   totalallocatedamount1:any;
   insertnewrecordtodet:any=[];
   totalAllocatedAmount: number ;
   postlabel:boolean=true;
   misallocatedpolicyinfo:any;
   misallocparialtodet:any;
   count:any=0;
   count1:any=0;
   amount:any=0;
   finalamount:any=0;
   hdrid:any;
   transcartiontype1:any;
   intcashofficearray:any=[];
   addlabel:boolean=true;
   spinloaderlabel:boolean=false;
   spinnerlabel:boolean=false;
   searchlabel:boolean=true;
   myForm: FormGroup;
   username:any;
   userid:any;
   savelabel:boolean=true;

ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })  

    this.getsessionvalues();
  }

  getsessionvalues(){
    this.username= this.tokendetails.getUsername();
    this.userid= this.tokendetails.getuserid();
   }

  toggleMakeCorrections(transaction_type){
    if ( transaction_type == 'allocate')
    {
      this.makeCorrections = true ;
    }

    if ( transaction_type == 'reverse')
    {
      this.makeCorrections = false ;
    }
  }
  
  misallocatedInput = new FormGroup({
   policyCode: new FormControl('', Validators.required),
   period: new FormControl('', Validators.required),
   misallocationID: new FormControl({value: '', disabled: true}),
   radios: new FormControl(''), // radio button things
  transType: new FormControl('') // radio button things
  }) ;

  policycorrection = new FormGroup({
    policycode1: new FormControl(''),
    period1: new FormControl(''),
    partyid : new FormControl(''),
    payername:  new FormControl(''),
    expectedamount: new FormControl(''),
    purpose :  new FormControl(''),
    allocated: new FormControl('')
  });


  bsModalRef: BsModalRef;
// below code is used for spinner loading 
openModalWithComponent() {
  this.bsModalRef = this.modalService.show(LoadingSpinnerComponent);
  }

  //enable search label
  enablesearchlabel(){
    let policycode =  this.misallocatedInput.get('policyCode').value;
    let period =   this.misallocatedInput.get('period').value;

    if(policycode !=null && policycode !='' && period !=null && period !=''){
      this.searchlabel=false;
    }else{
       if(policycode == '' || policycode==null){
         alert("policy code cannot be empty ");
       }
      
    }
  }

// getting misallocation policy info   -- step 1
getpolicyinfo(policy,policydate){
  this.spinnerlabel=true;
  this.misallocatedInput.get('policyCode').disable();
  this.misallocatedInput.get('period').disable();
   this.searchlabel=true;
this.http.get(`${apiURL}/allocations/partialmisallocationdetails/policycode?policycode=${policy}&period=${policydate}`
).subscribe((response)=>{
  this.spinnerlabel=false;
  this.misallocatedInput.get('policyCode').enable();
  this.misallocatedInput.get('period').enable();
  this.searchlabel=false;

console.log(response);
this.misallocatedpolicyinfo=response; 
if(this.misallocatedpolicyinfo.length==0){
       alert("no record is found with this policy code and period ");
}else{
  this.gettodetdetailsarray(this.misallocatedpolicyinfo[0]); 
  this.savelabel=false; 
  let misallocparitalhdrid = this.misallocatedpolicyinfo[0].misallocationid
  this.misallocatedInput.controls['misallocationID'].setValue(misallocparitalhdrid)
  // if misallocparitalhdrid valueis greater than zero then record is saved but its not posted 
  if(misallocparitalhdrid>0){
      this.getmisalloctodet(misallocparitalhdrid);
     
      }
     this.addlabel=false;
    }
},(error)=>{
 console.log(error);
 alert("error occured during fetching the policy details");
});
}

// now from the search policy  result we are  pushing  to a array insertrecordfromdetpartial
gettodetdetailsarray(u){
  if(this.misallocatedpolicyinfo.length>0){
      var obj = {}
         obj["policyId"] = u.policyid
          obj["policyCode"] = u.policycode
          obj["period"] = u.period
          obj["policyStatus"] = u.transcationtype
          obj["amount"] = u.amount
          obj["partyId"] = u.partyid
          obj["payorName"] = u.partyname
          obj["receiptNo"] = u.recepitnumber
          obj["listId"] = u.id
          obj["postingStatus"] = u.postingstatus
          obj["collectionFlag"] = u.flag    
          this.insertrecordfromdetpartial.push(obj);
      }
}

// if we having misallocparitalhdrid greater than 0 then we will call one more api call -- step 2 if misallochdrid > 0
getmisalloctodet(id){
this.http.get(`${apiURL}/allocations/partialmisallocationdetails/todet?hdrid=${id}`).subscribe((response)=>{
console.log(response)
this.misallocparialtodet=response
this.gettotalallocatedamount()
if(this.misallocparialtodet.length>0){
this.postlabel=false;
}
},(error)=>{
  console.log(error);
}
  );
}

 // to calculate the total amount 
gettotalallocatedamount(){
this.totalallocatedamount = this.misallocparialtodet.reduce((sum, item) => sum + item.amount, 0);
this.finalamount=this.totalallocatedamount;
}

// inserting a record to partial misalloc hdr  
oncheckhdr(u){
    if(this.insertrecordhdr.length ==0){
      var obj = {}
      obj["totalReversalAmt"] = u.amount
      obj["totalAllocatedAmt"] = u.amount
      obj["recepitNumber"]=u.recepitnumber
      this.insertrecordhdr.push(obj);
    }else{

      if(this.insertrecordhdr.length >0){
        this.count =this.insertrecordhdr.filter(app=> app.recepitNumber == u.recepitnumber);
        if(this.count.length==0){
          var obj = {}
          obj["totalReversalAmt"] = u.amount
          obj["totalAllocatedAmt"] = u.amount
          obj["recepitNumber"]=u.recepitnumber
          this.insertrecordhdr.push(obj);
        }

        if(this.count.length==1){
          this.insertrecordhdr=this.insertrecordhdr.filter(app=> app.recepitNumber != u.recepitnumber);
          console.log("array after splice--->"+ this.insertrecordhdr.length);  
        }
      }

    }  
}
  
// step -3 getting the policy record  by using policycode and date 
policydetails(i){
  var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
  var poclicydate = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  if (policycode == null || policycode == ''){
    alert("Please enter policy code ")
  }else{
  this.http.get(`${apiURL}/allocations/partialmisallocationdetails/pnewpolicycode?policycode=${policycode}&period=${poclicydate}`).
  subscribe((response)=>{
  console.log(response);
  this.newmanualrecord=response;
  if(this.newmanualrecord[0].policycode=="00"){
    alert("no details found with this policy code details");
  }else{
    this.patchValues(i);
  }
},(error)=>{
  console.log(error);
   alert("error has occured while fetching the policy details");
  });
  }
}

// after getting the response from serve regarding policy details we patch it by using below method
patchValues(i) {
  let x = (<FormArray>this.myForm.controls['corrections']).at(i);
  console.log("this calling form "+x);  
  x.patchValue({
    corPartyID: this.newmanualrecord[0].partyid,
    corPayerName:this.newmanualrecord[0].partyname,
    corExpectedAmnt:this.newmanualrecord[0].exceptedamount,
    corPurpose:this.newmanualrecord[0].purpose
  });
}


gettotalamountfromcorrectionarry(i){
  
  let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
  let period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  let partyid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').value;
  let payername = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').value;
  let excptedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').value;
  let purpose = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').value;
  let amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;    
  



if(policycode !=null && period !=null && partyid !=null && payername !=null && excptedamount !=null && purpose !=null && amount !=null && policycode !='' && period !='' && partyid !='' && payername !='' && purpose !='' && amount !=''){
    let mispartialamount =this.misallocatedpolicyinfo[0].amount
    if(amount==0){
      alert("amount can be zero");
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset();    
    }

    if(amount>mispartialamount){
      alert("amount cannot be greater than misallocated policy aamount");
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset();    
    }

   if(amount>0 ){
    // let totalamount=0;
    // for(let j=0;j<=i;j++){
    //   let allocamountpolicy = (<FormArray>this.myForm.controls['corrections']).at(j).get('corAllocatedAmnt').value; 
    //   totalamount= +totalamount + +allocamountpolicy; 
    //   }
     this.finalamount=+this.finalamount + +amount;



     if(this.finalamount>mispartialamount){
      alert("Final allocationg Total amount cannot be greater than misallocated policy aamount");
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset(); 
      this.finalamount=+this.finalamount - +amount;   
    }
      
    let amountallocated = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
    
    if(amountallocated !=null && amountallocated !=''){
         // enabling check box
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').enable();

     (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').disable(); 
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').disable();
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').disable();
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').disable();
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').disable();
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').disable();
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').disable();    
    }else{
      alert("Fields cannot be Empty");
    }
    
    
    }   
  }else{
    alert("please fill all required fields");
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset(); 

  }
}
  
//on check method for policy correction
checktodetdate(i){
  let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
  let period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  let partid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').value;
  let payername = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').value;
  let excptedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').value;
  let purpose = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').value;
  let amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;    
       
  if(amount<0 || amount==null || amount =="undefiend" || policycode==null || partid==null || payername==null || excptedamount==null || purpose==null){
     alert("please filled the required details");      
  }else{

    if(this.insertnewrecordtodet.length==0){
      var obj={}
      obj["policyCode"] = policycode
      obj["period"] = period
      obj["amount"] = amount
      obj["partyId"] = partid
      obj["payorName"] = payername 
      obj["purpose"] = purpose
      obj["policyId"] = this.newmanualrecord[0].policyid
      obj["receiptNumber"] = this.insertrecordfromdetpartial[0].receiptNo
      this.insertnewrecordtodet.push(obj);
      console.log("array size initally part"+this.insertnewrecordtodet.length);
    }else{
      if(this.insertnewrecordtodet.length>0){
        this.count1 =this.insertnewrecordtodet.filter(app=> app.policyCode == policycode);
      }
     
      if(this.count1.length==0){
        var obj={}
        obj["policyCode"] = policycode
        obj["period"] = period
        obj["amount"] = amount
        obj["partyId"] = partid
        obj["payorName"] = payername 
        obj["purpose"] = purpose
        obj["policyId"] = this.newmanualrecord[0].policyid
        obj["receiptNumber"] = this.insertrecordfromdetpartial[0].receiptNo
        this.insertnewrecordtodet.push(obj);
        console.log("array size from else part"+this.insertnewrecordtodet.length);
      }

      if(this.count1.length==1){
       // alert("size of dde array before splice--->"+ this.insertnewrecordtodet.length);
        this.insertnewrecordtodet=this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
       // alert("size of dde array after splice--->"+ this.insertnewrecordtodet.length); 
      }
    }
   } 
}



save(){
let transcartiontype = this.misallocatedInput.get('transType').value;
let misallocid = this.misallocatedInput.get('misallocationID').value;

if(transcartiontype == 'allocation' || transcartiontype== 'reverse' ){
  if(transcartiontype== 'reverse'){
       // here  insertrecordhdr array deals with misallocated policy info initially
     if(this.insertrecordhdr.length<=0){
          alert("please select misallocation policy information");
      }else{
          if(misallocid>0){
            alert("we updating the record");
            this.partialmisallochdrupdate(misallocid);
          }else{
            alert("we are insert new record with transcation type as reversal !");
            this.partialmisallochdinsertrecord();
          }
        }
     }
        
   if(transcartiontype == 'allocation'){
         if(this.insertrecordhdr.length<=0 || this.insertnewrecordtodet.length<=0){
             if(this.insertrecordhdr.length<=0){
            alert("plesae select a record from misallocate policy information");
           }else{
            alert("plesae select a record from policy allocation ");
           }
    }else{
        if(misallocid>0){
            alert("we updating the record");
            this.partialmisallochdrupdate(misallocid);
          }else{
            alert("we are insert new record with transcation type as Premium Reallocation !");
             this.partialmisallochdinsertrecord();  
          }
         }
       }
    
  } else{
        alert("please select the a Transcation type");
       }
}

//inserting record into  T_POL_PARTIAL_MISALLOC_HDR 
partialmisallochdinsertrecord(){
  let createdby=this.username;
  let modifiedby=this.username;
  let allocatedamount;
if(this.misallocparialtodet==undefined){
    allocatedamount=0
    this.finalamount= +this.finalamount +  +allocatedamount;
   }
  let transcartiontype = this.misallocatedInput.get('transType').value;
  this.http.post(`${apiURL}/allocations/partialmisallocationdetails/inserthdr?createdby=${createdby}&modifiedby=${modifiedby}`,{      
    "totalReversalAmt":this.insertrecordhdr[0].totalReversalAmt,
    "totalAllocatedAmt":this.finalamount,
    "transactionType":transcartiontype
   }).subscribe((response)=>{
     console.log(response); 
     this.hdrid=response
      this.misallocatedInput.patchValue({
        misallocationID:this.hdrid
      })
    this.pmfromdet(this.hdrid);
    },(error)=>
    {
      console.log(error);
      alert("error raised will insert record");
    }
    
  );
}


// update T_POL_PARTIAL_MISALLOC_HDR record
partialmisallochdrupdate(hdrid){
  let modifiedby = this.username;
  let id = hdrid;
  let transcartiontype = this.misallocatedInput.get('transType').value;
  this.http.post(`${apiURL}/allocations/partialmisallocationdetails/updatehdr?modifiedby=${modifiedby}&hdrid=${id}`,{
    "totalAllocatedAmt":this.finalamount,
    "transactionType":transcartiontype
   }).subscribe((response)=>{
     console.log(response); 
     this.hdrid=response
     this.pmtodetupdate(hdrid); 
    },(error)=>
    {
      console.log(error);
      alert("error raised will insert record");
    }
    
  );
}


//inserting record into T_POL_PARTIAL_MISALL_FROM_DET
pmfromdet(hdr){
  let createdby=this.username;
  let modifiedby=this.username;
  this.http.post(`${apiURL}/allocations/partialmisallocationdetails/inserfromdetr?pmishdrid=${hdr}&createdby=${createdby}&modifiedby=${modifiedby}`,
  this.insertrecordfromdetpartial      
  ).subscribe((response)=>{
  let paritalmisallocationfromdetid = response;
  console.log("paritalmisallocationfromdetid--->"+paritalmisallocationfromdetid)
  this.pmtodet();
  },(error)=>{
    console.log(error);
    alert("error raised will insert record");
  } 
);
}

// inserting new record into T_POL_PARTIAL_MISALL_TO_DET
pmtodet(){
 let partialhdrid= this.misallocatedInput.get('misallocationID').value
 let createdby=this.username;
 let modifiedby=this.username;
  this.http.post(`${apiURL}/allocations/partialmisallocationdetails/insertoetr?pmishdrid=${partialhdrid}&createdby=${createdby}&modifiedby=${modifiedby}`,
  this.insertnewrecordtodet      
  ).subscribe((response)=>{
   console.log(response);
   alert("succesfully record is saved");
     
   // we are removing only checked form data
   for(let i = 0;i<this.correctionForms.length;i++){
    let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value
    if(status==true){
      let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
         this.insertnewrecordtodet= this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
          this.correctionForms.removeAt(i);
        if(this.correctionForms.length==1){
              break;
            }
       }

   }


    // we are removing only checked form data
    for(let i = 0;i<this.correctionForms.length;i++){
      let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value
      if(status==true){
        let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
           this.insertnewrecordtodet= this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
            this.correctionForms.removeAt(i);
         }
     }


  },(error)=>
  {
   console.log(error);
   alert("error raised will insert record ");
  }  
  );
}

// updating  record into T_POL_PARTIAL_MISALL_TO_DET
pmtodetupdate(hdrid){
let createdby=this.username;
let modifiedby=this.username;
this.http.post(`${apiURL}/allocations/partialmisallocationdetails/insertoetr?pmishdrid=${hdrid}&createdby=${createdby}&modifiedby=${modifiedby}`,
this.insertnewrecordtodet      
).subscribe((response)=>{
console.log(response);
alert("successfully record is inserted");
  
  // we are removing only checked form data
  for(let i = 0;i<this.correctionForms.length;i++){
    let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value
    if(status==true){
      let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
         this.insertnewrecordtodet= this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
          this.correctionForms.removeAt(i);
        if(this.correctionForms.length==1){
              break;
            }
       }

   }


    // we are removing only checked form data
    for(let i = 0;i<this.correctionForms.length;i++){
      let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value
      if(status==true){
        let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
           this.insertnewrecordtodet= this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
            this.correctionForms.removeAt(i);
         }
     }
},(error)=>{
console.log(error);
alert("error raised will insert record ");
});
}


// deleteing the record from T_POL_PARTIAL_MISALL_TO_DET by using todetid
gettodetid(x,i){
  this.deleteToDetRecord(x.polParMisallocToId,i,x.policyCode,x.period);
}

deleteToDetRecord(id,i,policycode,period){
  let postingstatus=this.misallocparialtodet[i].postingStatus;
  let amounttoberemoved=this.misallocparialtodet[i].amount;
  let perioddet = this.misallocparialtodet[i].period;
  
 if(postingstatus=="P" || postingstatus=="p"){
  alert("record is already posted cannot be deleted");
 }else{
  this.http.delete(`${apiURL}/allocations/partialmisallocationdetails/deletetodet?todetid=${id}`)
  .subscribe((result)=>
  {
    console.log(result);
    alert("sucessfully record is deleted");
    this.finalamount = this.finalamount - amounttoberemoved;
    this.misallocparialtodet = this.misallocparialtodet.filter(app=>app.policyCode !=policycode && app.period !=perioddet);
  },(error)=>{
    console.log(error);
    alert("error occured durning deleting record");
  });
 } 
}
  


  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  addCorrection() {
    const correction = this.fb.group({ 
      corSelect:[],
      corPolicyCode: [],
      corPeriod: [],
      corPartyID: [],
      corPayerName: [],
      corExpectedAmnt: [],
      corPurpose: [],
      corAllocatedAmnt: [] 
    })
    this.correctionForms.push(correction);

  }
  
  // deleteing the record from formarray
  deleteCorrection(i) {
    let allocamountpolicy = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;   
      if(allocamountpolicy=="" || allocamountpolicy==undefined || allocamountpolicy==null){
        allocamountpolicy=0;
      } 
    this.finalamount=this.finalamount - allocamountpolicy;
    this.correctionForms.removeAt(i)
  }
 

  
post(){
if(this.misallocatedInput.get('misallocationID').value !=0 && this.misallocatedInput.get('misallocationID').value !=null){ 
 
if(this.insertnewrecordtodet.length==0){

  if(this.misallocparialtodet.length>0){
    for(let j=0;j<this.misallocparialtodet.length;j++){
       if(this.misallocparialtodet[j].postingStatus=="P"){
          alert("policy is already posted"+"-"+this.misallocparialtodet[j].policyCode);      
        }else{
          let createdby =this.username;
          var obj={}
          obj["receiptno"] = this.misallocparialtodet[j].recepitNumber
          obj["paymentfor"] = 2
          obj["dueDate"] = this.misallocparialtodet[j].period
          obj["partyid"] = this.misallocparialtodet[j].partyid
          obj["allocatedamount"] = this.misallocparialtodet[j].amount 
          obj["createdby"] = createdby
          obj["policycode"] = this.misallocparialtodet[j].policyCode
       // obj["maualtodtlid"]=this.receiptdetailstodtl[j].manualhdrtoid
          this.intcashofficearray.push(obj);    
        }
     }
   }else{
     alert("no saved records are avaliable to post");
   }
}else{
  alert("please save the unsaved records and try again to post saved records");
}
 
if(this.intcashofficearray.length>0){
      this.postingtintcashoffice();
  }
   
 }else{
  alert("records need to be saved first");
 }
}


postingtintcashoffice(){
let partialhdridposting =  this.misallocatedpolicyinfo[0].postingstatus
  if(partialhdridposting=="P" || partialhdridposting=="p"  ){
      alert("already record is posted so changes cannot be done");
  }else{
      this.http.post(`${apiURL}/allocations/partialmisallocationintcash`,
      this.intcashofficearray
      ).subscribe((result)=>{
      console.log(result);
      let finalcorrectionamount = this.misallocatedpolicyinfo[0].amount;
      if(finalcorrectionamount==this.finalamount){
            alert("no unallocated amount is avaliable so changes cannot be done");
             this.updatepostingstatuspartialhdr();
        }
        this.updatepostingstatuspartialmisallocation();
        },(error)=>{
           console.log(error);
         }
      );
    }
  }


  updatepostingstatuspartialmisallocation(){
    let misallochdrid= this.misallocatedInput.get('misallocationID').value 
    let postedby=this.username;
    let transcartiontype = this.misallocatedInput.get('transType').value;
    if(transcartiontype="allocation" ){
    this.http.get(`${apiURL}/partialmisallocation/postingstatuspremium?Partialmisallocationhdrid=${misallochdrid}&postedby=${postedby}`)
    .subscribe((result)=>{
      console.log(result);
      alert("Record is Successfully posted");
      this.clear();
    },(error)=>{
      console.log(error);
      alert("error occured while posting the record");
    })

    }else{
      this.http.get(`${apiURL}/partialmisallocation/postingstatusReverse?Partialmisallocationhdrid=${misallochdrid}&postedby=${postedby}`)
    .subscribe((result)=>{
      console.log(result);
      alert("Record is Successfully posted");
      this.clear();
    },(error)=>{
      console.log(error);
      alert("error occured while posting the record");
    })
    } 
  }

   
  updatepostingstatuspartialhdr(){
    let misallochdrid= this.misallocatedInput.get('misallocationID').value 
    let postedby=this.username;
    this.http.get(`${apiURL}/partialmisallocation/postingstatusofpartialmisallochdr?Partialmisallocationhdrid=${misallochdrid}&postedby=${postedby}`)
    .subscribe((result)=>{
      console.log(result);
      alert("Record is Successfully posted");
    },(error)=>{
      console.log(error);
    })
  }
  
  clearFormArray (){
    while(this.correctionForms.length !=0){
      this.correctionForms.removeAt(0);
     }
    
    }

  clear(){

    this.misallocatedInput.reset();
    this.policycorrection.reset();

    this.viewMisallocations = false ;
    this.makeCorrections = false ; 
    this.isReadOnly=true;
    this.newmanualrecord=[];
    this.insertrecordhdr=[];
    this.insertrecordfromdetpartial=[];
    this.totalallocatedamount=null;
    this.totalallocatedamount1=null;
    this.insertnewrecordtodet=[];
    this.totalAllocatedAmount=null;
    this.postlabel=true;
    this.misallocatedpolicyinfo=null;
    this.misallocparialtodet=null;
    this.count=0;
    this.count1=0;
    this.amount=0;
    this.finalamount=0;
    this.hdrid=null;
    this.transcartiontype1=null;
    this.intcashofficearray=[];
    this.searchlabel=true;
    this.savelabel=true;
    this.clearFormArray();
    this.ngOnInit();
 
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }


   

}