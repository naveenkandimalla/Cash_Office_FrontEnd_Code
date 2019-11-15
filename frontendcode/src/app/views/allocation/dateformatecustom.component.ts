import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';


// this code is used for developing customs pipe from displaying

@Pipe({ name: 'datetocustom'}) 
export class DateformatecustomComponent implements PipeTransform {


 // 2018-07-31T18:30:00.000+0000
  transform(value : any, args? : any) : any {
    return value.substring(0, 10) ;
    }
  }
