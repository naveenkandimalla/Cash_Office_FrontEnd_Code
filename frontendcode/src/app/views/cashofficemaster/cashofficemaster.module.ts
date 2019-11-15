// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
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

// Components Routing
import { CashOfficeMasterRoutingModule } from './cashofficemaster-routing.module';
import { SetUpPaymentMethodComponent } from './setuppaymentmethod.component';
import { SetUpApplicationsComponent } from './setupapplications.component';
import { SetUpCashierComponent } from './setupcashier.component';
import { SetUpCashOfficeComponent } from './setupcashoffice.component';
import { AssignCashierComponent } from './assigncashier.component';
import { GlobalServices} from '../../services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CashOfficeMasterRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    SetUpCashierComponent,
    SetUpPaymentMethodComponent,
    SetUpApplicationsComponent,
    SetUpApplicationsComponent   ,
    SetUpCashOfficeComponent ,
    AssignCashierComponent
  ],providers:[GlobalServices]
})
export class CashOfficeMasterModule { }
