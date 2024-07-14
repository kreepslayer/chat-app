import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { PopoverComponent } from './components/header/popover/popover.component';
import { ChatComponent } from './components/chat/chat.component';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { FriendRequestsPopoverComponent } from './components/header/friend-requests-popover/friend-requests-popover.component';
import { FriendsComponent } from './components/friends/friends.component';
import { SavedComponent } from './components/saved/saved.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
    declarations: [
        HomePage,
        HeaderComponent,
        PopoverComponent,
        ChatComponent,
        FriendRequestsPopoverComponent,
        FriendsComponent,
        SavedComponent,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
    ],
})
export class HomePageModule {}
