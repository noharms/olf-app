import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCombinationComponent } from './card-combination.component';

describe('CardCombinationComponent', () => {
  let component: CardCombinationComponent;
  let fixture: ComponentFixture<CardCombinationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCombinationComponent]
    });
    fixture = TestBed.createComponent(CardCombinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
