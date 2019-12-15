
// Set the dimensions and margins of the graph

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 60,
    right: 100,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);

    
    // Step 1: Parse Data/Cast as numbers
    // // ==============================
    data.forEach(function(data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
      });
  
      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([38000, d3.max(data, d => d.income)])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([40, 0])
        .range([0, height]);
  
    //   // Step 3: Create axis functions
    //   // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
    //   // Step 4: Append Axes to the chart
    //   // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
    //   // Step 5: Create Circles
    //   // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.income))
      .attr("cy", d => yLinearScale(d.obesity))
      .attr("r", "10")
      .attr("fill", "rgb(13, 124, 146, 0.8)")
      .attr("opacity", ".7");
    
       //   // Step 6: Add State Abbreviations to the Circles
    //   // ==============================

      var textGroup = chartGroup.selectAll("stateText")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("class", "stateText")
      .attr("x", d => xLinearScale(d.income))
      .attr("y", d => yLinearScale(d.obesity));
      

     // Step 7: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class","d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Income:$${d.income}<br>Obesity: ${d.obesity}%`);
      });

    // Step 8: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 9: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

      
      // Step. 10 Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height /1.5))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Obesity (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width /2}, ${height + margin.top - 20})`)
        .attr("class", "aText")
        .text("Income ($)");
    }).catch(function(error) {
    console.log(error);
    });
  