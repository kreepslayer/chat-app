import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
    constructor(
        public connectionProfileService: ConnectionProfileService,
        private chatService: ChatService
    ) {}

    allUsers: User[] = [];
    allUsersSubscription: Subscription;

    friends: User[] = [];
    friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});
    friendsSubscription: Subscription;

    ngOnInit() {
        this.allUsersSubscription = this.connectionProfileService
            .getAllUsers()
            .subscribe((users: User[]) => {
                this.allUsers = users;
            });
        this.friendsSubscription = this.chatService
            .getFriends()
            .subscribe((friends: User[]) => {
                this.friends = friends;
            });
    }

    friend = {
        userName: 'John Doe',
        imagePath: '',
    };

    focus() {
        let searchInput: HTMLInputElement | null =
            document.querySelector('#search');
        let searchPar = searchInput?.parentElement;
        if (searchInput) {
            searchPar?.classList.add('activeSearch');
        }
    }
    focusout() {
        let searchInput: HTMLInputElement | null =
            document.querySelector('#search');
        let searchPar = searchInput?.parentElement;
        if (searchInput) {
            searchPar?.classList.remove('activeSearch');
        }
    }

    searchFriends() {
        let searchInput: HTMLInputElement | null =
            document.querySelector('#search');

        if (searchInput) {
            let query = searchInput.value;
            if (query) {
                this.searchedFriends = this.allUsers.filter((user: User) => {
                    return user.userName
                        .toLowerCase()
                        .includes(query.toLowerCase());
                });
            } else {
                this.searchedFriends = this.allUsers;
            }
        }
    }
    searchedFriends: User[] = [];
    addFriend(friend: User) {
        console.log('add friend', friend);
        return this.connectionProfileService
            .addConnectionUser(friend.id)
            .pipe(take(1))
            .subscribe();
    }
}
