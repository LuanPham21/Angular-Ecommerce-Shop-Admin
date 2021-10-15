import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageProductsGroupComponent } from './manage-products-group/manage-products-group.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DialogModule} from 'primeng/dialog';
import {EditorModule} from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';

export const mainRoute: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo:'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'manage-products-group',
        component: ManageProductsGroupComponent,
      },
      {
        path: 'manage-categories',
        component: ManageCategoriesComponent,
      },
      {
        path: 'manage-products',
        component: ManageProductsComponent,
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
      },
      {
        path: 'manage-orders',
        component: ManageOrdersComponent,
      },
    ]
  }
]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(mainRoute),
    NgbModule,
    FormsModule,
    DialogModule,
    EditorModule,
    ButtonModule
  ],
  declarations: [MainComponent, DashboardComponent, ManageCategoriesComponent, ManageProductsGroupComponent, ManageProductsComponent, ManageUsersComponent, ManageOrdersComponent]
})
export class MainModule { }
