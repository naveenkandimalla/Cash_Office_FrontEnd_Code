import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, CanActivateChild } from '@angular/router';
import {TokenStorageService} from './token-storage.service';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate,CanActivateChild {
  
  
    constructor(
        private router: Router,
        private tokendetails:TokenStorageService   
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let loginstatus:boolean  = this.isAuthenticated();
        let roles = this.tokendetails.getAuthorities();
        if(loginstatus==true){
            console.log(roles);   
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
             
        let Authorities = this.tokendetails.getAuthorities();
        console.log(Authorities);
        let roledetails:string[]=route.data.roles;
        let rolestatus:boolean=false;
         console.log(state.url)
        let _url:String[]=[];
        state.url.split("/").forEach(element => {
                if(element !=''){
                    _url.push(element);
                }
                
        });

        // used for authenicating  admin users access
       if(_url[0]=="admin"){
         roledetails.forEach((element)=>{
                 if(Authorities.indexOf(element) > -1){
                    rolestatus=true;
                   }
            });

            if(rolestatus==false){
                alert("User Does Not Have Authority To Access This Page ");
                this.router.navigate(['/dashboard']);
                return false;
            }
       }


      // used for authenicating  cashofficetransaction users access
       if(_url[0]=="cashofficetransaction"){
        roledetails.forEach((element)=>{
            if(Authorities.indexOf(element) > -1){
               rolestatus=true;
              }
       });
        
       
       if(rolestatus==false){
        alert("User Does Not Have Authority To Access This Page ");
        this.router.navigate(['/dashboard']);
        return false;
          }

       }








       return true;
  }
    
   

        
  isAuthenticated(){
    const token =  this.tokendetails.getToken();
    const currentUser = this.tokendetails.getUsername();
    if (currentUser !=null && token !=null ) {
            return true;
    }else{
             return false;
    }
   }
}