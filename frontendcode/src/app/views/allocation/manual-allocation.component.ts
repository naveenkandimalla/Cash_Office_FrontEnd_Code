// receipt no: 354535 ,369471
// we fetch the sample data from t_receipt table or if record is already saved then we can found from T_POL_MANUAL_HDR by using its id we can access the data
// policycode : 4007552269,4007552162,4007552188  

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { HttpClient, HttpParams} from '@angular/common/http';
import { apiURL } from '../../_nav';
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
  templateUrl: './manual-allocation.component.html'
})
export class ManualAllocationComponent {
 
  myForm: FormGroup;
  searchlabel:boolean=true;
  manualallochdridservice:any;
  receiptdetails:any;
  checkingreceiptoutput:any;
  flagdetails:any;
  receiptdetailstodtl:any;
  receiptdatachecking:any;
  checkboxlabel:boolean=true;
  postlabel:boolean=true;
  validate:boolean=true;
  receiptnum:any;
  TotalPoliciesAllocatedAmount:number;
  Policiesallocatedamount:number;
  TotalUnallocatedamount:number;
  tmanualhdrunallocatedamount:number;
  Totalallocatedamount:number;
  tmanualhdrallocatedamount:number;
  Policiesamount:any;
  amount:any;
  AllocatedtotalpoliciesAmount:any=[];
  insertrecordtodtl:any=[]
  treceiptdetailslabel:boolean=true;
  manualallocationdtails:boolean=false;
  policydetails:any;
  policycheck:any=[];
  policyfornarraycheck:any=[];
  savelabel:boolean=true;
  manualhdrid:any;
  manualfromdet:any;
  intcashofficearray:any=[];
  bkstmtflag:any
  insertnewrecordtodet:any=[];
  count1:any;
  manualtodet:any;
  username:any;
  userid:any;

  constructor(private http:HttpClient,private fb: FormBuilder,
    private router:Router,
    private tokendetails:TokenStorageService){
  }

  misallocatedInput = new FormGroup({
    receiptNo: new FormControl('', Validators.required),
    BSFlag: new FormControl('', Validators.required),
    misallocationID: new FormControl({value: '0', disabled: true}), 
  }) ;

  ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })
     this.getsessionvalues();
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
      corPurposeID: [],
      corPostStatus: [],
      corAllocatedAmnt: [] 
    })
    this.correctionForms.push(correction);
     this.postlabel=true;
  }

  getsessionvalues(){
    this.username= this.tokendetails.getUsername();
    this.userid= this.tokendetails.getuserid();
   }

// used for fetching misallocation details depends on receipt number or bank statement number and flag type
search(x){
  this.getmanualhdrid(x);
}

// this code is used for enable and disable serach button
changestatusofsearchlabel(){
  this.searchlabel=false;
  let receiptid = this.misallocatedInput.get('receiptNo').value
  if(receiptid==null || receiptid=='' || receiptid==0){
    this.searchlabel=true;
  }
}

// step 1 checking whether record is already saved in or not T_POL_MANUAL_HDR
getmanualhdrid(receipt){
  this.http.get(`${apiURL}/allocations/manualallocation/tpolmanualhdrid?receipt=${receipt}`).subscribe((result)=>{ 
    console.log(result);
  if(result==null || result==''){
    let manualhrdid=0;
         console.log("no record is present in the T_POL_MANUAL_HDR so we call receipt details from t_receipt table");
         this.getManualallocationdetails(manualhrdid);
     }else{
       this.manualallochdridservice=result;
       console.log("record is present with the id --->"+this.manualallochdridservice);
         this.getManualallocationdetails(this.manualallochdridservice);
     }
  },
  (error)=>{
    console.log(error);
     }
  )

}


// step-2 fetch the receipt details based on manualhdrid followed from step 1
getManualallocationdetails(manualhdrid){
  let flag = this.misallocatedInput.get('BSFlag').value
  let receiptnum= this.misallocatedInput.get('receiptNo').value
// reading the false details
  if(flag =='' || flag=="false" || flag==null){       
     this.flagdetails="N"
    }else{
      this.flagdetails="Y"
   }

if(manualhdrid=="" || manualhdrid==null || manualhdrid=="null" || manualhdrid==0 ){
    console.log("now we are fetch data from t_receipt because we get initially manual hdr id as null");
     this.getreceiptdetails(this.flagdetails,receiptnum,manualhdrid);
  }else{
    console.log("now we are fetch data from T_POL_MANUAL_TO_DTL because we get initially manual hdr id as--->"+manualhdrid);
    this.getreceiptdetailstodtl(this.flagdetails,receiptnum,manualhdrid);    
  }
}


 // fetching the receipt data by using receipt id from t_receipt
