import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { SanPham } from '../../../shared/models/SanPham';
interface Category {
  maLoai: string,
  tenLoai: string
}
interface Brand {
  maHang: string,
  tenHang: string
}
@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent extends BaseComponent implements OnInit {
  public products: any;
  public product: any;
  public page = 1;
  public pageSize = 10;
  public totalItems:any;
  public formsearch: any;
  
  public categories: Category[];
  selectedCategory: Category;
  public brands: Brand[];
  selectedBrand: Brand;
  
  formProduct: FormBuilder;
  
  constructor(private fb: FormBuilder,injector: Injector,private route: ActivatedRoute, private router: Router) {
    super(injector);
    
    this.product = new SanPham();
  }
  isEdit: boolean = false;
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenSanPham': ['']
    });
    this.search();
  }
  
  loadPage(page) { 
    this._api.post('/api/SanPham/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  } 
  
  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/SanPham/search',{page: this.page, pageSize: this.pageSize, tenSanPham: this.formsearch.get('tenSanPham').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  }
  
  displayAdd: boolean = false;
  showAdd() {
    this.displayAdd = true;
    this._api.get('/api/LoaiSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.categories = res;
    }); 
    
    this._api.get('/api/HangSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res;
    }); 
  }
  resetform(form) {
    if (form != null)
    form.resetForm();
  }
  AddNewProduct(form: NgForm) {
    console.log(form.value);
    try {
      this._api.post('/api/SanPham/create-product', form.value).takeUntil(this.unsubscribe).subscribe(res => {
        alert("Thêm mới thành công");
        this.resetform(form);
        this.search();
        this.displayAdd = false;
      }, err => { console.log(err); });
      
      // product.photosmall=this.file2.name;
      // this._api.addnews(news).subscribe(res=>{
      // this.news?.push(res);
      // alert("Thêm Thành Công");
      //  this.router.navigate(['/news_management']);
      // });
    }
    catch (error) {
      console.log(error);
    }
  }
  
  edit(product: SanPham) {
    this.product = product;
    this._api.get('/api/LoaiSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.categories = res;
    }); 
    
    this._api.get('/api/HangSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res;
    }); 
    this.isEdit = true;
  }
  
  SaveData() {
    try {
      this._api.post('/api/SanPham/update-product',this.product).takeUntil(this.unsubscribe).subscribe(res => {
        alert("Cập nhật thành công");
        this.search();
        this.isEdit = false;
      }, err => { console.log(err); });
    }
    catch (error) {
      console.log(error);
    }
  }
  
  delete(maSanPham:string) {
    this._api.post('/api/SanPham/delete-product', { MaSanPham:maSanPham }).takeUntil(this.unsubscribe).subscribe(res => {
      alert("Xóa thành công");
      this.search();
    },err=>{console.log(err)});
  }
}
