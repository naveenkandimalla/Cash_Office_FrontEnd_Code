import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {AuthHeaderInterceptor} from '../services/auth-header-interceptor';

export * from './pager.service';
export * from './globalservices';
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true }
];

