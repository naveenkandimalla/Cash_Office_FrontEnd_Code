// initally we get policycode details from VW_MISALLOCATED_POLICY . after saving this policy record a new record is generated in T_POL_MISALLOCATION_HDR
//testing policy record --- 4006223937 (which is coming from T_POL_MISALL_FROM_DET) after saving the record
//4007552188,4007552269 policydata[to T_POL_MISALL_TO_DET]

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { HttpClient, HttpParams} from '@angular/common/http';
import { PagerService, GlobalServices } from './../../services/index';
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
  templateUrl: './misallocation-correction.component.html'
})
export class MisallocationCorrectionComponent {


  misallocationpolicy:any;
  totalmisallocationreversalamount:any;
  misallocationtodet:any;
  pager: any = {};
  pagedItems: any[];
  checkboxupdating:any;
  policydetails:any;
  misallochdrid:any;
  postlabel:boolean=true;
  totalpolicyamount:number;
  misallocationpolicyamount:number;
  initalamount:number=0; // this is the final amount this should be touched
  misallocatedhdrid:any;
  policyallocationcorrection:any=[]
  count:any;
  correctionamount:number=0;
  intcashofficearray:any=[];
  username:any;
  userid:any;
  count1:any;
  constructor(private http:HttpClient,private pagerService: PagerService,
    private router:Router,
    private tokendetails:TokenStorageService){
  }

  ngOnInit(){
    this.getsessionvalues();
 }
  

 getsessionvalues(){
  this.username= this.tokendetails.getUsername();
  this.userid= this.tokendetails.getuserid();
 }


  misallocatedInput = new FormGroup({
    policyCode: new FormControl('', Validators.required),
    misallocationID: new FormControl('')
    // radios: new FormControl(''), // radio button things
    // transType: new FormControl('') // radio button things
  }) ;

  checkboxform = new FormGroup({   
    cbf: new FormControl('')      
  });

  myForm = new FormGroup({
    policyCode2: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    payer: new FormControl('', Validators.required), 
  }) ;


  // calling misallocation policy details 
   getmisallocationdetails(m){
    this.http.get(`${apiURL}/allocations/misallocationcorrection/misallocpolicy?policycode=`+m).subscribe(
    (response) => {
    console.log(response);
    this.misallocationpolicy=response;
    if(this.misallocationpolicy.length==0){
        alert("no data found on this policycode");
     }else{
        // from the below code we are asigning the extra variable to object so that by using it we can manual chek the checkbox       
       this.misallocationpolicy.forEach((key) => {
        key["quantity"] = 0;
         });
      
         // calculating the total amount 
       this.totalmisallocationreversalamount = this.misallocationpolicy.reduce((sum, item) => sum + +item.amount, 0);
       this.setPage(1)
   for (let i = 0; i < this.misallocationpolicy.length; i++) {
        if(this.misallocationpolicy[i].misallocationId == 0){
                this.misallocatedInput.patchValue({
                       misallocationID:this.misallocationpolicy[i].misallocationId
                           })
        }else{
            this.misallocatedInput.patchValue({
            misallocationID:this.misallocationpolicy[i].misallocationId
            })
  
          this.getmisallocationtodetfrommisallocationid(this.misallocationpolicy[i].misallocationId);
           break;
         }
    }
  }
},
  (error)=>{ 
            console.log(error);
            alert("error occured while fetching the misallocation policy details")
            }
         );
   }

// below is for pagination
   setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.misallocationpolicy.length, page, 10);
  
    // get current page of items
    this.pagedItems = this.misallocationpolicy.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  
  // calling  MISALLOCATIONTODET table record details
getmisallocationtodetfrommisallocationid(td){
this.http.get(`${apiURL}/allocations/misallocationcorrection/misallocationdettoget?misallocationhdrid=`+td).subscribe(response=>{
this.misallocationtodet=response
console.log(this.misallocationtodet);
if(this.misallocationtodet.length>0){
    this.postlabel=false;
    this.enablecheckmark(this.misallocationtodet);
}
this.totalpolicyamount = this.misallocationtodet.reduce((sum, item) => sum + item.amount, 0);
//this.misallocationpolicyamount = this.misallocationtodet.reduce((sum, item) => sum + item.amount, 0);
this.initalamount=this.totalpolicyamount;   
},
(error)=>{
  console.log(error);
  alert("error occured while fetching details");
});
   
}


// now comparing misallocation unallocated policies with policies for correction and if any record is avaliable then we will check the check box automatically

enablecheckmark(policyrecord){
  for(let i=0;i<policyrecord.length;i++){
    this.count1 =  this.misallocationpolicy.filter(app=>app.misallocationId == policyrecord[i].misallocationId)
    if( this.count1.length==1){
        let misallocid = policyrecord[i].misallocationId;
        
        let index = this.misallocationpolicy.findIndex(x=>x.misallocationId == misallocid );
        console.log(index);
        this.misallocationpolicy[index].quantity=1;
    }
  }
  
}


