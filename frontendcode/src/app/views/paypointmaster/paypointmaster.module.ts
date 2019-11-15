import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaypointmasterRoutingModule } from './paypointmaster-routing.module';
import { DebitfileTemplateAssignmentComponent } from './debitfile-template-assignment.component';
import { FileDesignerComponent } from './filedesigner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaypointComponent } from './paypoint/paypoint.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../services';
import { FileValidator } from '../../customvalidators';


@NgModule({
  imports: [
    CommonModule,
    PaypointmasterRoutingModule, FormsModule, ReactiveFormsModule, ModalModule.forRoot()
  ],
  entryComponents: [
    PaypointComponent,
  ],
  declarations: [DebitfileTemplateAssignmentComponent,
    FileDesignerComponent,
    PaypointComponent, FileValidator],
  providers: [BsModalService, PagerService],
  exports:[PaypointComponent]
})
export class PaypointMasterModule { }
