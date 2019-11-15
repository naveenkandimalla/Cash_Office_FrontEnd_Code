import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GlobalServices, PagerService } from "../../services";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component";
import { PaypointmasterService } from "./paypointmaster.service";
import { resetApplicationState } from "@angular/core/src/render3/instructions";
import { FileValidator } from "../../customvalidators";
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

@Component({
  templateUrl: 'debitfile-template-assignment.component.html'
})
export class DebitfileTemplateAssignmentComponent {
  bsModalRef: BsModalRef;
  selectedPaypoint: any;
  dbtFileTmpltAssignment: FormGroup;
  ppAttributes: any;
  asgndPayPoints :any;
  fileToUpload: File = null;
  pager: any = {};
  pagedItems: any[];
  constantChecked: boolean = false;
  periodChecked: boolean = false;
  extensionChecked: boolean = false;
  strikeDayChecked: boolean = false;
  pensionlabel:boolean=false;
  otherlabel:boolean=false;

  constructor(private gs: GlobalServices,private pagerService: PagerService,
     private modalService: BsModalService, private ppservice: PaypointmasterService,
     private router:Router,
     private tokendetails:TokenStorageService) {
    this.dbtFileTmpltAssignment = new FormGroup({
      ppId: new FormControl('',[Validators.required]),
      ppName: new FormControl('',[Validators.required]),
      ppAttributeId: new FormControl('',[Validators.required]),
      ppAttributeDesc: new FormControl('',[Validators.required]),
      selectTemplate: new FormControl('',[FileValidator.validate]),
      pensionOnly: new FormControl(''),
      otherPremOnly: new FormControl(''),
      ffConstantValue: new FormControl(),
      ffPeriod: new FormControl(),
      ffStrikeday: new FormControl(),
      ffFileExtension: new FormControl()
    })
  }

  ngOnInit() {
    this.ppservice.getPpAttributes().subscribe(
      (data) => {
        this.ppAttributes = data;
      }
    );

    this.ppservice.getAsgndPayPointDetails().subscribe(
      (data) =>{
        this.asgndPayPoints=data;
        console.log(this.asgndPayPoints);
        this.setPage(1);
      }
    )
  }

