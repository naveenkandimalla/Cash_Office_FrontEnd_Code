// following the sample data for receipt details  3872 -- 341435,354535,353597,353986
// initally we will check the receipt or bank statement id fro t_receipt table ot t_bank_stmt_hdr after required details 
// we will save the existing receipt/bankstmt details record a new record will be insert in the table  [t_rcpt_reallocation]

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { HttpClient, HttpParams} from '@angular/common/http';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component";
import { formatDate } from "@angular/common";
import { apiURL } from '../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';



@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators
]
})

@Component({
  // selector: 'app-user-management',
  templateUrl: './paypoint-misallocation.component.html'
})
export class PaypointMisallocationComponent {

  bsModalRef: BsModalRef;
  receiptdetails:any;
  paypointdetails:any;
  selectedPaypoint:any;
  creditfilesdetails:any;
  credithdrid:any;
  username:any;
  userid:any;
  reallochdrid:any;
  reallocfromedetid:any;
  realloctoedetid:any;
  reallocationdetails:any;
  searchlabel:boolean=true;
  savelabel:boolean=true;
  postlabel:boolean=true;
  formattedDate:any;
  receiptflag:any;
  stmtflag:any;
  searchlabel1:boolean=true;

  constructor(private http:HttpClient,private modalService: BsModalService,
    private router:Router,
    private tokendetails:TokenStorageService){
  }
  
  ngOnInit(){
    // at loading time only we are calling the credit file api
    this.getcreditfiles();
    this.getpaypointdetails();

    //user login 
    this.getsessionvalues();
  }

    // loads the data as page loads
    getsessionvalues(){
      this.username= this.tokendetails.getUsername();
       this.userid= this.tokendetails.getuserid();
     }
  

 
  paypointMis = new FormGroup({
    rid: new FormControl('', Validators.required),
  });

  paypointMis2 = new FormGroup({
    rNo: new FormControl('', Validators.required),
    gAmnt: new FormControl('', Validators.required),
    pp: new FormControl('', Validators.required),
    pp1: new FormControl('', Validators.required),
    period: new FormControl("", Validators.required),

  });

  paypointMis3 = new FormGroup({
    ppnt: new FormControl('', Validators.required),
    ppName: new FormControl('', Validators.required),
    period2: new FormControl('', Validators.required),
    creditfile: new FormControl('', Validators.required),
    creditamount: new FormControl("", Validators.required),
  });


  // calling paypoint details
  getpaypointdetails(){
    this.http.get(`${apiURL}/allocations/paypoint`).subscribe((result)=>{ 
     console.log(result)
     this.paypointdetails=result
    },(error)=>{
      console.log(error);
      alert("error occured while fetching paypoint details");

    })
  }



   //calling credit file details
  getcreditfiles(){
    this.http.get(`${apiURL}/allocations/paypointmisallocations/creditfiledetails`).subscribe((result)=>{
    console.log(result);
     this.creditfilesdetails=result
      },(error)=>{
        console.log(error);
        alert("error occured while fetching credit files");
      })
   }



// fetching all reallocation details based on realloc hdr id  search 
getreallocationdetails(hdrid){
    if(hdrid==0 || hdrid==null){
      alert("Reallocation Id cannot be Zero/Empty");
    }else{ 
     this.http.get(`${apiURL}/allocations/paypointmisallocations/reallocationdetails?reallochdrid=${hdrid}`).subscribe((result)=>{
       this.reallocationdetails=result;
       console.log( this.reallocationdetails);
       if(this.reallocationdetails.length>0){
           this.getpatchdetails();
           this.searchlabel=false;
           this.savelabel=false;
           this.postlabel=false;
           this.searchlabel1=false;
       }else{
         alert("no record is found with this id");
         this.searchlabel=true;
         
       }
        },
        (error)=>{
           console.log(error)
        })
    }
}

// patch frpm paypoint details and to paypoint details 
getpatchdetails(){
    this.paypointMis2.patchValue({
      rNo:this.reallocationdetails[0].receiptno,
      gAmnt:this.reallocationdetails[0].rcptallocamount,
      pp:this.reallocationdetails[0].referencenumber,
      pp1:this.reallocationdetails[0].ppname,
      period:this.reallocationdetails[0].period
    })
  
    let paypointid=this.reallocationdetails[0].toreferenceno;
    let desc = this.paypointdetails.filter(app => app.paypoint_id == paypointid );
    
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    this.formattedDate = formatDate(this.reallocationdetails[0].toperiod, format, locale);

    this.paypointMis3.patchValue({
      ppnt:this.reallocationdetails[0].toreferenceno,
      ppName:desc[0].payPoint_Name,
      period2: this.formattedDate,
      creditfile:this.reallocationdetails[0].creditfilename,
      creditamount:this.reallocationdetails[0].totalcreditamount
    })
    this.credithdrid=this.reallocationdetails[0].credithdrid;
   }


  
 

  
   searchlabel1enable(){
     let  resceiptstmtno = this.paypointMis2.get('rNo').value;

     if(resceiptstmtno==0 || resceiptstmtno==null || resceiptstmtno=='' ){
       this.searchlabel1=true;
     }
     this.searchlabel1=false;
   }

