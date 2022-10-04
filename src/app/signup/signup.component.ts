import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  companyDetails!: FormGroup;
  personalDetails!: FormGroup;
  projectDetails!: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.companyDetails = this._formBuilder.group({
      company_name: ['', [Validators.required, Validators.maxLength(20)]],
      year_of_establishment: ['', Validators.required],
      type_of_establishment: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(200)]],
    });
    this.personalDetails = this._formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
    this.projectDetails = this._formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

}
