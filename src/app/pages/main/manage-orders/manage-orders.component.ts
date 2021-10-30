import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators} from '@angular/forms';
@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent extends BaseComponent implements OnInit {
  public doneSetup = false;
  public orderdetail:any;
  public orders: any;
  public page = 1;
  public pageSize = 10;
  public totalItems:any;
  public formsearch: any;

  constructor(private fb: FormBuilder, injector: Injector,private route: ActivatedRoute, private router: Router) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoTen': [''],
      'diaChiNhan': [''],     
      'email': [''],     
    });
    
    this.search();
  }

  loadPage(page) { 
    this._api.post('/api/DonHang/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  } 
  onRowExpand(row) {
    this.doneSetup = false; 
    this._api.get('/api/DonHang/get-by-id/'+ row.data.maDonHang).subscribe((res:any) => {
      this.orderdetail = res;
      this.doneSetup = true; 
      debugger;
      });
  }
  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/DonHang/search',{page: this.page, pageSize: this.pageSize, hoTen: this.formsearch.get('hoTen').value, diaChiNhan: this.formsearch.get('diaChiNhan').value, email: this.formsearch.get('email').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  }

}
