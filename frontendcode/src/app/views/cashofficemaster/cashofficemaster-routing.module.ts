import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetUpCashierComponent } from './setupcashier.component';
import { SetUpPaymentMethodComponent } from './setuppaymentmethod.component';
import { SetUpApplicationsComponent } from './setupapplications.component';
import { SetUpCashOfficeComponent } from './setupcashoffice.component';
import { AssignCashierComponent } from './assigncashier.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'CashOffice Master'
    },
    children: [
      {
        path: 'setupcashier',
        component: SetUpCashierComponent,
        data: {
          title: 'Setup-Cashier'
        }
      },
      {
        path: 'setuppaymentmethod',
        component: SetUpPaymentMethodComponent,
        data: {
          title: 'Setup-PaymentMethod'
        }
      },
      {
        path: 'setupapplications',
        component: SetUpApplicationsComponent,
        data: {
          title: 'Setup-Applications'
        }
      },
      {
        path: 'setupcashoffice',
        component: SetUpCashOfficeComponent,
        data: {
          title: 'Setup-CashOffice'
        }
      },
      {
        path: 'assigncashier',
        component: AssignCashierComponent,
        data: {
          title: 'Assign-Cashier'
        }
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashOfficeMasterRoutingModule {}
