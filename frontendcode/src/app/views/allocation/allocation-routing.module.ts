import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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


const routes: Routes = [
  {
    path: '',
    data: { title: 'Allocation' } ,

    children: [
      {
        path: 'bank-statement-adjustment-voucher',
        component: BankStatementAdjustmentVoucherComponent,
        data: {
          title: 'Bankn Statement Adjustment voucher'
        }        
      },
      {
        path: 'bank-statement-posting',
        component: BankStatementPostingComponent, 
        data: {
          title: 'Bank Statement Posting'
        }
      },
      {
        path: 'bank-stop-order-processing',
        component: BankStopOrderProcessingComponent,
        data: {
          title: 'Bank Stop Order Processing'
        }
      },
      {
        path: 'direct-debit-processing',
        component: DirectDebitProcessingComponent,
        data: { 
          title: 'Direct Debit Processing'
        }
      },
      {
        path: 'electronic-allocation',
        component:ElectronicAllocationComponent,
        data: {
          title: 'Electronic Allocation'
        }
      },
      {
        path: 'manual-adjustment-voucher',
        component: ManualAdjustmentVoucherComponent,
        data: {
          title: 'Manual Adjustment Voucher'
        }        
      },
      {
        path: 'manual-allocation',
        component: ManualAllocationComponent,
        data: {
          title: 'Manual Allocation'
        }        
      },    
      {
        path: 'misallocation-correction',
        component: MisallocationCorrectionComponent,
        data: {
          title: 'MisAllocation Correction'
        }        
      },
      {
        path: 'partial-misallocation-correction',
        component: PartialMisallocationCorrectionComponent,
        data: { title: 'Partial MisAllocation Correction' }
        
      },
      {
        path: 'paypoint-collection-history',
        component: PaypointCollectionHistoryComponent,
        data: { title: 'PayPoint Collection History' }       
      },
      {
        path: 'paypoint-misallocation',
        component: PaypointMisallocationComponent,
        data: { title: 'PayPoint MisAllocation' }        
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
export class AllocationRoutingModule {}  
  