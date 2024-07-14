import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsComponent } from './components/friends/friends.component';
import { SavedComponent } from './components/saved/saved.component';

const routes: Routes = [
    {
        path: '',
        component: HomePage,
        children: [
            { path: '', component: ChatComponent },
            // {
            //     path: ':id',
            //     component: ConnectionProfileComponent,
            // },
            // {
            //     path: 'chat/connections',
            //     component: ChatComponent,
            // },
            { path: 'friends', component: FriendsComponent },
            { path: 'saved', component: SavedComponent },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {}
