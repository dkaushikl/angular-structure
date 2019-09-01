import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TradeService } from '../../core/service';

declare var anychart: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
})

export class ChartComponent implements OnChanges {
  @Input() pairId: string;
  loading = false;
  @ViewChild('chart') chart: ElementRef;

  constructor(public tradeService: TradeService) {
    this.ChartObservable();
  }

  ChartObservable() {
    this.tradeService.chartRefreshAll$().subscribe((data: any) => {
      this.chartData();
    });
  }

  ngOnChanges(change: any) {
    this.pairId = change.pairId !== undefined ? change.pairId.currentValue : this.pairId;
    this.chartData();
  }


  chartData() {
    this.chart.nativeElement.innerHTML = '';
    this.loading = true;
    const that = this;
    anychart.data.loadJsonFile(environment.apiUrl + 'Market/GetChartData/' + this.pairId, function (data) {
      const result = [];
      const volume = [];
      for (let i = 0; i < data.Data.length; i++) {
        const tarray = [];
        const vol = [];
        tarray.push(
          new Date(data.Data[i].date).getTime(),
          data.Data[i].open,
          data.Data[i].high,
          data.Data[i].low,
          data.Data[i].close
        );
        result.push(tarray);
        vol.push(
          data.Data[i].date.toString().split('T')[0],
          data.Data[i].open
        );
        volume.push(vol);
      }
      anychart.theme(anychart.themes.darkBlue);
      const dataTable = anychart.data.table();
      dataTable.addData(result);
      const mapping = dataTable.mapAs({ value: 4 });
      const ohlcMapping = dataTable.mapAs({
        close: 4,
        high: 2,
        low: 3,
        open: 1,
      });
      const lineMapping = dataTable.mapAs({ value: 5 });
      // create stock chart
      const chart = anychart.stock();
      chart.left(10);
      chart.right(5);

      const plot = chart.plot(0); // first chart
      plot
        .yGrid(true)
        .xGrid(true)
        .yMinorGrid(true)
        .xMinorGrid(true);
      plot.height('70%');
      const series = plot.candlestick(ohlcMapping);
      series.risingFill('#1fb982');
      series.risingStroke('#1fb982');
      series.fallingFill('#de3249');
      series.fallingStroke('#de3249');

      const plotColumn = chart.plot(1); // second chart
      const rates = plotColumn.column(mapping);
      rates.name('Highest rate');
      rates.fill('#2d4f55');
      rates.pointWidth(6);

      const thSeries = chart.scroller().column(lineMapping);
      thSeries.fill('#f4c659');
      // const rangePicker = anychart.ui.rangePicker();
      // rangePicker.render(chart);
      // const rangeSelector = anychart.ui.rangeSelector();
      // rangeSelector.render(chart);

      chart.container('container');
      chart.draw();
      that.loading = false;
    });
  }

}
