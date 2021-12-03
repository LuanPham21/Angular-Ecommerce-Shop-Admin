import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-manage-best-selling',
  templateUrl: './manage-best-selling.component.html',
  styleUrls: ['./manage-best-selling.component.css']
})
export class ManageBestSellingComponent extends BaseComponent implements OnInit {
  public products: any;
  public page = 1;
  public pageSize = 10;
  public totalItems:any;
  public formsearch: any;
  public getBestSelling:any;
  public tenSanPham:string;
  constructor(private fb: FormBuilder,injector: Injector,private route: ActivatedRoute, private router: Router, private httpclient: HttpClient) {
    super(injector);
  }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenSanPham': ['']
    });
    this.search();
  }

  loadPage(page) { 
    this._api.post('/api/ThongKe/get-sanpham-banchay',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  } 
  
  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/ThongKe/get-sanpham-banchay',{page: this.page, pageSize: this.pageSize, tenSanPham: this.formsearch.get('tenSanPham').value}).takeUntil(this.unsubscribe).subscribe(res => {
      debugger;
      // this.products = res.data;
      this.products = res;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
      this.tenSanPham = this.products.data.tenSanPham.map((item:any)=>item.tenSanPham);
      this.getBestSelling = {
    
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
        ]
      }
    });
  }

 
}
