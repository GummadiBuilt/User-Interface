import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  companyDetails!: FormGroup;
  personalDetails!: FormGroup;
  projectDetails!: FormGroup;
  company_step = false;
  personal_step = false;
  project_step = false;
  step = 1;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.companyDetails = this.formBuilder.group({
      company_name: ['', Validators.required],
      year_of_establishment: ['', Validators.required],
      type_of_establishment: ['', Validators.required],
      address: ['', Validators.required],
    });

    this.personalDetails = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.projectDetails = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  get company() { return this.companyDetails.controls; }
  get personal() { return this.personalDetails.controls; }
  get project() { return this.projectDetails.controls; }

  next() {
    console.log('next method');
    if (this.step == 1) {
      this.company_step = true;
      if (this.companyDetails.invalid) { return }
      this.step++;
    }
    else if (this.step == 2) {
      this.personal_step = true;
      if (this.personalDetails.invalid) { return }
      this.step++;
    }
  }

  previous() {
    this.step--
    if (this.step == 1) {
      this.personal_step = false;
    }
    if (this.step == 2) {
      this.project_step = false;
    }
  }

  submit() {
    if (this.step == 3) {
      this.project_step = true;
      if (this.projectDetails.invalid) { return }
      alert("Well done!!")
    }
  }

}
