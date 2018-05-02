var Chart = require('chart.js')

exports.lineChart = function lineChart(ctx, trainingData) {
    let datasets = [{
        label: 'confidence',
        fill: false,
        data: trainingData.map(data => data.phaseVector[0])
    },{
        label: 'blocks.length',
        fill: false,
        data: trainingData.map(data => data.phaseVector[1])
    },{
        label: 'lines.length',
        fill: false,
        data: trainingData.map(data => data.phaseVector[2])
    },{
        label: 'symbols.length',
        fill: false,
        data: trainingData.map(data => data.phaseVector[3])
    },{
        label: 'words.length',
        fill: false,
        data: trainingData.map(data => data.phaseVector[4])
    }];
    let labels = Array.apply(null, { length: trainingData.length }).map(Number.call, Number);
    let myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets
        },
    });
}