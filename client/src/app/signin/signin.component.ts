import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from './../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form: FormGroup;

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

  onSignin(e) {
    if (this.form.valid) {
      const user = this.form.value;
      const subscribe = this.auth.signin(user).subscribe(data => {
        subscribe.unsubscribe();
        if (this.auth.isAuth()) {
          this.router.navigate(['chat']);
        }
      });
    }
  }

}
