import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexLegend, ApexMarkers, ApexTheme, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { BoxOfficeRevenueType } from '../models/financial/box-office-revenue-type';
import { FinancialService } from '../services/financial.service';

@Component({
  selector: 'app-master-view',
  imports: [ChartComponent],
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  private _box_Office_Revenue: BoxOfficeRevenueType[] = [];
  public get box_Office_Revenue(): BoxOfficeRevenueType[] {
    return this._box_Office_Revenue;
  }
  public set box_Office_Revenue(value: BoxOfficeRevenueType[]) {
    this._box_Office_Revenue = value;
    this.series = this.getSeries();
  }
  public series: ApexAxisChartSeries = this.getSeries();
  public chart: ApexChart = {
    type: 'bar',
    stacked: true,
    stackType: '100%',
    background: 'theme:surface-500',
    zoom: {
      enabled: true
    },
    toolbar: {
      show: true
    },
    fontFamily: 'var(--ig-font-family)'
  };
  public theme: ApexTheme = {
    mode: 'light'
  };
  public legend: ApexLegend = {
    show: false
  };
  public markers: ApexMarkers = {
    size: 6
  };
  public dataLabels: ApexDataLabels = {
    enabled: false
  };

  constructor(
    private financialService: FinancialService,
  ) {}


  ngOnInit() {
    this.financialService.getBoxOfficeRevenue().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.box_Office_Revenue = data
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getSeries(): ApexAxisChartSeries {
    return [
      {
        name: 'TotalWorldBoxOfficeRevenue',
        data: this.box_Office_Revenue,
        parsing: {
          x: 'Franchise',
          y: [
            'TotalWorldBoxOfficeRevenue'
          ]
        }
      },
      {
        name: 'HighestGrossingMovieInSeries',
        data: this.box_Office_Revenue,
        parsing: {
          x: 'Franchise',
          y: [
            'HighestGrossingMovieInSeries'
          ]
        }
      }
    ];
  }
}
