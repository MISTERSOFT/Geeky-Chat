import { Component, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Response } from '../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements DoCheck {
  form: FormGroup;
  disableButton = true;
  dataSent = false;

  constructor(
    private fb: FormBuilder,
    private webSocket: AuthService,
    private router: Router) {
    this.form = this.fb.group({
      email: ['admin@gmail.com', Validators.compose([Validators.required, Validators.email])],
      password: ['rootroot', Validators.compose([Validators.required, Validators.minLength(6)])],
      username: ['admin', Validators.required]
    });
  }
  ngDoCheck() {
    console.log('DoCheck');
    this.disableButton = !this.form.valid
  }

  onSignup(e) {
    console.log('is form valid', this.form.valid);
    if (this.form.valid) {
      this.disableButton = true;
      this.dataSent = true;
      const newUser = this.form.value;
      this.webSocket.signup(newUser).subscribe((response: Response<any>) => {
        console.log('response for signup', response);
        // If success navigate to signin
        if (response.success) {
          this.disableButton = false;
          this.dataSent = false;
          this.router.navigate(['signin']);
        } else {
          // TODO: else display error
        }
      });
    }
  }
}
