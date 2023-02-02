import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss']
})
export class HighchartsComponent implements OnInit {
  highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  @Input() totalTendersData: any;
  @Input() recommendedData: any;
  @Input() underProcessData: any;
  @Input() publishedData: any;
  @Input() total_tenders!: any;
  @Input() recommended!: any;
  @Input() under_process!: any;
  @Input() published!: any;

  updateFlag = false;

  constructor() {
    this.chartOptions = {
      chart: {
        type: 'sankey'
      },
      title: {
        text: 'Tenders Info Chart'
      },
      xAxis: {
        categories: ['Types']
      },
      yAxis: {
        title: {
          text: 'Count',
        }
      },
      series: [
        {
          name: '',
          type: 'bar',
          data: [],
        },
      ],
      accessibility: {
        enabled: false
      }
    };
  }

  ngOnInit(): void {

  }
  ngOnChanges(change: SimpleChanges) {
    this.chartOptions.series = [{
      name: change['total_tenders'] ? change['total_tenders'].currentValue : null,
      type: 'bar',
      data: change['totalTendersData'].currentValue,
    }, {
      name: change['recommended'] ? change['recommended'].currentValue : null,
      type: 'bar',
      data: change['recommendedData'].currentValue,
    }, {
      name: change['under_process'] ? change['under_process'].currentValue : null,
      type: 'bar',
      data: change['underProcessData'].currentValue,
    }, {
      name: change['published'] ? change['published'].currentValue : null,
      type: 'bar',
      data: change['publishedData'].currentValue,
    }];
    this.updateFlag = true;
  }

}
