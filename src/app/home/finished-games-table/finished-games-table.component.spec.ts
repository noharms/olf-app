import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedGamesTableComponent } from './finished-games-table.component';

describe('FinishedGamesTableComponent', () => {
  let component: FinishedGamesTableComponent;
  let fixture: ComponentFixture<FinishedGamesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinishedGamesTableComponent]
    });
    fixture = TestBed.createComponent(FinishedGamesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
