import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoaiSanPham } from 'src/app/shared/models/LoaiSanPham';
import { HttpClient } from '@angular/common/http';

interface ProductsGroup {
  maNhom: string,
  tenNhom: string
}
@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css']
})
export class ManageCategoriesComponent extends BaseComponent implements OnInit {
  public categories: any;
  public category: any;
  public page = 1;
  public pageSize = 3;
  public totalItems:any;
  public productsGroup: ProductsGroup[];
  selectedProductGroup: ProductsGroup;
  public formsearch: any;
  isEdit: boolean = false;
  
  constructor(private fb: FormBuilder, private httpclient: HttpClient, injector: Injector, private route: ActivatedRoute, private router: Router) {
    super(injector);
    this.category = new LoaiSanPham();
  }
  
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenLoai': ['']
    });
    this.search();
    
  }
  
  loadPage(page) { 
    this._route.params.subscribe(params => {
      this._api.post('/api/LoaiSanPham/search', { page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
        this.categories = res.data;
        this.totalItems = res.totalItems;
      }, err => { });       
    });   
  }
  search() {
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/LoaiSanPham/search', { page: this.page, pageSize: this.pageSize, tenLoai: this.formsearch.get('tenLoai').value }).takeUntil(this.unsubscribe).subscribe(res => {
      this.categories = res.data;
      this.totalItems = res.totalItems;
      this.pageSize = res.pageSize;
    });
  }
  displayAdd: boolean = false;
  showAdd() {
    this.displayAdd = true;
    this._api.get('/api/NhomSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.productsGroup = res;
    }); 
  }
  resetform(form) {
    if (form != null)
    form.resetForm();
  }
  
  Anh: any = null;
  onChange(event: any) {
    this.Anh = event.target.files[0];
  }
  upload(file?: any): Observable<any> {
    const apiURL = 'http://localhost:8961/api/LoaiSanPham/upload';
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.httpclient.post(apiURL, formData).pipe();
  }
  
  AddNew(form: NgForm) {
    console.log(form.value);
    try {
      this.upload(this.Anh).subscribe(res => { 
        const loaiSanPham: LoaiSanPham = new LoaiSanPham();
        loaiSanPham.MaLoai="";
        loaiSanPham.TenLoai = form.controls['tenLoai'].value;
        loaiSanPham.MaNhom = form.controls['maNhom'].value;
        loaiSanPham.MoTa = form.controls['moTa'].value;
        loaiSanPham.Anh = res.filePath;
        
        this._api.post('/api/LoaiSanPham/create-category',form.value).takeUntil(this.unsubscribe).subscribe(res => {
          alert("thêm mới thành công");
          this.resetform(form);
          this.search();
          this.displayAdd = false;
        });
        
      });
    }
    catch (error) {
      console.log(error);
    }
  }
  
  edit(category: LoaiSanPham) {
    this.category = category;
    this._api.get('/api/NhomSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.productsGroup = res;
    }); 
    this.isEdit = true;
  }
  
  SaveData() {
    try {
      this.upload(this.Anh).subscribe(res => { 
        this.category.Anh = res.filePath;
        this._api.post('/api/LoaiSanPham/update-category', this.category).takeUntil(this.unsubscribe).subscribe(res => {
          alert("Cập nhật thành công");
          this.search();
          this.isEdit = false;
        }, err => { console.log(err); });
      });
    }
    catch (error) {
      console.log(error);
    }
  }
  
  remove(maLoai: string) {
    this._api.post('/api/LoaiSanPham/delete-category', { MaLoai: maLoai }).takeUntil(this.unsubscribe).subscribe(res => {
      alert("Xóa thành công");
      this.search();
    }, err => { console.log(err) });
  }
}
