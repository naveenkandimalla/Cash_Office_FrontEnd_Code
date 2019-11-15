//sample data  350119,354460 all dde,bso records which are saved can be used for testing purpose
import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { apiURL } from '../../_nav';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators
]
})

@Component({
  templateUrl: 'bank-statement-posting.component.html'
})
export class BankStatementPostingComponent {

  detailInput = new FormGroup({
    bankstmtid: new FormControl('',Validators.required)  
  });
 
  detailInput1 = new FormGroup({
    posting: new FormControl('',Validators.required)
  });

  createdby:any;
  modifiedby:any;



  constructor(private http:HttpClient,private router:Router,
    private tokendetails:TokenStorageService){ }

   postingarray:any=['Cancel','Posting']
   postlabeldisable:boolean=true;
   bankstmtdetails:any;

   ngOnInit(){
     this.getsessionvalues();
   }
 
   // used for fetching login user details
  getsessionvalues(){
    this.createdby= this.tokendetails.getUsername();
    this.modifiedby=this.tokendetails.getUsername();
   }
   

  getbankstmtpostingdetails(bkstmtid){
    this.http.get(`${apiURL}/allocations/bankstmtposting?bankstmtid=${bkstmtid}`)
    .subscribe((result)=>{
      console.log(result)
      this.bankstmtdetails=result;
      if(this.bankstmtdetails.length==0){
        alert("no details found for this bank statment id")
      }else{
        this.postlabeldisable=false;
      }
      
    },(error)=>{
      console.log(error)
    })
  }

 
post(){
   let postingstatus = this.bankstmtdetails[0].postingstatus
  if(postingstatus=="P" || postingstatus == "p" || postingstatus=="C" || postingstatus == "c"){

        if(postingstatus=="P" || postingstatus == "p"){
          alert("record is already posted  so cannot be posted");
          this.clear();
        }

        if(postingstatus=="C" || postingstatus == "c"){
          alert("record is alredy in cancelled  so cannot be posted")
          this.clear();
        }
    }else{
      
          let posting = this.detailInput1.get('posting').value
          if(posting=="" || posting==null ){
            alert("posting field cannot be empty");
       
           }else{

            let Statementbalance= this.bankstmtdetails[0].stmtbalstatus

            if(Statementbalance=="B"){
              alert("No amount balance is avaliable into order to post a record");
              this.clear();
            }else{
              // alert("we are ready to post the record");
              this.insertrecrodinterfacepostingtable();
            }
           }
      }
  }

  //inserting the posting record details   into interface table
  insertrecrodinterfacepostingtable(){
   let username = this.createdby;
   let bankstmtid= this.bankstmtdetails[0].bankstmtid
   let transcation =  this.bankstmtdetails[0].paymentmode
   let createdby=this.createdby;
   let post = this.detailInput1.get('posting').value
   let postingstatus;
   if(post=="Cancel"){
     postingstatus='C'
   }else{
     postingstatus='P'
   }

  this.http.post(`${apiURL}/allocations/bankstmtposting/postingrecord?username=${username}`,{
   "bankstmtid":bankstmtid,
   "transcationcode":transcation,
   "createdby":createdby,
   "postingstatus":postingstatus
  })
  .subscribe((result)=>{
    //console.log(result)
    alert("successfully record is posted");
    this.clear();
  },(error)=>{
    
   console.log(error);
   alert("error occured while posting the error");

  })
  }


  Search(){
    let bankstmtid = this.detailInput.get('bankstmtid').value
    this.getbankstmtpostingdetails(bankstmtid);

  }
  clear(){
   this.detailInput.reset();
   this.detailInput1.reset();
   this.bankstmtdetails=null;
   this.postlabeldisable=true;
   this.ngOnInit();
  }

  exit(){
    window.location.href = "http://localhost:4200/#/dashboard" ; 
  }




}
