import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedEventEditFormComponent } from './selected-event-edit-form.component';

describe('SelectedEventEditFormComponent', () => {
  let component: SelectedEventEditFormComponent;
  let fixture: ComponentFixture<SelectedEventEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedEventEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedEventEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
