import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodwebhomeComponent } from './foodwebhome.component';

describe('FoodwebhomeComponent', () => {
  let component: FoodwebhomeComponent;
  let fixture: ComponentFixture<FoodwebhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodwebhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodwebhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
