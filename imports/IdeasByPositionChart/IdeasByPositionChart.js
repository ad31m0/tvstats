import Chart from 'chart.js';
import moment from "moment";
import {CandlesCollection} from "/imports/Candles/Candles";

IdeasByPositionChart({
  share: ["query"],
  shortIdeasList: [],
  longIdeasList: [],
  chart: null,
  fetchData(){
    let that = this;
    Meteor.subscribe("candles", { pair: this.pair(), timeframe: this.timeframe()}, {fields:{date: 1, close: 1, Long: 1, Short: 1}, sort: {time: -1}, limit: 200});

  },
  created(){
  },
  candles(){
    return CandlesCollection.find().fetch();
  },
  autorun(){
    if(this.pair()){
      this.fetchData();
    }
    let data = this.getChartData();
    let chart = this.chart();
    if(chart){
    chart.data = data;
    chart.update();
    this.chart(chart);
  }
  },

  getCandlesPipeline(){
    return [
        {$match: {}},
        {
          $project: {
            yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            date: "$date",
            close: "$close",
            shorts: "$Short",
            longs: "$Long"
          }
        },
        {$sort: {date: -1}},

    ]
  },
  getPipeline(position){
    return [
      {$match: {pair: this.pair(), position}},
      {
        $project: {
          yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          date: "$date"
        }
      },
      {
        $group: {
          _id: "$yearMonthDay",
          date: {$first: "$date"},
          count: {
            $sum: 1
          }
        }
      },
      {$sort: {date: -1}},


    ]
  },

  getChartData(){


    let labels = this.candles().map(x => moment(x.date).format("YYYY-MM-DD"));

    let candles = this.candles().map(x => {return  x.close}).reverse();
    let longs = this.candles().map(x => {return  x.Long}).reverse();
    let shorts = this.candles().map(x => {return x.Short}).reverse();
    console.log(longs, shorts, candles);
    var data = {
      labels: labels,
      datasets: [{
        type: "line",
        backgroundColor: "#00ff0000",
        borderColor: "#00ff00",
        label: 'Longs',
        yAxisID: 'y-axis-1',
        data: longs
      }, {
        type: "line",
        backgroundColor: "#ff000000",
        borderColor: "#ff0000",
        label: 'Shorts',
        yAxisID: 'y-axis-2',
        data: shorts
      },
      {
        type: "line",
       backgroundColor: "#ff000000",
       borderColor: "#0000ff",
       label: 'Price',
       yAxisID: 'y-axis-3',
       data: candles
     }
    ]
    };

    return data;
  },
  getChart(){

    let data = this.getChartData();


			var ctx = document.getElementById('IdeasByPositionChart').getContext('2d');
			let chart = new Chart(ctx, {
				type: 'bar',
				data: data,
				options: {

          maintainAspectRatio: false,
					responsive: true,
					title: {
						display: true,
						text: 'Chart.js Bar Chart - Multi Axis'
					},

					scales: {
						yAxes: [{
							type: 'linear',
							display: true,
							position: 'left',
							id: 'y-axis-1',
						}, {
							type: 'linear',
							display: true,
							position: 'left',
							id: 'y-axis-2',

						},

            {
              type: 'linear',
              display: true,
              position: 'right',
              id: 'y-axis-3',

            }
          ],
					}
				}
			});

      this.chart(chart);
  },

  rendered(){
    let that = this;

        that.getChart();

  },
  render(){
    return (<div style={{height: "300px"}}><canvas  id="IdeasByPositionChart" /></div>)

  }
})
