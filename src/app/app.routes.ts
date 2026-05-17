import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VaultComponent } from './vault/vault.component';
import { FavoritesComponent } from './element/favorites/favorites.component';
import { LoginComponent } from './element/login/login.component';
import { CreditCardComponent } from './element/credit-card/credit-card.component';
import { GeneratorComponent } from './generator/generator.component';
import { EditPswComponent } from './vault/edit-psw/edit-psw.component';
import { IdentityComponent } from './element/identity/identity.component';
import { VistaPerfilComponent } from './vista-perfil/vista-perfil.component';
import { DirectoryComponent } from './directory/directory.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },
    {
        path:'home',
        component:HomeComponent
    },
    {
        path:'vault',
        component:VaultComponent,
    },
    {
        path:'vault/edit-password/:id',
        component:EditPswComponent
    },
    {
        path:'element',
        children:[
            {
                path:'identity',
                component:IdentityComponent
            },
            {
                path:'login',
                component:LoginComponent
            },
            {
                path:'credit-card',
                component:CreditCardComponent
            }
        ]
    },
    {
        path:'favorites',
        component:FavoritesComponent
    },
    {
        path:'generator',
        component:GeneratorComponent
    },
    {
        path:'profile',
        component:VistaPerfilComponent,
    },
    {
        path:'directories',
        component:DirectoryComponent,
    },
    {
        path:'**',
        redirectTo:'home',
    }
];
