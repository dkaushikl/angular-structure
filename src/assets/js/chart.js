$(document).ready(function() {
    $.ajax({
        dataType: 'json',
        url: 'https://api.hashbyte.co/api/Exchange/GetCandelChart?interval=' + 1400,
        success: function(data) {
            var result = [];
            var volume = [];
            for (let i = 0; i < data.Data.length; i++) {
                var tarray = [];
                var vol = [];
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

            var dataTable = anychart.data.table();
            dataTable.addData(result);
            var mapping = dataTable.mapAs({ value: 4 });
            var ohlcMapping = dataTable.mapAs({
                close: 4,
                high: 2,
                low: 3,
                open: 1,
            });
            var lineMapping = dataTable.mapAs({ value: 5 });
            // create stock chart
            var chart = anychart.stock();
            chart.left(10);
            chart.right(5);

            var plot = chart.plot(0); // first chart
            plot
                .yGrid(true)
                .xGrid(true)
                .yMinorGrid(true)
                .xMinorGrid(true);
            plot.height('70%');
            var series = plot.candlestick(ohlcMapping);
            series.risingFill('#1fb982');
            series.risingStroke('#1fb982');
            series.fallingFill('#de3249');
            series.fallingStroke('#de3249');

            var plotColumn = chart.plot(1); // second chart
            var rates = plotColumn.column(mapping);
            rates.name('Highest rate');
            rates.fill('#2d4f55');
            rates.pointWidth(6);

            var thSeries = chart.scroller().column(lineMapping);
            thSeries.fill('#f4c659');
            var rangePicker = anychart.ui.rangePicker();
            rangePicker.render(chart);
            var rangeSelector = anychart.ui.rangeSelector();
            rangeSelector.render(chart);

            chart.container('container');
            chart.draw();
        }
    });
});