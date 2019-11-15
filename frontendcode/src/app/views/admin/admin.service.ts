
import {Injectable} from '@angular/core';

import { HttpClient, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Users } from './users';
import { apiURL } from '../../_nav';




@Injectable()
export class AdminService{



     
    constructor(private httpservice:HttpClient){}
 
    //code for getting all the users from USER table
    getallusers(){         
    return this.httpservice.get(`${apiURL}/admin/usermanagement`)
           .map((response) => {
            return response })
            .catch(this.handleError);
    }


    getallroledetails(){
    return this.httpservice.get(`${apiURL}/admin/roledetails`)
           .map((responsegroup) => {
                 return responsegroup})
           .catch(this.handleError);
    }

    // code for updating the users password 
    resetuserspassword(userfs,userdetail,userid){
    return this.httpservice.put(`${apiURL}/admin/usermanagement/passwordreset?username=${userfs}&userid=${userid}`,userdetail)
        .map((responsegroup) => {
         return responsegroup})
        .catch(this.handleError);
    }
  

    getallbranchnames(){
    return this.httpservice.get(`${apiURL}/admin/branchnames`)
           .map((responsegroup: Response) => { 
           return responsegroup})
           .catch(this.handleError);
    }
 
//     getallstmthrd():Observable<any>{
// console.log("admin service");
// let code =353423;
//         return this.httpservice.get('http://192.168.1.118:9090/CashOffice-Test/api/allocations/stmt/DetReversals')
//         .map((responsegroup: Response) => { console.log(responsegroup); return responsegroup.json(); })
//         .catch(this.handleError);
//     }
    getstmthdrlist():Observable<any>{       
  
        return this.httpservice.get(`${apiURL}/allocations/stmt/DetReversals`)
             .map((response) => {
              return response})
            .catch(this.handleError);

    }




  // to handle the error
  private handleError(error: Response){
    console.error(error);
    return Observable.throw(error);
}



}