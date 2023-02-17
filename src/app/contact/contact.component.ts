import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PageConstants } from '../shared/application.constants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactUsForm!: FormGroup;
  locationUrl: string = environment.locationUrl;
  public constVariable = PageConstants;
  categories = [{ id: 'client', roleName: 'Client' }, { id: 'contractor', roleName: 'Contractor' }, { id: 'individual', roleName: 'Individual' }];
  constructor(private _formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.contactUsForm = this._formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      category: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone: [null, [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      description: [null, [Validators.required, Validators.maxLength(250)]],
    });
  }

  onSubmit() {
    console.log(this.contactUsForm.value);
  }

}
