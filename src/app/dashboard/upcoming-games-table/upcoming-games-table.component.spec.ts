import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingGamesTableComponent } from './upcoming-games-table.component';

describe('UpcomingGamesTableComponent', () => {
  let component: UpcomingGamesTableComponent;
  let fixture: ComponentFixture<UpcomingGamesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingGamesTableComponent]
    });
    fixture = TestBed.createComponent(UpcomingGamesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
