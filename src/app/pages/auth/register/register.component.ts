import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseComponent implements OnInit {
  public frmRegister: FormGroup;
  constructor(injector: Injector, private router: Router) {
    super(injector);
  }
  
  ngOnInit(): void {
    this.frmRegister = new FormGroup({
      HoTen: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      TaiKhoan: new FormControl('', [Validators.required]),
      NgaySinh: new FormControl('', [Validators.required]),
      DiaChi: new FormControl('', [Validators.required]),
      MatKhau: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  
  onSubmit(value : any){
    if(this.frmRegister.invalid) return;
    this._api.post('/api/NguoiDung/create-user', 
    {
      HoTen:value.HoTen, 
      Email:value.Email, 
      TaiKhoan:value.TaiKhoan, 
      NgaySinh:value.NgaySinh, 
      DiaChi:value.DiaChi, 
      MatKhau: value.MatKhau,
      role: 'User'
    })
    .takeUntil(this.unsubscribe).subscribe(res => {
      alert('Đăng ký thành công');
      this.router.navigate(['/auth/login']);
    }, err => { 
      alert('Có lỗi trong quá trình thực hiện');
    });    
  }
  
}
