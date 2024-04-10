import { Component } from '@angular/core';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  message: string = '';
  sendMessage() {}
  focus() {
    let searchInput: HTMLInputElement | null =
      document.querySelector('#message');
    let searchPar = searchInput?.parentElement;
    if (searchInput) {
      searchPar?.classList.add('activeSearch');
    }
  }
  focusout() {
    let searchInput: HTMLInputElement | null =
      document.querySelector('#message');
    let searchPar = searchInput?.parentElement;
    if (searchInput) {
      searchPar?.classList.remove('activeSearch');
    }
  }
}
