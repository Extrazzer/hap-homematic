/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalizationService } from 'src/app/service/localization.service';
import { SettingsValidator } from 'src/app/validators/validator';


@Component({
  selector: 'dropdownmenu',
  templateUrl: './dropdownmenu.component.html',
  styleUrls: ['./dropdownmenu.component.sass']
})
export class DropdownmenuComponent implements OnInit {


  private _dataSource: Observable<any[]>;
  private _selected: any;
  public validationError: string;

  @Input() set dataSource(newDs: Observable<any[]>) {
    this._dataSource = newDs;
    this._select(this.selected);
  }

  get dataSource(): Observable<any[]> {
    return this._dataSource;
  }

  @Input() set selected(newSel: any) {
    this._selected = newSel;
    this._select(this._selected);
  }

  @Input() set listSource(newList: any[]) {
    this.dataSource = of(newList);
  }

  get selected(): any {
    return this._selected;
  }


  @Input() id: string;
  @Input() keyLabel: string;
  @Input() keyId: string;
  @Output() selectedChanged = new EventEmitter();

  public selectedLabel: string;

  @Input() set validator(newValidator: SettingsValidator) {
    newValidator.result.resultChanged.subscribe(whatChanged => {
      if (whatChanged === this.id) {
        const message = (newValidator.getMessage(this.id));
        if (message) {
          this.validationError = this.localizationService.l18n(message.message, [message.objectName]);
        }
      }
    })
  }

  constructor(private localizationService: LocalizationService) {

  }


  ngOnInit(): void {
    this._select(this.selected);
  }

  itemData(element: any, key: string) {
    if (typeof element === 'object') {
      return element[key];
    } else {
      return element;
    }
  }

  _select(newId: number) {

    if ((newId !== undefined) && (this.dataSource !== undefined)) {
      this.dataSource.pipe(map(items => items.filter(item => this.itemData(item, this.keyId) === newId))
      ).subscribe(fItem => {
        if (fItem.length > 0) {
          this.selectedLabel = this.itemData(fItem[0], this.keyLabel)
          this.selectedChanged.next(fItem[0]);
        } else {
          this.selectedLabel = undefined;
        }
      })
    }
  }
}
