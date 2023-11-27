import { Route } from '@angular/router';
import {ClientListComponent} from "./components/clients/client-list/client-list.component";
import {AddClientComponent} from "./components/clients/add-client/add-client.component";
import { EditClientComponent } from "./components/clients/edit-client/edit-client.component";

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
    {
        path: 'addclient',
        component: AddClientComponent
    },
    {
        path: 'getclient/:id',
        component: EditClientComponent
    }
];