getreceiptdetails(flag,recipt,manualhdrid){
  this.http.get(`${apiURL}/allocations/manualallocation/receiptdetailsflag?bankstmtflag=${flag}&receiptnum=${recipt}`).subscribe((result)=>{ 
    if(result == null || result == "null" || result==""){
          alert("No receipt/stmt data is found With this Receipt Number");
          this.clear();
    }else{
          console.log(result);
          this.receiptdetails= result;
          this.validate=false;
          // this is used for calculating total unallocated amount for this receipt id 
          this.getTotalUnallocatedamounttreceipt();
           // this is used for calculating total allocated amount for this receipt id 
          this.getTotalallocatedamounttreceipt() ;
    }
  },(error)=>{
    alert("error has occured while fetching the receipt details ");  
     console.log(error);
    });
}


 // fetching the receipt data by using receipt id from T_POL_MANUAL_TO_DTL
getreceiptdetailstodtl(flag,recipt,manualhdrid){
  this.http.get(`${apiURL}/allocations/manualallocation/receiptdetailsflagtodtl?bankstmtflag=${flag}&receiptnum=${recipt}`).subscribe((result)=>{
     console.log(result);
     this.receiptdetailstodtl=result;    
if(this.receiptdetailstodtl.length==0){
      this.getreceiptdetails(flag,recipt,manualhdrid);
      this.treceiptdetailslabel=true;
      this.manualallocationdtails=false;
      this.validate=false;  
   }else{
    // calculating total unallocated amount coming from pe_Get_Manual_PayPoint_DTL procedure
    this.getpoliciesallocatedtodetamountTdtl()
    this.getTotalUnallocatedamountTdtl()
    this.getTotalallocatedamountTdtl()
    // this is used for displaying the amount
    this.treceiptdetailslabel=false;
    this.manualallocationdtails=true;
    this.validate=false;
    this.postlabel=false;
   } 
},(error)=>{
    alert("error has occured while fetch the receipt details ");
     console.log(error);
    });
}

// calculating allocated amount and unallocated amount coming from pe_Get_ManualAlloc_FromRcpt (related to receipt)
getTotalUnallocatedamounttreceipt(){
      if(this.receiptdetails.length>0){
       this.TotalUnallocatedamount=this.receiptdetails[0].unallocatedamount
       }    
        this.tmanualhdrunallocatedamount= this.TotalUnallocatedamount;
        console.log("initially unallocated amount access for receipt pe_Get_ManualAlloc_FromRcpt--->"+this.tmanualhdrunallocatedamount);
}


getTotalallocatedamounttreceipt(){
   if(this.receiptdetails.length>0){
        this.Totalallocatedamount=this.receiptdetails[0].allocatedamount
     }
    this.tmanualhdrallocatedamount=this.Totalallocatedamount
    console.log("initially Allocated amount access for receipt pe_Get_ManualAlloc_FromRcpt--->"+this.Totalallocatedamount);
}

// calculating allocated amount and unallocated amount coming from pe_Get_Manual_PayPoint_DTL (related to T_POL_MANUAL_TO_DTL)
getpoliciesallocatedtodetamountTdtl(){ 
  this.TotalPoliciesAllocatedAmount = this.receiptdetailstodtl.reduce((sum, item) => sum + item.toallocatedamount, 0);
  this.Policiesallocatedamount=this.TotalPoliciesAllocatedAmount;
  console.log("initially policies accessed amount access for receipt pe_Get_Manual_PayPoint_DTL--->"+this.Policiesallocatedamount);
}

getTotalUnallocatedamountTdtl(){
       if(this.receiptdetailstodtl.length>0){
             this.TotalUnallocatedamount=this.receiptdetailstodtl[0].unallocatedamount;
          }
          this.tmanualhdrunallocatedamount= this.TotalUnallocatedamount;       
  console.log("initially UnAllocated amount access for receipt pe_Get_Manual_PayPoint_DTL--->"+this.tmanualhdrunallocatedamount);
}

