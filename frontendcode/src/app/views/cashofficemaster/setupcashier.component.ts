import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators} from '@angular/forms';
import { CreateCashier } from './CreateCashier.interface';

import { PagerService, GlobalServices } from './../../services/index';
import { apiURL } from '../../_nav';
import { TokenStorageService } from '../../services/token-storage.service';
import { HttpClient } from "@angular/common/http";

@Component({
  templateUrl: 'setupcashier.component.html'
})
export class SetUpCashierComponent {
 
  cashiers: any;
  users:any;
  allBranches: any;
  pager: any = {};
  pagedItems: any[];
  createCashier: FormGroup;
  constructor(private http: HttpClient,
               private pagerService: PagerService, 
               private gs: GlobalServices,
               private token: TokenStorageService) {
    //createCashier Form Group items or controllers Initialization 
    this.createCashier = new FormGroup(
      {
        cashierCode: new FormControl('',Validators.required),
        cashierName: new FormControl('',Validators.required),
        loginId: new FormControl('Please Select',Validators.required),
        branchCode: new FormControl('Please Select',Validators.required),
        branchName: new FormControl(),
        createdBy: new FormControl()
      }
    );
  }

  userName:any;
  ngOnInit() {

    this.getusersessiondetails();
  
    this.getcashiersdetails();

   
    this.http.get(apiURL+`/getUsers`).subscribe((response) => {
        this.users = response;    
      });

    
    this.gs.getBranches().subscribe(data => {
        this.allBranches = data;
        console.log(this.allBranches);
      });
      
   }


  // loading the user details,tokens details
  getusersessiondetails(){
    let token = this.token.getToken();
    this.userName = this.token.getUsername();
    console.log(token);
  }

  getcashiersdetails(){
    this.http.get(`${apiURL}/cashiers`).subscribe((response) => {
      this.cashiers = response;
      this.setPage(1);
    });
  }

  //ASSIGNING THE cashier values
  fetchCashiers(cashierCode,cashierName,branchName,loginId) {
    this.createCashier.patchValue({
      cashierCode:  cashierCode,
      cashierName: cashierName,
      branchName : branchName,
      loginId: loginId
      
    })
  }

  //To Save the form values
  onSubmit({ value, valid }: { value: CreateCashier, valid: boolean }) {
   // console.log(valid);
    this.createCashier.value.createdBy =this.userName;
    console.log("Createcashier Details",  this.createCashier.value);
    if(valid){
    this.http.post(apiURL+'/cashiers/CreateUpdateCashier',
    this.createCashier.value)
    .subscribe(
      (response) => {  
        alert("User created/updated successfully"+response);
        
       }  , error => {  
        alert(error.error.text); 
      }
        
    );
    
    }
  }
  
  updateBranchName(event) {
    //Filter Branch Name based on Selected Branch Code and assign it to branchName textbox. 
    this.createCashier.patchValue({
      branchName :this.allBranches.filter(app => app.organCode == event.target.value)[0].companyName
    });    
  }
  search(value){
    //Search Cashier details based on Cashier Code Input value
    //Search Cashiers object using FILTER pre defined method. 
    let cashier=this.cashiers.filter(app => app.cashierCode == value.toUpperCase());
    //Assign Cahsier details createCashier Form Group
    if(cashier.length != 0){
      this.createCashier.patchValue({
        cashierCode: cashier[0].cashierCode,
        cashierName: cashier[0].cashierName,
        loginId: cashier[0].loginId,
        branchCode: cashier[0].branchCode,
        branchName: cashier[0].branchName
      });
    }else{
      alert("No Cashier exists with Cashier Code "+value);
    }    
  }
  clear(){
    //Clear all Input Parameter values
    this.cashiers=null;
    this.createCashier.reset();
   
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.cashiers.length, page, 10);

    // get current page of items
    this.pagedItems = this.cashiers.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
