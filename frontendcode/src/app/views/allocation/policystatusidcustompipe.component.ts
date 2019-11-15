import { Pipe, PipeTransform } from '@angular/core';


// this code is used for developing customs pipe from displaying

@Pipe({ name: 'Policystatusidcustompipe'

}) export class Policystatusidcustompipe implements PipeTransform {

transform(input: any): string{ //string type

    if(input == '1'){
        return 'Inforce';
    }
   
   
   if(input == '2'){
    return 'Lapsed';
   }
   

} }