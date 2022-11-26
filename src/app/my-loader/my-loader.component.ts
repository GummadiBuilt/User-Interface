import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../shared/loader.service'

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.scss']
})
export class MyLoaderComponent implements OnInit {

  loading!: boolean;

  constructor(private loaderService: LoaderService) {

    this.loaderService.isLoading.subscribe((v) => {
    //  console.log(v);
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}