   // fetching recepit  details
   getbankstmtorreceipdetails(receipt){
    this.http.get(`${apiURL}/allocations/paypointmisallocations/receipt?receiptnum=${receipt}`)
    .subscribe((result)=>{
      console.log(result);
      this.receiptdetails=result;       
    if(this.receiptdetails.length==0){
      this.getbankstmtdetailsrecords(receipt);
    }

    if(this.receiptdetails.length>0){
      this.patchreceiptdetails();
      this.receiptflag='R';
    }
    
     },(error)=>{
     console.log(error);
     alert("error occured while fetching receipt details");
    });  
   
   }


    // fetching  bank stmt details
    getbankstmtdetailsrecords(receipt){
      this.http.get(`${apiURL}/allocations/paypointmisallocations/bkstmtdetails?receiptnum=${receipt}`).subscribe((result)=>{
      console.log(result)
      this.receiptdetails=result;
      if(this.receiptdetails.length==0){
        alert("no data found with this id");
      }else{
        this.patchreceiptdetails();
        this.stmtflag='S';
      }
    
       },(error)=>{
       console.log(error);
       alert("error occured while fetch bank statement details");
      })  
     
     }

   // patch from paypoint details
   patchreceiptdetails(){
      this.paypointMis2.patchValue({ 
          gAmnt: this.receiptdetails[0].amount,
          pp: this.receiptdetails[0].paypointid,
          pp1: this.receiptdetails[0].paypointname,
          period: this.receiptdetails[0].period
        })
       }
 

  // used for pop the paypoint details
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
    console.log("this my data"+result[0].paypoint_id)
    console.log("this my data"+result[0].payPoint_Name)
    console.log("this is paypointactid id "+result[0].pay_Point_Type_id)
    console.log(result)
    this.selectedPaypoint = result[0];
    this.patchthepaypoint()
    })
  }
   
  patchthepaypoint(){
    this.paypointMis3.patchValue({
      ppnt:this.selectedPaypoint.paypoint_id,
      ppName:this.selectedPaypoint.payPoint_Name
    })
  }

   // get credit amount when credit file is selected
   getcreditamount(){     
    let creditfilename = this.paypointMis3.get('creditfile').value
    let desc = this.creditfilesdetails.filter(app => app.creditfilename == creditfilename );
    if(desc.length != 0 ){
      this.credithdrid=desc[0].credithdrid
      this.paypointMis3.patchValue({
        creditamount: desc[0].cramount
      });
    }  
    this.savelabel=false;
   }
 
   //below code deals with table T_RCPT_REALLOCATION which we will use for both save/update
   // insert record into treceiptreallocallocation
   inserttoreceiptrealloc(){
    let receiptno = this.paypointMis2.get('rNo').value;
    let receiptnumber = +receiptno
    let receiptamount = this.paypointMis2.get('gAmnt').value;
    let createdby  = this.username;
    this.http.post(`${apiURL}/allocations/paypointmisallocations/inserttoreceiptrealloc?createdby=${createdby}`,{
    "receiptNo":receiptnumber,
    "rcptAllocAmt":receiptamount
    }).subscribe((result)=>{
    console.log(result)
    this.reallochdrid=result;
    this.insertfromreallocationdet();
    this.paypointMis.controls['rid'].setValue(this.reallochdrid);   
    },
    (error)=>{
      console.log(error);
      alert("error occured while inserting record");
    });
   }
   
