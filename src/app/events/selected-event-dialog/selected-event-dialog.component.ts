import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService, AppState, ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'epsilon-selected-event-dialog',
  templateUrl: './selected-event-dialog.component.html',
  styleUrls: ['./selected-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedEventDialogComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationSvc: NotificationService,
    public dialogRef: MatDialogRef<SelectedEventDialogComponent>,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
