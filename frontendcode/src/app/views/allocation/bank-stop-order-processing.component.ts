// sample data used for testing purpose - 354460,354461
// policycode : 4007552269,4007552162,4007552188  


import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { formatDate } from "@angular/common";
import {AdminService } from '../admin/admin.service';
import { Http, Response } from '@angular/http';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component"
import { AllocationsService } from "./allocations.service";
import { PagerService, GlobalServices } from './../../services/index';
import { apiURL } from '../../_nav';
import{AccountinfoComponent} from './accountinfo/Accountinfo.component'
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
  templateUrl: 'bank-stop-order-processing.component.html'
})
export class BankStopOrderProcessingComponent {

//  ---------------------------------------initial set up started-------------------------

bsopremiumdetails:any;
bnkAccDetails:FormGroup;
bnkStmtDetails:FormGroup;
paypointDetails:any;
bankdetailsstmt:any;
bsModalRef: BsModalRef;
myForm: FormGroup;
showbanknameoriginal:boolean=true;
showbankname:boolean=false; 
formattedDate:any;
formattedDate1:any;
formattedDate2:any;
formattedDate3:any;
formattedDate4:any;
scc:any;
scc1:any;
scc2:any;
scc3:any;
scc4:any;
Sundry=['CRE','CRX','LRE','LRX'];
Unspecified=['CRE','CRX','LRE','LRX']
myForm1:FormGroup;
bsosundry:any;
bsounspecified:any;
bsopcodeperiod:any;
searchlabel:boolean=true;
savelabel:boolean=true;
addlabel:boolean=true;
username:any;
userid:any;

  constructor(private fb: FormBuilder,private http:HttpClient,private ads:AdminService,
    private modalService: BsModalService, private pms:AllocationsService,
    private pagerService: PagerService, 
    private router:Router,
    private tokendetails:TokenStorageService ) {

      this.bnkAccDetails = new FormGroup({
        paymentMode: new FormControl('', Validators.required),
        bankName: new FormControl('', Validators.required),
        creationDate: new FormControl(''),
        modifiedDate: new FormControl(''),
        bankStatementID: new FormControl(''),
        accountNo: new FormControl(''), // , Validators.required), // auto-filled
        accountDesc: new FormControl('') // , Validators.required) // auto-filled
    
      }) ;
    
      this.bnkStmtDetails = new FormGroup({
        statementNo: new FormControl(''),
        fromDate: new FormControl(''),
        openingBalance: new FormControl(''),
        reversalPeriod: new FormControl(''),
        branch: new FormControl(''),
        postingStatus: new FormControl(''),
        toDate: new FormControl(''),
        closingBalance: new FormControl(''),
        loginName: new FormControl('')
    
      }) ;
    }

  ngOnInit() {
    this.bnkStmtDetails.patchValue({
      postingStatus:'U'
    })
    this.myForm = this.fb.group({
      corrections: this.fb.array([]),
      corrections1: this.fb.array([]),
      corrections2: this.fb.array([]),
    })

    this.getbktranscationdesc();

    this.getsessionvalues();
  }

  // user login details
  getsessionvalues(){
    this.username= this.tokendetails.getUsername();

   }

  transcationtypedes:any
getbktranscationdesc(){
  this.http.get(`${apiURL}/allocations/transcationtypesBKDesc`).subscribe(
    (Response)=>{
      this.transcationtypedes=Response;
      console.log(this.transcationtypedes);
    }
  );
}


  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  get correctionForms1() {
    return this.myForm.get('corrections1') as FormArray
  }

  get correctionForms2() {
    return this.myForm.get('corrections2') as FormArray
  }


  addCorrection() {

    const correction = this.fb.group({ 
     // corTransType:[],
     corSelect:[],
     corTransType:[],
     corPeriod:[],
     corPolicyCode:[],
     corPolicyStatus:[],
     corPayer:[],
     corExceptedPremium:[],
     corAllocatedPremium:[] 
    })

    this.correctionForms.push(correction);
    this.getenable();
    this.savelabel=false;
    
  }
  deleteCorrection(i) {
    this.correctionForms.removeAt(i)
  }

   // form array for sundry
   addCorrection1() {
    const correction1 = this.fb.group({  
      corSelectsun:[],
      corTransTypesun:[],
      corSundryDescription:[],
      corTransDatesun:[],
      corAllocatedAmntsun:[],  
     })
     this.correctionForms1.push(correction1); 
     this.savelabel=false;
  }

  deleteCorrection1(i) {
    this.correctionForms1.removeAt(i)
  }

 //form array for unspecified
  addCorrection2() {
    const correction2 = this.fb.group({ 
      UCHECK:[],
      uTransactionType:[],
      uDescription:[],
      uperiod:[],
      uallocatedamount:[]   
     })
     this.correctionForms2.push(correction2); 
     this.savelabel=false; 
  }

  deleteCorrection2(i) {
    this.correctionForms2.removeAt(i)
  }