// below code deals with T_RCPT_FROM_REALLOCATION_DET table were we will update /save record
insertfromreallocationdet(){
  let reallocid = this.reallochdrid;
  let createdby  = this.username;
  this.http.post(`${apiURL}/allocations/paypointmisallocations/inserttoreceiptreallofromdet?reallochdrid=${reallocid}&createdby=${createdby}`,{
  "referenceNo":this.receiptdetails[0].paypointid,
  "period":this.receiptdetails[0].period
  }).subscribe((result)=>{
   console.log(result);
  this.reallocfromedetid=result;
  this.inserttorealloctodet();
  },(error)=>{
        console.log(error);
        alert("error occured while inserting record  ");
      })
  }

// below code deals with table T_RCPT_TO_REALLOCATION_DET 
inserttorealloctodet(){
  let createdby  = this.username;;
  let reallocid = this.reallochdrid
  let period =this.paypointMis3.get('period2').value
  let crfilename = this.paypointMis3.get('creditfile').value
  let cerditfileamount = this.paypointMis3.get('creditamount').value
  let credithdrid =  this.credithdrid
  this.http.post(`${apiURL}/allocations/paypointmisallocations/inserttoreceiptreallotodet?reallochdrid=${reallocid}&createdby=${createdby}`,{
   "referenceNo":this.selectedPaypoint.paypoint_id,
   "period":period,
   "crFileName":crfilename,
   "totCrAmt":cerditfileamount,
   "crHdrId":credithdrid
  }).subscribe((result)=>{
    console.log(result)
    this.reallocfromedetid=result;
    alert("record is inserted successfully");
    this.postlabel=false;
  },
  (error)=>{
   console.log(error);
   alert("error occured while inserting record ");
  })
}
   
// updating the existing record from T_RCPT_REALLOCATION
updatetoreceiptrealloc(){
    let reallochdrid = this.paypointMis.get('rid').value
    let receiptno = this.paypointMis2.get('rNo').value
    let receiptnumber = +receiptno
    let receiptamount = this.paypointMis2.get('gAmnt').value
    let modifiedby = this.username;
    this.http.put(`${apiURL}/allocations/paypointmisallocations/updatereceiptrealloc?reallochdrid=${reallochdrid}&modifiedby=${modifiedby}`,{
    "receiptNo":receiptnumber,
    "rcptAllocAmt":receiptamount
    }).subscribe((result)=>{
    console.log(result);
    this.updatefromreallocationdet();
    },(error)=>{
      console.log(error);
      alert("error occured while updating the record");
     }
      );
   }

 // update realloc from reallocation 
