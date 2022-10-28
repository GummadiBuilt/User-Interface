import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public fb: FormBuilder,) {
    this.loginForm = this.fb.group({
      email: [],
    });
  }

  ngOnInit(): void {
  }

}