  // ------------------------------------initial setup ended---------------------------

 
  // used for patching the bank account details details
popupresult:any;
openModalWithComponentaccountinfo() {
  this.bsModalRef = this.modalService.show(AccountinfoComponent);
  this.bsModalRef.content.closeBtnName = 'Close';
  this.bsModalRef.content.onClose.subscribe(result => {
  console.log("this data is comping from popup"+result[0].description);
  this.popupresult=result[0];
  this.patchaccountdesc( this.popupresult);
  })
  
}

patchaccountdesc(x){
   this.bnkAccDetails.patchValue({
    bankName:x.finalbankname,
    accountNo:x.cashaccount,
    accountDesc:x.description
   })
}


// use for checking whether user is assign to a branch or not
branchName:any;
getbranchdetail(username){
  const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  this.http.get(`${apiURL}/allocation/branchname/branchcode?username=${username}`,
  { headers, responseType: 'text'})
  .subscribe(
    (response) => {
          console.log(response);
      this.branchName=response;
      if(this.branchName=="" || this.branchName==undefined){
        alert("No Branch is Assign To User");
        this.bnkStmtDetails.controls['loginName'].setValue('');
        this.bnkStmtDetails.controls['branch'].setValue('');
      }else{
        this.bnkStmtDetails.patchValue({
          branch:this.branchName
        })
      } 

      this.savelabel=false;
     
    }, (error) =>{
       console.log(error);
      alert("error occured while fetching branch details");
  } 
);
}

// used for fetching all the basic details about  bank statement details
getbankstmtdetails(stmtid){  
  this.http.get(`${apiURL}/allocations/bankstoporderprocessing/bankstmtdetails?stmtid=`+stmtid)
    .subscribe(
      response => {
       console.log(response);
        this.bankdetailsstmt=response;
        if( this.bankdetailsstmt.length>0){
          console.log(this.bankdetailsstmt[0])
          this.fetchbankstmtdetails();
          this.showbanknameoriginal=false;
          this.showbankname=true;
        }

        if(this.bankdetailsstmt.length==0){
          alert("No bank statement details is found with id ")
        }
       
      }, (error) =>{
        console.log(error);
    }  
);
}

bankstmtidstatus(){

 let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;
 console.log(bankstmtid);

 if(bankstmtid !=null && bankstmtid !=0){
  this.searchlabel=false;
 }else{
  this.searchlabel=true;
 }



}


fetchbankstmtdetails(){
  this.scc = this.bankdetailsstmt[0].creationdate;
  console.log("creation_DATE"+"------"+this.scc);

 this.scc1 = this.bankdetailsstmt[0].modifieddate;
 console.log("modified_DATETIME"+"------"+this.scc1);

 this.scc2 = this.bankdetailsstmt[0].stmtstartdate;
 console.log("stmt_START_DATE"+"------"+this.scc2);

 this.scc3 = this.bankdetailsstmt[0].stmtenddate;
 console.log("stmt_END_DATE"+"------"+this.scc3);

 this.scc4 = this.bankdetailsstmt[0].periodofreversal;
 console.log("period_FOR_REVERSALS"+"------"+this.scc4);

 this.bnkAccDetails.patchValue({       
   paymentMode: this.bankdetailsstmt[0].paymentmode,
   bankName: this.bankdetailsstmt[0].bankname,
   accountNo:this.bankdetailsstmt[0].accountnumber,
   accountDesc: this.bankdetailsstmt[0].description,  
   creationDate: this.bankdetailsstmt[0].creationdate,
   modifiedDate: this.bankdetailsstmt[0].modifieddate
 })

 this.bnkStmtDetails.patchValue({
   statementNo:this.bankdetailsstmt[0].bankstatementnumber,
   fromDate:this.bankdetailsstmt[0].stmtstartdate,
   openingBalance:this.bankdetailsstmt[0].openingbalance,
   reversalPeriod:this.bankdetailsstmt[0].periodofreversal,
   branch:this.bankdetailsstmt[0].capaturebybranch,
   postingStatus:this.bankdetailsstmt[0].postingstatus,
   toDate:this.bankdetailsstmt[0].stmtenddate,
   closingBalance:this.bankdetailsstmt[0].closingbalance,
   loginName:this.bankdetailsstmt[0].capatureby
 })

//  code used for formatting the date 
 const format = 'yyyy-MM-dd';
 const locale = 'en-US';
  this.formattedDate = formatDate(this.scc, format, locale);
  this.formattedDate1 = formatDate(this.scc1, format, locale);
  this.formattedDate2 = formatDate(this.scc2, format, locale);
  this.formattedDate3 = formatDate(this.scc3, format, locale);
  this.formattedDate4 = formatDate(this.scc4, format, locale);
 
this.bnkAccDetails.controls['creationDate'].setValue(this.formattedDate);
this.bnkAccDetails.controls['modifiedDate'].setValue(this.formattedDate1);
this.bnkStmtDetails.controls['fromDate'].setValue(this.formattedDate2);
this.bnkStmtDetails.controls['toDate'].setValue(this.formattedDate3);
//this.bnkStmtDetails.controls['reversalPeriod'].setValue(this.scc4.substring(0, 10));

if(this.scc4==null){
 this.bnkStmtDetails.controls['reversalPeriod'].setValue('');
}
else{
 this.bnkStmtDetails.controls['reversalPeriod'].setValue(this.formattedDate4);
}
 
}



// used for fetching bso premium details
bsototalamount:any;
getbsopremium(stmtid){
  this.http.get(`${apiURL}/allocations/bankstoporderprocessing/bsopremium?stmtid=`+stmtid)
    .subscribe(
      response => {
        this.bsopremiumdetails=response
        console.log( this.bsopremiumdetails);
        if( this.bsopremiumdetails.length>0){
          this.setPage(1);
          this.bsototalamount=this.bsopremiumdetails.reduce((sum, item) => sum + item.allocatedAmount, 0);
        }   
      }, (error) =>{
        console.log(error);
    }
    
);
  
}

// used for fetching sundry details
bsosundrytotalamount:any;
getbsosundry(bankstmtcode){
  let sundry = bankstmtcode;
 this.http.get(`${apiURL}/allocations/stmt/sundry?Bankstmtexclusionssundry1=`+sundry)
   .subscribe(
     (response) => {   
       this.bsosundry=response
        console.log(this.bsosundry);
      if(this.bsosundry.length>0){
        this.setPage1(1);
        this.bsosundrytotalamount=this.bsosundry.reduce((sum, item) => sum + item.aLLOCATED_AMOUNT, 0);
      }
     }, (error) =>{
       console.log(error);
       
     } 
);
}


// fetching unspecified details
bsounspecifiedtotalamount
getbsounspecified(bankstmtcode){
  let unspecified = bankstmtcode;
   this.http.get(`${apiURL}/allocations/stmt/unspecified?Bankstmtexclusionsunspecified=`+unspecified)
   .subscribe(
     response => {
       console.log(response); 
       this.bsounspecified=response;
       if( this.bsounspecified.length>0){
        this.setPage2(1);
        this.bsounspecifiedtotalamount=this.bsounspecified.reduce((sum, item) => sum + item.aLLOCATED_AMOUNT, 0);
       }
     }, (error) =>{
       console.log(error);   
   }  
);
}



//below code is use for saving/updating the bank  statement details record into t_bankt_hdr
savebankstmtdetails(){
  let paymentMode =   this.bnkAccDetails.get('paymentMode').value;
  let bankName = this.bnkAccDetails.get('bankName').value;
  let creationDate = this.bnkAccDetails.get('creationDate').value;
  let modifiedDate = this.bnkAccDetails.get('modifiedDate').value;
  let accountNo = this.bnkAccDetails.get('accountNo').value;
  let accountDesc = this.bnkAccDetails.get('accountDesc').value;
  let statementNo= this.bnkStmtDetails.get('statementNo').value;
  let fromDate = this.bnkStmtDetails.get('fromDate').value;
  let openingBalance = this.bnkStmtDetails.get('openingBalance').value;
  let toDate = this.bnkStmtDetails.get('toDate').value;
  let closingBalance = this.bnkStmtDetails.get('closingBalance').value;
  let loginName = this.bnkStmtDetails.get('loginName').value;

 if(openingBalance=="" || closingBalance=="" || paymentMode=="" || bankName=="" || creationDate=="" || modifiedDate=="" || accountNo=="" || accountDesc=="" || statementNo=="" || fromDate=="" ||  toDate=="" || loginName=="" || paymentMode==null || bankName==null || creationDate==null || modifiedDate==null || accountNo==null || accountDesc==null || statementNo==null || fromDate==null || openingBalance==null || toDate==null || closingBalance==null || loginName==null ){   
  alert("please filled the mandatory fields");
    if(openingBalance==0){
      alert("opening balances cannot be zero");
    }

    if(closingBalance==0){
      alert("closingBalance  cannot be zero");
    }
 }else{
   let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;
   if(bankstmtid=="" || bankstmtid==0 || bankstmtid==null){  
    this.saverecordbankdetails();
    this.addlabel==false;
    
   }else{
     this.updterecordbankdetails();
     this.addlabel==false;
   } 
 }
 }
 
