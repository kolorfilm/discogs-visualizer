function initSellsGraph() {
  $('.loader').show();

  $.get('/orders', (data, status) => {
    $('.loader').hide();

    // console.log(data, status);

    if(data.error){
      location.href = '/authorize';
      return false;
    }

    Highcharts.setOptions({
      lang: {
        thousandsSep: '.',
        decimalPoint: ','
      }
    });

    $('#highcharts-container').highcharts('StockChart', {
      credits: false,
      title: {
        text: 'Discogs Orders'
      },
      subtitle: {
        text: 'Profile of ' + data.meta.username
      },
      xAxis: {
        type: 'datetime',
        labels:{
          formatter: function(){
            return Highcharts.dateFormat('%Y/%m', this.value);
          }
        }
      },
      yAxis: {
        title: {
          text: 'Price'
        }
      },
      plotOptions: {
        column: {
          grouping: false
        }
      },
      tooltip: {
        valueDecimals: 2,
        useHTML: true,
        formatter: function () {
          var year = new Date(this.x).getFullYear();
          var month = new Date(this.x).getMonth();

          var total_fees = 0;

          var html_items = '<div class="tooltip-container">';
          html_items += '<div class="item item-head"><span class="item-price">Total</span><span class="item-price">Fee</span><span class="item-release">Order Link</span></div>';

          var i = 0;

          data.series_items.forEach((item, index) => {
            var item_year = new Date(item.created).getFullYear();
            var item_month = new Date(item.created).getMonth();

            if(item_year == year && item_month == month){
              i++;
              html_items += '<div class="item"><span class="item-price">' + Highcharts.numberFormat(item.total, 2) + ' €</span><span class="item-price">' + Highcharts.numberFormat(item.fee, 2) + ' €</span><a href="https://www.discogs.com/sell/order/' + item.id + '" target="_blank" class="item-release">' + item.id + '</a></span></div>';
              console.log
              total_fees += item.fee;
            }
          });

          html_items += '<div class="item"><span class="item-price item-price-total item-foot">' + Highcharts.numberFormat(this.y, 2) + ' €</span><span class="item-price item-foot">' + Highcharts.numberFormat(total_fees, 2) + ' €</span><span class="item-release item-foot"></span></div>';
          html_items += '</div>';

          return html_items;
        }
      },
      series: [{
        type: 'column',
        dataGrouping: {
          forced: true,
          units:[
            ['month',[1]]
          ]
        },
        data: data.series
      }]
    });

    var theTemplateScript = $('#summary-template').html();
    var theTemplate = Handlebars.compile(theTemplateScript);

    data.meta.totalAmount = Highcharts.numberFormat(data.meta.totalAmount, 2);
    data.meta.firstOrderDate = Highcharts.dateFormat('%Y/%m/%d', data.series_items[0].created);
    data.meta.lastOrderDate = Highcharts.dateFormat('%Y/%m/%d', data.series_items[data.series_items.length-1].created);

    var context = { 'meta': data.meta };

    var theCompiledHtml = theTemplate(context);
    $('#summary').html(theCompiledHtml);
  });
}