  populateDetails(value){    

    let ppDet=this.asgndPayPoints.filter(pp => pp.paypointid == value);
    if(ppDet.length == 0 ){
      alert("No templates are assigned to paypoint");
    }else{
   

      if(ppDet[0].constant !=null){
        this.constantChecked = true;
      }
      
      if(ppDet[0].period !=null){
        this.periodChecked = true;
      }

      if(ppDet[0].strikedate !=null){
        this.strikeDayChecked = true;
      }

      if(ppDet[0].fileextension !=null){
        this.extensionChecked = true;
      }


      if(ppDet[0].pensiononly == "N"){
        this.pensionlabel=false;
      }else{
        this.pensionlabel=true;
      }

      if(ppDet[0].otherpensiononly == "N"){
        this.otherlabel=false;
      }else{
        this.otherlabel=true;
      }

      console.log(ppDet[0]);
      this.dbtFileTmpltAssignment.patchValue({
        ppId: ppDet[0].paypointid,
        ppName: ppDet[0].paypointname,
        ppAttributeId:ppDet[0].ppattributeid,
        ppAttributeDesc:ppDet[0].templatecode ,
        selectTemplate:'',
       // pensionOnly: ppDet[0].pensionOnly ,
       // otherPremOnly: ppDet[0].otherPremOnly ,
        ffConstantValue: ppDet[0].constant,
        ffPeriod: ppDet[0].period,
        ffStrikeday: ppDet[0].strikedate,
        ffFileExtension:ppDet[0].fileextension
      })
    }
    
  }
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.selectedPaypoint = result[0];
      this.dbtFileTmpltAssignment.reset();
      this.dbtFileTmpltAssignment.patchValue({
        ppId: this.selectedPaypoint.payPointId,
        ppName: this.selectedPaypoint.payPointName
      })
    })
  }
  setPpAttrDesc(event) {
    let currPpAttr = this.ppAttributes.filter(attr => attr.ppAttributeId == event.target.value);
    this.dbtFileTmpltAssignment.patchValue({
      ppAttributeId: currPpAttr[0].ppAttributeId,
      ppAttributeDesc: currPpAttr[0].attrComDesc
    })
  }
  
  //on file browsing
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  isCheckeddetails(event) {
    console.log(event.target.name);
    if (event.target.name == "constantCheckBox") {
      if (event.target.checked) {
        this.constantChecked = true;
      }
      if (!event.target.checked) {
        this.constantChecked = false;
      }
    }
    if (event.target.name == "periodCheckBox") {
      if (event.target.checked) {
        this.periodChecked = true;
      }
      if (!event.target.checked) {
        this.periodChecked = false;
      }
    }
    if (event.target.name == "strikedayCheckBox") {
      if (event.target.checked) {
        this.strikeDayChecked = true;
      } if (!event.target.checked) {
        this.strikeDayChecked = false;
      }
    }
    if (event.target.name == "fileExtCheckBox") {
      if (event.target.checked) {
        this.extensionChecked = true;
      } if (!event.target.checked) {
        this.extensionChecked = false;
      }
    }
  }
  //just before submitting the form
  private prepareSave(): any {
    let input = new FormData();
    input.append('selectTemplate', this.fileToUpload);
    input.append('formValue', JSON.stringify(this.dbtFileTmpltAssignment.value));
    return input;
  }

  // fetch the seassion value 
  createdby:any;
  modifiedby:any;
  getsessionvalues(){
   this.createdby= this.tokendetails.getUsername();
   this.modifiedby=this.tokendetails.getUsername();
  }

  onSubmit() {
    this.getsessionvalues();

    //patching the values which are not selected
    if (this.dbtFileTmpltAssignment.get('pensionOnly').value == null || this.dbtFileTmpltAssignment.get('pensionOnly').value == false) {
      this.dbtFileTmpltAssignment.controls['pensionOnly'].setValue('N');
    }
    if (this.dbtFileTmpltAssignment.get('otherPremOnly').value == null || this.dbtFileTmpltAssignment.get('otherPremOnly').value == false) {
      this.dbtFileTmpltAssignment.controls['otherPremOnly'].setValue('N');
    }



    if (this.dbtFileTmpltAssignment.get('pensionOnly').value == true ) {
      this.dbtFileTmpltAssignment.controls['pensionOnly'].setValue('Y');
    }
    if (this.dbtFileTmpltAssignment.get('otherPremOnly').value == true) {
      this.dbtFileTmpltAssignment.controls['otherPremOnly'].setValue('Y');
    }



    const formModel = this.prepareSave();
    //console.log(formModel);
    let createdby=this.createdby;
    let modifiedby=this.modifiedby;
    console.log(this.dbtFileTmpltAssignment.value);
    this.ppservice.assignTemplate(formModel,createdby,modifiedby).subscribe(
      (response) => {
        console.log(response);
        alert("template is successfully assigned");
         this.resetForm();
      },
      (error) => {
        //this.dbtFileTmpltAssignment.reset(this.dbtFileTmpltAssignment.value);
        alert("Error occured while insert/updating the template");
        this.resetForm();
        console.log(error);
        console.log(error.message);
       
      }
    ) 
  }  
  resetForm(): any {
  this.dbtFileTmpltAssignment.reset();
  this.constantChecked = false;
  this.periodChecked = false;
  this.extensionChecked = false;
  this.strikeDayChecked = false;
  this.pensionlabel=false;
  this.otherlabel=false;
  this.ngOnInit();
  } 

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.asgndPayPoints.length, page,5);

    // get current page of items
    this.pagedItems = this.asgndPayPoints.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  exit(){
      this.router.navigateByUrl('/dashboard');
  }
}