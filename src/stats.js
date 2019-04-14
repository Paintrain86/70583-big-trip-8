import BaseComponent from './base-component.js';
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

class Stats extends BaseComponent {
  constructor() {
    super();

    this._data = null;

    this._onDraw = null;
  }

  set onDraw(cb) {
    this._onDraw = cb;
  }

  get moneyArray() {
    const result = [];

    this._data.forEach((obj) => {
      if (!obj) {
        return;
      }

      const existTypeObj = result.filter((item) => item.type === obj.type)[0];

      if (existTypeObj) {
        existTypeObj.money += obj.price;
      } else {
        result.push({
          type: obj.type,
          icon: obj.icons.get(obj.type),
          money: obj.price
        });
      }
    });

    return result;
  }

  get transportArray() {
    const result = [];
    const transports = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

    this._data.forEach((obj) => {
      if (!obj) {
        return;
      }

      if (transports.indexOf(obj.type) > -1) {
        const existTypeObj = result.filter((item) => item.type === obj.type)[0];

        if (existTypeObj) {
          existTypeObj.count += 1;
        } else {
          result.push({
            type: obj.type,
            icon: obj.icons.get(obj.type),
            count: 1
          });
        }
      }
    });

    return result;
  }

  get timeSpendArray() {
    const result = [];
    const transports = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

    this._data.forEach((obj) => {
      if (!obj) {
        return;
      }
      if (transports.indexOf(obj.type) > -1) {
        const existTypeObj = result.filter((item) => item.type === obj.type)[0];

        if (existTypeObj) {
          existTypeObj.time += Math.ceil((obj.timeEnd.getTime() - obj.timeStart.getTime()) / 1000 / 60 / 60);
        } else {
          result.push({
            type: obj.type,
            icon: obj.icons.get(obj.type),
            time: Math.ceil((obj.timeEnd.getTime() - obj.timeStart.getTime()) / 1000 / 60 / 60)
          });
        }
      }
    });

    return result;
  }

  _drawStats() {
    if (!Array.isArray(this._data)) {
      return;
    }

    const moneyCtx = document.querySelector(`.statistic__money`);
    const transportCtx = document.querySelector(`.statistic__transport`);
    const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

    const moneyStats = this.moneyArray;
    const transportStats = this.transportArray;
    const timeSpendStats = this.timeSpendArray;

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    const moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: moneyStats.map((item) => `${item.icon} ${item.type}`),
        datasets: [{
          data: moneyStats.map((item) => item.money),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    const transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: transportStats.map((item) => `${item.icon} ${item.type}`),
        datasets: [{
          data: transportStats.map((item) => item.count),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    const timeSpendChart = new Chart(timeSpendCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: timeSpendStats.map((item) => `${item.icon} ${item.type}`),
        datasets: [{
          data: timeSpendStats.map((item) => item.time),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val} hours`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT TIME SPEND`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    moneyChart.update();
    transportChart.update();
    timeSpendChart.update();
  }

  get template() {
    return `
      <section class="statistic content-wrap" id="stats">
        <div class="statistic__item statistic__item--money">
          <canvas class="statistic__money" width="900"></canvas>
        </div>

        <div class="statistic__item statistic__item--transport">
          <canvas class="statistic__transport" width="900"></canvas>
        </div>

        <div class="statistic__item statistic__item--time-spend">
          <canvas class="statistic__time-spend" width="900"></canvas>
        </div>
      </section>
    `;
  }
}

export default Stats;
