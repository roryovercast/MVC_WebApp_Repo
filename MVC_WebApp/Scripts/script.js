var bardata = [40, 80, 60, 70, 15, 40, 80, 40, 80, 100, 80, 60, 70, 15, 40, 80, 40, 80, 100, 80, 60, 70, 15, 40, 80];

bardata.sort(function compareNumbers(a, b) {
    return a - b;
})

var height = 400,
    width = 600,
    barWidth = 50,
    barOffset = 5,
    barPad = .2,
    barOuterPad = .2;

var tempColor;

var colors = d3.scale.linear()
    .domain([0, bardata.length*.33, bardata.length*.66, bardata.length])
    .range(['#B58929','#C61C6F', '#268BD2', '#85992C'])

/*var getNewNumber = function (intMax, intFloor) {
    // intMax lets you define a maximum value
    // intFloor lets you define a min value
    // intMax can only be omitted if both are omitted
    if (!intMax) {
        intMax = 100;
    }
    if (!intFloor) {
        intFloor = 1;
    }
    var intMyNum = Math.floor((Math.random() * intMax) + intFloor);
    return intMyNum;
};*/


var yScale = d3.scale.linear()
    .domain([0, d3.max(bardata)])
    .range([0, height - 10])

var xScale = d3.scale.ordinal()
    .domain(d3.range(0, bardata.length))
    .rangeBands([0, width], barPad, barOuterPad)
     
var tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0)

var myChart = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .selectAll('rect').data(bardata)
    .enter().append('rect')
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
myChart.transition()
    .attr('height', function (d) {
        return yScale(d);
    })
    .attr('y', function (d) {
        return height - yScale(d);
    })
    .delay(function (d, i) {
        return i * 100;
    })
    .duration(1000)
    .ease('elastic')

var vGuideScale = d3.scale.linear()
    .domain([0, d3.max(bardata)])
    .range([height, 0])

var vAxis = d3.svg.axis()
    .scale(vGuideScale)
    .orient('left')
    .ticks(10)

var vGuide = d3.select('svg').append('g')
    vAxis(vGuide)
    vGuide.attr('transform', 'translate(35, 0)')
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
    hGuide.attr('transform', 'translate(0, ' + (height - 30) + ')')
    hGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000" })
    hGuide.selectAll('line')
        .style({ stroke: "#000" })


/*setInterval (function() {
    var intNewNum = getNewNumber();
    bardata.pop();
    bardata.push(intNewNum);
    handleD3Update();
}, 1000);*/