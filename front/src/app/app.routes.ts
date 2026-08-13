import { Routes } from '@angular/router';
import { UnauthGuard } from "@core/guards/unauth.guard";
import { AuthGuard } from "@core/guards/auth.guard";
import { MeComponent } from "@pages/me/me.component";
import { NotFoundComponent } from "@pages/not-found/not-found.component";
import { LoginComponent } from "@pages/auth/login/login.component";
import { RegisterComponent } from "@pages/auth/register/register.component";
import { ListComponent } from "@pages/sessions/list/list.component";
import { DetailComponent } from "@pages/sessions/detail/detail.component";
import { FormComponent } from "@pages/sessions/form/form.component";
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'register',
    canActivate: [UnauthGuard],
    component: RegisterComponent
  },
  {
    path: 'login',
    canActivate: [UnauthGuard],
    component: LoginComponent
  },
  {
    path: 'sessions',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ListComponent,
        data: { title: 'Sessions' },
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        data: { title: 'Sessions - detail' },
      },
      {
        path: 'create',
        canActivate: [AdminGuard],
        component: FormComponent,
        data: { title: 'Sessions - create' },
      },

      {
        path: 'update/:id',
        canActivate: [AdminGuard],
        component: FormComponent,
        data: { title: 'Sessions - update' },
      },
    ]
  },
  {
    path: 'me',
    canActivate: [AuthGuard],
    component: MeComponent
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];


