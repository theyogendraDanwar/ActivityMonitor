let {
  chart, 
  lastMeasureTimes, 
  model, 
  precentageMem, 
  os, 
  os_utils, systemInformation} = require('./constants.js');

  systemInformation.diskLayout((item) => console.log(item));

function getSysInfo() {
  let network_block = null;
  const freememory = os.freemem();
  const totalmem = os.totalmem();
  const username = os.userInfo();
  const arch = os.arch();
  const network = os.networkInterfaces();
  Object.keys(network).forEach((key, item)=>{
  //  console.log(key);
    network_block =  network[key].map((item) => {
     return (`<div>${item.address}</div>`);
    })
  });

  precentageMem =  (totalmem - freememory) / totalmem * 100;
  var bar2 = document.getElementsByClassName('ld-Bar__mem')[0].ldBar;
  bar2.set(precentageMem);
  var bar3 = document.getElementsByClassName('ld-Bar__usage')[0].ldBar;
  os_utils.cpuUsage((item) => bar3.set(item*100));
  $('.system_container_info').text('');
  $('.system_container_info').append(`<div>${model}</div>`);
  $('.system_container_info').append(`<div>${arch}</div>`)
  $('.system_container_info').append(`<div>${username.username}</div>`)
  const info = os.cpus();
  model = info[0].model;
}

function setLastMeasureTimes(cpus) {
  for (let i = 0; i < cpus.length; i++) {
    lastMeasureTimes[i] = getCpuTimes(cpus[i]);
  }
}

function getDatasets() {
  const datasets = []
  const cpus = os.cpus()

  for (let i = 0; i < cpus.length; i++) {
    const cpu = cpus[i]
    const cpuData = {
      data: getCpuTimes(cpu),
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ]
    }
    datasets.push(cpuData)
  }
  testCpus = os.cpus();
  return datasets;
}

function updateDatasets() {
  const cpus = os.cpus()
  for (let i = 0; i < cpus.length; i++) {
    const cpu = cpus[i]
    chart.data.datasets[i].data = getCpuTimes(cpu);
    chart.data.datasets[i].data[0] -= lastMeasureTimes[i][0];
    chart.data.datasets[i].data[1] -= lastMeasureTimes[i][1];
    chart.data.datasets[i].data[2] -= lastMeasureTimes[i][2];
  }
  chart.update();
  setLastMeasureTimes(cpus);
  getSysInfo()
}

function getCpuTimes(cpu) {
  return [
    cpu.times.user,
    cpu.times.sys,
    cpu.times.idle,
  ];
}

function drawChart() {
  chart = new Chart($('.chart'), {
    type: 'doughnut',
    data: {
      labels: [
        'User Time (ms)',
        'System Time (ms)',
        'Idle Time (ms)'
      ],
      datasets: getDatasets()
    },
    options: {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'CPU Activity',
        fontColor: 'rgb(0,0,0)',
        fontSize: 16
      },
      legend: {
        display: true,
        labels: {
          fontColor: 'rgb(0,0,0)',
          fontSize: 12
        }
      }
    }
  });

  setInterval(updateDatasets, 2000);
}

$(() => {
  setLastMeasureTimes(os.cpus());
  drawChart();
  getSysInfo()
})