updatefromreallocationdet(){
  let reallocfromid = this.reallocationdetails[0].rcptfromrealldetid;
  let modifiedby = this.username;
  this.http.put(`${apiURL}/allocations/paypointmisallocations/updatetoreceiptreallofromdet?reallocfromid=${reallocfromid}&modifiedby=${modifiedby}`,{
  "referenceNo":this.reallocationdetails[0].referencenumber,
  "period":this.reallocationdetails[0].period
  }).subscribe((result)=>{
  console.log(result)
  this.reallocfromedetid=result;
  this.updaterealloctoreallocation(); 
  },
  (error)=>{
  console.log(error);
  })
  }

 // update realloc to reallocation
 updaterealloctoreallocation(){
    let realloctoid = this.reallocationdetails[0].rcpttorealldetid
    let period =this.paypointMis3.get('period2').value
    let crfilename = this.paypointMis3.get('creditfile').value
    let cerditfileamount = this.paypointMis3.get('creditamount').value
    let credithdrid = this.reallocationdetails[0].credithdrid
    let referenceNo = this.paypointMis3.get('ppnt').value
    let modifiedby = this.username;
 this.http.put(`${apiURL}/allocations/paypointmisallocations/updatetoreceiptreallotodet?realloctoid=${realloctoid}&modifiedby=${modifiedby}`,{
  "referenceNo":referenceNo,
  "period":period,
  "crFileName":crfilename,
  "totCrAmt":cerditfileamount,
  "crHdrId":credithdrid
  }).subscribe((result)=>{
   console.log(result) ;
   alert("record is updated successfully");
   this.postlabel=false;
   },(error)=>{
    console.log(error);
    alert("error occured while updating record ")
  })
}

  // used for saving paypoint misallocation details
  save(){   
  let receiptno=  this.paypointMis2.get('rNo').value
  let pointno =   this.paypointMis3.get('ppnt').value
  let creditfile = this.paypointMis3.get('creditfile').value  
  let period = this.paypointMis3.get('period2').value
  if(receiptno=='' || pointno=="" || creditfile =="" || period=='' || receiptno==null || pointno==null || creditfile ==null || period==null){
       if(pointno=='' ){
            alert("paypoint id cannot be empty");
          }
       if(receiptno=='' ){
            alert("receipt/bankstmt id cannot be empty");
          }
      if(creditfile=='' ){
            alert("credit file cannot be empty");
          }

       if(period ==''){
            alert("period cannot be empty");
          }

    }else{
        let hdrid = this.paypointMis.value.rid
        if(hdrid == ""|| hdrid==null ){
          this.inserttoreceiptrealloc();
        }else {
          if( this.reallocationdetails[0].postingstatus='P'){
              alert("record is already posted changes cannot be done");
          }else{
            this.updatetoreceiptrealloc();
          }
           
        }
    }
 }
   
 posttoallocate(){
  let period =this.paypointMis3.get('period2').value
  let receiptno=  this.paypointMis2.get('rNo').value
  let paypointno =   this.paypointMis3.get('ppnt').value
  let receiptamount = this.paypointMis2.get('gAmnt').value
  let flag;

  if(this.stmtflag=='' || this.stmtflag==null || this.stmtflag==undefined ){
    flag='R'
  }else{
    flag='S'
  }
    this.getalloctionamount(this.credithdrid,paypointno,period,receiptno,receiptamount,flag);
 }


 //method used for calling esoallocation
 getalloctionamount(crhdrid,paypointid,period,receiptnum,receiptamount,flag){
 
  this.http.post(`${apiURL}/allocations/electronicallocations/allocated?updatedby=${this.userid}`,{
    "crhdrid":crhdrid,
    "paypointid":paypointid,
    "period":period,
    "receiptno":receiptnum,
    "receiptamount":receiptamount,
    "flag":flag
  }).subscribe((result)=>{
    console.log(result);
    let esoallocation:any = result;
    alert(esoallocation.fileresponse);
  },(error)=>{
    console.log(error);
  })

}


 // search method
 search(){

  let hdrid = this.paypointMis.get('rid').value;
 if(hdrid=='' || hdrid==null){
   alert("Reallocation id cannot be Empty");
   this.searchlabel=true;
 }

 this.searchlabel=false;
   
}

 clear(){
 this.paypointMis.reset();
 this.paypointMis2.reset();
 this.paypointMis3.reset();

 this.receiptdetails=null;
 this.selectedPaypoint=null;
 
 this.credithdrid=null;
 this.reallochdrid=null;
 this.reallocfromedetid=null;
 this.realloctoedetid=null;
 this.reallocationdetails=null;

 this.searchlabel=true;
 this.savelabel=true;
 this.postlabel=true;
 this.searchlabel1=true;

}


exit(){
  window.location.href = "http://localhost:4200/#/dashboard" ; 
}


}