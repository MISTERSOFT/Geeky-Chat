import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { User } from './../shared/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private webSocket: AuthService) {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      username: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  onSignup(e) {
    console.log('onSignup', this.form.valid);
    if (this.form.valid) {
      const newUser: User = this.form.value;
      this.webSocket.signup(newUser).subscribe(data => {
        console.log('response for signup', data);
        // TODO: If success navigate to signin
        // else display error
      });
    }
  }
}
