import { Route } from '@angular/router';
import {AddClientComponent} from "./components/clients/add-client/add-client.component";
import { EditClientComponent } from "./components/clients/edit-client/edit-client.component";
import { ClientDetailsComponent } from "./components/clients/client-details/client-details.component";
import { ClientListComponent } from "./components/clients/client-list/client-list.component";
import { AddAppointmentComponent } from './components/add-appointment/add-appointment.component';
import { ViewAppointmentsComponent } from './components/view-appointments/view-appointments.component';
import { MainComponent } from "./components/main/main.component";
import { AuthComponent } from "./auth/auth.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { AuthGuard } from "./auth/auth.guard";

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: "/auth",
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthComponent,
    },
    {
        path: 'home',
        component: MainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'search-clients',
        component: ClientListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'add-client',
        component: AddClientComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'get-client/:id',
        component: EditClientComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'view-client/:id',
        component: ClientDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'add-appointment',
        component: AddAppointmentComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'view-appointments',
        component: ViewAppointmentsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [AuthGuard]
    }
];
