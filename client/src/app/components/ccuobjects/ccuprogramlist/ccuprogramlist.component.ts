import { ArrayDataSource } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Models, Selectors } from 'src/app/store';


interface ListNode {
  name: string;
  id: string;
  pl1?: string;
  active: boolean;
  exists: boolean;
}

const LIST_DATA: ListNode[] = [];


@Component({
  selector: 'app-ccuprogramlist',
  templateUrl: './ccuprogramlist.component.html',
  styleUrls: ['./ccuprogramlist.component.sass']
})
export class CCUProgramlistComponent implements OnInit, OnDestroy {

  @Output() selectionChanged: EventEmitter<ListNode> = new EventEmitter();
  @Input() preselectedVariables: string[];
  dataSource = new ArrayDataSource(LIST_DATA);
  listData: ListNode[];
  searchText: string;
  private ngDestroyed$ = new Subject();

  constructor(
    public store: Store<Models.AppState>
  ) { }

  ngOnInit(): void {

    if (this.preselectedVariables === undefined) {
      this.preselectedVariables = [];
    }
    // we have to do this once cause the store will change on every selection
    this.store.select(Selectors.selectAllAppliances(Models.HapApplicanceType.Program))
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(hapdevices => {
        this.store.pipe(select(Selectors.selectAllCCUPrograms))
          .pipe(takeUntil(this.ngDestroyed$))
          .subscribe(ccuProgramList => {
            this.listData = [];
            ccuProgramList.forEach(program => {
              const exists = (hapdevices.filter(device => `${device.address}` === `${program.name}:0`).length > 0);
              const active = (this.preselectedVariables.indexOf(program.name) !== -1);
              this.listData.push({ id: program.name, name: program.name, active, exists })
            })
            this.fillList();
          })
      })
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  select(node): void {
    this.selectionChanged.emit(node);
  }

  fillList(): void {
    this.dataSource = new ArrayDataSource(this.listData);
  }

  sortData(event): void {
    console.log(event);
  }

}
