import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  ngOnInit(): void {
  }

  resetPasswordForm: FormGroup;
  constructor(public fb: FormBuilder,) {
    this.resetPasswordForm = this.fb.group({
      password: [],
      new_password: [],
      confirm_password: [],
    });
  }

}
