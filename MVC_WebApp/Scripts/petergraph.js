/*
<style>
svg {
    background: lightgrey;
}
rect {
    fill: lightblue;
    stroke: darkgrey;
}
</style>
<div id="chart">
</div>
<script src="d3.min.js"></script>
<!-- <script src="fixer.js" type="application/javascript;version=1.7">
</script> -->
<script type="application/javascript;version=1.7">
*/

function randInt(floor, max) {
    return Math.floor((Math.random() * max) + floor);
}

function *genData() {
    let i = 1;
    while (true) {
        yield {id: i, value: randInt(1, 10)};
        i++;
    }
}

let dataStream = genData();

let data = [dataStream.next().value];



var svg = d3.select('body').append('svg')
    .attr({height: 500, width: 500});
    
function enterBars(selection) {
    selection.enter().append('rect')
        .attr({height: 50, width: 50})
        .attr('y', (d, i) => i * 50)
        .attr('width', (d) => d.value * 50)
        .attr('x', 500)
}

function updateBars(selection) {
    selection.attr('y', (d, i) => i * 50)
        .attr('width', (d) => d.value * 50)
        .attr('x', 0)
}


var rect = svg.selectAll('rect').data(data, (d) => d.id);
rect.call(enterBars);
rect.transition().call(updateBars);


setInterval(function () {
    
    if (data.length == 10) {
        data.shift();
    }
    data.push(dataStream.next().value);
    
    var rect = svg.selectAll('rect').data(data, (d) => d.id);
    rect.call(enterBars);
    rect.transition().call(updateBars);
    rect.exit().transition()
        .attr('x', 500)
        .remove();

}, 1000);
