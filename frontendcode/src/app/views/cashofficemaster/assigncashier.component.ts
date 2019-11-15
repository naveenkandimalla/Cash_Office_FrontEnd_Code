import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PagerService, GlobalServices } from '../../services';
import { apiURL } from '../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';


@Component({
  templateUrl: 'assigncashier.component.html'
})
export class AssignCashierComponent {
  cashOffice: any;
  cashiers: any;
  asgndCashiers: any;
  pager: any = {};
  pagedItems: any[];
  filteredCashiers :any;
  constructor(private http: HttpClient, 
              private pagerService: PagerService,
              private gs:GlobalServices,
              private router:Router,
              private tokendetails:TokenStorageService) { }
  assignCashierForm = new FormGroup({
    cashOfficeCode: new FormControl('', Validators.required),
    cashOfficeDesc: new FormControl(),
    cashierCode: new FormControl('', Validators.required),
    cashierName: new FormControl(),
    branchName: new FormControl(),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl(),
    cashierId: new FormControl(),
    isSenior: new FormControl(false),
    coCashierid:new FormControl()
  });

  userName:any;
  ngOnInit() {
    this.userName =this.tokendetails.getUsername();
    this.http.get(apiURL + '/getCashOfficeDetails')
      .subscribe(response => {
        this.cashOffice = response;
        //this.setPage(1);
      });
    this.http.get(apiURL + '/cashiers').subscribe(
      (response) => {
        this.cashiers = response;
        console.log(this.cashiers);
        //this.filteredCashiers = this.cashiers;
      }
    );
  }

  updateDesc(event) {
    //this.cashiers = this.filteredCashiers;
    let co = this.cashOffice.filter(co => co.cashOfficeCode == event.target.value)[0];
 //patchValue is used to update only some of the form fields
    this.assignCashierForm.patchValue({
      cashOfficeDesc: co.cashOfficeDesc
    })
    this.http.get(apiURL+'/cashiers/assignedCashiers/' + JSON.stringify(co.cashOfficeId)).subscribe(
      (data) => {
        console.log(data);
        this.asgndCashiers = data;
        if(this.asgndCashiers.length > 0){
            this.setPage(1);
            // below code is used for assigning unqine cashier
              for (var ac in this.asgndCashiers) {
               for (var ca in this.cashiers) {
                  this.cashiers = this.cashiers.filter(cs => cs.cashierCode != this.asgndCashiers[ac].cashierCode);
                    }
                }
      }else{
        alert("No data is present with this cash office code");
      }
      },
      (error) => {
        alert("error at fetching assigned cashiers of the cashoffice");
      }
    )
  }

  //To patch the values of cash office details to some fields
  updateDetls(event) {
    let cashr = this.cashiers.filter(app => app.cashierCode == event.target.value)[0];

    console.log(cashr);

    this.assignCashierForm.patchValue({
      cashierName: cashr.cashierName,
      branchName: cashr.branchName,
      //startDate:this.gs.fromJsonDate(cashr.startDate),
      //endDate:this.gs.fromJsonDate(cashr.endDate),
      isSenior: false,
      cashierId: cashr.cashierId 
    });
  }

  //To display the corresponding form values to their fields
 
  populateDetails(value,event){
    let cashr = this.asgndCashiers.filter(app => app.cashierId == value.cashierId)[0];
    console.log(cashr);
    this.cashiers.push(cashr);
    this.assignCashierForm.patchValue({
      cashierCode:cashr.cashierCode,
      cashierName: cashr.cashierName,
      branchName: cashr.branchName,  
      startDate: this.gs.fromJsonDate(cashr.startDate),
      endDate: this.gs.fromJsonDate(cashr.endDate),
      isSenior: cashr.isSenior,
      cashierId: cashr.cashierId,
      coCashierid:cashr.coCashierid
    });
    
  }

  //clear the form group values
  clearForm(){
    this.assignCashierForm.reset();
    this.pagedItems=null;
    this.ngOnInit();
   
  }

  //To submit the all form group values for save 
  onSubmit() {
    if (this.assignCashierForm.get('isSenior').value == null) {
      this.assignCashierForm.controls['enabled'].setValue(false);
    }
    console.log(this.assignCashierForm.value);
    this.http.post(apiURL+`/cashiers/assignCashier?createdby=${this.userName}`,
     this.assignCashierForm.value)
      .subscribe(
        data => {
          if(data == null){
            alert("This Cashier is already assigned to given CashOffice");  
          }else{
          alert("successfully assigned cashier to cashoffice");     
          }
        this.clearForm(); 
        }       
        , error => {  
          alert(error.error.message); 
        }
      );
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.asgndCashiers.length, page, 5);

    // get current page of items
    this.pagedItems = this.asgndCashiers.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}



