import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from './../core/auth.service';
import { User } from '../shared/models';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['admin@gmail.com', Validators.compose([Validators.required, Validators.email])],
      password: ['rootroot', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  onSignin(e) {
    console.log('onSignin', this.form.valid);
    if (this.form.valid) {
      const user: User = this.form.value;
      const subscribe = this.auth.signin(user).subscribe(data => {
        console.log('response for signin', data);
        subscribe.unsubscribe();
        // TODO: If success navigate to signin
        // else display error
      });
    }
  }

}
