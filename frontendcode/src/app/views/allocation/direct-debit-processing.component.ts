// Direct Debit Processing - Allocation Module 
// sample data used for testing purpose - 354460,354461
// policycode : 4007552269,4007552162,4007552188  

import { Component, NgModule, OnInit } from '@angular/core';
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
import{AccountinfoComponent} from './accountinfo/Accountinfo.component';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule
    , FormArray, FormBuilder
]
})

@Component({
  templateUrl: './direct-debit-processing.component.html'
})
export class DirectDebitProcessingComponent implements OnInit {
  paymentmodelabel:boolean=false;
  paymentmodelabe2:boolean=true;
  bsModalRef: BsModalRef;
  today = new Date() ;
  bnkAccDetails:FormGroup;
  bankdetailsstmtexclusions:any;
  bankdetailsstmtsundry:any;
  bankdetailsstmtreversals:any;
  bankdetailsstmtunspecified:any;
  bnkStmtDetails:FormGroup;
  statusMessage:any;
   scc:any;
   scc1:any;
   scc2:any;
   scc3:any;
   scc4:any;
   kk:any;
   usergroup:any;
   test:any;
   selectedPaypoint: any;
   dde:FormGroup;
   dderow:any;
   bankstmtcode:any;
   paypointDetails:any;
   policyexclusions :FormGroup;
   policyReversals:FormGroup;
   popupresult:any;
   branchName:any; 
   showbanknameoriginal:boolean=true;
   showbankname:boolean=false;
   period:any;
   myForm: FormGroup;
   myForm1: FormGroup;
   myForm2: FormGroup;
   myForm3: FormGroup;
   myForm4: FormGroup;
   formattedDate:any;
   formattedDate1:any;
   formattedDate2:any;
   formattedDate3:any;
   formattedDate4:any;
   policydetails:any;
    // array to add for transcation types 
    DDE=['CRE','CRX']
    Sundry=['CRE','CRX','LRE','LRX']
    Unspecified=['CRE','CRX','LRE','LRX']
    Reversals=['CRX']
    Premium=['CRE']
    searchlabel:boolean=true;
    savelabel:boolean=true;
    addlabel:boolean=true;
    username:any;
    userid:any;

    
  
  constructor(private fb: FormBuilder,private http:HttpClient,private ads:AdminService,private http1: Http,
    private modalService: BsModalService,
     private pms:AllocationsService,private pagerService: PagerService ,
     private router:Router,
     private tokendetails:TokenStorageService ) {


    this.bnkAccDetails = new FormGroup({
      paymentMode: new FormControl(''),
      bankName: new FormControl(''),
      creationDate: new FormControl(''),
      modifiedDate: new FormControl(''),
      bankStatementID: new FormControl({value:'',disabled: false}),
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

   
   // initially form array set up ............................................
ngOnInit() {    
  
  // calling transcation types
  this.getbktranscationdesc();

  this.bnkStmtDetails.patchValue({
    postingStatus:'U'
  })

  this.myForm = this.fb.group({
  corrections: this.fb.array([])
}) 

this.myForm1 = this.fb.group({
  corrections1: this.fb.array([])
})
this.myForm2 = this.fb.group({
  corrections2: this.fb.array([])
})

this.myForm3 = this.fb.group({
  corrections3: this.fb.array([])
})

this.myForm4 = this.fb.group({
  corrections4: this.fb.array([])
})

this.getsessionvalues();

}

// user login details
getsessionvalues(){
  this.username= this.tokendetails.getUsername();
 }

   get correctionForms() {
    return this.myForm.get('corrections') as FormArray
   }
   get correctionForms1() {
    return this.myForm1.get('corrections1') as FormArray
   }
   get correctionForms2() {
    return this.myForm2.get('corrections2') as FormArray
   }
   get correctionForms3() {
    return this.myForm3.get('corrections3') as FormArray
   }
   get correctionForms4() {
    return this.myForm4.get('corrections4') as FormArray
   }

  addCorrection() {

    const correction = this.fb.group({
      // DDE/EFT
      corSelect:[], 
      corTransType: [],
      corPeriod: [],
      corPaypointCode: [],
      corPayPointName: [],
      corStrikeDate:[],
      corGrossAmnt: [],
      corAllocatedAmnt: []

    })

    this.correctionForms.push(correction);
  }


  addCorrection1() {
  //POLICY EXCLUSIONS
    const correction1 = this.fb.group({  
      check:[],
      Period:[],
      PolicyCode:[],
      PolicyStatus:[],
      Payour:[],
      ExceptedPremium:[],
      AllocatedAmount:[]

      })
    this.correctionForms1.push(correction1);
  }
 
  addCorrection2() {
    //Reversals
      const correction2 = this.fb.group({  
        ccHeck:[],
        ccTranscationType:[],
        CPeriod:[],
        cPolicyCode:[],
        cPolicyStatus:[],
        cPayour:[],
        ccExceptedPremium:[],
        cAllocatedAmount:[]
  
        })
      this.correctionForms2.push(correction2);
    }


    addCorrection3() {
      // sundry
        const correction3 = this.fb.group({  
          corSelectsun:[],
          corTransTypesun:[],
          corSundryDescription:[],
          corTransDatesun:[],
          corAllocatedAmntsun:[]
    
          })
        this.correctionForms3.push(correction3);
      }


      addCorrection4() {
          const correction4 = this.fb.group({  
           //unspecified
           UCHECK:[],
           uTransactionType:[],
           uDescription:[],
           uperiod:[],
           uallocatedamount:[]
      
            })
          this.correctionForms4.push(correction4);
        }


  deleteCorrection(i) {
    this.correctionForms.removeAt(i) ;
    
  }

  deleteCorrection1(i) {
   
    this.correctionForms1.removeAt(i) ; 
  }

  
  deleteCorrection2(i) {
    this.correctionForms2.removeAt(i) ;
    
  }

  deleteCorrection3(i) {
    this.correctionForms3.removeAt(i) ;
    
  }

  deleteCorrection4(i) {
    this.correctionForms4.removeAt(i) ;
   
  }



// below code is used for nowing transcation type and its description 
transcationtypedes:any
getbktranscationdesc(){
  this.http.get(`${apiURL}/allocations/transcationtypesBKDesc`).subscribe(
    (Response)=>{
      this.transcationtypedes=Response;
      console.log(this.transcationtypedes);
    },(error)=>{
      console.log(error);
    }
  );
}

// below code is deals with bank statement details-------------------------------------------

// used for pop up the bank name 
  openModalWithComponentaccountinfo() {
      //console.log("modal call");
      this.bsModalRef = this.modalService.show(AccountinfoComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.onClose.subscribe(result => {
      this.popupresult=result[0];
      this.patchaccountdesc( this.popupresult);
      }) 
    }

  //used for patching the bank name,cashaccount
    patchaccountdesc(x){
       this.bnkAccDetails.patchValue({ 
        bankName:x.finalbankname,
        accountNo:x.cashaccount,
        accountDesc:x.description
       })
    }


    // fetching branch details  depends on user name
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
          }else{
            this.bnkStmtDetails.patchValue({
              branch:this.branchName
            }) 
          }
        }, (error) =>{
           console.log(error);
          alert("error occured while fetching bank  branch details");
      });
    }

  
  // used for enabling and diabling search button
   enabledsearch(){
   let x = this.bnkAccDetails.get('bankStatementID').value; 
    if(x>0 && x !=''){
      this.searchlabel=false;
    }     
   }

