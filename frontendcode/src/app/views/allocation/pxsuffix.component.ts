
import { Pipe, PipeTransform } from '@angular/core';


// this code is used for developing customs pipe from displaying

@Pipe({ name: 'pxsuffix'

}) export class pxsuffix implements PipeTransform {

transform(input: string): string{ //string type

    if(input == 'A'){
        return 'Premium Allocation';
    }
   
   
   else{
    return 'Reverse Offset';
   }
   

} }

