import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './services/auth-guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    data: {
      title: 'Home',
      roles: ["ROLE_USER"]
    },
    children: [
      {
        path: 'cashofficemaster',
        canActivateChild: [AuthGuard],
        loadChildren: './views/cashofficemaster/cashofficemaster.module#CashOfficeMasterModule',
        data: { roles: ["ROLE_USER"] }
      }, 
       {
        path: 'allocation',
        canActivateChild: [AuthGuard],
        loadChildren: './views/allocation/allocation.module#AllocationModule',
        data: { roles: ["ROLE_USER"] } 
      },
    
      {
        path: 'cashofficereports',
        canActivateChild: [AuthGuard],
        loadChildren: './views/cashofficereports/cash-office-reports.module#CashOfficeReportsModule',
        data: { roles: ["ROLE_USER"] }
      },
      {
        path: 'paypointmaster',
        canActivateChild: [AuthGuard],
        loadChildren: './views/paypointmaster/paypointmaster.module#PaypointMasterModule',
        data: { roles: ["ROLE_USER"] }
      },
      {
        path: 'cashofficetransaction',
        canActivateChild: [AuthGuard],
        loadChildren: './views/cashofficetransaction/cashofficetransaction.module#CashOfficeTransactionMasterModule',
        data: { roles: ["ROLE_SR_CASHIER"] }
      },
      {
        path: 'paypointtransaction',
        canActivateChild: [AuthGuard],
        loadChildren: './views/paypointtransaction/paypointtransaction.module#PaypointTransactionModule',
        data: { roles: ["ROLE_USER"] }
      },
      {
        path: 'paypoint-reports',
        canActivateChild: [AuthGuard],
        loadChildren: './views/paypointreports/paypoint-reports.module#PaypointReportsModule',
        data: { roles: ["ROLE_USER"] }
      },
      {
        path: 'admin',
        canActivateChild: [AuthGuard],
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { roles: ["ROLE_ADM_CASHOFFICE"] }
      },
      {
        path: 'dashboard',
        canActivateChild: [AuthGuard],
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        data: { roles: ["ROLE_ADMIN"] } 
      },
      // {
      //   path: 'charts',
      //   canActivateChild: [AuthGuard],
      //   loadChildren: './views/chartjs/chartjs.module#ChartJSModule',
      //   data: { roles: ["ROLE_USER"] }
      // },
      // {
      //   path: 'icons',
      //   canActivateChild: [AuthGuard],
      //   loadChildren: './views/icons/icons.module#IconsModule'
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: './views/notifications/notifications.module#NotificationsModule'
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: './views/widgets/widgets.module#WidgetsModule'
      // }
    ]
  },
    { 
      path: '**', 
      redirectTo: 'dashboard' 
    }
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
