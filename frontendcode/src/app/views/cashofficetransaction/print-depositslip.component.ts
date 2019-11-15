import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

import { forEach } from '@angular/router/src/utils/collection';
import { apiURL } from '../../_nav';

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'print-depositslip.component.html'
})
export class PrintbankslipComponent {

  printDepositSlip: FormGroup;
  ttlCash: any;
  getDepositSlipID: any;
  CashOffDetails: any;
  TableData: any[];
  receiptDetails: any;
  details: Array<any> = [];
  total: any = 0;
  DenmTotal: any = 0;
  receiptsData: any;
  removedata: any;
  userName:any;
  userId:any;
  showDiv:any;
  id: any = 0;
  ChequeData: any;
  CashData: any;
  data: Array<any> = [];
  deleterow: any;
  validateAmt: any = 0;
  DenominationDetails: any;
  buttonDisabled1: any;
  cols: { field: string; title: string; show: boolean; }[];

  constructor(private http: HttpClient,private router:Router,
    private tokendetails:TokenStorageService) {
    this.printDepositSlip = new FormGroup(
      {
        depositSlipId: new FormControl(''),
        cashOffice: new FormControl(''),
        receiptDate: new FormControl(''),
        depositDate: new FormControl(''),
        cashier: new FormControl(''),
        payMethodDesc: new FormControl(''),
        denominationCode: new FormControl(''),
        amount: new FormControl(''),
        totalDenominationCash: new FormControl(''),
        denominationcode: new FormControl(''),
        Amount: new FormControl(''),
        totalReceiptedCash: new FormControl(''),
        cheque: new FormControl(''),
        postalOrder: new FormControl(''),
        totalDeposit: new FormControl(''),
        deleteOption: new FormControl('')
      }
    )
  }

  ngOnInit() {
    // this.userName = sessionStorage.getItem('userName');
    // this.userId = sessionStorage.getItem('userID');
    this.userName =this.tokendetails.getUsername();

   //To Get the Deposit Details and Cashier Details
   this.http.get(apiURL + '/DepositDetails/' + JSON.stringify( this.userName))
   .subscribe(
     data => {
       this.CashOffDetails = data;
      console.log( this.CashOffDetails );
       if(this.CashOffDetails.length > 0){
         this.printDepositSlip.patchValue({
           cashOffice: this.CashOffDetails[0].cashOffice,
           depositDate: this.CashOffDetails[0].depositDate,
           cashier: this.CashOffDetails[0].cashier
         });
       }else{
         alert("please login with valid user")
       }
    
     })

    // To Get Denomination Codes 
    this.http.get(apiURL + '/Denominationdetails/')
      .subscribe(
        data => {
          this.DenominationDetails = data;
        })
      }

  //To add Denomination cash Details
  addDenomination(printDepositSlip) {

    let TotalAmount = this.printDepositSlip.value.Amount - -  this.printDepositSlip.value.totalDenominationCash;
    let updateAmt = this.printDepositSlip.value.Amount - - this.validateAmt;

    // Assigning FormGroup Amount,denominationCode values to temparory variables amount,denominationcode
    if (TotalAmount <= this.ttlCash && updateAmt <= this.ttlCash) {
      let denominationcode : any= this.printDepositSlip.value.denominationCode;
      let amount : number= this.printDepositSlip.value.Amount;
      var coinsval = denominationcode
      var code = denominationcode.substring(3);
      var codevalue: number = +code;
      // To validate the amount and denomination Code
      if ((amount >= codevalue && amount % codevalue == 0) || (coinsval == 'COINS' && amount > 0)) {

        if (this.id >= 0) {
          var id = this.id++;
          // created data array to add rows
          this.data = [{ denominationcode, amount, id }];
          if (denominationcode != undefined && amount != undefined){   
            for (var i = 1; i <= this.details.length; i++) {
             // console.log(this.details[i - 1].denominationcode);
              if (this.details[i - 1].denominationcode == coinsval) {
                alert("already denominations added");
                return;
              } 
            }  
            this.totalDenominationCash();
            this.details.push(this.data[0]);
            this.allTableData();
          }
        }

      } else {
        alert("enter valid amount");
      }
    }
    else {
      alert("Total Denomination Cash should not be more than Total Receipted Cash");
    }
  }

