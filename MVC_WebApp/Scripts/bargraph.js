"use strict";

//********Setting up bardata variable***********\\

function randInt(floor, max) {
    if (!max) {
        max = 100;
    }
    if (!floor) {
        floor = 1;
    }
    return Math.floor((Math.random() * max) + floor);
}

function *genData() {
	let max = 50;
	while (true) {
		yield {timestamp: new Date(), value: randInt(1, max)};
		max++;
	}
}

let dataStream = genData();

let bardata = [dataStream.next().value];

//********Setting up chart variables************\\

//Chart Dimensions/Margins/Padding
var margin = { top: 30, right: 30, bottom: 30, left: 35 }
var height = 600 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right,
    barWidth = 50,
    barOffset = 5,
    barPad = .2,
    barOuterPad = 0;

//Colors
var colors = d3.time.scale().range(['#222', '#89d']);
//var colors = d3.scale.category10();

//Scales
var yScale = d3.scale.linear()
    .range([height, 0]);
	
var xScale = d3.scale.ordinal()
    .rangeBands([0, width], barPad, barOuterPad);
var xAxisScale = d3.time.scale()
	.range([0, width]);

function updateScales() {
	let maxValue = d3.max(bardata.map(d => d.value));
	let timeExtent = d3.extent(bardata.map(d => d.timestamp));
	
	colors.domain(timeExtent);
	yScale.domain([0, maxValue]);
	xScale.domain(bardata.map(d => d.timestamp));
	xAxisScale.domain(timeExtent);
}

//Tool tip for Mouseover
var tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0);
	
var svg = d3.select('#chart').append('svg')
    .style('background' , '#E7E0CB')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
	
// Axis creation
var vAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(10)
	.innerTickSize(-width);

let yAxis = svg.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`)
	.attr('class', 'axis');
	
var hAxis = d3.svg.axis()
    .scale(xAxisScale)
    .orient('bottom')
    //.tickValues([0,10,20,30,40]);

let xAxis = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
	.attr('class', 'axis');
	
// let line = d3.svg.line()
    // .x(d => xScale(d.timestamp) + xScale.rangeBand()/2)
    // .y(d => yScale(d.value));
    
//Start of chart
var myChart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
// let myPath = myChart.append('path');
	
function hoverTooltip(selection, makeText) {
	selection.on('mouseover', function (d) {
            tooltip.transition()
                .style('opacity', .9);
            tooltip.html(makeText(d))
                .style('left', `${d3.event.pageX - 15}px`)
				.style('top', `${d3.event.pageY - 35}px`);
            d3.select(this)
                .style('opacity', .5)
                .style('fill', 'yellow');
        })
        .on('mouseout', function (d, i) {
            d3.select(this)
                .style('opacity', 1)
                .style('fill', colors(d.timestamp));
			tooltip.transition()
				.style('opacity', 0)
        });
}

function enterBars(bars) {
    bars.append('rect')
        .style('fill', (d) => colors(d.timestamp))
        .attr('width', xScale.rangeBand())
        .attr('x', (d, i) => xScale(d.timestamp) + xScale.rangeBand() * 1.2)
        .attr('height', (d) => height - yScale(d.value))
        .attr('y', (d) => yScale(d.value))
		.attr('opacity', 0)
		.call(hoverTooltip, (d) => d.value);
}

function updateBars(bars) {
    bars.style('fill', (d) => colors(d.timestamp))
		.attr('width', xScale.rangeBand())
		.attr('x', (d, i) => xScale(d.timestamp))
        .attr('height', (d, i) => height - yScale(d.value))
        .attr('y', (d) => yScale(d.value))
		.attr('opacity', 1);
}

function update(svg) {
	let duration = 500;

	updateScales();

	let bars = svg.selectAll('rect').data(bardata, (d) => d.timestamp);
	bars.enter().call(enterBars);
	bars.transition(duration).call(updateBars);
	bars.exit().transition(duration)
		.attr('width', 0)
		.remove();
        
    // myPath.datum(bardata)
        // .attr('d', line);
	
	yAxis.transition(duration).call(vAxis);
	//hAxis.tickValues(bardata.map(d => d.timestamp).filter(d => d % 5 == 0));
	xAxis.transition(duration).call(hAxis);
}
update(myChart);

setInterval (function() {
	if (bardata.length == 50) {
		bardata.shift();
	}
    bardata.push(dataStream.next().value);
    //console.log(bardata);
    
    update(myChart);
}, 1000);