 // saving the record into t_bank_hdr
 bankstmtid:any;
 saverecordbankdetails(){
  let paymentMode =   this.bnkAccDetails.get('paymentMode').value;
  let bankName = this.bnkAccDetails.get('bankName').value;
  let creationDate = this.bnkAccDetails.get('creationDate').value;
  let modifiedDate = this.bnkAccDetails.get('modifiedDate').value;
  let accountNo = this.bnkAccDetails.get('accountNo').value;
  let accountDesc = this.bnkAccDetails.get('accountDesc').value;
  let statementNo= this.bnkStmtDetails.get('statementNo').value;
  let fromDate = this.bnkStmtDetails.get('fromDate').value;
  let openingBalance = this.bnkStmtDetails.get('openingBalance').value;
  let toDate = this.bnkStmtDetails.get('toDate').value;
  let closingBalance = this.bnkStmtDetails.get('closingBalance').value;
  let createdby = this.bnkStmtDetails.get('loginName').value;
  let branch = this.bnkStmtDetails.get('branch').value;

 this.http.post(`${apiURL}/allocations/tbankstmthdr/savehdrrecod`,{
   "paymentmode":paymentMode,
   "bankname":bankName,
   "accountnumber":accountNo,
   "creationdate":creationDate,
  "modifiedate":modifiedDate,
  "bankstmtnumber":statementNo,
  "datefrom":fromDate,
  "dateto":toDate,
  "loginname":createdby,
  "openingbalance":openingBalance,
  "closingbalance":this.bnkStmtDetails.value.closingBalance,
  "branch":branch,
  "createdby":createdby
 }
 ).subscribe((result)=>{
    let bankstmtid = result;
   console.log(bankstmtid);
   this.bnkAccDetails.controls['bankStatementID'].setValue(bankstmtid);
   this.addlabel=false;
   alert("Bank statement record is saved succesfully");
  
 },(error)=>{
   console.log(error);
   alert("error occured while saving record");
 })
}

// update t_bank_stmt_hdr table
updterecordbankdetails(){
 let paymentMode =   this.bnkAccDetails.get('paymentMode').value;
 let bankName = this.bnkAccDetails.get('bankName').value;
 let creationDate = this.bnkAccDetails.get('creationDate').value;
 let modifiedDate = this.bnkAccDetails.get('modifiedDate').value;
 let accountNo = this.bnkAccDetails.get('accountNo').value;
 let accountDesc = this.bnkAccDetails.get('accountDesc').value;
 let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;
 let statementNo= this.bnkStmtDetails.get('statementNo').value;
 let fromDate = this.bnkStmtDetails.get('fromDate').value;
 let openingBalance = this.bnkStmtDetails.get('openingBalance').value;
 let toDate = this.bnkStmtDetails.get('toDate').value;
 let closingBalance = this.bnkStmtDetails.get('closingBalance').value;
 let createdby = this.bnkStmtDetails.get('loginName').value;
 let branch = this.bnkStmtDetails.get('branch').value;
 this.http.post(`${apiURL}/allocations/tbankstmthdr/updatedhdrrecod?bankstmtid=${bankstmtid}`,{
   "paymentmode":paymentMode,
   "bankname":bankName,
   "accountnumber":accountNo,
   "creationdate":creationDate,
  "modifiedate":modifiedDate,
  "bankstmtnumber":statementNo,
  "datefrom":fromDate,
  "dateto":toDate,
  "loginname":createdby,
  "openingbalance":openingBalance,
  "closingbalance":this.bnkStmtDetails.value.closingBalance,
  "branch":branch,
  "createdby":createdby
 }
 ).subscribe((result)=>{
   console.log(result);
   alert("Bank statement Record is updated successfully");
   this.addlabel=false;
 },(error)=>{
   console.log(error);
   alert("error occured while Updating record");
 })
   
}

//.......................the below code deals with bsopremium record

//by using below code we can disable the inputs which are enter for saving bso premium record
updateamountchangesbso(i){
  let  transcationtype = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
  let  period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  let  policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
  let  policystatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyStatus').value;
  let  payor = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayer').value;
  let  exceptedpremium = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExceptedPremium').value;
  let  allocatedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedPremium').value;


  if(transcationtype !=null && period !=null && policycode != null && policystatus!= null && payor !=null && exceptedpremium !=null && allocatedamount !=null  && transcationtype !='' && period !='' && policycode != '' && payor !='' &&  exceptedpremium !='' && allocatedamount!=''){

    (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').disable(); 
    (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').disable();
    (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').disable();
    // (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayer').disable();
    //  (<FormArray>this.myForm.controls['corrections']).at(i).get('corExceptedPremium').disable();
    //  (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyStatus').disable();
    (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedPremium').disable();
     
    // used for enabled the check box
     (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').enable();
  }else{
    alert("fields cannot be empty");
    (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedPremium').reset();
  }
}

// below code is used for set up the checkbox status as disabled
getenable(){
  let lengthform = this.correctionForms.length;
  let count=lengthform-1;
  (<FormArray>this.myForm.controls['corrections']).at(count).get('corSelect').disable();
}


insertbsopremium:any=[];
count:any;
bsopremiumcheck(i){
  let  transcationtype = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
  let  period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  let policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
  let  policystatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyStatus').value;
  let  payor = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayer').value;
  let  exceptedpremium = (<FormArray>this.myForm.controls['corrections']).at(i).get('corExceptedPremium').value;
  let  allocatedamount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedPremium').value;
  
if(transcationtype==null || period==null || policycode == null || policystatus== null || payor==null || exceptedpremium==null || allocatedamount==null  || policycode == '' || payor=='' || exceptedpremium=='' || allocatedamount=='' ){
  alert("Fields cannot be empty");
}else{

  if(this.insertbsopremium.length ==0){
        var obj = {}
        obj["bkTransactionType"] = transcationtype
        obj["period"] = period
        obj["policyCode"] = policycode
        obj["policyStatus"] = policystatus
        obj["payor"] = payor
        obj["expectedPremium"] = exceptedpremium
        obj["allocatedAmount"] = allocatedamount
        this.insertbsopremium.push(obj);
     }else{
      if(this.correctionForms.length>0){
        this.count =this.insertbsopremium.filter(app=> app.policyCode == policycode);
        if(this.count.length==0){

          var obj = {}
          obj["bkTransactionType"] = transcationtype
          obj["period"] = period
          obj["policyCode"] = policycode
          obj["policyStatus"] = policystatus
          obj["payor"] = payor
          obj["expectedPremium"] = exceptedpremium
          obj["allocatedAmount"] = allocatedamount
          this.insertbsopremium.push(obj);
          alert("size of todet array --->"+this.insertbsopremium.length);

        }

        if(this.count.length==1){
          this.insertbsopremium=this.insertbsopremium.filter(app=> app.policyCode != policycode);
          console.log("length after slicing---->>"+this.insertbsopremium.length);
        }

      }

   }


}

}


  //fetch the policy details using policy code and period --4007552162,4007552269
  // below code is used for fetching the policy status,payour,excepted premium details 
  fetchpolicydetailsbypcodeperiod(i){
   var  period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
   var policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
   
   if(period ==null || policycode ==null || period =='' || policycode ==''  ){
     alert("period and policy code both are required");

     if(period ==null || period =='' ){
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').reset();
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').reset();
     }

     if(policycode ==null || policycode ==''){
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').reset();
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').reset();
     }
     
   
   }else{
     this.http.get(`${apiURL}/allocations/bankstoporderprocessing/bsopcodeperiod?policycode=${policycode}&period=${period}`)
     .subscribe(
       response => {
         console.log(response);
         this.bsopcodeperiod=response;
       if(this.bsopcodeperiod.length>0){
         this.patchbsopremium(i);
       }else{
         alert("No record founch for this Policycode and period");
         (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').reset();
         (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').reset();
       }  
       }, (error) =>{
         console.log(error);   
     } 
  );
   }

  }

  //patch premium policy details
  patchbsopremium(i){
    
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    x.patchValue({
      corPolicyStatus:this.bsopcodeperiod[0].stattusname,
      corPayer:this.bsopcodeperiod[0].partyname,
      corExceptedPremium:this.bsopcodeperiod[0].exceptedamount
    });
  }

 


  // saving the record into bso premium 
  saverecordbsopremium(){
    let bankstmtidde = this.bnkAccDetails.get('bankStatementID').value;
    console.log(this.insertbsopremium);
  this.http.post(`${apiURL}/allocations/bankstoporderprocessing/bsopremiumssave?bankstmtid=${bankstmtidde}`,
  this.insertbsopremium
  ).subscribe(
   (result)=>{
     console.log(result);
     alert(" Bso record is successfully saved ");
           // used for removing formarray records 
           for(let i = 0;i<this.correctionForms.length;i++){
            let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value  
               if(status==true){
                     let  policycode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPolicyCode').value;
                       this.insertbsopremium= this.insertbsopremium.filter(app=> app.policyCode != policycode);
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
                this.insertbsopremium= this.insertbsopremium.filter(app=> app.policyCode != policycode);
                 this.correctionForms.removeAt(i);
                 }
          }

          this.searchlabel=false;

   },(error)=>{
     console.log(error);
     alert("error has raised while saving Bso premium record ");
   }

  );

  }

  // delete bso record 
  deletebsorecord(x,i){
    let allocatedamount =  this.bsopremiumdetails[i].allocatedAmount;
    if(this.bankdetailsstmt[0].postingstatus !='P'){

      this.http.get(`${apiURL}/allocation/bsorecorddelete?bsoid=${x}`).subscribe(
        (result)=>{
          console.log(result);
          let statusid = result;
          if(statusid==1){
            alert("Record is Succesfully Deleted");
            let bsopremiumid = this.bsopremiumdetails[i].bkStmtDetBsoId
            this.bsototalamount = this.bsototalamount - allocatedamount
            this.bsopremiumdetails = this.bsopremiumdetails.filter(app=> app.bkStmtDetBsoId !=bsopremiumid);
            this.setPage(1);
          }else{
            alert("error occured while deleting the record ");
          }
        },(error)=>{
          console.log(error);
          alert("error occured while deleting the record ");
        }
      )

    }else{
      alert("Already record is posted so it cannot be modified/deleted");
    }
    

  }


// ..............................bso premium code end 


//..................below deals with sundry record 

 // used for oatch the description based on input of transcation type
  patchsundrydesc(i){
    let x  = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corTransTypesun').value;
    let descpatch= this.transcationtypedes.filter(app=>app.transcationtype==x)[0]
    let xsun = (<FormArray>this.myForm.controls['corrections1']).at(i);
    xsun.patchValue({
    corSundryDescription:descpatch.transdescription
    });
   }

  
   updateamountchangesbsosundry(i){
    let x  = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corTransTypesun').value;
    let x1 = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSundryDescription').value;
    let x2 = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corTransDatesun').value;
    let x3 = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corAllocatedAmntsun').value; 

  
    if(x != null && x1 != null &&  x2 != null &&  x3 != null &&  x != '' &&  x1 != '' &&  x2 != '' &&  x3 != ''){
      
    (<FormArray>this.myForm.controls['corrections1']).at(i).get('corTransTypesun').disable();
    (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSundryDescription').disable();
    (<FormArray>this.myForm.controls['corrections1']).at(i).get('corTransDatesun').disable();
    (<FormArray>this.myForm.controls['corrections1']).at(i).get('corAllocatedAmntsun').disable(); 

    (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSelectsun').enable(); 

    }else{
      alert("filled all required fields");
      (<FormArray>this.myForm.controls['corrections1']).at(i).get('corAllocatedAmntsun').reset();
    }

   }

  

  insertrecordfromSundryarray:any=[];
  count1:any;
  sundrycheckbox(i){
   let x  = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corTransTypesun').value;
   let x1 = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSundryDescription').value;
   let x2 = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corTransDatesun').value;
   let x3 = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corAllocatedAmntsun').value;  
   let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;
   
    if(x == null || x1 == null || x2 == null || x3 == null ){
        
      alert("all required fields need to be filled");
  
  
      if(x == null){
        alert("Transcation Type cannot be null");
      }
  
     if(x1 == null){
      alert("Description cannot be null");
     }
    
     if(x2 == null){
      alert("Transcation Date cannot  be null");
     }
  
     if(x3 == null){
      alert("Allocated Amount cannot be null");
     }

  
  
  }else{

      if(this.insertrecordfromSundryarray.length==0){
          var obj={}
          obj["bk_stmt_id"] = bankstmtid
          obj["bK_TRANSACTION_TYPE"]=x
          obj["bK_TRANSACTION_DESC"]=x1
          obj["pERIOD"]=x2
          obj["aLLOCATED_AMOUNT"]=x3
          obj["createdby"]= this.username
          this.insertrecordfromSundryarray.push(obj);
           console.log(this.insertrecordfromSundryarray);
      }else{

        if(this.correctionForms1.length>0){

          this.count1 =this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC == x1);

          if(this.count1.length==0){
            var obj={}
            obj["bk_stmt_id"] = bankstmtid
            obj["bK_TRANSACTION_TYPE"]=x
            obj["bK_TRANSACTION_DESC"]=x1
            obj["pERIOD"]=x2
            obj["aLLOCATED_AMOUNT"]=x3
            obj["createdby"]= this.username
            this.insertrecordfromSundryarray.push(obj);
            console.log("size of dde array--->"+ this.insertrecordfromSundryarray.length);
            console.log(this.insertrecordfromSundryarray);

          }

          if(this.count1.length==1){
            this.insertrecordfromSundryarray=this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC != x1);
            console.log("length after slicing---->>"+this.insertrecordfromSundryarray.length);
          }

        }


          } 

  }

   }

 
// deleting sundry record

deletesundryrecord(dde,i){
 let rv = dde
let allocatedamount =   this.bsosundry[i].aLLOCATED_AMOUNT;
 if(this.bankdetailsstmt[0].postingstatus !='P'){
  this.http.delete(`${apiURL}/allocations/dde/deletesundry?sundryid=${dde.bk_sundry_id}`)
  .subscribe(
    (response) => {
      console.log(response);
      alert("succesfully record has been deleted");
 
      let sundryid = dde.bk_sundry_id
      this.bsosundrytotalamount=this.bsosundrytotalamount - allocatedamount;
      this.bsosundry=this.bsosundry.filter(app=>app.bk_sundry_id!==sundryid); 
      this.setPage1(1);
    }, (error) =>{
      console.log(error);
      alert("error occured while deleting the record");
  }
 );

 }else{
  alert("Already record is posted so it cannot be modified/deleted");
 }

}


  //post for sundry
  savesundryrecord(){

    if(this.insertrecordfromSundryarray.length==0){
     alert("Select alteast one policy");
    } else{
    
       this.http.post(`${apiURL}/allocations/sundry/post`,
       this.insertrecordfromSundryarray).subscribe((response) => {  
        console.log("sundry result starts here");
        console.log(response);   
        alert("sundry record has been inserted");

        for(let i = 0;i<this.correctionForms1.length;i++){

          let status:boolean =  (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSelectsun').value;

             if(status==true){

                   let x1  = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSundryDescription').value;

                    this.insertrecordfromSundryarray=this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC != x1);

                      this.correctionForms1.removeAt(i);

                           if(this.correctionForms1.length==1){

                                 break;
                              }

                 console.log("after remove--->"+ this.insertrecordfromSundryarray.length)
             }
 
         }


         for(let i = 0;i<this.correctionForms1.length;i++){

          let status:boolean =  (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSelectsun').value;

             if(status==true){

                   let x1  = (<FormArray>this.myForm.controls['corrections1']).at(i).get('corSundryDescription').value;
                    this.insertrecordfromSundryarray=this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC != x1);

                      this.correctionForms1.removeAt(i);


                 
             }
 
         }

         this.searchlabel=false;

  }, (error) =>{
    console.log(error);
    alert("error occured while saving the record bso unspecified");
}
);
      
    }

 }


// .............................below code deals with unspecified 

patchunspecifieddesc(i){
  let x  = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uTransactionType').value;
  let descpatch= this.transcationtypedes.filter(app=>app.transcationtype==x)[0]
  let xsun = (<FormArray>this.myForm.controls['corrections2']).at(i);
  console.log("this calling form "+x);
 
  xsun.patchValue({
   uDescription:descpatch.transdescription
  });
 }

 updateamountchangesbsoundefined(i){

  let x = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uTransactionType').value;
  let x1 = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uDescription').value;
  let x2 = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uperiod').value;
  let x3 = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uallocatedamount').value;
 
  if(x != null && x1 != null &&  x2 != null &&  x3 != null &&  x != '' &&  x1 != '' &&  x2 != '' &&  x3 != ''){
    (<FormArray>this.myForm.controls['corrections2']).at(i).get('uTransactionType').disable();
    (<FormArray>this.myForm.controls['corrections2']).at(i).get('uDescription').disable();
    (<FormArray>this.myForm.controls['corrections2']).at(i).get('uperiod').disable();
    (<FormArray>this.myForm.controls['corrections2']).at(i).get('uallocatedamount').disable();
    (<FormArray>this.myForm.controls['corrections2']).at(i).get('UCHECK').enable();
  }else{
    alert("please filled all required fields data");
  }


 }


 insertrecordfromunspecifiedarray:any=[];
 count3:any;
 elementunspecified(i){
  let x = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uTransactionType').value;
  let x1 = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uDescription').value;
  let x2 = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uperiod').value;
  let x3 = (<FormArray>this.myForm.controls['corrections2']).at(i).get('uallocatedamount').value;
  let bankstmtnumber = this.bnkAccDetails.value.bankStatementID

  if(x == null || x1 == null || x2 == null || x3 == null){
    
    alert(" all details need to be  filled ");

    if(x == null){
      alert(" Transcation type cannot be null");
    }

    if(x1 == null){
      alert(" Description cannot be null");
    }

    if(x2 == null){
      alert(" period cannot be null");
    }

    if(x3 == null){
      alert(" allocated amount cannot be null");
    }

}else{
   
 
  if(this.insertrecordfromunspecifiedarray.length==0){
    var obj={}
    obj["bk_stmt_id"] = bankstmtnumber
    obj["bK_TRANSACTION_TYPE"]=x
    obj["bK_TRANSACTION_DESC"]=x1
    obj["pERIOD"]=x2
    obj["aLLOCATED_AMOUNT"]=x3
    obj["createdby"]= this.username
    this.insertrecordfromunspecifiedarray.push(obj);
  }else{
    if(this.correctionForms2.length>0){

      this.count3 =this.insertrecordfromunspecifiedarray.filter(app=> app.bK_TRANSACTION_DESC == x1);

      if(this.count3.length==0){
        var obj={}
    obj["bk_stmt_id"] = bankstmtnumber
    obj["bK_TRANSACTION_TYPE"]=x
    obj["bK_TRANSACTION_DESC"]=x1
    obj["pERIOD"]=x2
    obj["aLLOCATED_AMOUNT"]=x3
    obj["createdby"]= this.username
    this.insertrecordfromunspecifiedarray.push(obj);
    alert("size of dde array--->"+ this.insertrecordfromunspecifiedarray.length);

      }

      if(this.count3.length==1){
        this.insertrecordfromunspecifiedarray=this.insertrecordfromunspecifiedarray.filter(app=> app.bK_TRANSACTION_DESC != x1);
        console.log("length after slicing---->>"+this.insertrecordfromunspecifiedarray.length);
      }


    }
  }
   
  }

 }



 saveunspecifiedrecord(){  
    this.http.post(`${apiURL}/allocations/unspecified/post`,
    this.insertrecordfromunspecifiedarray
 ).subscribe((response) => {
            console.log("unspecified saved results are :")
            console.log(response);
            alert("successfully unspecified record is saved");

            for(let i = 0;i<this.correctionForms2.length;i++){

              let status:boolean = (<FormArray>this.myForm.controls['corrections2']).at(i).get('UCHECK').value;
    
                 if(status==true){
    
                 let x1= (<FormArray>this.myForm.controls['corrections2']).at(i).get('uDescription').value;
    
                        this.insertrecordfromunspecifiedarray=this.insertrecordfromunspecifiedarray.filter(app=> app.bK_TRANSACTION_DESC != x1);
                      
    
                          this.correctionForms2.removeAt(i);
    
                               if(this.correctionForms2.length==1){
    
                                     break;
                                  }

                                  console.log("length after slicing---->>"+this.insertrecordfromunspecifiedarray.length);
  
                 }
     
             }



             for(let i = 0;i<this.correctionForms2.length;i++){

              let status:boolean = (<FormArray>this.myForm.controls['corrections2']).at(i).get('UCHECK').value;
    
                 if(status==true){
    
                 let x1= (<FormArray>this.myForm.controls['corrections2']).at(i).get('uDescription').value;
  
                        this.insertrecordfromunspecifiedarray=this.insertrecordfromunspecifiedarray.filter(app=> app.bK_TRANSACTION_DESC != x1);
                          this.correctionForms2.removeAt(i);
    
                                 
  
                 }
     
             }


             this.searchlabel=false;



          }, (error) =>{
            console.log(error);
            alert("error occured while saving unspecified record ");  
        }   
    );
}


unspecifieddelete(dde,i){

  let allocatedamount  =  this.bsounspecified[i].aLLOCATED_AMOUNT
  if(this.bankdetailsstmt[0].postingstatus !='P'){

    this.http.delete(`${apiURL}/allocations/dde/deleteunspecified?bK_STMT_DET_UNSP_ID=${dde.bK_STMT_DET_UNSP_ID}`)
    .subscribe(
      (response) => {
        console.log(response);
        alert("succesfully record has been deleted"); 

       let unspecifiedid =  this.bsounspecified[i].bK_STMT_DET_UNSP_ID
        this.bsounspecifiedtotalamount = this.bsounspecifiedtotalamount - allocatedamount
        this.bsounspecified=this.bsounspecified.filter(app=>app.bK_STMT_DET_UNSP_ID !== unspecifiedid)
       this.setPage2(1);
      }, (error) =>{
        console.log(error);
        alert("error occured while deleting unspecified record");
    }  
);

  }else{
    alert("Already record is posted so it cannot be modified/deleted");
  }

}





  pager: any = {};
  pagedItems: any[];
  pager1: any = {};
  pagedItems1: any[];
  pager2: any = {};
  pagedItems2: any[];

  // this set page is for bso bsopremium
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.bsopremiumdetails.length, page, 10);

    // get current page of items
    this.pagedItems = this.bsopremiumdetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
 

  // this set page is for bso sundry
  setPage1(page1: number) {
    if (page1 < 1 || page1 > this.pager1.totalPages) {
      return;
    }
    // get pager object from service
    this.pager1 = this.pagerService.getPager(this.bsosundry.length, page1, 10);

    // get current page of items
    this.pagedItems1 = this.bsosundry.slice(this.pager1.startIndex, this.pager1.endIndex + 1);
  }


  // this set page is for bso unspecified
  setPage2(page2: number) {
    if (page2 < 1 || page2 > this.pager2.totalPages) {
      return;
    }
    // get pager object from service
    this.pager2 = this.pagerService.getPager(this.bsounspecified.length, page2, 10);

    // get current page of items
    this.pagedItems2 = this.bsounspecified.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
  }



  clearFormArray (){
    while(this.correctionForms.length !=0){
      this.correctionForms.removeAt(0);
     }
    
    }

    clearFormArray1 (){
      while(this.correctionForms1.length !=0){
        this.correctionForms1.removeAt(0);
       }
      
      }

      clearFormArray2 (){
        while(this.correctionForms2.length !=0){
          this.correctionForms2.removeAt(0);
         }
        
        }
  

  save(){

    if(this.bankdetailsstmt==undefined){
      this.savebankstmtdetails();
      if( this.insertbsopremium.length>0){
        console.log("we revoke save method for bso premium");
         this.saverecordbsopremium();
      }

      if(this.insertrecordfromSundryarray.length>0){
       console.log("we revoke save method for bso sundry");
        this.savesundryrecord();
      }

     if(this.insertrecordfromunspecifiedarray.length>0){
        console.log("we revoke save method for bso unspecified");
        this.saveunspecifiedrecord();
       }

    
    }else{

      if(this.bankdetailsstmt[0].postingstatus !='P'){

        this.savebankstmtdetails();
        
            if( this.insertbsopremium.length>0){
               console.log("we revoke save method for bso premium");
                this.saverecordbsopremium();
             }
  
             if(this.insertrecordfromSundryarray.length>0){
              console.log("we revoke save method for bso sundry");
               this.savesundryrecord();
             }

            if(this.insertrecordfromunspecifiedarray.length>0){
               console.log("we revoke save method for bso unspecified");
               this.saveunspecifiedrecord();
              }
         
              //firsty saving/updating the bank statement record details 
           

           if(this.insertbsopremium.length==0 && this.insertrecordfromSundryarray.length==0 && this.insertrecordfromunspecifiedarray.length==0 ){
            alert("no bank statement allocation record is avaliable to save")
           }
    

   }else{
    alert("already record as been posted changes cannot be done");

   }

    }
   

     
  
  }


 // serach by using bank stmt id 
 search(x){
   let bankstmtid = x;
   this.clear();
   this.bnkAccDetails.controls['bankStatementID'].setValue(bankstmtid);
  this.getbankstmtdetails(x);
  this.getbsopremium(x);
  this.getbsosundry(x);
  this.getbsounspecified(x);
  this.addlabel=false;
}


//reset the all functions 
clear(){
   // reseting the bank stmt details
   this.bnkAccDetails.reset();
   this.bnkStmtDetails.reset();
   this.bankdetailsstmt=null;

  // reseting bso premium
  this.bsopremiumdetails=null;
   this.pager =0;
  this.pagedItems=[];


  // reseting sundry
   this.bsosundry=null;
   this.pager1 =0;
  this.pagedItems1=[];


  //reseting unspecified
  this.bsounspecified==null;
  this.pager2 =0;
  this.pagedItems2=[];


  // form array
  this.clearFormArray();
  this.clearFormArray1();
  this.clearFormArray2();


  // clear the insertrecord arrays
  this.insertbsopremium=[];
  this.insertrecordfromSundryarray=[];
  this.insertrecordfromunspecifiedarray=[];

  this.savelabel=true;
  this.searchlabel=true;

  this.showbanknameoriginal=true;
  this.showbankname=false;
   
  this.count=null;
  this.count1=null;
  this.count3=null;

  this.ngOnInit();
}

exist(){
  window.location.href = "http://localhost:4200/#/dashboard" ; 
}




}
