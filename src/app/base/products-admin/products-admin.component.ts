import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { isArray } from '@dwtechs/checkhard';
import { CrudItemOptions } from 'app/shared/utils/crud-item-options/crud-item-options.model';
import { TableLazyLoadEvent } from 'app/shared/ui/table/table-lazyload-event.model';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TableColumn } from '../../shared/ui/table/table-column.model';
import { ControlType } from 'app/shared/utils/crud-item-options/control-type.model';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss'],
})
export class ProductsAdminComponent implements OnInit, OnChanges {
  
  @ViewChild('dataTable') dataTable: Table;
  data$: Observable<Product[]>;
  selectedProducts: Product;
  @Input() public readonly config: CrudItemOptions[];
  @Input() public readonly editableRows: boolean = true;
  @Input() public readonly deletableRows: boolean = true;
  @Input() public readonly selectable: boolean;
  @Input() public readonly allowAdd: boolean;
  @Input() public readonly allowDelete: boolean;
  @Input() public readonly allowEdit: boolean;
  @Input() public readonly entity; // class of new entry
  @Input() public readonly lazy: boolean = false;
  @Input() public readonly totalRecords: number;
  @Input() public readonly multiSelect: boolean;
  @Output() saved: EventEmitter<Product> = new EventEmitter();
  @Output() deleted: EventEmitter<number[]> = new EventEmitter();
  @Output() lazyLoaded: EventEmitter<TableLazyLoadEvent> = new EventEmitter();

  public cols: TableColumn[];
  public selectedEntries = [];
  public columnsConfigDialogDisplayed = false;
  public exportDialogDisplay = false;
  public entryEditionDialogDisplayed = false;
  public editedEntry: Product;
  public creation: boolean;
  public ControlType = ControlType;

  constructor(private productsService: ProductsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue: config, previousValue: prevConfig } = changes.config ?? {};
    const configChanged = JSON.stringify(config) !== JSON.stringify(prevConfig);
    if (config && configChanged) {
      this.cols = this.getColumns();
    }
    const { currentValue: data$, previousValue: prevData } = changes.data$ ?? {};
    if (data$ && prevData) {
    }
  }

  ngOnInit(): void {
    this.data$ = this.productsService.getAllProducts();
  }

  public onLazyLoad(event: LazyLoadEvent) {
    const cleanEvent: TableLazyLoadEvent = {
      first: event.first,
      rows: event.rows,
      sortOrder: event.sortOrder as 1 | -1,
      sortField: event.sortField,
      filters: event.filters
      // filters: event.filters ? JSON.stringify(event.filters) : '' as any
    };
    this.lazyLoaded.emit(cleanEvent);
  }

  public onEdit(rowData: Product): void {
    this.editedEntry = {...rowData};
    this.creation = false;
    this.entryEditionDialogDisplayed = true;
  }

  public onDelete(id: number): void {
    this.deleted.emit([id]);
  }

  public onDeleteMultiple(): void {
    const ids = this.selectedEntries.map(entry => entry.id);
    this.deleted.emit(ids);
  }

  public manageColumns(): void {
    this.columnsConfigDialogDisplayed = true;
  }

  public onNew(): void {
    this.entryEditionDialogDisplayed = true;
    this.creation = true;
    this.editedEntry = new this.entity();
  }

  public onEditedEntrySave(editedEntry): void {
    this.saved.emit(editedEntry);
    this.editedEntry = null;
    this.entryEditionDialogDisplayed = false;
  }
  
  public onDeleteEntry(id: number): void{
    this.deleted.emit([id])
    this.entryEditionDialogDisplayed = false;
  }

  public hideDialog(): void {
    this.columnsConfigDialogDisplayed = false;
    this.entryEditionDialogDisplayed = false;
    this.exportDialogDisplay = false;
    this.editedEntry = null;
    this.selectedEntries = [];
  }

  public export():void{
    this.exportDialogDisplay = true;
  }

  private getColumns(): TableColumn[] {
    return this.config.map(item => {
      const renderedValue = (cellValue: unknown, isTooltip = false) => this.getRenderer(cellValue, item, isTooltip);
      const columnOptions = item.columnOptions;
      return {
        ...item,
        ...columnOptions,
        key: item.key.toString(),
        isList: item.controlType === 'table',
        isVisible: columnOptions.default,
        renderer: (cellValue: unknown) => renderedValue(cellValue),
        tooltip: cellValue => columnOptions.tooltip ? columnOptions.tooltip(cellValue) : renderedValue(cellValue, true),
        filterable: columnOptions.filterable !== false,
        sortable: columnOptions.sortable !== false,
      }
    });
  }

  private getRenderer(cellValue: unknown, control: CrudItemOptions, isTooltip: boolean): string {
    if (control.columnOptions.customCellRenderer) {
      return control.columnOptions.customCellRenderer(cellValue);
    }
    switch (control.controlType) {
      case ControlType.TABLE: {
        return this.tableCellRenderer(cellValue);
      }
      case ControlType.SELECT: {        
        return this.selectCellRenderer(cellValue, control);
      }
      case ControlType.MULTISELECT: {
        return this.multiselectCellRenderer(cellValue, control, isTooltip);
      }
      case ControlType.DATE: {
        return formatDate(cellValue as number, 'yyyy-MM-dd', 'en');
      }
      case ControlType.CHECKBOX: {
        return this.checkboxCellRenderer(cellValue, isTooltip);
      }
      default: {
        return `${cellValue}`;
      }
    }
  }

  private tableCellRenderer(cellValue: unknown): string {
    return this.isCellArray(cellValue) ? cellValue.length.toString() : '';
  }
  
  private selectCellRenderer(cellValue: unknown, column: CrudItemOptions): string {
    const option = this.getOption(column, cellValue);
    if (!option) return '';
    return option.label;
  }

  private multiselectCellRenderer(cellValue: unknown, column: CrudItemOptions, tooltip: boolean): string {
    if (this.isCellArray(cellValue)) {
      const separator = tooltip ? ', ': '';
      let values = cellValue.map(val => this.getOption(column, val)).filter(val => !!val);
      return values.map(val => {
        if (val.styleClass && !tooltip) {
          return `<i class="${val.styleClass}">${val.label}</i>`;
        }
        return val.label;
      }).join(separator);
    }
    return '';
  }

  private checkboxCellRenderer(cellValue: unknown, tooltip: boolean): string {
    if (tooltip) {
      return cellValue ? 'Yes' : 'No';
    }
    return cellValue ? '<i class="pi pi-check green"></i>' : '<i class="pi pi-times indigo"></i>';
  }

  private isCellArray(cellValue: unknown): cellValue is unknown[] {
    return cellValue && isArray(cellValue);
  }

  private getOption(column: CrudItemOptions, cellValue: unknown): SelectItem {
    return column.options.find(opt => opt.value === cellValue)
  }

}
