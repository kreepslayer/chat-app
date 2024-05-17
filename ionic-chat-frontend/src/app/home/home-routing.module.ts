import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ChatComponent } from './components/chat/chat.component';

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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {}
