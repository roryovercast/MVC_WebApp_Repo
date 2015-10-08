var bardata = [40, 800, 100, 80, 30, 70, 15, 40, 80];

var height = 400,
    width = 600,
    barWidth = 50,
    barOffset = 5,
    barPad = .2,
    barOuterPad = .2;

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

//var handleD3Update = function () {

    var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, height - 10])

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0, bardata.length))
        .rangeBands([0, width], barPad, barOuterPad)

    d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#C9D7D6')
        .selectAll('rect').data(bardata)
        .enter().append('rect')
            .style('fill', '#C61C6F')
            .attr('width', xScale.rangeBand())
            .attr('height', function (d) {
                return yScale(d);
            })
            .attr('x', function (d, i) {
                return xScale(i);
            })
            .attr('y', function (d) {
                return height - yScale(d);
            })
//}; 
/*setInterval (function() {
    var intNewNum = getNewNumber();
    bardata.pop();
    bardata.push(intNewNum);
    handleD3Update();
}, 1000);*/