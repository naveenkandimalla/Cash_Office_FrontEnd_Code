// Bank Statement Adjustment Voucher - Allocation Module
// sample data 331,276
// tables T_BANK_STMT_REALLOCATION,T_BK_STMT_UNSPEC_ALLOC_DET,T_BK_STMT_TO_REALLOCATION_DET
// reference : 4007552269,4007552162,4007552188  
import { Component, NgModule, ɵConsole } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well
import { HttpClient, HttpParams} from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
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
  , FormArray, FormBuilder]
})

@Component({
  templateUrl: 'bank-statement-adjustment-voucher.component.html'
})
export class BankStatementAdjustmentVoucherComponent {


  constructor(private fb: FormBuilder,private http:HttpClient,
    private router:Router,
    private tokendetails:TokenStorageService) { }
      
  UNPOSTED:any="UNPOSTED";
  applicationcodes=['TPOL','ACL']
  Transcationtyps=['CRE','CRX','LRE','LRX']
  bankstmtdetails:any;
  unspecifieddetails:any;
  reallocationdetails:any;
  creamount:any;
  lreamount:any;
  IsChecked:boolean=true;
  IsChecked123:boolean=false;
  searchlabel:boolean=true;
  savelabel:boolean=true;
  postlabel:boolean=true;
  addlabel:boolean=true;
  bankstmtreallocid:any;
  crxamount:any;
  lrxamount:any;
  reallocatecreamount:any;
  reallocatelreamount:any;
  reallocatecrxamount:any;
  reallocatelrxamount:any;
  count:any;
  insertnewrecordtodet:any=[];
  toplselect:boolean=false;
  aclselect:boolean=false;
  referncedetails:any;
  newreallocationdetailsforunposted:any=[];
  username:any;
  userid:any;

    // form group fro bank stmt id
bankStmtId = new FormGroup({
     bankStatementID : new FormControl('')
  });

    // form group for bank account details
bnkAccDetails = new FormGroup({
      paymentMode: new FormControl(''),
      creationDate: new FormControl(''),
      modifiedDate: new FormControl(''),
      bankName: new FormControl(''),
      accountNo: new FormControl(''),
      accountDesc: new FormControl('')
  }) ;
 
bnkStmtDetails = new FormGroup({
    statementNo: new FormControl(''),
    fromDate: new FormControl(''),
    openingBalance: new FormControl(''),
    postingStatus: new FormControl(''),
    toDate: new FormControl(''),
    closingBalance: new FormControl(''),
    glPostingStatus: new FormControl(''),
    loginName: new FormControl(''),
    branch: new FormControl('')
  }) ;

  myForm: FormGroup;
  ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })
   this.getsessionvalues();
 }


  getsessionvalues(){
    this.username= this.tokendetails.getUsername();
   }


  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }
 
addCorrection() {
    const correction = this.fb.group({ 
      corSelect:[],
      corApplication: [],
      corActivity: [],
      corPeriod: [],
      corRefNo: [],
      corRefStatus: [],
      corPayor: [],
      corTransType: [],
      corAmount: [],
      corRPostingStatus: [] 
    })
    this.correctionForms.push(correction);
    this.savelabel=false;
}


  // used for enabling the search label
enableserachlabel(){
    this.searchlabel=false;
    let status = this.bankStmtId.get('bankStatementID').value;
    if(status=="" || status==0 || status==null  ){
      this.searchlabel=true;
    }
  }

// used for changing the input for options
  applicationcodeselect(i){
    let applicationcode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').value;
     if(applicationcode=="TPOL"){
         this.toplselect=true
         this.aclselect=false
       }
      if(applicationcode=="ACL"){
         this.aclselect=true
         this.toplselect=false;
        }     
   }
