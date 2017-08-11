var babyparse = require("babyparse");


var csv = babyparse.parseFiles("data.csv").data;

csv.shift();
var cat = csv
  .filter((x) => typeof x[2] !== 'undefined')
  .map((x) => [x[2], parseFloat(x[3])]);
console.log(cat);

var result = cat.reduce((result, line) => {
  if(!(line[0] in result)) {
    result[line[0]] = line[1]
  } else {
    result[line[0]] += line[1]; 
  }
  return result;
});
console.log(result);