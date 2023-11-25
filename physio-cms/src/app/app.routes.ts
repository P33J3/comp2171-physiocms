import { Route } from '@angular/router';
import {ClientListComponent} from "./components/clients/client-list/client-list.component";

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: "/home",
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: ClientListComponent
    },
];