   //enable save button
   enablesavebutton(){
     let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;
     this.savelabel=false;
   }
  
  // used for fetching all the basic details about  bank statement details
  bankdetailsstmt:any;
  getbankstmtdetails(stmtid){
    this.http.get(`${apiURL}/allocations/bankstoporderprocessing/bankstmtdetails?stmtid=`+stmtid)
      .subscribe(
        response => {
          this.bankdetailsstmt=response;
          console.log(response);

           if( this.bankdetailsstmt.length==0){
             alert("No Bank Statement Details Found");
           }

          if( this.bankdetailsstmt.length>0){
            this.fetchbankstmtdetails();
            this.showbanknameoriginal=false;
            this.showbankname=true;
            this.addlabel=false;
            this.savelabel=false;
          }  
        }, (error) =>{
         
          alert("Error Occured while Fetching Bank Statement Details");
          console.log(error); 
      }
      );
    }

       // used for patching the bank stmt details
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
     modifiedDate: this.bankdetailsstmt[0].modifieddate, 
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

 if(this.scc4==null){
   this.bnkStmtDetails.controls['reversalPeriod'].setValue('');
 }
 else{
   this.bnkStmtDetails.controls['reversalPeriod'].setValue(this.formattedDate4);
 }
}



 // used for saving the record in the bank_stmt_hdr table
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
   }else{
     this.updterecordbankdetails();
   }
  
 }
 }

 // saving the record into t_bank_hdr
 newbankstmtid:any;
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
    console.log(result);
    this.newbankstmtid = result;
    this.bnkAccDetails.controls['bankStatementID'].setValue(this.newbankstmtid);
    alert("Bank Statement record is saved succesfully");
    this.saveallrecords();
    this.addlabel=false;
    this.searchlabel=false;
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
    alert("Bank Statement Record is updated successfully"); 
    this.newbankstmtid = result;
    this.saveallrecords(); 
    this.addlabel=false;
    this.searchlabel=false;
  },(error)=>{
    console.log(error);
    alert("error occured while saving record");
  })   

  
}


// below code deals with dde records --------------------------------------------------------

  //fetching DDE Details
  ddedetailsbank:any;
  ddetotalamount:number=0;
  getALLDDEDetails(code){
    let Bankstmt1=code; 
    this.http.get(`${apiURL}/allocations/stmt/ddedetails?Bankstmt=`+Bankstmt1).subscribe(
      (response) => { 
          this.ddedetailsbank =response;
          console.log(this.ddedetailsbank);
          this.setPagedde(1);  
          if(this.ddedetailsbank.length>0){

        this.ddetotalamount = this.ddedetailsbank.reduce((sum, item) => sum + item.allocated_amount, 0);
          }
        }, (error) =>{
          console.log(error);
          alert("error occured while fetching DDe records");
      }    
  );
  }

  pagerdde: any = {};
  pagedItemsdde: any[];
  setPagedde(page: number) {
     if (page < 1 || page > this.pagerdde.totalPages) {
       return;
     }
     // get pager object from service
     this.pagerdde = this.pagerService.getPager(this.ddedetailsbank.length, page, 10);
 
     // get current page of items
     this.pagedItemsdde = this.ddedetailsbank.slice(this.pagerdde.startIndex, this.pagerdde.endIndex + 1);
   }