getTotalallocatedamountTdtl(){
  if(this.receiptdetailstodtl.length>0){
    this.Totalallocatedamount=this.receiptdetailstodtl[0].allocatedamount
 }
 this.tmanualhdrallocatedamount=this.Totalallocatedamount;
 console.log("initially Allocated amount access for receipt pe_Get_Manual_PayPoint_DTL--->"+this.tmanualhdrallocatedamount);
}



// below code is used for not to allow a policy to allocate again
  getpolicycodedetails(i){
   let policycodefromarray = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
     if(policycodefromarray =="" || policycodefromarray ==null){
         alert("policy code caanot be null");
      }else{           
         let desc= this.policycheck.filter(app => app.policyCode == policycodefromarray);  // initally checking policycode     
           if(desc.length==0){

              var obj1={}
                        obj1["policyCode"]=policycodefromarray;
                       obj1["position"]= i
                        this.policycheck.push(obj1);   
    
                        console.log("checking the no of policies of unique"+ this.policycheck.length);
                       this.policyinfofetching(policycodefromarray,i);

                   
             }else{
                alert("already for this policy amount is allocated ");
                 this.patchmethodforsamevalue(i);
           }
      }
   }


policyinfofetching(policycode,i){
    this.http.get(`${apiURL}/allocations/misallocationcorrection/policyinfo?policycode=`+policycode).subscribe(response=>{
        console.log(response)
        this.policydetails=response
      if(this.policydetails.length==0){
                alert("no policy found with this policy code");   
        } else{
             this.patchValues(i);
              }          
         },(error)=>{ 
             console.log(error);
               alert("error in fetching policycode details");
          }            
      );
   }


   //if we try to add same policy again the we need tp patch the value as empty or zero
   patchmethodforsamevalue(i){
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    console.log("this calling form "+x);
    x.patchValue({
      corPolicyCode:0
    });

   }


   patchValues(i) {
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    x.patchValue({
      corPartyID: this.policydetails[0].partyid,
      corPayerName:this.policydetails[0].partyName,
      corExpectedAmnt:this.policydetails[0].expectedAMOUNT,
      corPurpose:this.policydetails[0].purpose,
      corPurposeID:this.policydetails[0].purpose_id,
      corPostStatus:this.policydetails[0].postingStatus
    });
  }


