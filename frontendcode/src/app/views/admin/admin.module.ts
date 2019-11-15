import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// import { ButtonsComponent } from './buttons.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Admin Routing
import { AdminRoutingModule } from './admin-routing.module';

// Cash Office - ADMIN Module
import { AssignRoleComponent } from './assign-role.component';
import { GroupMasterComponent } from './group-master.component';
import { PageAccessComponent } from './page-access.component' ;
import { ResetPasswordComponent } from './reset-password.component' ;
import { UserManagementComponent } from './user-management.component' ;
import {AdminService} from './admin.service'
import { HttpModule } from '@angular/http';
import{Applicationcode} from './custompipestags/applicationcode.component';
import{Enableddisabled} from './custompipestags/enabledisabled.component'




@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule, ReactiveFormsModule,
    HttpModule
  ],
  declarations: [
    // ButtonsComponent,
    AssignRoleComponent,
    GroupMasterComponent,
    PageAccessComponent,
    ResetPasswordComponent,
    UserManagementComponent,Applicationcode,Enableddisabled
    
  ],
  providers:[AdminService]
})
export class AdminModule { }
