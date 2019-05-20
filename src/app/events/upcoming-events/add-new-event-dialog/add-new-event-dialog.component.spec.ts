import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEventDialogComponent } from './add-new-event-dialog.component';

describe('AddNewEventDialogComponent', () => {
  let component: AddNewEventDialogComponent;
  let fixture: ComponentFixture<AddNewEventDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewEventDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
