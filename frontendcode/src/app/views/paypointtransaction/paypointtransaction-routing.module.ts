import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateDebitfileComponent } from './generate-debitfile/generate-debitfile.component';
import { SplitMergeDebitfileComponent } from './split-merge-debitfile/split-merge-debitfile.component';
import { SplitMergeSearchComponent } from './split-merge-search/split-merge-search.component';
import { UploadCreditfileComponent } from './upload-creditfile/upload-creditfile.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paypoint Transaction'
    },
    children: [
      {
        path: 'generate-debitfile',
        component: GenerateDebitfileComponent,
        data: {
          title: 'Generate Debit File'
        }
      },
      {
        path: 'split-merge-debitfile',
        component: SplitMergeDebitfileComponent,
        data: {
          title: 'Split/Merge Debitfile'
        }
      },
      {
        path: 'split-merge-search',
        component: SplitMergeSearchComponent,
        data: {
          title: 'Split/Merge Search'
        }
      },
      {
        path: 'upload-creditfile',
        component: UploadCreditfileComponent,
        data: {
          title: 'Upload Creditfile'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaypointTransactionRoutingModule { }
