import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}

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

    searchFriends() {}
    searchedFriends: User[] = [
        {
            id: 1,
            userName: 'John Doe',
            imagePath: '',
        },
    ];
    addFriend(friend: User) {}
}