// getting policy details to which we need to allocate 
getpolicycodedetails(){ 
var policycode= this.myForm.get('policyCode2').value
this.http.get(`${apiURL}/allocations/misallocationcorrection/policyinfo?policycode=`+policycode).subscribe(response=>{
console.log(response)
this.policydetails=response
if(this.policydetails.length==0){
   alert("no policy found with this policy code"); 
}else{
    this.myForm.patchValue({
    policyCode2:this.policydetails[0].policycode,
    status:this.policydetails[0].postingStatus, 
    payer:this.policydetails[0].partyName
  })
}     
 },(error)=>{
console.log(error);
alert("error while fetching policy details");
    });
}


oncheck(u,ind){
  if(this.policyallocationcorrection.length>0){ 
    
    this.count =this.policyallocationcorrection.filter(app=> app.recepitNumber == u.recepitNumber );
    if(this.count.length==0){
      var obj = {}  
      obj["amount"] = u.amount
      obj["collectionflag"] = u.collectionflag
      obj["id"] = u.id
      obj["period"] = u.period
      obj["partyid"]=u.partyid
      obj["partyname"]=u.partyname
      obj["policyCode"]=u.policyCode
      obj["policyid"]=u.policyid
      obj["policystatus"]=u.policystatus
      obj["postingStatus"]=u.postingstatus
      obj["recepitNumber"]=u.recepitNumber
      obj["misallocationId"]=u.misallocationId
      this.policyallocationcorrection.push(obj);
      console.log("size if count is 0 then-->"+ this.policyallocationcorrection.length);
     this.policyallocamountassignednew();
    }

    if(this.count.length==1){
      this.policyallocationcorrection = this.policyallocationcorrection.filter(app=> app.recepitNumber != u.recepitNumber)
      console.log("size if count is 1 then-->"+ this.policyallocationcorrection.length);
      this.policyallocamountassignednew();
    }

    }else{
      var obj = {}  
      obj["amount"] = u.amount
      obj["collectionflag"] = u.collectionflag
      obj["id"] = u.id
      obj["period"] = u.period
      obj["partyid"]=u.partyid
      obj["partyname"]=u.partyname
      obj["policyCode"]=u.policyCode
      obj["policyid"]=u.policyid
      obj["policystatus"]=u.policystatus
      obj["postingStatus"]=u.postingstatus
      obj["recepitNumber"]=u.recepitNumber
      obj["misallocationId"]=u.misallocationId
      this.policyallocationcorrection.push(obj);
      console.log("size of todet array --->"+this.policyallocationcorrection.length);
     this.policyallocamountassignednew();
    }  

}

policyallocamountassignednew(){
this.correctionamount = +this.correctionamount + +this.policyallocationcorrection.reduce((sum, item) => sum + item.amount, 0);
this.totalpolicyamount = +this.initalamount + + this.correctionamount;
// reseting the form array amount value to zero 
this.correctionamount=0;
}

// code for checking wheteher record is need for update or insert
policyallocatecorrection(){
if(this.policyallocationcorrection.length==0){
    alert("No Policy is selected for allocating ")
}else{
    let misallocatedid = this.misallocatedInput.get('misallocationID').value;
  if(misallocatedid==0){
      alert("we are saving the record ") ;    
      this.inserthdrrecord();   
  }else{
       alert("we are updating the record ")
        this.updatemisallochdr(misallocatedid);
      }
     }
   }


  // inserting the record to misallochdr
inserthdrrecord(){
   this.http.post(`${apiURL}/allocations/misallocationcorrection/misallocationhdrrecordinsert`,{
         "totalReversalAmt":this.totalpolicyamount, 
         "totalAllocatedAmt":this.totalpolicyamount,
         "postingStatus":'U',
         "createdBy":this.username,
         "modifiedBy":this.username
    }).subscribe( 
    (response)=>{
    this.misallochdrid = response 
    this.misallocatedInput.controls['misallocationID'].setValue(this.misallochdrid);
    this.insertingrecordmisallocfromdet(this.misallochdrid,this.policyallocationcorrection);   
    },
    (error)=>{
      console.log(error);
      alert("error occured while inserting a new record");
    }
  );
 }
  
// update allocated amount in misallocallction hdr table

