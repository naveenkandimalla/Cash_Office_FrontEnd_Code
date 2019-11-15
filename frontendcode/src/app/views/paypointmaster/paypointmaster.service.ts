import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../_nav';

@Injectable({
  providedIn: 'root'
})
export class PaypointmasterService {
  

  constructor(private http: HttpClient) { }
  getAsgndPayPointDetails(): any {
    return this.http.get(apiURL + "/getAsgndPayPointDetails");
  }
  getPayPointDetails() {
    return this.http.get(apiURL + "/getPaypoints");
  }
  getPpAttributes() {
    return this.http.get(apiURL + "/getPaypointAttributes");
  }  
  assignTemplate(formData,createdby,modifiedby) {
    return this.http.post(`${apiURL}/assignDebitFileTemplate?createdby=${createdby}&modifiedby=${modifiedby}`, formData);
  }

  getFileDesignFields(){
    return this.http.get(apiURL + "/getFileDsgnFields");
  }
  postFileDetailsToPP(formData,createdby){
    return this.http.post(`${apiURL}/saveFileDesignToPP?createdby=${createdby}`, formData);
  }
  getAssignedFileDetails(){
    return this.http.get(apiURL +"/getAssignedFileDetails");
  }
  getAssignedFieldDetails(ppId){
    return this.http.get(apiURL +"/getAssignedFieldDetails?ppId="+ppId);//this will use request param at REST end
  }
  deleteFileField(id){
    return this.http.delete(apiURL +"/deleteFieldWithId/"+id);//this will use pathvariable at REST end
  }
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', 'http://localhost:8080/api/file/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get('http://localhost:8080/api/file/all');
  }
}
