import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileValidator } from '../../../customvalidators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaypointComponent } from '../../paypointmaster/paypoint/paypoint.component';
import { PaypointTransactionService } from '../paypointtransaction.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import{Router} from '@angular/router';

@Component({
  templateUrl: './upload-creditfile.component.html'
})
export class UploadCreditfileComponent implements OnInit {

  uploadCreditFileForm: FormGroup;
  bsModalRef: BsModalRef;
  fileToUpload: File;
  creditFileName: string;
  AllowedExtns: string[] = ["txt", "csv", "xls", "TXT","CSV","XLS"];
  dlabel:boolean=true;
  username:any;
  //filelabel:boolean=true;
  constructor(private modalService: BsModalService,
             private ptService: PaypointTransactionService,
             private router:Router,
              private tokendetails:TokenStorageService) {
    this.uploadCreditFileForm = new FormGroup({
      paypointId: new FormControl('', Validators.required),
      paypointName: new FormControl('', Validators.required),
      period: new FormControl('', Validators.required),
      creditFile: new FormControl('', [FileValidator.validate])
    })
  }
  ngOnInit() {

    this.uploadCreditFileForm.get('creditFile').disable();
    this.username= this.tokendetails.getUsername();
  }  
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.uploadCreditFileForm.patchValue({
        paypointId: result[0].payPointId,
        paypointName: result[0].payPointName
      });
      console.log(this.uploadCreditFileForm.controls['paypointId'].value);
      this.ptService.getCreditFileName(this.uploadCreditFileForm.controls['paypointId'].value).
        subscribe(
          (response) => {
            this.creditFileName = response;
            console.log("creditFileName coming from db--->"+ this.creditFileName);
          },
          error => console.log(error)
        );
    });
  }

  enablefilelabel(){
    this.uploadCreditFileForm.get('creditFile').enable();
    this.uploadCreditFileForm.get('creditFile').reset();
  }

  handleFileInput(files: FileList) {
    console.log("stage 1 reading the input---->"+files);
    this.fileToUpload = files.item(0);
    console.log("stage 2 reading file item"+this.fileToUpload);
    let name = this.fileToUpload.name;
    console.log("reading actual file name ---->"+name);
    let extn = name.split(".").pop();
    if (name.length < 9) {
      alert("Invalid File");
      return false;
    }
    if (this.AllowedExtns.indexOf(extn) > -1) {
            console.log("yes file exists with following formats are .txt,.csv,.xls");
    } else {
      alert("Not a Valid File! Allowed File Formats are .txt,.csv,.xls");
      this.uploadCreditFileForm.reset();
      return false; 
    }

    let strTemp = name.substring(0, name.lastIndexOf("."));
    //console.log(strTemp);
    let crFile = strTemp.substring(0, strTemp.length - 4);
    //alert(crFile)
    let strMonth = strTemp.substring(strTemp.length - 4, strTemp.length - 2);

    let strYear = strTemp.substring(strTemp.length - 2, strTemp.length);
  
    let period = this.uploadCreditFileForm.controls['period'].value;//2019-03-01
    
    console.log(strTemp);
    console.log(crFile);
    console.log(strMonth);
    console.log(strYear);
    console.log(period);


  
    if (this.creditFileName != crFile) {
      alert("Credit File not belong to Paypoint ");
      this.resetuploadfile();
    }
  
    if (strYear != period.substring(2, 4)) {
      alert("File period (Year)is not matching with upload period");
      this.resetuploadfile();
    }
 
    if (strMonth != period.substring(5, 7)) {
      alert("File period (Month)is not matching with upload period");
     this.resetuploadfile();
    } 
  }
  private prepareSave(): any {
    let input = new FormData();
    input.append('creditFile', this.fileToUpload);
    input.append('formValue', JSON.stringify(this.uploadCreditFileForm.value));
    return input;
  }

  resetuploadfile(){
    this.uploadCreditFileForm.reset();
    // this.uploadCreditFileForm.get('creditFile').enable();
    // this.uploadCreditFileForm.get('period').enable();
  }

  
  onSubmit() {    
    const formModel = this.prepareSave();
    //console.log(formModel);
    this.ptService.uploadCreditFile(formModel,this.username).subscribe(
      (response) => {
      
        let uploadcreditfileresponse:any = response;
        console.log(uploadcreditfileresponse.message);
        console.log(response);
        this.uploadCreditFileForm.reset();
        this.uploadCreditFileForm.get('creditFile').disable();
      },
      (error) => {
        this.uploadCreditFileForm.reset();
        console.log(error.error.message)
        alert("Error occured While uploading the Credit File");
        this.uploadCreditFileForm.get('creditFile').disable();
      }
    ) 
  }
}