// used for updating the allocated and unallocated amount
updatepoliciesallocatedamount(i){

  let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;   
  let period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  let partid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').value;
  let payername = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').value;
  let excptedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').value;
  let purpose = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').value;
  let purposeid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurposeID').value;
  let postingstatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPostStatus').value;
  let allocamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;  

  if(policycode !=null && period !=null  && partid !=null  && payername != null && excptedamount !=null && purpose !=null && purposeid !=null && postingstatus !=null  && allocamount !=null && policycode !='' && period !=''  && partid !=''  && payername != '' && excptedamount !='' && purpose !='' && purposeid !='' && postingstatus !=''  && allocamount !=''){  
    
    let totalunallocatedamountavailable =this.tmanualhdrunallocatedamount;
    
    // now checking amount we try to alllocate and avaliable amount 
    if(allocamount>totalunallocatedamountavailable){
      alert("amount assigning cannot be greater than avaliable unallocated amount");
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset(); 
      return;
    }

    // allocated amount cannot be negative or zero
    if(allocamount<=0){
      alert("allocating amount cannot be less than or equal to zero");
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset(); 
      return;
    }

    // pushing the allocated amount to a array so that while deleting or removing allocated amount then we can access this array
    var obj = {}; 
    obj["amount"] = allocamount
    obj["position"] = i
    this.AllocatedtotalpoliciesAmount.push(obj);
      
    let total=0
    let finalamount;
    for ( let j = 0;j<=i;j++ ) {
          finalamount = (<FormArray>this.myForm.controls['corrections']).at(j).get('corAllocatedAmnt').value;  
                total = +total + +finalamount;
    }              
    console.log("total allocated amount--->"+total);

     // if we are initally saving the record from t_receipt to t_pol_manual_hdr then we have null value for policesallocation
    if(this.receiptdetailstodtl==undefined || this.receiptdetailstodtl=="null" || this.receiptdetailstodtl==null || this.receiptdetailstodtl==""){
      this.Policiesallocatedamount=0;
     }
     
     // we are updating the amount unallocated,allocated,total policies amount
     this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount+ +allocamount
     this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount-allocamount
     this.Policiesallocatedamount=this.Policiesallocatedamount+ +total;

     if(this.Policiesallocatedamount>0){      
      this.savelabel=false;
    }

   (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').disable();   
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurposeID').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corPostStatus').disable();
    (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').disable(); 

    (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').enable(); 
    
  }else{
    alert("fields cannot be empty");
    (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset(); 
  }
    

}


checktodtl(i){

  let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;    
  let period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  let partid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPartyID').value;
  let payername = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayerName').value;
  let excptedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExpectedAmnt').value;
  let purpose = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurpose').value;
  let purposeid = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPurposeID').value;
  let postingstatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPostStatus').value;
  let amount:number = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;

  if(this.insertnewrecordtodet.length ==0){

        var obj={}
        obj["policyCode"] = policycode
        obj["period"] = period 
        obj["partyId"] = partid
        obj["payorName"] = payername
        obj["expectedAmount"] = excptedamount  
        obj["purposeName"] = purpose
        obj["purposeId"] = purposeid
        obj["postingStatus"]=postingstatus
        obj["allocatedAmount"] =  amount
        this.insertnewrecordtodet.push(obj); 
       
  }else{
       
    if(this.correctionForms.length>0){
      this.count1 =this.insertnewrecordtodet.filter(app=> app.policyCode == policycode);
    }
     
    if(this.count1.length==0){
      var obj={}
      obj["policyCode"] = policycode
      obj["period"] = period 
      obj["partyId"] = partid
      obj["payorName"] = payername
      obj["expectedAmount"] = excptedamount  
      obj["purposeName"] = purpose
      obj["purposeId"] = purposeid
      obj["postingStatus"]=postingstatus
      obj["allocatedAmount"] =  amount
      this.insertnewrecordtodet.push(obj); 
    }

    if(this.count1.length==1){
      this.insertnewrecordtodet=this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
      console.log("size of dde array after splice--->"+ this.insertnewrecordtodet.length);  
    }

  }

}



deleteCorrection(i) {
  let amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
  let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
  this.correctionForms.removeAt(i)
  if(amount=="" || amount==null || amount=="null"){
    amount=0;
  }else{
    this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount- +amount;
    this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount + +amount;
    this.Policiesallocatedamount=this.Policiesallocatedamount- +amount;
  }

  // removing the record from pushed array used for checking the amount
  this.policycheck= this.policycheck.filter(app=>app.policyCode != policycode);
  console.log("checking the no of policies of unique"+ this.policycheck.length);

  if(this.correctionForms.length==0){
    this.postlabel=false;
  }

}



// saving the record into t_pol_manual_hdr,fromdtl,todtl
 save(){
    if(this.manualallochdridservice=="" || this.manualallochdridservice==null){
        alert("we are inserting the record ");
      this.insertrecordtopolmanual() 
    }else{
       alert("we are updating the record")
     this.updatedManualallocarion()
    }
 }


 
 
 insertrecordtopolmanual(){   
    if(this.insertnewrecordtodet.length<=0) {
          alert("please select a policy to allocate ")
          this.checkboxlabel=false;
       }else{

        for(let i=0;i<this.insertnewrecordtodet.length;i++){

          if(this.insertnewrecordtodet[i].postingStatus=="P"){
            // so we are removing that policy code data from  insertnewrecordtodet so that only unposted data can be saved
                this.insertnewrecordtodet.splice(i,1);
                this.correctionForms.removeAt(i);
                             
             }
            }
                                     
    let flag = this.misallocatedInput.get('BSFlag').value
        if(flag =='' || flag=="false" || flag ==null){
                this.bkstmtflag="N";
            }else {
              this.bkstmtflag="Y"
              }
        this.getinsertintotpolhdr();                     
       } 
    }

 // inserting the new record into t_pol_manual_hdr
 getinsertintotpolhdr(){
    let unallocatedamount=this.tmanualhdrunallocatedamount
    let allocatedamount= this.tmanualhdrallocatedamount 
    let totalassignpoliciesamount = this.Policiesallocatedamount
    let createdby= this.username
    this.http.post(`${apiURL}/allocations/manualallocation/inserttpolmanualhdr`,{
      "receiptNo":this.misallocatedInput.get('receiptNo').value,
      "totalAllocatedAmt":unallocatedamount,
      "totalUnallocatedAmt":allocatedamount,
      "totalPoliciesAmount":totalassignpoliciesamount,
      "bankStmtFlag":this.bkstmtflag,
      "createdBy":createdby
    }).subscribe((result)=>{
      console.log(result)
      this.manualhdrid = result;
      this.getinsertfromdtl(this.manualhdrid);
    },
      (error)=>{
        console.log(error);
        alert("error occured while saving record into t_pol_manual_hdr");
      }
     );
  }

// inserting record into t_pol_manual_from_Dtl
getinsertfromdtl(manualallochdrid){
   let createdby= this.username
  this.http.post(`${apiURL}/allocations/manualallocation/inserttpolmanualfromdet?manualhdrid=${manualallochdrid}&createdby=${createdby}`,{
   "paypointId":this.receiptdetails[0].paypoint,
   "period":this.receiptdetails[0].period,
   "allocatedAmount":this.receiptdetails[0].allocatedamount,
   "unallocatedAmount":this.receiptdetails[0].unallocatedamount,
   "receiptAmount":this.receiptdetails[0].recepitamount,
   "grossAmount":this.receiptdetails[0].grossamount 
  }).subscribe((result)=>{
     console.log(result);
     this.manualfromdet=result;
     this.getinserttpolmanualtodet(this.manualhdrid);
  },(error)=>{
       console.log(error);
       alert("error occured while saving record ");
  });

}


getinserttpolmanualtodet(manualallochdrid){ 
  let createdby= this.username
  this.http.post(`${apiURL}/allocations/manualallocation/inserttpolmanualtodet?manualhdrid=${manualallochdrid}&stmtflag=${this.bkstmtflag}&createdby=${createdby}`,
    this.insertnewrecordtodet
  ).subscribe((result)=>{
     console.log(result);
      this.manualtodet = result;
      alert("record is sucessfully saved");

    // removing the saved records which are checked

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

     for(let i = 0;i<this.correctionForms.length;i++){
      let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value;
         if(status==true){
          let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
                 this.insertnewrecordtodet= this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
                  this.correctionForms.removeAt(i);            
         }

     }

    this.clear();
  },(error)=>{
    console.log(error);
    alert("error occured while saving record");

  })
}

 // if we have already a manualhdrid for the respectivity receipt then update the record
  updatedManualallocarion(){
     this.getupdatedrecord() 
   }
// for update the record in t pol manual hdr and to insert a record in t_po_manuall_to_det
 getupdatedrecord(){

  if(this.insertnewrecordtodet.length<=0){
    alert("no record is found for save");
  }else{

    for(let i=0;i<this.insertnewrecordtodet.length;i++){
      if(this.insertnewrecordtodet[i].postingStatus=="P"){
        alert("already record has been posted so it cannot be saved at position--->"+i);
        // so we are removing that policy code data from  insertnewrecordtodet so that only unposted data can be saved
            this.insertnewrecordtodet.splice(i,1);               
         }
        }
      this.getupdatehdr(); 
   }
 }

 //for update of tpolmanualhdr
 getupdatehdr(){
    let manualhdrid =this.manualallochdridservice
    let totalallocatedamount=this.tmanualhdrallocatedamount
    let totalunallocatedamount=this.tmanualhdrunallocatedamount
    let totalpoliciesamount=this.Policiesallocatedamount
    let modifiedby = this.username;

    this.http.get(`${apiURL}/allocations/manualallocation/updatetpolmanualallochdr?manualhdrid=${manualhdrid}&totalallocatedamount=${totalallocatedamount}&totalunallocatedamount=${totalunallocatedamount}&totalpoliciesamount=${totalpoliciesamount}&modifiedby=${modifiedby}`)
      .subscribe((result)=>
      {  
        console.log(result);
        this. getupdatemanualallocationtodet(); 
      },
      (error)=>{
        console.log(error)
        alert("error occured while saving record ");
      }
      )

 }


getupdatemanualallocationtodet(){
  let createdby= this.username
  let manualhdrid=this.manualallochdridservice
   console.log(this.insertnewrecordtodet) 
   this.http.post(`${apiURL}/allocations/manualallocation/inserttpolmanualtodet?manualhdrid=${manualhdrid}&stmtflag=${this.bkstmtflag}&&createdby=${createdby}`,
   this.insertnewrecordtodet
  ).subscribe((result)=>{
     console.log(result);
      this.manualtodet = result
      alert("record is sucessfully Inserted");

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
  
       for(let i = 0;i<this.correctionForms.length;i++){
        let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value
           if(status==true){
            let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value; 
                   this.insertnewrecordtodet= this.insertnewrecordtodet.filter(app=> app.policyCode != policycode);
                    this.correctionForms.removeAt(i);            
           }
  
       }
       this.clear();

  },(error)=>{
    console.log(error);
    alert("error occured while saving record");
  })

}

// deleteing the existed record  which is fetched from data base 
deleterecordfromtpolamnual(i){   
    if(this.receiptdetailstodtl.length>0){
          if(this.receiptdetailstodtl[i].topostingstatus=="P"){
              alert("already record  has been posted cannot be deleted")
          }else{
              var amount =  this.receiptdetailstodtl[i].toallocatedamount;
              this.tmanualhdrallocatedamount=this.tmanualhdrallocatedamount- +amount;
              this.tmanualhdrunallocatedamount=this.tmanualhdrunallocatedamount + +amount;
              this.Policiesallocatedamount=this.Policiesallocatedamount- +amount ;
               this.deleteamounttoallocate(i)
            }
         }
    }

  deleteamounttoallocate(i){
    let manualhdrid =this.receiptdetailstodtl[i].manualhdrid
    let manualtodetid=this.receiptdetailstodtl[i].manualhdrtoid
    let totalallocatedamount=this.tmanualhdrallocatedamount
    let totalunallocatedamount=this.tmanualhdrunallocatedamount
    let totalpoliciesamount=this.Policiesallocatedamount
    let modifiedby =  this.username;
    this.http.get(`${apiURL}/allocations/manualallocation/deletetodtl?manualhdrid=${manualhdrid}&manualToDtlId=${manualtodetid}&totalallocatedamount=${totalallocatedamount}&totalunallocatedamount=${totalunallocatedamount}&totalpoliciesamount=${totalpoliciesamount}&modifiedby=${modifiedby}`)
      .subscribe((result)=>{console.log(result)
       alert("record has been succesfully deleted");
       
// after deleting the record we need to update delete amount at data base side becauyse its saved data
   let manualhdrid =this.manualallochdridservice
   let totalallocatedamount=this.tmanualhdrallocatedamount
   let totalunallocatedamount=this.tmanualhdrunallocatedamount
   let totalpoliciesamount=this.Policiesallocatedamount
   let modifiedby =  this.username
   this.http.get(`${apiURL}/allocations/manualallocation/updatetpolmanualallochdr?manualhdrid=${manualhdrid}&totalallocatedamount=${totalallocatedamount}&totalunallocatedamount=${totalunallocatedamount}&totalpoliciesamount=${totalpoliciesamount}&modifiedby=${modifiedby}`)
   .subscribe((result)=>{  
      console.log(result);
   },(error)=>{
      console.log(error)
      alert("error occured while saving record");
    }
     )
         
  let policycode = this.receiptdetailstodtl[i].policycode
  this.receiptdetailstodtl=this.receiptdetailstodtl.filter(app=>app.policycode != policycode);
  // this.clear();
  },(error)=>{
    console.log(error);
    alert("error has occured while deleting the record")
        }
      )
  }


// used for posting the unposted records
post(){

  let manualhdrpostingstatus = this.receiptdetailstodtl[0].hdrpostingststus;
  if(manualhdrpostingstatus=='P'){
    alert("record is already posted so it cannot be changed");
  }else{
    if(this.receiptdetailstodtl.length<0){
      alert("no records are assigned to post/record is not saved");
   }else{ 
      if(this.receiptdetailstodtl.length>0){
        for(let j=0;j<this.receiptdetailstodtl.length;j++){
              if(this.receiptdetailstodtl[j].topostingstatus=="P"){
                     alert("policy is already posted"+"-"+this.receiptdetailstodtl[j].policycode);                 
                }else{
                    if(this.receiptdetailstodtl[j].manualhdrtoid==0){
                             alert("record need to be saved policycode--->"+this.receiptdetailstodtl[j].policycode)
                        }else{
                            let createdby = this.username
                            var obj={}
                            obj["receiptno"] = this.receiptdetailstodtl[j].receiptno
                            obj["paymentfor"] = this.receiptdetailstodtl[j].purposeid
                            obj["dueDate"] = this.receiptdetailstodtl[j].period
                            obj["partyid"] = this.receiptdetailstodtl[j].partyid
                            obj["allocatedamount"] = this.receiptdetailstodtl[j].toallocatedamount 
                            obj["createdby"] = createdby
                            obj["policycode"] = this.receiptdetailstodtl[j].policycode
                            obj["maualtodtlid"]=this.receiptdetailstodtl[j].manualhdrtoid
                            this.intcashofficearray.push(obj);
                           console.log("length of intcashoffice--->"+this.intcashofficearray.length);
                            
                           }
                       } 
               }

    if(this.intcashofficearray.length>0){
      this.postingtintcashoffice();
    }else{
      alert("no unposted record are found");
   } 

   let totalallocatedamountfinally =this.receiptdetailstodtl[0].recepitamount;
   let allocatedamount = this.Policiesallocatedamount;
   alert(totalallocatedamountfinally);
   alert(allocatedamount);
   if(totalallocatedamountfinally==allocatedamount){
     console.log("total amount is allocated so remaining amount to be allocate to policy is zero")
      this.updatepostingstatustpolmanualhdr();
    }
 }        
}         
  }
}

// inserting new record   into tintcashoffice
postingtintcashoffice(){      
  this.http.post(`${apiURL}/allocations/maualallocationpostingintcashoffice`,
  this.intcashofficearray).subscribe( (result)=>
    {
      console.log(result);
      this.updatepostingstatusmanualtodtl();
    },
     (error)=>{
       console.log(error);
     }
    );
}

// updating the posting status of t_pol_manual_tdl posting status to p;
updatepostingstatusmanualtodtl(){
 this.http.post(`${apiURL}/allocations/upatepostingstatustodtl`,
 this.intcashofficearray
 ).subscribe((result)=>{
     console.log(result+"from posting status updated");
     alert("records are posted");
     this.clear();
   },
    (error)=>{
      console.log(error);
      alert("error occured while posting record");
      
    }
   );
 }

 updatepostingstatustpolmanualhdr(){
  let postedby =  this.username;
  let manualhdrid =  this.receiptdetailstodtl[0].manualhdrid
  this.http.get(`${apiURL}/allocations/manualallocation/updatepostingstatusmanualhdr?manualhdrid=${manualhdrid}&postedby=${postedby}`)
  .subscribe((result)=>{
    console.log(result)
  },(error)=>{
    console.log(error);
  });
 }

 clearFormArray (){
  while(this.correctionForms.length !=0){
    this.correctionForms.removeAt(0);
   }
  
  }

clear(){
  this.misallocatedInput.reset();
  this.searchlabel=true;
  this.manualallochdridservice=null;
  this.receiptdetails=null;
  this.checkingreceiptoutput=null;
  this.flagdetails=null;
  this.receiptdetailstodtl=null;
  this.receiptdatachecking=null;
  this.checkboxlabel=true;
  this.postlabel=true;
  this.validate=true;
  this.receiptnum=null;
  this.TotalPoliciesAllocatedAmount=0;
  this.Policiesallocatedamount=0;
  this.TotalUnallocatedamount=0;
  this.tmanualhdrunallocatedamount=0;
  this.Totalallocatedamount=0;
  this.tmanualhdrallocatedamount=0;
  this.Policiesamount=null;
  this.amount=null;
  this.AllocatedtotalpoliciesAmount=[];
  this.insertrecordtodtl=[]
  this.treceiptdetailslabel=true;
  this.manualallocationdtails=false;
  this.policydetails=null;
  this.policycheck=[];
  this.policyfornarraycheck=[];
  this.savelabel=true;
  this.manualhdrid=null;
  this.manualfromdet=null;
  this.intcashofficearray=[];
  this.bkstmtflag=null;
  this.insertnewrecordtodet=[];
  this.count1=null;
  this.manualtodet=null;

  this.clearFormArray();

  this.ngOnInit();
}

exit(){
  window.location.href = "http://localhost:4200/#/dashboard" ; 
}


}