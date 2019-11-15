import { Injectable } from '@angular/core';


import { HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { apiURL } from '../../_nav';

@Injectable({
    providedIn: 'root'
  })
  export class AllocationsService {
    constructor(private http: HttpClient) { }

// paypoint details of mostly used  details
getPayPointDetails() {
 return this.http.get(`${apiURL}/allocations/paypoint`)
        .map((response) => {
          return response })
      .catch(this.handleError)
     }

// fetching all paypointdetails
gettpaypointdetails(){
return this.http.get(`${apiURL}/allocations/electronicallocations/paypoint`)
      .map((response) => {
      return response})
      .catch(this.handleError);
    }

// fetching the details for excepted amount,status code
getpaypointcollectionhistory(pp){
  let paypointid = pp;
   return this.http.get(`${apiURL}/allocations/paypointcollectionhistory?paypointiddetails=`+paypointid)
        .map((response) => {
        return response})
        .catch(this.handleError);
  }

// fetching recpit details
getreceiptdetails(ppid,period){
  return this.http.get(`${apiURL}/allocations/paypointcollectionhistory/recepitdetails?p_Paypoint_Id=${ppid}&p_Period=${period}`)
      .map((response) => {
      return response })
    .catch(this.handleError);
    }

// used for pop bibo data 
getmigbobi(stmt){
  let bankstmt = stmt;
  return this.http.get(`${apiURL}/allocations/manualadjustmentvoucher/bibo?bankstmtnum=`+bankstmt)
        .map((response) => {
        console.log("service data");
        return response;})
      .catch(this.handleError);
    }

getpostingdetails(){
  return this.http.get(`${apiURL}/allocations/manualadjustmentvoucher/unpostingstatus`)
        .map((response) => {
        return response })
       .catch(this.handleError);
      }


// to handle the error
private handleError(error: Response){
console.error(error);
return Observable.throw(error);
}

  }