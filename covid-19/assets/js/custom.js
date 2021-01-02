function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

var countriesChartOptions = new Object();
var casesChartOptions = new Object();
var myCountriesChart = new Object();
var myCasesChart = new Object();
var selectedCountries = [];
var colorMap = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a',
  '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2',
  '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
  '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728',
  '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
  '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5', '#393b79',
  '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', '#cedb9c',
  '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b',
  '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6'];

function addGoogleMobilityData(countries) {
  removeGoogleMobilityData();
  for( var i = 0; i < selectedCountries.length; i++){
    countryName = selectedCountries[i];
    countries[countryName].transit.lineStyle = {'color': colorMap[2*i+1]};
    countries[countryName].transit.itemStyle = {'color': colorMap[2*i+1]};
    countriesChartOptions.series.push(countries[countryName].transit);
  };
  myCountriesChart.setOption(countriesChartOptions, true);
}
function removeGoogleMobilityData() {
  indexesToRemove = []
  for( var i = 0; i < countriesChartOptions.series.length; i++){
    if ( countriesChartOptions.series[i].name.includes("(Google Mobility Index)")) {
      indexesToRemove.push(i);
    }
  };
  for ( var j = indexesToRemove.length-1 ; j >= 0 ; j--) {
      countriesChartOptions.series.splice(indexesToRemove[j], 1);
  };
  myCountriesChart.setOption(countriesChartOptions, true);
}

function initControllers(countries, countriesDict, selectClass, google_mobility_index_check) {
  var googleMobilityIndex = true;
  $(google_mobility_index_check).find('input').data( "checked", true );
  //
  $(google_mobility_index_check).click(function() {
		var check_box = $(this).find('input');
    var checked = $( check_box ).data( "checked" );
    if (checked) {
    	$( check_box ).data( "checked", false );
      googleMobilityIndex = false;
      removeGoogleMobilityData();
    } else {
    	$( check_box ).data( "checked", true );
      googleMobilityIndex = true;
      addGoogleMobilityData(countries);
    }
  });
  Object.keys(countries).forEach(function (value){
      $(selectClass).append('<option value='+value+'>'+countriesDict[0][value]+'</option>')
  })


  $(selectClass).tokenize2({

    // max number of tags
    tokensMaxItems: 10,

    // allow you to create custom tokens
    tokensAllowCustom: false,

    // max items in the dropdown
    dropdownMaxItems: 10,

    // minimum/maximum of characters required to start searching
    searchMinLength: 0,
    searchMaxLength: 0,

    // specify if Tokenize2 will search from the begining of a string
    searchFromStart: true,

    // choose if you want your search highlighted in the result dropdown
    searchHighlight: true,

    // custom delimiter
    delimiter: ',',

    // display no results message
    displayNoResultsMessage: false,
    noResultsMessageText: 'No results mached "%s"',

    // custom delimiter
    delimiter: ',',

    // data source
    dataSource: 'select',

    // waiting time between each search
    debounce: 0,

    // custom placeholder text
    placeholder: 'Choose countries',

    // enable sortable
    // requires jQuery UI
    sortable: false,

    // tabIndex
    tabIndex: 0,

    // allows empty values
    allowEmptyValues: false,

    // z-index
    zIndexMargin: 1500
  });


  $(selectClass).on('tokenize:tokens:added', function(e, value, text){

    index = countriesChartOptions.series.length;
    if (!googleMobilityIndex) {
      index = index * 2;
    }
    selectedCountries.push(value);
    countries[value].series.lineStyle = {'color': colorMap[index]};
    countries[value].series.itemStyle = {'color': colorMap[index]};
    if(googleMobilityIndex) {
      countries[value].transit.lineStyle = {'color': colorMap[index+1]};
      countries[value].transit.itemStyle = {'color': colorMap[index+1]};
    }
    countries[value].cases_series.lineStyle = {'color': colorMap[index]};
    countries[value].cases_series.itemStyle = {'color': colorMap[index]};

    countriesChartOptions.series.push(countries[value].series);
    // if (googleMobilityIndex) {
    countriesChartOptions.series.push(countries[value].transit);
    // }

    myCountriesChart.setOption(countriesChartOptions);

    casesChartOptions.series.push(countries[value].cases_series);
    myCasesChart.setOption(casesChartOptions);
  });

  $(selectClass).on('tokenize:tokens:remove', function(e, value){
    for( var i = 0; i < countriesChartOptions.series.length; i++){
      if ( countriesChartOptions.series[i].name === value) {
        countriesChartOptions.series.splice(i, 1);
    }};
    for( var i = 0; i < countriesChartOptions.series.length; i++){
      if ( countriesChartOptions.series[i].name === (value.concat(" (Google Mobility Index)"))) {
        countriesChartOptions.series.splice(i, 1);
    }};
    myCountriesChart.setOption(countriesChartOptions, true);

    for( var i = 0; i < casesChartOptions.series.length; i++){
      if ( casesChartOptions.series[i].name === value) {
        casesChartOptions.series.splice(i, 1);
    }};
    myCasesChart.setOption(casesChartOptions, true);
    const index = selectedCountries.indexOf(value);
    if (index > -1) {
      selectedCountries.splice(index, 1);
    }
  });
}


