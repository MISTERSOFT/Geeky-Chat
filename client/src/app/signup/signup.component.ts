import { NewUser } from './../shared/models/user';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WebSocketService } from '../core/websocket.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private webSocket: WebSocketService) {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      username: ['', Validators.required]
    });
    console.log('form', this.form);
  }

  ngOnInit() {
  }

  onSignup(e) {
    console.log('onSignup', this.form.valid);
    if (this.form.valid) {
      const newUser: NewUser = this.form.value;
      this.webSocket.signup(newUser).subscribe(data => {
        console.log('response for signup', data);
        // TODO: If success navigate to signin
        // else display error
      });
    }
  }
}