// fetch bank statement details
getbankstmtdetails(bankstmtid){ 
 console.log("bank stmt id --->"+bankstmtid);
 this.http.get(`${apiURL}/allocations/bankstmtadjustmentvoucher/bankstmtdetails?bankstmtid=${bankstmtid}`).subscribe((result)=>{
   this.bankstmtdetails=result;
   console.log(this.bankstmtdetails);
   if(this.bankstmtdetails.length==0){
     alert("No Bank Statment details is found with this bank stmt id ")
     this.creamount=0;
     this.lreamount=0;
     this.crxamount=0;
     this.lrxamount=0;
     this.reallocatecreamount=0;
     this.reallocatelreamount=0;
     this.reallocatecrxamount=0;
     this.reallocatelrxamount=0;
    }
  else{
    this.patchAccouctDeatils();
    this.getunspecifieddetails(bankstmtid);
    this.bankstmtreallocid=this.bankstmtdetails[0].bankstmtreallocid;
    this.addlabel=false;
   } 
 },(error)=>{
   console.log(error) ;
   alert("error occured while fetch bank statement details"); 
 })
}

  // patching the bank statement details
patchAccouctDeatils(){
  this.bnkAccDetails.patchValue({
    paymentMode:this.bankstmtdetails[0].paymentmode,
    creationDate:this.bankstmtdetails[0].creationdate,
    modifiedDate:this.bankstmtdetails[0].modifieddate,
    bankName:this.bankstmtdetails[0].bankname,
    accountNo:this.bankstmtdetails[0].accountnumber,
    accountDesc:this.bankstmtdetails[0].description
  })
  this.bnkStmtDetails.patchValue({
    statementNo:this.bankstmtdetails[0].bankstatementnumber,
    fromDate:this.bankstmtdetails[0].stmtstartdate,
    openingBalance:this.bankstmtdetails[0].openingbalance,
    postingStatus:this.bankstmtdetails[0].postingstatus,
    toDate:this.bankstmtdetails[0].stmtenddate,
    closingBalance:this.bankstmtdetails[0].closingbalance,
    glPostingStatus:this.bankstmtdetails[0].posttogl,
    loginName:this.bankstmtdetails[0].capatureby,
    branch:this.bankstmtdetails[0].capaturebybranch
  })
}

 // fetch unspecified details
 getunspecifieddetails(bankstmtid){
   console.log("unspecified method stated for excution");
  this.http.get(`${apiURL}/allocations/bankstmtadjustmentvoucher/unspecifieddetails?bankstmtid=${bankstmtid}`).subscribe((result)=>{
  console.log(result)
  this.unspecifieddetails=result;
  this.creamount=0;
  this.lreamount=0;
  this.crxamount=0;
  this.lrxamount=0;
  this.gettotalamountcre();
  this.gettotalamountlre();
  this.gettotalamountcrx();
  this.gettotalamountlrx();
  this.getreallocationdetails(bankstmtid);
},(error)=>{
  console.log(error);
  alert("error occured while fetching Unspecified details");
 
})

}

  // caluclating the total unamount of different transcation types
  gettotalamountcre(){
    if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
         this.creamount=0;
     }else{
       let amount = 0 ;
          for(let i = 0 ; i<this.unspecifieddetails.length;i++){
                 if(this.unspecifieddetails[i].bktranstype=="CRE"){    
                     let  specifiedcreamount = this.unspecifieddetails[i].allocatedamount
                         amount= +amount + +specifiedcreamount
                           this.creamount = +amount
                 }
            }
       }
   }
 
   gettotalamountlre(){
     if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
           this.lreamount=0;
     }else{
       let amount = 0 
         for(let i = 0 ; i<this.unspecifieddetails.length;i++){
               if(this.unspecifieddetails[i].bktranstype=="LRE"){
                   let specifiedcreamount = this.unspecifieddetails[i].allocatedamount
                      amount= +amount + +specifiedcreamount
                       this.lreamount = +amount
           
                  }
 
         }
 
       }
 
   }
 
 gettotalamountcrx(){
       if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
         this.crxamount=0;
       }else{
         let amount = 0 
         for(let i = 0 ; i<this.unspecifieddetails.length;i++){
           if(this.unspecifieddetails[i].bktranstype=="CRX"){   
            let  specifiedcreamount = this.unspecifieddetails[i].allocatedamount
            amount= +amount + +specifiedcreamount
            this.crxamount = +amount
           }
         }
      }
 }
  
   
  
 gettotalamountlrx(){
   if(this.unspecifieddetails.length<=0 || this.unspecifieddetails=="" || this.unspecifieddetails==null ||this.unspecifieddetails==undefined){
         this.lrxamount=0;
     }else{
         let amount = 0 
      for(let i = 0 ; i<this.unspecifieddetails.length;i++){
         if(this.unspecifieddetails[i].bktranstype=="LRX"){   
            let  specifiedcreamount = this.unspecifieddetails[i].allocatedamount
            amount= +amount + +specifiedcreamount
            this.lrxamount = +amount
           }
 
         }
 
       }
   }

 // ------------------------------------------------reallocation----------------------

