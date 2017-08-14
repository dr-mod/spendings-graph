
var ctx = document.getElementById('chart').getContext('2d');

var colors = {
  blue : "rgb(54, 162, 235)",
  green : "rgb(75, 192, 192)",
  grey : "rgb(201, 203, 207)",
  turquoise :"rgb(64, 224, 208)",
  orange : "rgb(255, 159, 64)",
  purple : "rgb(153, 102, 255)",
  red : "rgb(255, 99, 132)",
  yellow : "rgb(255, 205, 86)",
  violet : "rgb(238, 130, 238)"
}

var colorNames = ["blue", "violet", "green", "grey", "orange", "purple", "red", "yellow", "turquoise" ]

function genBackgroundColors(colorsCount) {
  var backgroundColors = [];
  for (var i = 0; i < colorsCount; i++){
    var colorNumber = i % colorNames.length;
    var color = colors[colorNames[colorNumber]];
    backgroundColors.push(color);
  }
  return backgroundColors;
}

function createChart(data) {
  new Chart(ctx, {
      type: 'doughnut',
 
      data: {
          labels: [...data.keys()],
          datasets: [{
              label: "My First dataset",
              backgroundColor: genBackgroundColors(data.size), 
              data: [...data.values()],
          }]
      },
 
      options: {}
  });
  $('#container').removeClass('hide');
  console.log([...data.keys()], [...data.values()])
}

function aggregate(spendings) {
  var map = new Map();
  spendings.forEach((spending) => {
    if (map.has(spending[0])) {
      var amount = map.get(spending[0]);
      amount += spending[1];
      map.set(spending[0], amount);
    } else {
      map.set(spending[0], spending[1]);
    }
  });
  return map;
}

var buttonStream = Rx.Observable.fromEvent(document.getElementById('files'), 'change')
   .map((x)=> x.target.files[0]);
var dropStream = Rx.Observable.fromEvent(document.getElementById('drop-zone'), 'drop')
  .map((x)=> x.dataTransfer.files[0]);
  
Rx.Observable.merge(buttonStream, dropStream)
  .flatMap((file) => Rx.Observable.bindCallback((filee, callback) => Papa.parse(filee, { complete : callback}))(file))
  .map((csv) => csv[0].data)
  .map((csv) => csv.slice(1))
  .map((csv) => csv.filter((x) => typeof x[2] !== 'undefined'))
  .map((csv) => csv.map((x) => [x[2], (-1) * parseFloat(x[3])]))
  .map(aggregate)
  .subscribe(createChart)
  
  
var dropZone = $('#drop-zone');

dropZone[0].ondrop = function(e) {
  e.preventDefault();
}

dropZone[0].ondragover = function() {
  $(this).addClass('drop');
  return false;
}

dropZone[0].ondragleave = function() {
  $(this).removeClass('drop');
  return false;
}