import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllocationsService } from '../allocations.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../../services/index';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { apiURL } from '../../../_nav';


@Component({
  selector: 'app-paypoint',
  templateUrl: './bibo.component.html'
})
export class BiboComponent implements OnInit {

paypointDetails: any;
pager: any = {};
pagedItems: any = [];
paypointForm: FormGroup;
public onClose: Subject<any>;
biboo:any
bibopaymentMode:any
bibootransactionCode:any;
cashAllocTrnId:any;
bankcode:any;
branchCode:any;
bankStmtId:any;
stmtNumber:any;
accountNumber:any;
allocationStatus:any;
grossAmount:any;
allocatedAmount:any;

constructor(private ppservice: AllocationsService,
            private bsModalRef: BsModalRef, private pagerService: PagerService,
            private http: HttpClient) {

      this.paypointForm = new FormGroup({
      bankstmt: new FormControl('')

    })
  }



  ngOnInit() {
    this.onClose = new Subject();
  }

  public populateDetails(ppId) {
    alert("calling populate click event cashAllocTrnId is---->"+ppId)
    this.onClose.next(ppId);
    this.bsModalRef.hide();
  }


  onSearch(value) {
   this.getmigbobi(value);
  }


  getmigbobi(stmt){   
  let bankstmt = stmt;
  this.http.get(`${apiURL}/allocations/manualadjustmentvoucher/bibo?bankstmtnum=`+bankstmt).subscribe(
  (response) => { 
  console.log(response);
  this.biboo=response
  if(this.biboo==null){
      alert("no record found with this id ");
    }else{
      this.bibopaymentMode=this.biboo.paymentMode;
      this.bibootransactionCode= this.biboo.transactionCode;
      this.cashAllocTrnId = this.biboo.cashAllocTrnId;
      this.bankcode= this.biboo.bankCode;
      this.branchCode=this.biboo.branchCode;
      this.bankStmtId = this.biboo.bankStmtId;
      this.stmtNumber = this.biboo.stmtNumber;
      this.accountNumber=this.biboo.accountNumber;
      this.allocationStatus = this.biboo.allocationStatus;
      this.grossAmount = this.biboo.grossAmount;
      this.allocatedAmount = this.biboo.allocatedAmount;
    }
      },(error) =>{
        console.log(error)
    });
}

 }