// fetch reallocation details
getreallocationdetails(bankstmtid){
  console.log("reallocation method stated for excution");
this.http.get(`${apiURL}/allocations/bankstmtadjustmentvoucher/reallocation?bankstmtid=${bankstmtid}`).subscribe((result)=>{
 console.log(result)
 this.reallocationdetails=result;
 if(this.reallocationdetails.length>0){

  this.postlabel=false;
 }
 this.reallocatecreamount=0;
 this.reallocatelreamount=0;
 this.reallocatecrxamount=0;
 this.reallocatelrxamount=0;
 this.gettotalreallocamountcre();
 this.gettotalreallocamountlre();
 this.gettotalreallocamountcrx();
 this.gettotalreallocamountlrx();
},(error)=>{
 console.log(error);
 alert("error occured while fetching reallocation details");

})
}


// caluclating the total unamount of different transcation types
gettotalreallocamountcre(){
      if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatecreamount=0;
      }else{
        let amount = 0 
        for(let i = 0 ; i<this.reallocationdetails.length;i++){
          if(this.reallocationdetails[i].transactionCode=="CRE"){    
           let  specifiedcreamount = this.reallocationdetails[i].amount
           amount= +amount + +specifiedcreamount
           this.reallocatecreamount = +amount
          }

        }

      }

  }
 
gettotalreallocamountlre(){
      if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatelreamount=0;
      }else{
        let amount = 0 
        for(let i = 0 ; i<this.reallocationdetails.length;i++){
          if(this.reallocationdetails[i].transactionCode=="LRE"){   
           let  specifiedcreamount = this.reallocationdetails[i].amount
           amount= +amount + +specifiedcreamount
           this.reallocatelreamount = +amount
          }

        }

      }
  }

  
gettotalreallocamountcrx(){
      if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatecrxamount=0;
      }else{
       let amount = 0 
        for(let i = 0 ; i<this.reallocationdetails.length;i++){
          if(this.reallocationdetails[i].transactionCode=="CRX"){    
           let  specifiedcreamount = this.reallocationdetails[i].amount
           amount= +amount + +specifiedcreamount
           this.reallocatecrxamount = +amount
          }
        }
      }
  }


  
gettotalreallocamountlrx(){
   if(this.reallocationdetails.length<=0 || this.reallocationdetails=="" || this.reallocationdetails==null ||this.unspecifieddetails==undefined){
        this.reallocatelrxamount=0;
    }else{
      let amount = 0 
      for(let i = 0 ; i<this.reallocationdetails.length;i++){
          if(this.reallocationdetails[i].transactionCode=="CRX"){  
           let  specifiedcreamount = this.reallocationdetails[i].amount
           amount= +amount + +specifiedcreamount
           this.reallocatelrxamount = +amount
          }

        }

      }

  }


