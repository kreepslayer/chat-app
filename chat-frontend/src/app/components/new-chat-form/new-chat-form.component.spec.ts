import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChatFormComponent } from './new-chat-form.component';

describe('NewChatFormComponent', () => {
  let component: NewChatFormComponent;
  let fixture: ComponentFixture<NewChatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewChatFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewChatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