  //clear the All form values
  clear(){
    this.printDepositSlip.reset();
    this.details=null;
    //this.ngOnInit();
   
  }
  
  //To delete the Denomination table rows
  deleteRow(index) {
    var x: number = this.details[index].amount;
    var y: number = this.printDepositSlip.value.totalDenominationCash;
    var z: number;
    z = y - x;
    this.validateAmt = z;
    this.printDepositSlip.patchValue({ totalDenominationCash: z })
    this.details.splice(index, 1);

  }

  //To Get Receipts data based on receipt date
  onSearchChange(searchValue: Date) {
    
    var curDate = new Date();
  if(new Date(searchValue) < curDate){
    this.http.post(apiURL + '/getReceipts/',
      this.printDepositSlip.value).subscribe(data => {
        this.receiptsData = data;
        console.log( this.receiptsData);
        if(this.receiptsData[0].payMethodDesc == "CASH"){ 
          this.showDiv=true;
        }      
          
   
      if(this.receiptsData == null ){  
       alert("Already submitted for this selected date");
      }
      else{

        const allTotal = this.receiptsData.reduce((sum, item) => sum + item.receiptAmount, 0).toFixed(2);

        this.printDepositSlip.patchValue({
          totalDeposit: allTotal
        });
       
        //To Get only Cheque Details rows
        this.ChequeData = this.receiptsData.filter(app => app.payMethodDesc == "CHEQUE");
      
        const ttlCheque = this.ChequeData.reduce((sum, item) => sum + item.receiptAmount, 0).toFixed(2);

        this.printDepositSlip.patchValue({
          cheque: ttlCheque
        });

        //To Get only Cash Details rows
        this.CashData = this.receiptsData.filter(app => app.payMethodDesc == "CASH");

        this.ttlCash = this.CashData.reduce((sum, item) => sum + item.receiptAmount, 0).toFixed(2);
        this.printDepositSlip.patchValue({
          totalReceiptedCash: this.ttlCash
        });

      }
      })

    }else{
      alert("Receipt Date should not be future date");
    }
  }

  //To add Total Denomination Cash
  totalDenominationCash() {
    this.total = this.printDepositSlip.value.totalDenominationCash;
    var x: number = this.data[0].amount;
    var y: number = this.total;
    var z: number;
    z = x - - y;
    this.DenmTotal = z;
    if (this.DenmTotal <= this.ttlCash) {
      this.printDepositSlip.patchValue({
        totalDenominationCash: this.DenmTotal
      });
    } else {
      alert("Total Denomination Cash and Total Receipted Cash should be equal");

    }
  }

  //To get All the Rows in a Denomination Table
  allTableData() {
    this.TableData = this.details.slice(0, this.details.length)
  }

  //just before submitting the form
  private prepareSave(value12): any {
    let input = new FormData();
    //input.append('selectTemplate', this.printDepositSlip.value);
    input.append('formValue', JSON.stringify(value12));
    return input;
  }

  //To save the Denomination and receipt Details
  save(printDepositSlip) {
//     this.http.post(apiURL + '/SaveUserDetails/' + JSON.stringify( this.userName),
//        this.printDepositSlip.value).subscribe(data => {
//          console.log(data);
//          let DepositId=data;
//          this.printDepositSlip.patchValue({
//                        depositSlipId: DepositId
//                      });

//                  this.getsavemethod2();    

//        }
    
//        )

//    console.log(this.printDepositSlip.get('depositSlipId').value)


 console.log(this.details)
 for (var i = 0; i < this.details.length; ++i) {
  this.getsavemethod2(i);
 }   
}


getsavemethod2(i){
  if (this.printDepositSlip.value.totalDenominationCash == this.ttlCash) {
      this.http.post(apiURL + '/SaveReceipt', 
      {
        "denominationcode":this.details[i].denominationcode,
        "amount":this.details[i].amount
      }).subscribe(data => {
        console.log(data);
      },(error)=>{
        console.log(error);
      })
  }
}
}  
