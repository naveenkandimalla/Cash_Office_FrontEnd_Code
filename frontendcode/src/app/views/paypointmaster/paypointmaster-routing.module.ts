import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebitfileTemplateAssignmentComponent } from './debitfile-template-assignment.component';
import { FileDesignerComponent } from './filedesigner.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paypoint Master'
    },
    children: [
      {
        path: 'debit-file-template-assignment',
        component: DebitfileTemplateAssignmentComponent,
        data: {
          title: 'Debit File Template Assignment'
        }
      },
      {
        path: 'filedesigner',
        component: FileDesignerComponent,
        data: {
          title: 'File Designer'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaypointmasterRoutingModule { }
