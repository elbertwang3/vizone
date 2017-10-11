var stations = []; // lazily loaded

var formatTime = d3.time.format("%I:%M%p");

var margin = {top: 20, right: 30, bottom: 20, left: 100},
    trainwidth = 960 - margin.left - margin.right,
    trainheight = 600 - margin.top - margin.bottom;

var formatTime2 = d3.time.format("%I:%M");


var x = d3.time.scale()
    .domain([parseTime2("5:30"), parseTime2("24:00")])
    .range([0, trainwidth]);

var y = d3.scale.linear()
    .domain([0, 5527])
    .range([0, trainheight]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(8)
    .tickFormat(formatTime);


d3.csv("../data/hyperloop.csv", function(data) {
  console.log(data);
  var svg2 = d3.select("#train").append("svg")
      .attr("width", trainwidth+margin.left+margin.right)
      .attr("height", trainheight+margin.top+margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  aatip = d3.select("#train").append("div")  
        .attr("class", "tooltip")
        .style("left", 1000 + "px")    
        .style("top", 1300 + "px");
  var cities = ["Seattle", "San Francisco", "Los Angeles", "Austin", "Boulder", "Chicago", "New York", "Boston"]
  var city_distances = [0, 807, 1190, 2567, 3503, 4521, 5311, 5527]
  svg2.selectAll("text").data(cities).enter().append("text")
    .text(function (d) { return d; })
    .attr("x",0)
    .attr("y", function (d, i) { return y(city_distances[i])})
    .attr("fill", "black")
    .style("text-anchor", "end")

  svg2.selectAll("line").data(cities).enter().append("line")
    .attr('x1', 0)
    .attr("x2", trainwidth)
    .attr("stroke", "#ddd")
    .attr("stroke-dasharray", "1,1")
    .attr("stroke-width", 2)
    .attr('y1', function (d, i) { return y(city_distances[i])})
    .attr('y2', function (d, i) { return y(city_distances[i])})

  svg2.append("g")
    .attr("class", "x top axis")
    .call(xAxis.orient("top"));

  svg2.append("g")
    .attr("class", "x bottom axis")
    .attr("transform", "translate(0," + trainheight + ")")
    .call(xAxis.orient("bottom"));

  var stops = ["Seattle arrive" , "Seattle depart", "San Francisco arrive", "San Francisco depart", "Los Angeles arrive", "Los Angeles depart", "Austin arrive", "Austin depart", "Boulder arrive", "Boulder depart", "Chicago arrive", "Chicago depart", "New York arrive", "New York depart", "Boston arrive", "Boston depart"]
  var city_distances2 = [0, 0, 807, 807, 1190, 1190, 2567, 2567, 3503, 3503, 4521, 4521, 5311, 5311, 5527, 5527]

  var i;
  for (i = 0; i < data.length; i++) {
    schedule = []
    train_times = []
    train = data[i]["train_name"]
    console.log(data[i])
    string = train + " : " + JSON.stringify(data[i])
    var htmlstring =  "<h5> Schedule </h5>"
    for (var property in data[i]) {
      if (data[i].hasOwnProperty(property) && property != "train_name") {
        // do stuff
        if (data[i][property] != "") {
          htmlstring += property + " : " + data[i][property] + "<br>"
        }
      }
    }
    delete data[i].train_name
    var j = 0
    for (var property in data[i]) {
      time = data[i][property]
      if (time != "") {
        schedule.push({x: x(parseTime2(time)), y: y(city_distances2[j])})
        train_times.push({stop: stops[j], time: time})
      }
      j++;
    }
    schedule.sort(function(a, b) {
      return a.x - b.x;
    });
    var d3line2 = d3.svg.line()
      .x(function(d){return d.x;})
      .y(function(d){return d.y;})
      .interpolate("linear");

    svg2.append("svg:path")
      .attr("d", d3line2(schedule))
      .style("stroke-width", 2)
      .style("stroke", "steelblue")
      .style("fill", "none")
      .on("mouseover", function() {
        d3.select(this)
        .style("stroke", "orange");    
        

        aatip.html(htmlstring);
    

    
        aatip.transition()   
          .duration(200)     
                .style("opacity", "1")

      })    
      
      .on("mouseout", function() {
        d3.select(this)
        .style("stroke", "steelblue")
        aatip.transition()    
              .duration(200)    
              .style("opacity", "0"); 
      })
      //.append("svg:title")
      //.text(string);
    }
});
  



function parseTime(s) {
  var t = formatTime.parse(s);
  if (t != null && t.getHours() < 3) t.setDate(t.getDate() + 1);
  return t;
}
function parseTime2(s) {
  var t = formatTime2.parse(s);
  return t;
}