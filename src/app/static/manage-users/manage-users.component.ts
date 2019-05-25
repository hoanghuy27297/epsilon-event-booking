import { UserList } from './manage-user.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../../core/core.state';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, selectUser, selectUserId } from '@app/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { User, IUser } from '@app/shared/models/user.model';
import { map, takeUntil } from 'rxjs/operators';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog
} from '@angular/material';
import { selectUserList } from './manage-user.selector';
import { ManageUserDialogComponent } from './manage-user-dialog/manage-user-dialog.component';

@Component({
  selector: 'epsilon-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  user$: Observable<User>;
  dataSource: MatTableDataSource<IUser> = new MatTableDataSource();
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns: string[] = ['name', 'email', 'position', 'role', 'buttons'];
  userList$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject();
  userId: string = '';

  constructor(
    private store: Store<AppState>,
    private db: AngularFirestore,
    private dialog: MatDialog
  ) {
    this.user$ = this.store.pipe(
      select(selectUser),
      map(user => user)
    );

    this.store
      .pipe(select(selectUserId))
      .subscribe(state => (this.userId = state));

    this.userList$ = this.store.pipe(select(selectUserList));
  }

  ngOnInit() {
    this.onGetAllUser();

    this.userList$.pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
      if (result && result.users) {
        this.dataSource = new MatTableDataSource(result.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onGetAllUser() {
    this.db
      .collection('users')
      .snapshotChanges()
      .subscribe(result => {
        let tableData: IUser[] = [];
        result.forEach(data => {
          const user = new User(data.payload.doc.data(), data.payload.doc.id);
          tableData = [user.toJSON(), ...tableData];
        });
        this.store.dispatch(new UserList(tableData));
      });
  }

  onManageUser(type: string, data?: any): void {
    if (type === 'delete') {
      this.dialog.open(ManageUserDialogComponent, {
        width: '350px',
        data: { type: 'delete', data }
      });
    } else if (type === 'edit') {
      this.dialog.open(ManageUserDialogComponent, {
        width: '65%',
        data: {
          type: 'edit',
          data
        }
      });
    } else {
      this.dialog.open(ManageUserDialogComponent, {
        width: '65%',
        data: { type: 'add', data: {} }
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
