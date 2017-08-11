var babyparse = require("babyparse");
var Rx = require('rxjs/Rx');

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

var csv = babyparse.parseFiles("data.csv").data;

Rx.Observable.of(csv)
.map((csv) => csv.slice(1))
.map((csv) => csv.filter((x) => typeof x[2] !== 'undefined'))
.map((csv) => csv.map((x) => [x[2], parseFloat(x[3])]))
//.flatMap((x) => Rx.Observable.from(x))
.map(aggregate)
.forEach((x) => console.log(x));