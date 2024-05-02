import { Component } from '@angular/core';
import { CurrentUserService } from '../../services/currentUser.service';
import type { User } from '../../models/user.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  messages = 15;
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
  constructor(public currentUserService: CurrentUserService) {}
  currentUser: User = {
    id: 0,
    userName: '',
    displayName: '',
    avatarURL: '',
    role: '',
  };
  ngOnInit() {
    this.currentUser = this.currentUserService.getCurrentUser();
    console.log(
      '🚀 ~ MainComponent ~ ngOnInit ~ this.currentUser:',
      this.currentUser
    );
  }
}
