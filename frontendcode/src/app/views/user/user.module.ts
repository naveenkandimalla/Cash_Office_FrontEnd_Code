import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Cash Office - USER Module
import { UserRoutingModule } from './user-routing.module';
import { PassManagementComponent } from './pass-management.component' ;

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule
  ],
  declarations: [
    PassManagementComponent
  ]
})
export class UserModule { }
