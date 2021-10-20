import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
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
  public page = 1;
  public pageSize = 10;
  public totalItems:any;
  public categories: Category[];
  selectedCategory: Category;
  public brands: Brand[];
  selectedBrand: Brand;
  constructor(injector: Injector,private route: ActivatedRoute, private router: Router) {
    super(injector);
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._api.post('/api/SanPham/product-all-paginate',{page: this.page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
        this.products = res.data;
        this.totalItems = res.totalItems;
        setTimeout(() => {
          this.loadScripts();
        });
      });
    });

    this._api.get('/api/LoaiSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.categories = res;
    }); 

    this._api.get('/api/HangSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res;
    }); 
  }
  displayAdd: boolean = false;
  showAdd() {
    this.displayAdd = true;
  }
  loadPage(page) { 
    this._route.params.subscribe(params => {
      this._api.post('/api/SanPham/product-all-paginate', { page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
        this.products = res.data;
        this.totalItems = res.totalItems;
        }, err => { });       
   });   
  }
}
