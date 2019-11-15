import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CashOfficeReportsRoutingModule } from './cash-office-reports-routing.module';
import { CashierAssignmentComponent } from './cashier-assignment.component';
import { CollectionAppBranchComponent } from './collection-app-branch.component';
import { CollectionAppDetailComponent } from './collection-app-detail.component';
import { CollectionAppSummaryComponent } from './collection-app-summary.component';
import { DepositSlipComponent } from './deposit-slip.component';
import { ReceiptListingComponent } from './receipt-listing.component';
import { ReprintReceiptComponent } from './reprint-receipt.component';
@NgModule({
  imports: [
    CommonModule,
    CashOfficeReportsRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule, ReactiveFormsModule
  ],
  declarations: [
    CashierAssignmentComponent,
    CollectionAppBranchComponent,
    CollectionAppDetailComponent,
    CollectionAppSummaryComponent,
    DepositSlipComponent,
    ReceiptListingComponent,
    ReprintReceiptComponent
  ]
})
export class CashOfficeReportsModule {
}
