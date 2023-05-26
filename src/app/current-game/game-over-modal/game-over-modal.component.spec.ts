import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverModalComponent } from './game-over-modal.component';

describe('GameOverModalComponent', () => {
  let component: GameOverModalComponent;
  let fixture: ComponentFixture<GameOverModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameOverModalComponent]
    });
    fixture = TestBed.createComponent(GameOverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
