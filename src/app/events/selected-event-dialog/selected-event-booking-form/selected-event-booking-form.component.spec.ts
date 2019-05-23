import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedEventBookingFormComponent } from './selected-event-booking-form.component';

describe('SelectedEventBookingFormComponent', () => {
  let component: SelectedEventBookingFormComponent;
  let fixture: ComponentFixture<SelectedEventBookingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedEventBookingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedEventBookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