updatechangesofdde(i){
  let x = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
  let x1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPaypointCode').value;
  let x2 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayPointName').value;
  let x3 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corStrikeDate').value;
  let x4 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corGrossAmnt').value;
  let x5 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
  let x6= (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
 
  if(x != null && x1 !=null &&  x2 !=null &&  x3 !=null &&  x4 != null && x5 != null && x6 != null &&  x != '' && x1 != '' &&  x2 != '' &&  x3 != '' &&  x4 != '' &&  x5 != '' && x6 != ''){
   
 (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').disable();
 (<FormArray>this.myForm.controls['corrections']).at(i).get('corPaypointCode').disable();
  (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayPointName').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corStrikeDate').disable();
   (<FormArray>this.myForm.controls['corrections']).at(i).get('corGrossAmnt').disable();
  (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').disable();
  (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').disable();

  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').enable();  
  }else{
    
    alert("fields cannot be empty");
    (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').reset();

  }

}

insertrecordfromddearray:any=[]
count1:any;
Dddeselectedrecord(i){
 let x = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
 let x1 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPaypointCode').value;
 let x2 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayPointName').value;
 let x3 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corStrikeDate').value;
 let x4 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corGrossAmnt').value;
 let x5 = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAllocatedAmnt').value;
 let x6= (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
 let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;

  if(x == null || x1 == null || x2 == null || x3 == null || x4 == null || x5 == null || x6 == null ){    
    alert("all required fields need to be filled");
    if(x == null){
      alert("TRANSACTION TYPE should not be null");
    }

   if(x1 == null){
    alert("PAYPOINT CODE should not be null");
   }
  
   if(x2 == null){
    alert("PAYPOINT NAME should not be null");
   }

   if(x3 == null){
    alert("STRIKE DATE should not be null");
   }

   if(x4 == null){
    alert("GROSS AMOUNT should not be null");
   }

   if(x5 == null){
    alert("ALLOCATED AMOUNT should not be null");
   }
   
   if(x6 == null){
     alert("period should not be null")
   }

}else{

  if(this.insertrecordfromddearray.length ==0){
    var obj={}
    obj["bk_transaction_type"] = x
    obj["period"]= x6
    obj["paypoint_id"]=x1
    obj["pay_point_name"]=x2
    obj["strike_date"]=x3
    obj["gross_amount"]=x4
    obj["allocated_amount"]=x5
    obj["bank_stmt_id"]=bankstmtid
    obj["createdby"]="test"
    this.insertrecordfromddearray.push(obj);
    console.log("size of dde array--->"+ this.insertrecordfromddearray.length);
  }else{
      
    if(this.correctionForms.length>0){
        
      this.count1 =this.insertrecordfromddearray.filter(app=> app.pay_point_name == x2);

      if(this.count1.length==0){
        var obj={}
        obj["bk_transaction_type"] = x
        obj["period"]= x6
        obj["paypoint_id"]=x1
        obj["pay_point_name"]=x2
        obj["strike_date"]=x3
        obj["gross_amount"]=x4
        obj["allocated_amount"]=x5
        obj["bank_stmt_id"]=this.newbankstmtid
        obj["createdby"]= this.username
        this.insertrecordfromddearray.push(obj);
        console.log("size of dde array--->"+ this.insertrecordfromddearray.length);   
      }

      if(this.count1.length==1){

        this.insertrecordfromddearray=this.insertrecordfromddearray.filter(app=> app.pay_point_name != x2);
        console.log("size of dde array after splice--->"+ this.insertrecordfromddearray.length);  
         }

       }
     }
  } 

}


// save the new record into dde table
saverecordDDE(){
this.http.post(`${apiURL}/allocations/dde`,
this.insertrecordfromddearray).subscribe(
  response => {
        console.log(response);
        this.bankdetailsstmt=response;
        alert("DDE Record is saved successfully");


        for(let i = 0;i<this.correctionForms.length;i++){
          let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value  
             if(status==true){
                   let  paypointname = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayPointName').value;
                     this.insertrecordfromddearray= this.insertrecordfromddearray.filter(app=> app.pay_point_name != paypointname);
                      this.correctionForms.removeAt(i);
                           if(this.correctionForms.length==1){
                                 break;
                              }
             }
 
         }

         for(let i = 0;i<this.correctionForms.length;i++){
          let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value  
            if(status==true){
              let paypointname = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayPointName').value;
              this.insertrecordfromddearray= this.insertrecordfromddearray.filter(app=> app.pay_point_name != paypointname);
               this.correctionForms.removeAt(i);
               }
        }




      }, (error) =>{
        console.log(error);
       alert("error occured while saving the dde record ");
    }  
);
}

dderecorddeletedinfo:any;
dderecorddeleted(ddeid,i){
  let allocatedamount = this.ddedetailsbank[i].allocated_amount;
 this.http.delete(`${apiURL}/allocations/dde/deletedde?ddeid=${ddeid}`)
 .subscribe(
   (response) => {
     console.log(response);
     let ddeserveresult = response;
     alert("succesfully record has been deleted")
     if(ddeserveresult==1){
     this.ddetotalamount = this.ddetotalamount - allocatedamount;
     this.ddedetailsbank =  this.ddedetailsbank.filter(dde=>dde.ddeid != ddeid);
     this.setPagedde(1);
     console.log( this.ddedetailsbank);
     }
   }, (error) =>{
     console.log(error);
     alert("error occured while deleteing dde record ");
 } 
);
}


// below code deals with policy exclusion ----------------------------------------------------


// code for fetching policy exclusions
policyexclusiontotalamount:number=0;
getALLBankAccountDetailsexclusions(bankstmtcode){
  let exclusions = bankstmtcode;
 this.http.get(`${apiURL}/allocations/stmt/exclusions?Bankstmtexclusions=`+exclusions)
   .subscribe(
     (response) => {
       this.bankdetailsstmtexclusions=response;
       console.log(this.bankdetailsstmtexclusions);
         this.setPagepe(1);
         if(this.bankdetailsstmtexclusions.length>0){

          this.policyexclusiontotalamount = this.bankdetailsstmtexclusions.reduce((sum, item) => sum + item.aLLOCATED_AMOUNT, 0);
            }
     }, (error) =>{
       console.log(error);
       alert("error occured while fetching policy exclusion records");
   }  
);
}


pagerpe: any = {};
pagedItemspe: any[];
setPagepe(page: number) {
  if (page < 1 || page > this.pagerpe.totalPages) {
    return;
  }
  // get pager object from service
  this.pagerpe = this.pagerService.getPager(this.bankdetailsstmtexclusions.length, page, 10);

  // get current page of items
  this.pagedItemspe = this.bankdetailsstmtexclusions.slice(this.pagerpe.startIndex, this.pagerpe.endIndex + 1);
}


insertrecordfrompolicyexclusionarray:any=[];
count2:any;
updatechangepolicyexclusion(i){

  let x = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('Period').value;
  let x1 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyCode').value;
  let x2 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyStatus').value;
  let x3 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('Payour').value;
  let x4 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('ExceptedPremium').value;
  let x5 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('AllocatedAmount').value;

  if(x != null &&  x1 !=null && x2 !=null &&  x3 !=null &&  x4 != null &&  x5 != null &&  x != '' &&  x1 != '' &&  x2 != '' &&  x3 != '' && x4 != '' && x5 != '' ){

     (<FormArray>this.myForm1.controls['corrections1']).at(i).get('Period').disable();
     (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyCode').disable();
     (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyStatus').disable();
     (<FormArray>this.myForm1.controls['corrections1']).at(i).get('Payour').disable();
     (<FormArray>this.myForm1.controls['corrections1']).at(i).get('ExceptedPremium').disable();
     (<FormArray>this.myForm1.controls['corrections1']).at(i).get('AllocatedAmount').disable();

     (<FormArray>this.myForm1.controls['corrections1']).at(i).get('check').enable();
     
  }else{
    alert("fields cannot be empty");
    (<FormArray>this.myForm1.controls['corrections1']).at(i).get('AllocatedAmount').reset();

  }

}

PolicyExculsionselectedrecord(i){

  let x = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('Period').value;
  let x1 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyCode').value;
  let x2 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyStatus').value;
  let x3 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('Payour').value;
  let x4 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('ExceptedPremium').value;
  let x5 = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('AllocatedAmount').value;
  let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;
 
  if(x == null || x1 == null || x2 == null || x3 == null || x4 == null || x5 == null ){
        
    alert("all required fields need to be filled");


    if(x == null){
      alert("period cannot be null");
    }

   if(x1 == null){
    alert("PolicyCode should not be null");
   }
  
   if(x2 == null){
    alert("PolicyStatus should not be null");
   }

   if(x3 == null){
    alert("Payour should not be null");
   }

   if(x4 == null){
    alert("ExceptedPremium should not be null");
   }

   if(x5 == null){
    alert("Allocated Amount should not be null");
   }


}else{

  if(this.insertrecordfrompolicyexclusionarray.length ==0){
    var obj={}
    obj["bankstmtid"] = bankstmtid
    obj["period"]=x
    obj["policycode"]=x1
    obj["payour"]=x3
    obj["policystatus"]=x2
    obj["exceptedamount"]=x4
    obj["allocatedpremium"]=x5
    obj["createdby"]= this.username
    this.insertrecordfrompolicyexclusionarray.push(obj);
    console.log("size of dde array--->"+ this.insertrecordfrompolicyexclusionarray.length);
  }else{

    if(this.correctionForms1.length>0){

      this.count2 =this.insertrecordfrompolicyexclusionarray.filter(app=> app.policycode == x1);
      
      if(this.count2.length==0){
        var obj={}
        obj["bankstmtid"] = this.newbankstmtid
        obj["period"]=x
        obj["policycode"]=x1
        obj["payour"]=x3
        obj["policystatus"]=x2
        obj["exceptedamount"]=x4
        obj["allocatedpremium"]=x5
        obj["createdby"]= this.username
        this.insertrecordfrompolicyexclusionarray.push(obj);
        console.log("size of dde array--->"+ this.insertrecordfrompolicyexclusionarray.length);

      }

      if(this.count2.length==1){

        this.insertrecordfrompolicyexclusionarray=this.insertrecordfrompolicyexclusionarray.filter(app=> app.policycode != x1);
        console.log("size of dde array after splice --->"+ this.insertrecordfrompolicyexclusionarray.length);
      }

    }


  }

}

}

 // fetchingfetching policy info details for policy exclusion used for saving the new record
 
 policyinfofetching(i){

   let policycode = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyCode').value;
    
   if(policycode<0){
       alert("policycode cannot be less than 1");
   }else{
     this.http.get(`${apiURL}/allocations/misallocationcorrection/policyinfo?policycode=`+policycode).subscribe(response=>{
       console.log(response)
         this.policydetails=response
 
       if(this.policydetails.length==0){
           alert("no policy found with this policy code");
         
        } else{
         this.patchValuespe(i);
         }
      
         },(error)=>{
       
       console.log(error);
         alert("error in fetching policycode details");
      }
     
      );
   } 
}

// used for patching party name,status name,excepted amount
patchValuespe(i) {
let x = (<FormArray>this.myForm1.controls['corrections1']).at(i);
console.log("this calling form "+x);
x.patchValue({
  PolicyStatus:this.policydetails[0].statusName,
  Payour:this.policydetails[0].partyName,
  ExceptedPremium:this.policydetails[0].expectedAMOUNT
});
}

saverecordpolicyexclusion(){
  this.http.post(`${apiURL}/allocations/policyexclusion`,
  this.insertrecordfrompolicyexclusionarray
 ).subscribe(
        (response) => {
          console.log(response);
         alert("policy exclusion Record is saved successfully");

         for(let i = 0;i<this.correctionForms1.length;i++){
          let status:boolean =  (<FormArray>this.myForm1.controls['corrections1']).at(i).get('check').value  
             if(status==true){
                   let  policycode = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyCode').value;
                     this.insertrecordfrompolicyexclusionarray= this.insertrecordfrompolicyexclusionarray.filter(app=> app.policyCode != policycode);
                      this.correctionForms1.removeAt(i);
                           if(this.correctionForms1.length==1){
                                 break;
                              }
             }
 
         }

         for(let i = 0;i<this.correctionForms1.length;i++){
          let status:boolean =  (<FormArray>this.myForm1.controls['corrections1']).at(i).get('check').value  
            if(status==true){
              let  policycode = (<FormArray>this.myForm1.controls['corrections1']).at(i).get('PolicyCode').value;
              this.insertrecordfrompolicyexclusionarray= this.insertrecordfrompolicyexclusionarray.filter(app=> app.policycode != policycode);
               this.correctionForms.removeAt(i);
               }
        }


        }, (error) =>{
          console.log(error);
         alert("error  occured  while saving policyexclusion record")
      } 
 );
}


perecorddeletedinfo:any;
perecorddeleted(ddeid,i){
    let allocatedamount =  this.bankdetailsstmtexclusions[i].aLLOCATED_AMOUNT;
    
 this.http.get(`${apiURL}/allocations/policyexclusiondelete?bkstmtpeid=${ddeid}`)
 .subscribe(
   (response) => {
     console.log(response);
     let ddeserveresult = response;
     alert("succesfully record has been deleted")
     if(ddeserveresult==1){
      this.policyexclusiontotalamount = this.policyexclusiontotalamount - allocatedamount;
     this.bankdetailsstmtexclusions =  this.bankdetailsstmtexclusions.filter(dde=>dde.policyexculsionid != ddeid);
     this.setPagepe(1);
     console.log( this.ddedetailsbank);
     }
   }, (error) =>{
     console.log(error);
     alert("error occured while deleteing dde record ");
 } 
);
}


// below code deals with Reversal records----------------------------------------------
reversaltotalamount:number=0
 getALLBankAccountDetailsexclusionsREVERSALS(bankstmtcode){
  let REVERSALS = bankstmtcode;
 this.http.get(`${apiURL}/allocations/stmt/DetReversals?BankstmtexclusionsDetReversals=`+REVERSALS)
   .subscribe(
     response => {
       this.bankdetailsstmtreversals=response;
       console.log("reversal record result");
       console.log(this.bankdetailsstmtreversals);
       if(this.bankdetailsstmtreversals==null){

       }else{
        this.setPage(1);

        if(this.bankdetailsstmtreversals.length>0){

          this.reversaltotalamount = this.bankdetailsstmtreversals.reduce((sum, item) => sum + item.aLLOCATED_AMOUNT, 0);
            }
       }
       
     }, (error) =>{
       console.log(error);
      
   }   
);


}

pager: any = {};
pagedItems: any[];
setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
    return;
  }
  // get pager object from service
  this.pager = this.pagerService.getPager(this.bankdetailsstmtreversals.length, page, 10);

  // get current page of items
  this.pagedItems = this.bankdetailsstmtreversals.slice(this.pager.startIndex, this.pager.endIndex + 1);
}


updatechangereversal(i){

  let x6 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccTranscationType').value;
  let x = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('CPeriod').value;
  let x1 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyCode').value;
  let x2 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyStatus').value;
  let x3 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPayour').value;
  let x4 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccExceptedPremium').value;
  let x5= (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cAllocatedAmount').value; 

  if(x != null &&  x1 !=null &&  x2 !=null &&  x3 !=null &&  x4 != null && x5 != null &&  x6 != null &&  x != '' &&  x1 != '' &&  x2 != '' &&  x3 != '' &&  x4 != '' &&  x5 != '' &&  x6 != ''){

    (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccTranscationType').disable();
    (<FormArray>this.myForm2.controls['corrections2']).at(i).get('CPeriod').disable();
    (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyCode').disable();
    (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyStatus').disable();
     (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPayour').disable();
    (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccExceptedPremium').disable();
    (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cAllocatedAmount').disable(); 

    (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccHeck').enable(); 

  }else{
      alert("fields cannot be empty");
      (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cAllocatedAmount').reset(); 
  }



}

insertrecordfromReversalarray:any=[];
count3:any;
reversalcheckbox(i){
    let x6 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccTranscationType').value;
    let x = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('CPeriod').value;
    let x1 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyCode').value;
    let x2 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyStatus').value;
    let x3 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPayour').value;
    let x4 = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccExceptedPremium').value;
    let x5= (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cAllocatedAmount').value; 
    let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;

    if(x == null || x1 == null || x2 == null || x3 == null || x4 == null || x5 == null || x6==null ){
        
      alert("all required fields need to be filled");
  
  
      if(x == null){
        alert("period cannot be null");
      }
  
     if(x1 == null){
      alert("PolicyCode should not be null");
     }
    
     if(x2 == null){
      alert("PolicyStatus should not be null");
     }
  
     if(x3 == null){
      alert("Payour should not be null");
     }
  
     if(x4 == null){
      alert("ExceptedPremium should not be null");
     }
  
     if(x5 == null){
      alert("Allocated Amount should not be null");
     }

     if(x6==null){
       alert("Transcation Type Cannot be null");
     }
  
  
  }else{
   
    if(this.insertrecordfromReversalarray.length ==0){
  
        var obj={}
        obj["bk_stmt_id"] = bankstmtid
        obj["pERIOD_FOR_REVERSALS"]=x
        obj["pOLICY_CODE"]=x1
        obj["pAYOR"]=x3
        obj["policystatusname"]=x2
        obj["eXPECTED_PREMIUM"]=x4
        obj["aLLOCATED_AMOUNT"]=x5
        obj["createdby"]= this.username
        obj["bK_TRANSACTION_TYPE"]=x6
        this.insertrecordfromReversalarray.push(obj);
        console.log("size of dde array--->"+ this.insertrecordfromReversalarray.length);

    }else{

      if(this.correctionForms2.length>0){

        this.count3 =this.insertrecordfromReversalarray.filter(app=> app.pOLICY_CODE == x1);

        if(this.count3.length==0){
             
          var obj={}
          obj["bankstmtid"] = this.newbankstmtid
          obj["pERIOD_FOR_REVERSALS"]=x
          obj["pOLICY_CODE"]=x1
          obj["pAYOR"]=x3
          obj["policystatusname"]=x2
          obj["eXPECTED_PREMIUM"]=x4
          obj["aLLOCATED_AMOUNT"]=x5
          obj["createdby"]= this.username
          obj["bK_TRANSACTION_TYPE"]=x6
          this.insertrecordfromReversalarray.push(obj);
          console.log("size of dde array--->"+ this.insertrecordfromReversalarray.length);


        }

        if(this.count3.length==1){
          this.insertrecordfromReversalarray= this.insertrecordfromReversalarray.filter(app=> app.pOLICY_CODE != x1);
          console.log("size of dde array after splice--->"+ this.insertrecordfromReversalarray.length);
        }
        

      }


    }
  } 
  
}


// fetchingfetching policy info details for policy reversal used for saving the new record
policydetailsrevasal:any;
policyinfofetchingreversal(i){
  let policycode = (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyCode').value;
  if(policycode<0){
      alert("policycode cannot be less than 1");
  }else{
    this.http.get(`${apiURL}/allocations/misallocationcorrection/policyinfo?policycode=`+policycode).subscribe(response=>{
      console.log(response)
        this.policydetailsrevasal=response
      if(this.policydetailsrevasal.length==0){
          alert("no policy found with this policy code");
       } else{
        this.patchValuesrecersal(i);
        }
     
        },(error)=>{
      
      console.log(error);
        alert("error in fetching policycode details");
    
     }
    
      );
  }


}

patchValuesrecersal(i) {
let x = (<FormArray>this.myForm2.controls['corrections2']).at(i);
console.log("this calling form "+x); 
x.patchValue({
  cPolicyStatus:this.policydetailsrevasal[0].statusName,
  cPayour:this.policydetailsrevasal[0].partyName,
  ccExceptedPremium:this.policydetailsrevasal[0].expectedAMOUNT
});
}

  saverecordreversal(){
        this.http.post(`${apiURL}/allocations/reversalposting/posting`,
        this.insertrecordfromReversalarray).subscribe(
        (response) => {
           alert("reversal record has been inserted");
           console.log(response);
           for(let i = 0;i<this.correctionForms2.length;i++){
            let status:boolean =  (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccHeck').value  
               if(status==true){
                     let  policycode =  (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyCode').value;
                       this.insertrecordfromReversalarray= this.insertrecordfromReversalarray.filter(app=> app.pOLICY_CODE != policycode);
                        this.correctionForms2.removeAt(i);
                             if(this.correctionForms2.length==1){
                                   break;
                                }
               }
   
           }

           for(let i = 0;i<this.correctionForms2.length;i++){
            let status:boolean =  (<FormArray>this.myForm2.controls['corrections2']).at(i).get('ccHeck').value
              if(status==true){
                let  policycode =  (<FormArray>this.myForm2.controls['corrections2']).at(i).get('cPolicyCode').value;
                this.insertrecordfromReversalarray= this.insertrecordfromReversalarray.filter(app=> app.pOLICY_CODE != policycode);
                this.correctionForms2.removeAt(i);
                 }
          } 
        }, (error) =>{
          console.log(error);
          alert("error occured while saving record");
        }
      );
      
  }


  
  deletereversalrecord(dde,i){
    let reversalid = dde.bK_STMT_DET_REV_ID;
     let allocatedamount = this.bankdetailsstmtreversals[i].aLLOCATED_AMOUNT
    // 
    this.http.delete(`${apiURL}/allocations/dde/deletereversal?reversalid=${reversalid}`)
    .subscribe(
      (response) => {
        console.log(response);
        alert("succesfully record has been deleted");
        this.reversaltotalamount = this.reversaltotalamount - allocatedamount;
        this.bankdetailsstmtreversals =  this.bankdetailsstmtreversals.filter(app=>app.bK_STMT_DET_REV_ID != reversalid)
         this.setPage(1);
      }, (error) =>{
        console.log(error);
        alert("error occured while deleting record")
    }  
);

}



// below code deals with sundry record-------------------------------------------------------

// code for fetching sundry
sundryamounttotal:any;
getALLBankAccountDetailsexclusionssundry(bankstmtcode){
  let sundry = bankstmtcode;
 this.http.get(`${apiURL}/allocations/stmt/sundry?Bankstmtexclusionssundry1=`+sundry)
   .subscribe(
     (response) => {
       //console.log(response); 
       this.bankdetailsstmtsundry=response
       if(this.bankdetailsstmtsundry==null || this.bankdetailsstmtsundry==undefined){

       }else{
         console.log(this.bankdetailsstmtsundry);
       this.setPagesu(1);
       if(this.bankdetailsstmtsundry.length>0){

        this.sundryamounttotal = this.bankdetailsstmtsundry.reduce((sum, item) => sum + item.aLLOCATED_AMOUNT, 0);
          }
       }
       
      }, (error) =>{
       console.log(error);
    
   }
 
   
);


}


pagersu: any = {};
pagedItemssu: any[];
setPagesu(page: number) {
  if (page < 1 || page > this.pagersu.totalPages) {
    return;
  }
  // get pager object from service
  this.pagersu = this.pagerService.getPager(this.bankdetailsstmtsundry.length, page, 10);

  // get current page of items
  this.pagedItemssu = this.bankdetailsstmtsundry.slice(this.pagersu.startIndex, this.pagersu.endIndex + 1);
}


updatechangesundry(i){

  let x  = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corTransTypesun').value;
  let x1 = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSundryDescription').value;
 let x2 = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corTransDatesun').value;
  let x3 = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corAllocatedAmntsun').value;  
  let bankstmtid = this.bnkAccDetails.get('bankStatementID').value;


  if(x != null && x1 != null &&  x2 != null &&  x3 != null &&  x != '' &&  x1 != '' &&  x2 != '' &&  x3 != ''){
           
    (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corTransTypesun').disable();
    (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSundryDescription').disable();
    (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corTransDatesun').disable();
    (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corAllocatedAmntsun').disable(); 

    (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSelectsun').enable();

  }else{

    alert("filled all required fields");
    (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corAllocatedAmntsun').reset();  

  }



}

insertrecordfromSundryarray:any=[];
count4:any;
  sundrycheckbox(i){
   let x  = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corTransTypesun').value;
    let x1 = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSundryDescription').value;
   let x2 = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corTransDatesun').value;
    let x3 = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corAllocatedAmntsun').value;  
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
        console.log("size of dde array--->"+ this.insertrecordfromSundryarray.length);

    }else{


      if(this.correctionForms3.length>0){

        this.count4 =this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC == x1);
    
        if(this.count4.length==0){

          var obj={}
          obj["bk_stmt_id"] = this.newbankstmtid
          obj["bK_TRANSACTION_TYPE"]=x
          obj["bK_TRANSACTION_DESC"]=x1
          obj["pERIOD"]=x2
          obj["aLLOCATED_AMOUNT"]=x3
          obj["createdby"]= this.username
          this.insertrecordfromSundryarray.push(obj);
          console.log("size of dde array--->"+ this.insertrecordfromSundryarray.length);

        }
   
        if(this.count4.length==1){

          this.insertrecordfromSundryarray=this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC != x1);
          console.log("length after slicing---->>"+this.insertrecordfromSundryarray.length);

        }

      }

    }

  }

   }

   patchsundrydesc(i){
    let x  = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corTransTypesun').value;
    let descpatch= this.transcationtypedes.filter(app=>app.transcationtype==x)[0]
    let xsun = (<FormArray>this.myForm3.controls['corrections3']).at(i);
    console.log("this calling form "+x);
    xsun.patchValue({
    corSundryDescription:descpatch.transdescription
     });
   }

    //post for sundry
    savesundryrecord(){
         this.http.post(`${apiURL}/allocations/sundry/post`,
         this.insertrecordfromSundryarray).subscribe((response) => {
         alert("sundry record has been inserted");
         console.log("sundry id--->"+response); 
         for(let i = 0;i<this.correctionForms3.length;i++){
          let status:boolean =  (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSelectsun').value  
             if(status==true){
                   let  sundesc = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSundryDescription').value;
                     this.insertrecordfromSundryarray= this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC != sundesc);
                      this.correctionForms3.removeAt(i);
                           if(this.correctionForms3.length==1){
                                 break;
                              }
             }
 
         }

         for(let i = 0;i<this.correctionForms3.length;i++){
          let status:boolean =  (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSelectsun').value  
            if(status==true){
              let  sundesc = (<FormArray>this.myForm3.controls['corrections3']).at(i).get('corSundryDescription').value;
              this.insertrecordfromSundryarray= this.insertrecordfromSundryarray.filter(app=> app.bK_TRANSACTION_DESC != sundesc);
               this.correctionForms3.removeAt(i);
               }
        }
      }, (error) =>{
          console.log(error);
         alert("error occured while saving sundry record");
    }
  );
}

 // deleting sundry record

 deletesundryrecord(dde,i){
    let allocatedamount =  this.bankdetailsstmtsundry[i].aLLOCATED_AMOUNT
    // 
   this.http.delete(`${apiURL}/allocations/dde/deletesundry?sundryid=${dde.bk_sundry_id}`)
   .subscribe(
     (response) => {
       console.log(response);
       alert("succesfully record has been deleted");
       this.sundryamounttotal = this.sundryamounttotal - allocatedamount;
       this.bankdetailsstmtsundry=this.bankdetailsstmtsundry.filter(app=>app.bk_sundry_id !=dde.bk_sundry_id);
       this.setPagesu(1);
      }, (error) =>{
       console.log(error)
   } 
);

 }



// below code deals with unspecified record details --------------------------------------
unspecifiedamount:number=0
 getALLBankAccountDetailsexclusionsunspecified(bankstmtcode){
  let unspecified = bankstmtcode;
 this.http.get(`${apiURL}/allocations/stmt/unspecified?Bankstmtexclusionsunspecified=`+unspecified)
   .subscribe(
     response => {
       //console.log(response); 
       this.bankdetailsstmtunspecified=response;
       if(this.bankdetailsstmtunspecified==null ||this.bankdetailsstmtunspecified==undefined ){

       }else{
        console.log(this.bankdetailsstmtunspecified);
        this.setPageun(1);
        if(this.bankdetailsstmtunspecified.length>0){

          this.unspecifiedamount = this.bankdetailsstmtunspecified.reduce((sum, item) => sum + item.aLLOCATED_AMOUNT, 0);
            }
       }
      
     
     }, (error) =>{
       console.log(error);
   }
 
   
);
}

pagerun: any = {};
 pagedItemsun: any[];
 setPageun(page: number) {
    if (page < 1 || page > this.pagerun.totalPages) {
      return;
    }
    // get pager object from service
    this.pagerun = this.pagerService.getPager(this.bankdetailsstmtunspecified.length, page, 10);
    // get current page of items
    this.pagedItemsun = this.bankdetailsstmtunspecified.slice(this.pagerun.startIndex, this.pagerun.endIndex + 1);
  }





updatechangeunspecified(i){
    let x = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uTransactionType').value;
    let x1 = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uDescription').value;
    let x2 = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uperiod').value;
    let x3 = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uallocatedamount').value;
    let bankstmtnumber = this.bnkAccDetails.value.bankStatementID

    if(x != null && x1 != null &&  x2 != null &&  x3 != null &&  x != '' &&  x1 != '' &&  x2 != '' &&  x3 != ''){
       (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uTransactionType').disable();
       (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uDescription').disable();
       (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uperiod').disable();
       (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uallocatedamount').disable(); 

       (<FormArray>this.myForm4.controls['corrections4']).at(i).get('UCHECK').enable(); 
    }else{
      alert("please filled all required fields data");
      (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uallocatedamount').reset(); 

    }
}

   insertrecordfromunspecifiedarray:any=[];
   count5:any;
   elementunspecified(i){
    let x = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uTransactionType').value;
    let x1 = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uDescription').value;
    let x2 = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uperiod').value;
    let x3 = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uallocatedamount').value;
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
        console.log("size of dde array--->"+ this.insertrecordfromunspecifiedarray.length);
    }else{
      if(this.correctionForms4.length>0){

        this.count5 =this.insertrecordfromunspecifiedarray.filter(app=> app.bK_TRANSACTION_DESC == x1);
        
        if(this.count5.length==0){

          var obj={}
          obj["bk_stmt_id"] = bankstmtnumber
          obj["bK_TRANSACTION_TYPE"]=x
          obj["bK_TRANSACTION_DESC"]=x1
          obj["pERIOD"]=x2
          obj["aLLOCATED_AMOUNT"]=x3
          obj["createdby"]= this.username
          this.insertrecordfromunspecifiedarray.push(obj);
          console.log("size of dde array--->"+ this.insertrecordfromunspecifiedarray.length);

        }

        if(this.count5.length==1){
          this.insertrecordfromunspecifiedarray=this.insertrecordfromunspecifiedarray.filter(app=> app.bK_TRANSACTION_DESC != x1);
          console.log("length after slicing---->>"+this.insertrecordfromunspecifiedarray.length);

        }

      }

    }

  }
 }

 patchunspecifieddesc(i){
  let x  = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uTransactionType').value;
  let descpatch= this.transcationtypedes.filter(app=>app.transcationtype==x)[0]
  let xsun = (<FormArray>this.myForm4.controls['corrections4']).at(i);
  console.log("this calling form "+x);
  xsun.patchValue({
   uDescription:descpatch.transdescription
  });
 }
  
saveunspecifiedrecord(){
   
    this.http.post(`${apiURL}/allocations/unspecified/post`,
    this.insertrecordfromunspecifiedarray).subscribe(response => {
     console.log(response);
     alert("unspecified record is saved successfully");
     for(let i = 0;i<this.correctionForms4.length;i++){
      let status:boolean =  (<FormArray>this.myForm4.controls['corrections4']).at(i).get('UCHECK').value  
         if(status==true){
               let  unspdesc = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uDescription').value;
                 this.insertrecordfromunspecifiedarray= this.insertrecordfromunspecifiedarray.filter(app=> app.policyCode != unspdesc);
                  this.correctionForms4.removeAt(i);
                       if(this.correctionForms4.length==1){
                             break;
                          }
         }

     }

     for(let i = 0;i<this.correctionForms4.length;i++){
      let status:boolean =  (<FormArray>this.myForm4.controls['corrections4']).at(i).get('UCHECK').value  
        if(status==true){
          let  unspdesc = (<FormArray>this.myForm4.controls['corrections4']).at(i).get('uDescription').value;
          this.insertrecordfromunspecifiedarray= this.insertrecordfromunspecifiedarray.filter(app=> app.policyCode != unspdesc);
           this.correctionForms4.removeAt(i);
           }
    }
      }, (error) =>{
       console.log(error);
        alert("error occured while saving unspecified record");
        }   
    );
  
 
}

unspecifieddelete(dde,i){
   let allocatedamount =  this.bankdetailsstmtunspecified[i].aLLOCATED_AMOUNT
  this.http.delete(`${apiURL}/allocations/dde/deleteunspecified?bK_STMT_DET_UNSP_ID=${dde.bK_STMT_DET_UNSP_ID}`)
    .subscribe((response) => {
      console.log(response);
      alert("succesfully record has been deleted");
      this.unspecifiedamount = this.unspecifiedamount - allocatedamount;
      this.bankdetailsstmtunspecified=this.bankdetailsstmtunspecified.filter(app=>app.bK_STMT_DET_UNSP_ID != dde.bK_STMT_DET_UNSP_ID);
        this.setPageun(1);
      }, (error) =>{
        console.log(error);
        alert("error occured while deleting record");
        
      }
);
 
}


    // pop up details  fro dde record paypoint id,paypoint name 
    openModalWithComponent(i) {
      //console.log("modal call");
      this.bsModalRef = this.modalService.show(PaypointComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.onClose.subscribe(result => {
      console.log("this my data"+result[0].paypoint_id)
      console.log("this my data"+result[0].payPoint_Name)
      this.selectedPaypoint = result[0];
      console.log("this my data 2 "+this.selectedPaypoint.paypoint_id)
      this.patchValues(i)
      this.patchValuesreversal(0)

      })
    }


    
  // pop up the paypoint details
  patchValues(i) {
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    console.log("this calling form "+x);
     
    x.patchValue({
      corPayPointName: this.selectedPaypoint.payPoint_Name,
      corPaypointCode:this.selectedPaypoint.paypoint_id,
     // corPeriod: this.bnkStmtDetails.value.reversalPeriod,
    });
  }


// pop up details  fro reversal record paypoint id,paypoint name 
    openModalWithComponent1() {
      //console.log("modal call");
      this.bsModalRef = this.modalService.show(PaypointComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.onClose.subscribe(result => {
      console.log("this my data"+result[0].paypoint_id)
      console.log("this my data"+result[0].payPoint_Name)
      this.selectedPaypoint = result[0];
      console.log("this my data 2 "+this.selectedPaypoint.paypoint_id)
      this.patchValuesreversal(0)
      })
    }

  // patching for reversal paypoint i
  patchValuesreversal(i) {
    let x = (<FormArray>this.myForm.controls['corrections']).at(i);
    console.log("this calling form "+x);
    x.patchValue({
     cPolicyCode:this.selectedPaypoint.paypoint_id
    });
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

        clearFormArray3 (){
          while(this.correctionForms3.length !=0){
            this.correctionForms3.removeAt(0);
           }
          
          }

          clearFormArray4 (){
            while(this.correctionForms4.length !=0){
              this.correctionForms4.removeAt(0);
             }
            
            }


// below code define all save methodds signuture
 saveallrecords(){

 

              if(this.insertrecordfromddearray.length>0){
                this.saverecordDDE();
              }
              
              if( this.insertrecordfrompolicyexclusionarray.length>0){
                this.saverecordpolicyexclusion();
              }
        
              if(this.insertrecordfromReversalarray.length>0){
                this.saverecordreversal();
              }
        
              if(this.insertrecordfromSundryarray.length>0){
                this.savesundryrecord();
              }
        
              if( this.insertrecordfromunspecifiedarray.length>0){
                this.saveunspecifiedrecord();
              }

   
             
            }

// below codes deals with save/update search methods....................


clear(){ 
  //setting up bank stmt as null initially
  this.bankstmtcode=null;

  // setting up bankstmt id as null
  this.bankdetailsstmt=null;
  this.bnkAccDetails.reset();
  this.bnkStmtDetails.reset();

  // dealing with dde
  this.ddedetailsbank=null;
  this.insertrecordfromddearray=[];
  this.count1=null;
  this.clearFormArray();
  //this.setPagedde(1); 
  this.pagerdde=0;
  this.pagedItemsdde=[];


  // dealing with policy exclusion
  this.bankdetailsstmtexclusions=null;
  this.insertrecordfrompolicyexclusionarray=[];
  this.count2=null;
  this.clearFormArray1();
  //this.setPagepe(1);
  this.pagerpe=0;
  this.pagedItemspe=[];

  //dealing with reversal
  this.bankdetailsstmtreversals=null;
  this.insertrecordfromReversalarray=[];
  this.count3=null;
  this.clearFormArray2();
 // this.setPage(1);
  this.pager=0;
  this.pagedItems=[];

  //dealing with sundry
  this.bankdetailsstmtsundry=null;
  this.insertrecordfromSundryarray=[];
  this.count4=null;
  this.clearFormArray3();
  //this.setPagesu(1);
  this.pagersu=0;
  this.pagedItemssu=[];

  //dealing with unspecified
  this.bankdetailsstmtunspecified=null;
  this.insertrecordfromunspecifiedarray=[];
  this.count5=null;
  this.clearFormArray4();
  //this.setPageun(1);
  this.pagerun=0;
  this.pagedItemsun=[];

  this.searchlabel=true;


  this.bnkStmtDetails.patchValue({
    postingStatus:'U'
  })

  this.savelabel=true;
  this.addlabel=true;

  this.ddetotalamount=0;
  this.policyexclusiontotalamount=0;
  this.reversaltotalamount=0;
  this.sundryamounttotal=0;
  this.unspecifiedamount=0;

  this.ngOnInit();
}

  // method for fetching bank statement details 
  search(s){
    this.bankstmtcode=s;
    this.getbankstmtdetails(s);
    this.getALLDDEDetails(s);
    this.getALLBankAccountDetailsexclusions(s);
    this.getALLBankAccountDetailsexclusionsREVERSALS(s);
    this.getALLBankAccountDetailsexclusionssundry(s);
    this.getALLBankAccountDetailsexclusionsunspecified(s);  
   }
  

   save(){

    if(this.bankdetailsstmt==undefined){

      this.savebankstmtdetails();

    }else{
      if(this.bankdetailsstmt[0].postingstatus !='P'){

        this.savebankstmtdetails();

        if(this.insertrecordfromddearray.length==0 && this.insertrecordfrompolicyexclusionarray.length==0 && this.insertrecordfromReversalarray.length==0 && this.insertrecordfromSundryarray.length==0 && this.insertrecordfromunspecifiedarray.length==0){
          alert("no bank statement allocation record is avaliable to save")
        }
      }else{
        alert("already record as been posted changes cannot be done");
      }
    }   
 }

 exit(){
  // Re-direct to app landing page
   window.location.href = "http://localhost:4200/#/dashboard" ;
  
}



}



