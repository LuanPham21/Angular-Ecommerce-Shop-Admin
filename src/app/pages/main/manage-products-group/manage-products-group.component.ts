import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, NgForm } from '@angular/forms';
import { NhomSanPham } from 'src/app/shared/models/NhomSanPham';

@Component({
  selector: 'app-manage-products-group',
  templateUrl: './manage-products-group.component.html',
  styleUrls: ['./manage-products-group.component.css']
})
export class ManageProductsGroupComponent extends BaseComponent implements OnInit {
  public products_group:any;
  public product_group:any;
  public page = 1;
  public pageSize = 3;
  public totalItems:any;
  public formsearch: any;
  isEdit: boolean = false;
  constructor(private fb: FormBuilder, private httpclient: HttpClient, injector: Injector, private route: ActivatedRoute, private router: Router) {
    super(injector);
    this.product_group = new NhomSanPham();
  }
  
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenNhom': ['']
    });
    this.search();
  }
  search() {
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/NhomSanPham/search', { page: this.page, pageSize: this.pageSize, tenNhom: this.formsearch.get('tenNhom').value }).takeUntil(this.unsubscribe).subscribe(res => {
      this.products_group = res.data;
      this.totalItems = res.totalItems;
      this.pageSize = res.pageSize;
    });
  }
  loadPage(page) { 
    this._route.params.subscribe(params => {
      this._api.post('/api/NhomSanPham/search', { page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
        this.products_group = res.data;
        this.totalItems = res.totalItems;
      }, err => { });       
    });   
  }
  
  displayAdd: boolean = false;
  showAdd() {
    this.displayAdd = true;
  }
  resetform(form) {
    if (form != null)
    form.resetForm();
  }
  
  AddNew(form: NgForm) {
    console.log(form.value);
    try {
      this._api.post('/api/NhomSanPham/create-product-group',form.value).takeUntil(this.unsubscribe).subscribe(res => {
        alert("thêm mới thành công");
        this.resetform(form);
        this.search();
        this.displayAdd = false;
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  edit(product_group: NhomSanPham) {
    this.product_group = product_group;
    this.isEdit = true;
  }
  
  SaveData() {
    try {
      this._api.post('/api/NhomSanPham/update-product-group', this.product_group).takeUntil(this.unsubscribe).subscribe(res => {
        alert("Cập nhật thành công");
        this.search();
        this.isEdit = false;
      }, err => { console.log(err); });
    }
    catch (error) {
      console.log(error);
    }
  }
  
  remove(maNhom: string) {
    this._api.post('/api/NhomSanPham/delete-product-group', { MaNhom: maNhom }).takeUntil(this.unsubscribe).subscribe(res => {
      alert("Xóa thành công");
      this.search();
    }, err => { console.log(err) });
  }
}
