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
        component: MainComponent
    },
    {
        path: 'search-clients',
        component: ClientListComponent
    },
    {
        path: 'add-client',
        component: AddClientComponent
    },
    {
        path: 'get-client/:id',
        component: EditClientComponent
    },
    {
        path: 'view-client/:id',
        component: ClientDetailsComponent
    },
    {
        path: 'add-appointment',
        component: AddAppointmentComponent
    },
    {
        path: 'view-appointments',
        component: ViewAppointmentsComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent
    }
];