updatemisallochdr(misallochdrid){
  alert("updating hdr table--->"+misallochdrid)
   this.http.post(`${apiURL}/allocations/misallocationcorrection/misallocationhdrrecordupdate?misallocidhdr=${misallochdrid}`,{
    "totalReversalAmt":this.totalpolicyamount, 
    "totalAllocatedAmt":this.totalpolicyamount,
    "modifiedBy":this.username
   }).subscribe( (response)=>{
     console.log(response);
      
     this.misallocatedhdrid=response;
  
     this.insertingrecordmisallocfromdet(this.misallocatedhdrid,this.policyallocationcorrection);    
    },(error)=>{
      console.log(error);
      alert("error raised while updating the record ");
    });

}
   

   
insertingrecordmisallocfromdet(id,misallocation){
    let createdby=this.username;
    let modifiedby=this.username;
    this.http.post(`${apiURL}/allocations/misallocationcorrection/misallocationfromdetinsertnewrecord?misallocidhdr=${id}&createdby=${createdby}&modifiedby=${modifiedby}`, 
    misallocation).subscribe( response=>{
    let polmisallocationfromdet = response;
    console.log(polmisallocationfromdet+"--records ids coming from db after saving");

    this.insertrecordmisalloctodet(this.misallocatedInput.get('misallocationID').value,this.policyallocationcorrection,this.policydetails)
  
     },(error)=>{
   console.log(error);
      alert("error occured while inserting record "); 
        }
     );
   }
   
   
   // by using this we can send json object
   private prepareSave(): any {
    let input = new FormData();
    input.append('misallocationfromdet',JSON.stringify(this.policyallocationcorrection));
    input.append('formValue', JSON.stringify(this.policydetails));
    return input;
  }



   // insert into misalloctodet
   insertrecordmisalloctodet(id,misallocation,policyinfo){
    let createdby=this.username;
    let modifiedby=this.username;
    console.log(misallocation);
    console.log(policyinfo);
    let policycode=policyinfo[0].policycode;
    let misalloc = this.prepareSave();
    this.http.post(`${apiURL}/allocations/misallocationcorrection/misallocationtodetinsertnewrecord?misallocidhdr=${id}&createdby=${createdby}&modifiedby=${modifiedby}&policycode=${policycode}`,  
    misalloc,
   ).subscribe( response=>{
   let misallocationtodetid = response ;
   console.log("misallocationhdrto id --->"+misallocationtodetid);  
    alert("Sucessfully Record Saved");
    this.clear();
    },(error)=>{
      console.log(error);
      alert("error occured while inserting record "); 
      }
       );
   }  


  // record is posting 
postrecord(){
if(this.policyallocationcorrection.length<0 && this.misallocationtodet.length<0){
    alert("no records are assigned to post/record is not saved");
}else{

if(this.policyallocationcorrection.length>0){
alert("record cannot be posted need to saved first");
}else{
  if(this.misallocationtodet.length>0){
       for(let j=0;j<this.misallocationtodet.length;j++){
            if(this.misallocationtodet[j].policystatus=="P"){
              alert("policy is already posted"+"-"+this.misallocationtodet[j].policyCode);           
            }else{
               if(this.misallocatedInput.get('misallocationID').value==0 ||this.misallocatedInput.get('misallocationID').value==null){
                alert("record need to be saved ");
              }else{
                let createdby =this.username
                var obj={}
                obj["receiptno"] = this.misallocationtodet[j].recepitNumber
                obj["paymentfor"] = 2
                obj["dueDate"] = this.misallocationtodet[j].period
                obj["partyid"] = this.misallocationtodet[j].partyid
                obj["allocatedamount"] = this.misallocationtodet[j].amount 
                obj["createdby"] = createdby
                obj["policycode"] = this.misallocationtodet[j].policyCode
                this.intcashofficearray.push(obj);
               }
           }
         }

     if(this.intcashofficearray.length>0){
      this.postingtintcashoffice();
      }
    }
  }  
}
}

postingtintcashoffice(){      
  this.http.post(`${apiURL}/allocations/misallocationintcashoffice`,
  this.intcashofficearray
  ).subscribe((result)=>{
  console.log(result);
  this.updatepostingstatusmisallocation();
  },(error)=>{
    console.log(error);
    alert("error occured while posting record");
  });
}

//updating posting status
updatepostingstatusmisallocation(){
  let misallochdrid= this.misallocatedInput.get('misallocationID').value 
  let postedby=this.username;
  this.http.get(`${apiURL}/misallocation/postingstatus?misallocationhdrid=${misallochdrid}&postedby=${postedby}`)
  .subscribe((result)=>{
    console.log(result);
    alert("Record is Successfully posted");
    this.clear();
  },(error)=>{
    console.log(error);
  })
}


//81087264,4007552188
  search(x){
    this.getmisallocationdetails(x)
    this.misallocationtodet=[];
  }
    
clear(){

  this.misallocatedInput.reset();
  this.misallocatedInput.get('misallocationID').setValue(0);
  this.checkboxform.reset();
  this.myForm.reset();

  this.misallocationpolicy=null;
  this.totalmisallocationreversalamount=null;
  this.pagedItems=[];
  this.pager=0;
 
  this.misallocationtodet=null;
  
  this.checkboxupdating=null;
  this.policydetails=null;
 
  this.misallochdrid=null;
  this.postlabel=true;
  this.totalpolicyamount=0;
  this. misallocationpolicyamount=0;
  this.initalamount=0;
  this.misallocatedhdrid=null
  this.policyallocationcorrection=[]
  this.count=null;
  this.correctionamount=0;
  this.intcashofficearray=[];
  
   this.count1=null;
}

exit(){
  // Re-direct to app landing page
  window.location.href = "http://localhost:4200/#/dashboard" ;
}

save(){

   this.policyallocatecorrection();
}


 post(){
  this.postrecord();        
  }



}