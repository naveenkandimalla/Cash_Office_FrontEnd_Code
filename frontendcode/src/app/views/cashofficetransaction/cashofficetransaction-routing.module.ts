import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { queryReceiptComponent } from './query-receipt.component' ;
import { CancelpaymentReceiptComponent } from './cancelpaymentreceipt.component';
import { PrintbankslipComponent } from './print-depositslip.component';
import {cashofficeactivityComponent } from './cash-officeactivity.component';
import { CashTillComponent } from './cash-tillactivity.component';
import { PaymentreceiptComponent } from './payment-receipt.component';
import { RecieptPostingComponent } from './receipt-posting.component';
import { SecureLoanEnquireComponent } from './secure-loanenquire.component';
import { approvereceiptcancellationComponent } from './approve-receiptcancellation.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
const routes: Routes = [
  {
    path: '',
    // component: CashOfficeReportsComponent, 
    data: { title: 'Cash Office Transactions' } ,

    children: [
      {
        path: 'QueryReciept',
        component: queryReceiptComponent,
        data: {
          title: 'Query Receipt'
        }

      },
        {
          path: 'CancelReciept',
        component: CancelpaymentReceiptComponent,
        data: {
          title: 'CancelReceipt'
        }
      },
      {
        path: 'cashofficeactivity',
      component: cashofficeactivityComponent,
      data: {
        title: 'cashofficeactivity'
      }
    },
    {
      path: 'ReceiptPosting',
    component: RecieptPostingComponent,
    data: {
      title: 'RecieptPosting'
    }
  },
  {
    path: 'Approvecancellation',
  component: approvereceiptcancellationComponent,
  data: {
    title: 'Approvecancellation'
  }
},
    {
      path: 'paymentreceipt',
    component: PaymentreceiptComponent,
    data: {
      title: 'paymentreceipt'
    }
  },
    {
      path: 'cashtillactivity',
    component: CashTillComponent,
    data: {
      title: 'cashtillactivity'
    }
  },
  {
    path: 'secureloanenquire',
  component: SecureLoanEnquireComponent,
  data: {
    title: 'secureloanenquire'
  }
},
      {
        path: 'PrintSlip',
      component: PrintbankslipComponent,
      data: {
        title: 'PrintSlip'
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
export class CashOfficeTransactionRoutingModule {}  
