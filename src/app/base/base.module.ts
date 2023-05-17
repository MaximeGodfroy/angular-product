import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ThemeToggleButtonComponent } from 'app/base/theme-toggle-button/theme-toggle-button.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ProductsComponent } from './products/products.component';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { ProductsAdminComponent } from './products-admin/products-admin.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    SidenavComponent,
    ThemeToggleButtonComponent,
    BreadcrumbComponent,
    ProductsComponent,
    ProductsAdminComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    TableModule,
    DataViewModule,
    PaginatorModule
  ],
  exports: [NavbarComponent, FooterComponent, SidenavComponent, BreadcrumbComponent, ProductsComponent, ProductsAdminComponent]
})
export class BaseModule {}
