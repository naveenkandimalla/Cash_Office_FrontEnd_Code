import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashierAssignmentComponent } from './cashier-assignment.component' ;
import { CollectionAppBranchComponent } from './collection-app-branch.component';
import { CollectionAppDetailComponent } from './collection-app-detail.component';
import { CollectionAppSummaryComponent } from './collection-app-summary.component';
import { DepositSlipComponent } from './deposit-slip.component';
import { ReceiptListingComponent } from './receipt-listing.component' ;
import { ReprintReceiptComponent } from './reprint-receipt.component' ;


const routes: Routes = [
  {
    path: '',
    // component: CashOfficeReportsComponent, 
    data: { title: 'Cash Office Reports' } ,

    children: [
      {
        path: 'cashier-assignment',
        component: CashierAssignmentComponent,
        data: {
          title: 'Cashier Assignment'
        }
      },
      {
        path: 'collection-branch',
        component: CollectionAppBranchComponent,
        data: {
          title: 'Collection - Application Branch'
        }
      },
      {
        path: 'collection-app-detail',
        component: CollectionAppDetailComponent,
        data: {
          title: 'Collection - Application Detail'
        }
      },
      {
        path: 'collection-app-summary',
        component: CollectionAppSummaryComponent,
        data: {
          title: 'Collection - Application Summary'
        }
      },
      {
        path: 'receipt-listing',
        component: ReceiptListingComponent,
        data: {
          title: 'Daily Receipt Listing'
        }
      },
      {
        path: 'deposit-slip',
        component: DepositSlipComponent,
        data: {
          title: 'Reprint Deposit Slip' 
        }
      },
      {
        path: 'reprint-receipt',
        component: ReprintReceiptComponent,
        data: {
          title: 'Reprint Receipt'
        }
      },
      {
        path: '**',
        redirectTo: '' /// dbg. TO-DO 404: Page Not Found component.
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashOfficeReportsRoutingModule {}  
