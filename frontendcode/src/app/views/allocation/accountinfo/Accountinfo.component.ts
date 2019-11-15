import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../../services/index';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { apiURL } from '../../../_nav';

@Component({
    selector: 'app-paypoint',
    templateUrl: './accountinfo.component.html'
  })


  export class AccountinfoComponent implements OnInit {

    public onClose: Subject<any>;
    banknames:any;
    accountinfoDe:FormGroup;
    constructor(private bsModalRef: BsModalRef, private pagerService: PagerService,private http:HttpClient) {
        this.accountinfoDe = new FormGroup({
            bankName: new FormControl('')
          })
    }
 
    ngOnInit() {
        this.onClose = new Subject();
        this.fetchbanknames();  
    }
           
    //fetchbankdetails  
    fetchbanknames(){
    this.http.get(`${apiURL}/allocations/stmt/bankdetails`)
    .subscribe(response => {
    console.log(response); 
    this.banknames=response;
     }, (error) =>{
      console.log(error);
    });
     }
        
    banknamefetching:any
    accountinfopop(){
      let bankname =this.accountinfoDe.get('bankName').value
      let bankid=this.banknames.filter(app=>app.bankname==bankname);
      let bankcode = bankid[0].bankcode;
      this.banknamefetching = bankid[0].bankname
      this. fetchaccountinfo(bankcode);
      }
        
    accountinfo:any
    fetchaccountinfo(bankcode){
    this.http.get(`${apiURL}/allocations/accountinfodetails?parentbankid=${bankcode}`)
    .subscribe(response => {
      console.log(response);
      this.accountinfo=response;
      // every important one we are additional info to result set 
       this.accountinfo.forEach((key) => {
       key["finalbankname"] = this.banknamefetching;
       });
               
      }, (error) =>{ console.log(error); 
             });
    }


  public populateDetails(x) {
  this.onClose.next(this.accountinfo.filter(app => app.description == x.description));
  this.bsModalRef.hide();
  }


  }