import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalServices } from '../../services/globalservices';
import { apiURL } from '../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';



@Component({
  templateUrl: 'setupapplications.component.html'
})

export class SetUpApplicationsComponent {
  currAppCode: string;
  currAppDesc: string;
  currAppId: number; 
  marked = false;
  applications: any;
  activities: any;
  setupAppActivity: FormGroup;
  userName:any;
  userId:any;
  myForm: FormGroup;
  savelabel:boolean=true;
  addactivitylabel:boolean=true;

  constructor(private http: HttpClient, private gs: GlobalServices,private fb: FormBuilder,
                private router:Router,
                private tokendetails:TokenStorageService) {


    this.setupAppActivity = new FormGroup(
      {
        applicationCode: new FormControl('', Validators.required),
        applicationDesc: new FormControl('', Validators.required),
        enabled: new FormControl('', Validators.required)
      }
    )
  }
  
  ngOnInit() {
    //Service Call to get all Application details and display in Table
    this.gs.getApplications().subscribe(
      (data) => {
        this.applications = data;
      });

    this.userName =this.tokendetails.getUsername();

    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })
  }

  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  addCorrection() {
    const correction = this.fb.group({ 
      appActivityCode:[],
      appActivityDesc: [],
      enabled: []
    })
    this.correctionForms.push(correction);
    this.savelabel=false;
  }

  // enabling the add activity label only if we have enter required information
  enablingactivitylable(){
    let applicationdesc =  this.setupAppActivity.get('applicationDesc').value;
   if(applicationdesc !='' && applicationdesc !=null && applicationdesc !=undefined){
     this.addactivitylabel=false;
   }else{
    this.addactivitylabel=true;
   }

  }

  //To Assign the  all Application details to the fields
  fetchActivities(appCode, appDesc, appId,enabled) {
    this.setupAppActivity.patchValue({
      applicationCode: appCode,
      applicationDesc: appDesc,
      enabled:enabled=='1'?true:false
    })
    this.http.get(apiURL + `/getActivities?appid=${appId}`).subscribe(
      (response) => {
        this.activities = response;
        console.log(response);
        if(this.activities.length>0){
          this.savelabel=false;
          this.addactivitylabel=false;
        }
      }
    );
  }



 save(){
console.log(this.myForm.controls['corrections'].value);
  this.saveApplication(); 

  if(this.activities.length > 0){
    this.updateappactvity();
  }
  this.clear();
}

 

 
  // save new record into application 
  applicationdata:any
  saveApplication(){
    if(this.setupAppActivity.get('enabled').value==true){
      this.setupAppActivity.controls['enabled'].setValue('1');
    }else{
      this.setupAppActivity.controls['enabled'].setValue('0');
    }
    this.http.post(apiURL + `/saveApplication?createdby=${this.userName}`, this.setupAppActivity.value).subscribe(
      (result)=>{
        console.log("below result is from t_application");
          this.applicationdata=result;
         if(this.applicationdata[0].appId>0){
            this.saveActivity(this.applicationdata[0].appId);
         }
      },(error)=>{
        console.log(error);
        alert("error occured while insert new record");
      }
    );
  }


  //To save the all application details
  saveActivity(appid) {
    let obs = this.http.post(apiURL + `/saveActivity?appid=${appid}&createdby=${this.userName}`, this.myForm.controls['corrections'].value);
    obs.subscribe((response) => {
      console.log(response);
      let appactivity = response;
      if(appactivity[0]>0){
        alert("Activity has been successfully saved");
      }
      this.clear();
    }, (error) => {
      alert("Error while saving the Application/Activity");
    })
  }


  //updating the exact position 
  updatestatus(i){
    
    if(this.activities[i].enabled=='1'){
      this.activities[i].enabled='0'
    }else{
      this.activities[i].enabled='1'
    }
    
  }


  // update appactivity
 updateappactvity(){

   this.http.post(apiURL +`/updateappactivity?modifiedby=${this.userName}`,this.activities).subscribe(
     (result)=>{
       console.log(result);
       alert("records are updated successfully")
     },(error)=>{
       console.log(error);
     }
   )
 }
 



  //To clear the form group values
  clear() {
    this.setupAppActivity.reset(); 
    this.activities=null;
    this.ngOnInit();
    this.applicationdata=null
    this.savelabel=true;
    this.addactivitylabel=true;
  }

  //To fetch the values and assign to the fields
  search(value) {
    let appl = this.applications.filter(app => app.applicationCode == value.toUpperCase());
    this.fetchActivities(appl[0].applicationCode, appl[0].applicationDesc, appl[0].appId,appl[0].enabled);
  }
} 
