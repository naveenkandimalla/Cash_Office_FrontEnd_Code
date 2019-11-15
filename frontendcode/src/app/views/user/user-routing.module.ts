import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassManagementComponent } from './pass-management.component' ;

const routes: Routes = [
  {
    path: '',
    component: PassManagementComponent, 
    data: { title: 'User' } ,

    children: [
      {
        path: 'pass-mgt',
        component: PassManagementComponent,
        data: {
          title: 'Password Management' 
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
export class UserRoutingModule {}  
