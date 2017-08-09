var babyparse = require("babyparse");


var csv = babyparse.parseFiles("data.csv").data;

csv.shift();
var cat = csv.map((x) => {
 return {x[2] : x[3]}
})
var result = cat.reduce((result, line) => {
  if(!(line[0] in result)) {
    result[line[0]] = line[1]
  } else {
    result[line[0]] += line[1]; 
  }
  return result;
});
console.log(result);