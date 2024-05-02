//@ts-nocheck
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
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

  constructor(private router: Router) {}
  message: string = ``;
  ngOnInit() {
    let main = document.querySelector('.main-main');
    let last: HTMLElement | null = document.querySelector('.last');
    console.log('🚀 ~ MainContentComponent ~ ngOnInit ~ last:', last);
    console.log('🚀 ~ MainContentComponent ~ ngOnInit ~ main:', main);
    if (last && main) {
      document.querySelector('.last')?.scrollIntoView();
    }
    //TODO scroll to bottom
  }
}
