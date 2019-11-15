import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// import { ButtonsComponent } from './buttons.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Admin Routing
import { AllocationRoutingModule } from './allocation-routing.module';

// Cash Office - ALLOCATION Module
import { ElectronicAllocationComponent } from './electronic-allocation.component';
import { BankStatementAdjustmentVoucherComponent} from './bank-statement-adjustment-voucher.component';
import { BankStatementPostingComponent } from './bank-statement-posting.component';
import { BankStopOrderProcessingComponent } from './bank-stop-order-processing.component';
import { DirectDebitProcessingComponent } from './direct-debit-processing.component' ;
import { ManualAdjustmentVoucherComponent } from './manual-adjustment-voucher.component' ;
import { ManualAllocationComponent } from './manual-allocation.component' ;
import { MisallocationCorrectionComponent } from './misallocation-correction.component' ;
import { PartialMisallocationCorrectionComponent } from './partial-misallocation-correction.component' ;
import { PaypointCollectionHistoryComponent } from './paypoint-collection-history.component';
import { PaypointMisallocationComponent } from './paypoint-misallocation.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { AdminService } from '../admin/admin.service';
import { HttpModule } from '@angular/http';
import { PaypointComponent } from './paypoint/paypoint.component';
import{BiboComponent} from './bibo/Bibo.component';
import {TpaypointComponent} from './tpaypoint/tpaypoint.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../services';
import{AllocationsService} from './allocations.service'
import{pxsuffix} from './pxsuffix.component'
import{DateformatecustomComponent} from './dateformatecustom.component'
import{Policystatusidcustompipe} from './policystatusidcustompipe.component'
import{AccountinfoComponent} from './accountinfo/Accountinfo.component'

@NgModule({
  imports: [
    CommonModule,
    AllocationRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule, ReactiveFormsModule
    , TabsModule,HttpModule
  ],
  declarations: [
    ElectronicAllocationComponent,
    BankStatementAdjustmentVoucherComponent,
    BankStatementPostingComponent,
    BankStopOrderProcessingComponent,
    DirectDebitProcessingComponent,
    ManualAdjustmentVoucherComponent,
    ManualAllocationComponent,
    MisallocationCorrectionComponent,
    PartialMisallocationCorrectionComponent,
    PaypointCollectionHistoryComponent,
    PaypointMisallocationComponent,
    PaypointComponent ,BiboComponent,pxsuffix,DateformatecustomComponent,Policystatusidcustompipe,TpaypointComponent,AccountinfoComponent
  ],entryComponents: [
    PaypointComponent,BiboComponent,TpaypointComponent,AccountinfoComponent
  ],
  providers:[AdminService,BsModalService, PagerService,AllocationsService],
  exports:[PaypointComponent,TpaypointComponent,AccountinfoComponent]
})
export class AllocationModule { }
