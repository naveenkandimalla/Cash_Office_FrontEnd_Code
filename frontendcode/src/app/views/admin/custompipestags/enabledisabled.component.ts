import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'enabledtag'

})

export class Enableddisabled implements PipeTransform {

transform(input: any): any{ //string type

    if(input == "1"){
        return "True"
    }else{
        return "False"
    }

} }