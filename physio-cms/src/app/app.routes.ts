import { Route } from '@angular/router';
import {AddClientComponent} from "./components/clients/add-client/add-client.component";
import { EditClientComponent } from "./components/clients/edit-client/edit-client.component";
import { ClientDetailsComponent } from "./components/clients/client-details/client-details.component";
import { ClientListComponent } from "./components/clients/client-list/client-list.component";

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: "/addclient",
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
    },
    {
        path: 'viewclient/:id',
        component: ClientDetailsComponent
    }
];
