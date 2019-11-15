import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import {TokenStorageService} from './token-storage.service'



@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor{

constructor(private authService:TokenStorageService){

}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        let token =  this.authService.getToken();
        
        console.log("initiall login"+token);
        let tokenizedReq = req;
        if(token != null){
            tokenizedReq = req.clone(
                {
                  headers: req.headers.set('Authorization', 'Bearer '+this.authService.getToken())
                }
              )
        }
        
        return next.handle(tokenizedReq);
      }

}