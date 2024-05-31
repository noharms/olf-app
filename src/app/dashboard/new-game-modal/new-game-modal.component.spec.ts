import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameModalComponent } from './new-game-modal.component';

describe('NewGameModalComponent', () => {
  let component: NewGameModalComponent;
  let fixture: ComponentFixture<NewGameModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewGameModalComponent]
    });
    fixture = TestBed.createComponent(NewGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
