import { Routes } from '@angular/router';
import { UnauthGuard } from "@app/core/guards/unauth.guard";
import { AuthGuard } from "@app/core/guards/auth.guard";
import { MeComponent } from "@app/pages/me/me.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { LoginComponent } from "@app/pages/auth/login/login.component";
import { RegisterComponent } from "@app/pages/auth/register/register.component";
import { ListComponent } from "@app/pages/sessions/list/list.component";
import { DetailComponent } from "@app/pages/sessions/detail/detail.component";
import { FormComponent } from "@app/pages/sessions/form/form.component";

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
        component: FormComponent,
        data: { title: 'Sessions - create' },
      },

      {
        path: 'update/:id',
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


