import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './services/auth-guard';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PagerService,GlobalServices, httpInterceptorProviders } from './services/index';
import {TokenStorageService} from './services/token-storage.service'
import { ModalModule } from 'ngx-bootstrap/modal';
import { StorageServiceModule} from 'angular-webstorage-service';
import { LoadingSpinnerComponent } from './services/loading-spinner/loading-spinner.component';
import { AuthHeaderInterceptor } from './services/auth-header-interceptor';




@NgModule({
  imports: [
    BrowserModule,
    StorageServiceModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    LoadingSpinnerComponent,

  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy   
  },
  PagerService,
  GlobalServices,
  TokenStorageService,
   {
    provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true 
   }
  
],
  entryComponents: [LoadingSpinnerComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
