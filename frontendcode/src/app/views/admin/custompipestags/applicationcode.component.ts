import { Pipe, PipeTransform } from '@angular/core';


// this code is used for developing customs pipe from displaying

@Pipe({ name: 'modulecode'

}) export class Applicationcode implements PipeTransform {

transform(input: any): any{ //string type

    if(input == 1){
        return 'CASHOFFICE MASTER';
    }
    if(input == 2){
        return 'CASHOFFICE TRANSACTION';
    }
    if(input == 3){
        return 'CASHOFFICE REPORTS';
    }
    if(input == 4){
        return 'PAYPOINT MASTER';
    }
    if(input == 5){
        return 'PAYPOINT TRANSACTION';
    }
    if(input == 6){
        return 'ALLOCATION';
    }
    if(input == 7){
        return 'PAYPOINT REPORTS';
    }

    if(input == 8){
        return 'ADMIN';
    }
    if(input == 9){
        return 'USER';

    }if(input == 10){
        return 'STANBIC HOST TO HOST';
    }

   
  
   

} }