//fetch the refernce number details 
referencedetails(i){
  let applicationcode = (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').value;
  let referencenumber = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').value;
  if(this.insertnewrecordtodet.length>0){
        let count = this.count =this.insertnewrecordtodet.filter(app=> app.referenceNo == referencenumber);
        if(count.length==1){
          alert("already for this reference number amount is allocated");
          (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').reset();
          referencenumber=null;
        }
   }
  if(applicationcode==null || referencenumber==null ){ 
      if(applicationcode==null){
          alert("application must be selected");
         }  
      if(referencenumber==null){
          alert("referencenumber not be empty");
        }
  }else{
      this.http.get(`${apiURL}/allocations/bankstmtadjustmentvoucher/referencedetails?referencenumber=${referencenumber}&applicationcode=${applicationcode}`).subscribe((result)=>{
      this.referncedetails=result;
      console.log(this.referncedetails);
      if(this.referncedetails.length>0){
        this.patchreferncedetails(i);
       }

      if(this.referncedetails.length==0){
           alert("No record found");
        }   
        })
      }
}

//patching the refernce status and payour details
patchreferncedetails(i){
let x = (<FormArray>this.myForm.controls['corrections']).at(i);
  console.log("this calling form "+x);
x.patchValue({
  corRefStatus: this.referncedetails[0].statusname,
  corPayor:this.referncedetails[0].partyname  
    });
}


// updating amount based on allocated and avaliability amount
updateamountchanges(i){
  let application = (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').value;  
  let activity = (<FormArray>this.myForm.controls['corrections']).at(i).get('corActivity').value;
  let period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
  let referencenumber = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').value;
  let referencestatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefStatus').value;
  let payor = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayor').value;
  let transcationtype = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
  let amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').value;
        
  if(transcationtype !=null && application !=null &&  activity !=null &&  period  !=null &&  referencenumber !=null &&  transcationtype !='' &&  application !=''&&  activity !='' &&  period !='' &&  referencenumber !='') {
      if(transcationtype=="CRE" || transcationtype=="LRE" || transcationtype=="CRX" || transcationtype=="LRX"  ){
            if(transcationtype=="CRE"){
                    if(amount> this.creamount){
                          alert("amount cannot be greater than Unspecified CRE amount");
                            (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                            (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                          }else{
                            this.reallocatecreamount=this.reallocatecreamount+ +amount;
                              
                             if(this.reallocatecreamount>this.creamount){
                               alert("Total reallocation cre amount caanot be greater than unspecified cre amount");
                               this.reallocatecreamount=this.reallocatecreamount - +amount;
                               (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                               (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                               
                             }

                          }
                         }
              if(transcationtype=="LRE"){
                    if(amount> this.lreamount){
                        alert("amount cannot be greater than Unspecified LRE amount");
                       
                        (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                         (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                       }else{
                           this.reallocatelreamount = this.reallocatelreamount+ +amount;
                         
                           
                           if(this.reallocatelreamount>this.lreamount){
                            alert("Total reallocation lre amount caanot be greater than unspecified lre amount");
                            this.reallocatelreamount=this.reallocatelreamount - +amount;
                            (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                            (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                            
                          }
                       
                       
                          }
                  }

               if(transcationtype=="CRX"){
                      if(amount> this.crxamount){
                        alert("amount cannot be greater than Unspecified CRX amount");
                         (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                         (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                        }else{
                          this.reallocatecrxamount = this.reallocatecrxamount+ +amount;
                         
                           
                          if(this.reallocatecrxamount>this.crxamount){
                           alert("Total reallocation crx amount caanot be greater than unspecified crx amount");
                           this.reallocatecrxamount=this.reallocatecrxamount - +amount;
                           (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                           (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                           
                         }   


                        }
                  }

                if(transcationtype=="LRX"){
                       if(amount> this.lrxamount){
                          alert("amount cannot be greater than Unspecified LRX amount");
                           (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                           (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                          }else{
                              
                            this.reallocatelrxamount = this.reallocatelrxamount+ +amount;
                         
                           
                            if(this.reallocatelrxamount>this.lrxamount){
                             alert("Total reallocation lrx amount caanot be greater than unspecified lrx amount");
                             this.reallocatelrxamount=this.reallocatelrxamount - +amount;
                             (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
                             (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').reset();
                             
                           }  


                          }
                  }
          }
          
      let transtype= (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;  
          // by using this we can disable the fields
   if(transcationtype !=null&& transtype != undefined && application !=null &&  activity !=null &&  period  !=null &&  referencenumber !=null && amount !=null &&  transcationtype !='' &&  application !='' &&  activity !='' &&  period !='' && referencenumber !='' &&  amount!='') {
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').disable(); 
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corActivity').disable();
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').disable();
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').disable();
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefStatus').disable();
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayor').disable();
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').disable();   
      // used for enabled the check box
       (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').enable();


    }else{
      //alert("fields cannot be empty");
     }
 }else{
    alert("please filled all required fields");
      (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').reset();
    }
 }

  // reallocation checkbox method
  insertRecordToInsertNewRecordToDet (i){
    // first collection the information which we filled in the form array
    let application = (<FormArray>this.myForm.controls['corrections']).at(i).get('corApplication').value;  
    let activity = (<FormArray>this.myForm.controls['corrections']).at(i).get('corActivity').value;
    let period = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPeriod').value;
    let referencenumber = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').value;
    let referencestatus = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefStatus').value;
    let payor = (<FormArray>this.myForm.controls['corrections']).at(i).get('corPayor').value;
    let transcationtype = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
    let amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').value;
    let postingstatus="U"
    // checking the status of each field in that record 
      if(application==null || activity==null|| period==null  || referencenumber==null || referencestatus==null || payor==null || transcationtype==null || amount==null || postingstatus==null ||application=='' || activity==''|| period==''  || referencenumber=='' || referencestatus=='' || payor=='' || transcationtype=='' || amount=='' || postingstatus==''){
    //   alert("please filled the required details");
    //      if(application==null || application==''){
    //         alert("Application cannot be null");
    //      }
    //      if(activity==null  || activity==''){
    //       alert("activity cannot be null");
    //       (<FormArray>this.myForm.controls['corrections']).at(i).get('corActivity').enable();
    //       this.IsChecked=false;
    //       this.IsChecked123=true;  
    //     }
    //     if(period==null || period==''){
    //       alert("period cannot be null");
    //     }
    //     if(referencenumber==null || referencenumber=='' ){
    //       alert("referencenumber cannot be null");
    //     }
    //     if(referencestatus==null || referencestatus==''){
    //       alert("referencestatus cannot be null");
    //     }
    //     if( payor==null || payor==''){
    //       alert("payor cannot be null");
    //     }
    //     if(transcationtype==null || transcationtype==''){
    //       alert("transcationtype cannot be null");
    //     }
    //     if(amount==null || amount==''){
    //       alert("amount cannot be null");
    //     }
    //      if(postingstatus==null || postingstatus==''){
    //       alert("postingstatus cannot be null");
    //      }
    
     } else{   
      if(this.insertnewrecordtodet.length==0){
              var obj={}
              obj["toreallocpostingStatus"]=postingstatus
              obj["bkstmtreallocid"]=this.bankstmtdetails[0].bankstmtreallocid
              obj["appCode"] = application
              obj["appActivityCode"] = activity
              obj["referenceNo"] = referencenumber 
              obj["referenceStatus"] = referencestatus
              obj["toreallocateperiod"] = period
              obj["payor"] = payor
              obj["transactionCode"]=transcationtype
              obj["amount"] =  amount
              this.insertnewrecordtodet.push(obj); 
              console.log("aray size ------->"+this.insertnewrecordtodet.length)
      }else{
         // if we are having any record in this  [insertnewrecordtodet] array then checking whether
          // record is already present in the   [insertnewrecordtodet] array or we need to push new record into that array
        if(this.correctionForms.length>0){

          //checking the count if count.length get 1 as result then this this record is already present in our [insertnewrecordtodet] array 
          this.count =this.insertnewrecordtodet.filter(app=> app.referenceNo == referencenumber);
         
          // if count is zero then we are adding the record 
          if(this.count.length==0){
            var obj={}
            obj["toreallocpostingStatus"]=postingstatus
            obj["bkstmtreallocid"]=this.bankstmtdetails[0].bankstmtreallocid
            obj["appCode"] = application
            obj["appActivityCode"] = activity
            obj["referenceNo"] = referencenumber 
            obj["referenceStatus"] = referencestatus
            obj["toreallocateperiod"] = period
            obj["payor"] = payor
            obj["transactionCode"]=transcationtype
            obj["amount"] =  amount
            this.insertnewrecordtodet.push(obj); 
            console.log("aray size ------->"+this.insertnewrecordtodet.length)
            // console.log(this.insertnewrecordtodet)
          }
          // if count is 1 then we are removing this record from our array 
          // by this way we can add or remove record in our array by using check button
          if(this.count.length==1){
            this.insertnewrecordtodet=this.insertnewrecordtodet.filter(app=> app.referenceNo != referencenumber);
            console.log("length after slicing---->>"+this.insertnewrecordtodet.length);
          }
        }
      }
    }
}




// insert the record into reallocation todet 
inserttoreallocationdet(){
  let createdby =this.username;
  this.http.post(`${apiURL}/allocations/bankstmtadjustmentvoucher/insertreallocationtodetrecord?createdby=${createdby}`,
   this.insertnewrecordtodet    
   ).subscribe((result)=>{ 
    console.log(result);
    alert("record is succesfully saved");
     },(error)=>{
        console.log(error);
        alert("eerror occured during saving the error");
     })
  }

  // deleting the record if posting status is unposted
deleterecordreallocationtodet(i){
 let postingstatus=this.reallocationdetails[i].toreallocpostingStatus;
 let amount=this.reallocationdetails[i].amount;
 let transcationtype=this.reallocationdetails[i].transactionCode;

  if(postingstatus=="P"){
        alert("recored is already posted so it cannot be deleted ");
  }else{
     let reallocidtodet =this.reallocationdetails[i].bkStmtToReallDetId
      this.http.get(`${apiURL}/allocations/bankstmtadjustmentvoucher/deleterecordtbkreallocation?reallocidtodet=${reallocidtodet}`)
      .subscribe((result)=>{
       console.log(result);
       alert("successfully record is removed");

       if(transcationtype=="CRE"){

        this.reallocatecreamount=this.reallocatecreamount- +amount;
      }
      if(transcationtype=="LRE"){
        this.reallocatelreamount=this.reallocatelreamount - +amount;
      }
      if(transcationtype=="CRX"){
        this.reallocatecrxamount=this.reallocatecrxamount- +amount;
      }
      if(transcationtype=="LRX"){
        this.reallocatelrxamount=this.reallocatelrxamount - +amount;
      }
      // after deleting the record succesfully we are remove that records from our array
        this.reallocationdetails=this.reallocationdetails.filter(app=>app.bkStmtToReallDetId != reallocidtodet); 
       },(error)=>{
          console.log(error);
          alert("error occured during deleting the record");
          })
        }
  }

 

 

//   //enabling/disableing the check button
// getenable(){
//     let lengthform = this.correctionForms.length;
//     let count=lengthform-1;
//     (<FormArray>this.myForm.controls['corrections']).at(count).get('corSelect').disable();
//   }

deleteCorrection(i) {
  this.correctionForms.removeAt(i);
  let transcationtype = (<FormArray>this.myForm.controls['corrections']).at(i).get('corTransType').value;
  let amount = (<FormArray>this.myForm.controls['corrections']).at(i).get('corAmount').value;
  if(amount=='' || amount==null || amount==undefined){
    amount=0;
  }

  if(transcationtype=="CRE"){

    this.reallocatecreamount=this.reallocatecreamount- +amount;
  }
  if(transcationtype=="LRE"){
    this.reallocatelreamount=this.reallocatelreamount - +amount;
  }
  if(transcationtype=="CRX"){
    this.reallocatecrxamount=this.reallocatecrxamount- +amount;
  }
  if(transcationtype=="LRX"){
    this.reallocatelrxamount=this.reallocatelrxamount - +amount;
  }
}


postrecord(){
  let createdby=this.username;
  let bankstmtid= this.bankStmtId.get('bankStatementID').value
  alert("bank statement id ---->"+bankstmtid);
  this.http.post(`${apiURL}/allocations/bankstmtadjustmentvoucher/insertinterfacetablereallocationtodetrecord?createdby=${createdby}&bankstmtid=${bankstmtid}`,
  this.newreallocationdetailsforunposted).subscribe(
    (result)=>{
      console.log(result);
      alert("record is posted successfully");
    },
    (error)=>{
      console.log(error);
      alert("error occured while posting error");
    }
  );
}

postreallocbankstmt(){
let bkreallocid =this.bankstmtreallocid;
let postedby = this.username;
this.http.get(`${apiURL}/allocations/bankstmtadjustmentvoucher/updatepostingstatus?bkstmtreallocid=${bkreallocid}&postedby=${postedby}`).subscribe(
(result)=>{
console.log(result);
alert("successfully record is posted");
},(error)=>{
console.log(error);
alert("error occured while posting the record");
})
}


// save method
save(){
if(this.insertnewrecordtodet.length <=0){
    alert("please select  atleast to save the record");
}else{
    if(this.bankstmtdetails[0].postingstatus !='P'){
      this.inserttoreallocationdet();
    }else{
      alert("record is already posted so it cannot be changed/saved new records ");
    }
 // used for removing formarray records 
 for(let i = 0;i<this.correctionForms.length;i++){
    let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value  
      if(status==true){
        let referencenumber = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').value;
          console.log("before remove--->"+ this.insertnewrecordtodet.length)
           this.insertnewrecordtodet=this.insertnewrecordtodet.filter(app=> app.referenceNo != referencenumber);
            this.correctionForms.removeAt(i);
              if(this.correctionForms.length==1){
                     break;
                 }
              }
           }
// used for removing formarray records(where index of record in form array is zero) 
for(let i = 0;i<this.correctionForms.length;i++){
      let status:boolean =  (<FormArray>this.myForm.controls['corrections']).at(i).get('corSelect').value  
      if(status==true){
        let referencenumber = (<FormArray>this.myForm.controls['corrections']).at(i).get('corRefNo').value;
        console.log("before remove--->"+ this.insertnewrecordtodet.length)
        this.insertnewrecordtodet=this.insertnewrecordtodet.filter(app=> app.referenceNo != referencenumber);
        this.correctionForms.removeAt(i);
         }
      }
    } 
}

// search method
search(x){
  this.getbankstmtdetails(x);
}


// used for removing all formarray records
clearFormArray (){
  while(this.correctionForms.length !=0){
    this.correctionForms.removeAt(0);
   }
  }


clear(){
    this.bankStmtId.reset();
    this.bnkAccDetails.reset();
    this.bnkStmtDetails.reset();
    this.clearFormArray();

    this.bankstmtdetails=null;
    this.unspecifieddetails=null;
    this.reallocationdetails=null;
    this.creamount=0;
    this.lreamount=0;
    this.IsChecked=true;
    this.IsChecked123=false;
    this.searchlabel=true;
    this.savelabel=true;
    this.postlabel=true;
    this.addlabel=true;
    this.bankstmtreallocid=null;
    this.crxamount=0;
    this.lrxamount=0;
    this.reallocatecreamount=0;
    this.reallocatelreamount=0;
    this.reallocatecrxamount=0;
    this.reallocatelrxamount=0;
    this.count=0;
    this.insertnewrecordtodet=[];
    this.toplselect=false;
    this.aclselect=false;
    this.referncedetails=null;
    this.newreallocationdetailsforunposted=[];
    this.ngOnInit();
  }

  //post method
post(){
  if(this.bankstmtdetails[0].postingstatus !='P'){  
    if( this.reallocationdetails.length>0){
      this.newreallocationdetailsforunposted= this.reallocationdetails.filter(app=>app.toreallocpostingStatus !='P') 
      if(this.newreallocationdetailsforunposted.length>0){
           this.postrecord();
      }else{
        alert("No Unposted record is found ");
      }
  if(this.reallocatecreamount==this.creamount && this.reallocatelreamount==this.lreamount && this.reallocatecrxamount==this.crxamount && this.reallocatelrxamount==this.lrxamount  ){
    this.postreallocbankstmt();
    }
  }
}else{
  alert("record is already posted so it cannot be changed ")
  }
}

  // exit method
exit(){
  window.location.href = "http://localhost:4200/#/dashboard" ; 
}
  
}