function initCountryCharts(countries, countriesDict, containerID) {
  countryNames = new Set(Object.keys(countries));

  myCountriesChart = echarts.init(document.getElementById(containerID));
  series = [];
  legend = [];
  countryNames.forEach(function (country){
    legend.push(countriesDict[0][country]);
    legend.push(countriesDict[0][country].concat(' (Google Mobility Index)'));
  })

  index = 0
  function getValues(country, field, visualMap) {
    array = [];
    for (i = 0 ; i < country.dates.length - 1 ; i++) {
      array.push([country.dates[i], country[field][i], visualMap])
    }
    return array;
  }

  countryNames.forEach(function (e) {
    countries[e]['series'] =
      {
        name: countriesDict[0][e],
        type:'line',
        smooth: true,
        data: getValues(countries[e],'senti_bert_std_trend', "No Google Mobility Index Data"),
        lineStyle: {},
        markLine: {
          silent: false, // ignore mouse events
          symbol: ['none', 'none'],
          label: {
            position: 'insideStartBottom',
            show: true,
            formatter: function (params) {
              str = (params.dataIndex == 0)? e+": pre-COVID-19 sentiments":
                    (params.dataIndex == 1)? e+": lowest sentiment drop":"";
              return str
            }
          },
          data : [
            {xAxis: countries[e].drop_senti_bert[0]},
            {xAxis: countries[e].min_senti_bert_std[0]}
          ]
        }
      }
    countries[e]['transit'] =
      {
        name: countriesDict[0][e].concat(' (Google Mobility Index)'),
        type:'line',
        data: getValues(countries[e],'transit', "Google Mobility Index Data"),
        smooth: true,
        yAxisIndex: 1,
        lineStyle: {}
      }
  });
  countriesChartOptions =
  {
    title: {
        text: 'Standarized Sentiment Index'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        },
        formatter: function (params) {
          var str = "";
          params.forEach(function (p) {
            str = str + p.marker + " " + p.seriesName + ": " + (Math.round(p.value[1] * 1000) / 1000).toFixed(3)+"<br />";
          });
          return str
        }
    },
    legend: {
        data: legend
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: countries.AFG.dates
    },
    yAxis: [{
        type: 'value',
        name: 'standarized value',
        nameRotate: '90',
        nameLocation: 'center',
        nameGap: '40'
    },{
      type: 'value',
      name: 'mobility change (%)',
      axisLabel: {
         formatter: '{value} %'
       },
       nameRotate: '90',
       nameLocation: 'center',
       nameGap: '50'
    }],
    series: series,
    // visualMap: {
    //     type: 'piecewise',
    //     categories: ["Google Mobility Index Data"],
    //     dimension: 2,
    //     calculable: false,
    //     hoverLink: false,
    //     orient: 'horizontal',
    //     top: 0,
    //     left: 'right',
    //     inRange: {
    //         color: ['#c23531','#2f4554', '#61a0a8'],
    //         // opacity: ,
    //         // lineStro
    //         lineStyle: {color: 'red'},
    //         symbol: 'rect'
    //     },
    //     // outOfRange: {
    //     //     color: ['#ddd']
    //     // },
    // },
  };
  myCountriesChart.setOption(countriesChartOptions);
}


function initCasesCharts(countries, countriesDict, containerID) {
  countryNames = new Set(Object.keys(countries));

  myCasesChart = echarts.init(document.getElementById(containerID));
  series = [];
  legend = [];
  countryNames.forEach(function (country){
    legend.push(country);
  });

  countryNames.forEach(function (e) {
    countries[e]['cases_series'] =
      {
        name: countriesDict[0][e],
        type:'line',
        smooth: true,
        data: countries[e].confirmed,
        lineStyle: {}
      }
  });
  casesChartOptions =
  {
    title: {
        text: 'Number of COVID-19 Cases'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    legend: {
        data: legend
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: countries.AFG.dates
    },
    yAxis: [{
        type: 'value',
        name: 'number of cases',
        nameRotate: '90',
        nameLocation: 'center',
        nameGap: '40'
    }],
    series: series
  };
  myCasesChart.setOption(casesChartOptions);
}
