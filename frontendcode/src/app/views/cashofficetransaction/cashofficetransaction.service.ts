import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../_nav';

@Injectable({
  providedIn: 'root'
})

export class CashofficeTransactionService {

    constructor(private http: HttpClient) { }
    getPolicyDetails(Id): any {
      return this.http.get(apiURL + "/getPolicyDtls?Id="+Id);
    }  

  }
  