import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Response } from '../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  form: FormGroup;

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

  onSignup(e) {
    console.log('onSignup', this.form.valid);
    if (this.form.valid) {
      const newUser = this.form.value;
      this.webSocket.signup(newUser).subscribe((response: Response<any>) => {
        console.log('response for signup', response);
        // If success navigate to signin
        if (response.success) {
          this.router.navigate(['signin']);
        } else {
          // TODO: else display error
        }
      });
    }
  }
}
