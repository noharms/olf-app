import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenGamesTableComponent } from './open-games-table.component';

describe('OpenGamesTableComponent', () => {
  let component: OpenGamesTableComponent;
  let fixture: ComponentFixture<OpenGamesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenGamesTableComponent]
    });
    fixture = TestBed.createComponent(OpenGamesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
