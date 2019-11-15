import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignRoleComponent } from './assign-role.component';
import { GroupMasterComponent } from './group-master.component';
import { PageAccessComponent } from './page-access.component' ;
import { ResetPasswordComponent } from './reset-password.component' ;
import { UserManagementComponent } from './user-management.component' ;

const routes: Routes = [
  {
    path: '',
    // component: UserManagementComponent, 
    data: { title: 'Admin' } ,

    children: [
      {
        path: 'assign-role',
        component: AssignRoleComponent,
        data: {
          title: 'Assign Role'
        }
      },
      {
        path: 'group-master',
        component: GroupMasterComponent,
        data: {
          title: 'Group Master'
        }
      },
      {
        path: 'page-access',
        component: PageAccessComponent,
        data: {
          title: 'Page Access'
        }
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password'
        }
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        data: {
          title: 'User Management' 
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
export class AdminRoutingModule {}  
