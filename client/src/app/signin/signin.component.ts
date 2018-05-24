import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../core/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, DoCheck {
  form: FormGroup;
  disableButton = false;
  dataSent = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) {
    this.form = this.fb.group({
      email: ['admin@gmail.com', Validators.compose([Validators.required, Validators.email])],
      password: ['rootroot', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }
  ngDoCheck() {
    this.disableButton = !this.form.valid;
  }
  onSignin(e) {
    if (this.form.valid) {
      this.disableButton = true;
      this.dataSent = true;
      const user = this.form.value;
      // const subscribe =
      // this.auth.signin(user, () => {
      //   if (this.auth.isAuth()) {
      //     this.router.navigate(['chat']);
      //   }
      // });

      this.auth.signin(user).subscribe(() => {
        if (this.auth.isAuth()) {
          this.router.navigate(['chat']);
        } else {
          this.disableButton = false;
          this.dataSent = false;
        }
      });

      // .subscribe(data => {
      //   subscribe.unsubscribe();
      //   if (this.auth.isAuth()) {
      //     this.router.navigate(['chat']);
      //   }
      // });
    }
  }

}
