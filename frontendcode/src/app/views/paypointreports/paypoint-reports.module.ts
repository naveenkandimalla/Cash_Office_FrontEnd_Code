import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { PaypointReportsRoutingModule } from './paypoint-reports-routing.module';

import { OversandUndersComponent } from './oversandunders.component' ;
import { rejectionsComponent } from './rejections.component' ;
import { UnspecifiedBankComponent } from './unspecified-bank.component' ;
import { UnspecifiedGsoesoComponent } from './unspecified-gsoeso.component' ;
import { BankStatementComponent } from './bank-statement.component' ;
import { paypointSummaryComponent } from './paypoint-summary.component' ;
import { ManualAdjustmentComponent } from './manual-adjustment.component' ;
import { StatementAllocationComponent } from './statement-allocation.component';
import { unallocatedCashRecieptsComponent } from './unallocated-cashReciepts.component' ;
import { unmatchedCreditComponent } from './unmatchedCredit.component' ;
import { recieptAllocationStatusComponent} from './reciept-allocation-status.component' ;

@NgModule({
  declarations: [
    OversandUndersComponent,
    rejectionsComponent,
    UnspecifiedBankComponent,
    UnspecifiedGsoesoComponent,
    BankStatementComponent,
    paypointSummaryComponent,
    ManualAdjustmentComponent,
    StatementAllocationComponent,
    unallocatedCashRecieptsComponent,
    unmatchedCreditComponent,
    recieptAllocationStatusComponent
  ],

  imports: [
    PaypointReportsRoutingModule,
    CommonModule,
    BsDropdownModule.forRoot(),
    FormsModule, ReactiveFormsModule
  ]
})
export class PaypointReportsModule { }
