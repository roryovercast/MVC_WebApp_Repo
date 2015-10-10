//********Setting up bardata variable***********\\
var bardata = [];
for (var i = 0; i < 50; i++) {
    bardata.push(Math.round(Math.random()*30+1))
}
/*bardata.sort(function compareNumbers(a, b) {
    return a - b;
})*/

//********Setting up chart variables************\\

//Chart Dimensions/Margins/Padding
var margin = { top: 30, right: 30, bottom: 30, left: 30 }
var height = 600 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right,
	barWidth = 50,
	barOffset = 5,
	barPad = .2,
	barOuterPad = 0;

//Colors
var tempColor;
var colors = d3.scale.linear()
    .domain([0, bardata.length*.33, bardata.length*.66, bardata.length])
    .range(['#B58929','#C61C6F', '#268BD2', '#85992C'])

//Scales
var yScale = d3.scale.linear()
    .domain([0, d3.max(bardata)])
    .range([0, height - 10])

var xScale = d3.scale.ordinal()
    .domain(d3.range(1, bardata.length))
    .rangeBands([0, width], barPad, barOuterPad)
     
//Tool tip for Mouseover
var tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0)

//Start of chart
var myChart = d3.select('#chart').append('svg')
    .style('background' , '#E7E0CB')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

var bars = myChart.selectAll('rect').data(bardata)

bars.enter().append('rect')
    .style('fill', function(d, i) {
        return colors(i);
    })
    .attr('width', xScale.rangeBand())
    .attr('x', function (d, i) {
        return xScale(i);
    })
    .attr('height', 0)
    .attr('y', height)

    //Events on the Chart
    .on('mouseover', function (d) {
        tooltip.transition()
            .style('opacity', .9)
        tooltip.html(d)
            .style('left', (d3.event.pageX - 15) + 'px')
            .style('top', (d3.event.pageY - 35) + 'px')
        tempColor = this.style.fill;
        d3.select(this)
            .style('opacity', .5)
            .style('fill', 'yellow')
    })
    .on('mouseout', function (d) {
        d3.select(this)
            .style('opacity', 1)
            .style('fill', tempColor)
    })

    //Transitions
    .transition()
        .attr('height', function (d) {
            return yScale(d);
        })
        .attr('y', function (d) {
            return height - yScale(d);
        })
        .delay(function (d, i) {
            return i * 20;
        })
        .duration(1000)
        .ease('elastic')

//Axis creation
var vGuideScale = d3.scale.linear()
    .domain([0, d3.max(bardata)])
    .range([height, 0])

var vAxis = d3.svg.axis()
    .scale(vGuideScale)
    .orient('left')
    .ticks(10)

var vGuide = d3.select('svg').append('g')
vAxis(vGuide)
vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
vGuide.selectAll('path')
    .style({ fill: 'none', stroke: "#000" })
vGuide.selectAll('line')
    .style({ stroke: "#000" })

var hAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickValues(xScale.domain().filter(function (d, i) {
        return !(i % (bardata.length / 5));
    }))

var hGuide = d3.select('svg').append('g')
hAxis(hGuide)
hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
hGuide.selectAll('path')
    .style({ fill: 'none', stroke: "#000" })
hGuide.selectAll('line')
    .style({ stroke: "#000" })


//Random Data Generation
var getNewNumber = function (intMax, intFloor) {
    if (!intMax) {
        intMax = 100;
    }
    if (!intFloor) {
        intFloor = 1;
    }
    var intMyNum = Math.floor((Math.random() * intMax) + intFloor);
    return intMyNum;
};
setInterval (function() {
    var intNewNum = getNewNumber();
    if (bardata.length=50){
        bardata.shift();
    }
    bardata.push(intNewNum);
    console.log(bardata);
}, 1000);