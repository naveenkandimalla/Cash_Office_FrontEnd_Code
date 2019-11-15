// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
// Forms Component
import { FormsComponent } from './forms.component';
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';
// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

// Components Routing

import { GlobalServices } from '../../services';
import { queryReceiptComponent } from './query-receipt.component';
import { CashOfficeTransactionRoutingModule } from './cashofficetransaction-routing.module';
import { CancelpaymentReceiptComponent } from './cancelpaymentreceipt.component';
import { PrintbankslipComponent } from './print-depositslip.component';
import { PolicyComponent } from "./policy/policy.component";
import { cashofficeactivityComponent } from './cash-officeactivity.component';
import { CashTillComponent } from './cash-tillactivity.component';
import { PaymentreceiptComponent } from './payment-receipt.component';
import { RecieptPostingComponent } from './receipt-posting.component';
import { SecureLoanEnquireComponent } from './secure-loanenquire.component';
import { approvereceiptcancellationComponent } from './approve-receiptcancellation.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    CashOfficeTransactionRoutingModule
  ],
  entryComponents: [
    PolicyComponent,
  ],
  declarations: [
    queryReceiptComponent,
    CancelpaymentReceiptComponent,
    PrintbankslipComponent,
    cashofficeactivityComponent,
    CashTillComponent,
    PaymentreceiptComponent,
    PolicyComponent,
    RecieptPostingComponent,
    SecureLoanEnquireComponent,
    approvereceiptcancellationComponent,
    FormsComponent    
  ],providers:[GlobalServices,BsModalService
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true,
    // }
  ],
    exports:[PolicyComponent]
})
export class CashOfficeTransactionMasterModule { }
   