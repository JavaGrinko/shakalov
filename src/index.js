const Layer = require('synaptic').Layer
const Network = require('synaptic').Network
var Tesseract = require('tesseract.js')

window.propagate = propagate
window.activate = activate
window.network = network;
window.training = training;

let myNetwork;
let trainingData = [];

function network() { return myNetwork }


function activate(images, answer) {
    console.log(images);
    Array.from(images).forEach(image => {
        Tesseract.recognize(image, 'rus')
            .progress(function (p) { console.log('progress', p) })
            .then(function (result) {
                console.log('result', result)
                let phaseVector = [
                    result.confidence,
                    result.blocks.length,
                    result.lines.length,
                    result.symbols.length,
                    result.words.length
                ];
                console.log(myNetwork.activate(phaseVector));
            });
    });
}

function propagate(images, answer) {
    console.log(images);
    if (answer != undefined) {
        for (let i = 0; i < images.length; i++) {
            let block = document.getElementById(answer ? "good" : "bad");
            let progress = document.createElement('progress');
            progress.id = `${(answer ? "good" : "bad") + i}`;
            progress.max = 100;
            block.appendChild(progress);
        }
    }
    
    Array.from(images).forEach((image, index) => {
        Tesseract.recognize(image, 'rus')
            .progress(function (p) { 
                document.getElementById(`${(answer ? 'good' : 'bad') + index}`).value = parseInt(p.progress * 100);
            })
            .then(function (result) {
                console.log('result', result)
                let phaseVector = [
                    result.confidence,
                    result.blocks.length,
                    result.lines.length,
                    result.symbols.length,
                    result.words.length
                ];
                trainingData.push({
                    phaseVector,
                    answer
                });
            });
    });
}

function training() {
    let learningRate = .01;
    console.log(trainingData);
    for (let i = 0; i < 10; i++) {
        trainingData.forEach(t => {
            myNetwork.activate(t.phaseVector);
            myNetwork.propagate(learningRate, [t.answer]);
        });
    }
}

(function () {
    console.log('Initializing neural network...')
    /*
        Фазовый вектор:
        0 - процент доверия (confidence)
        1 - кол-во блоков
        2 - кол-во строк
        3 - кол-во символов
        4 - кол-во слов
    */
    var inputLayer = new Layer(5);
    var hidden1Layer = new Layer(10);
    var outputLayer = new Layer(1);

    inputLayer.project(hidden1Layer);
    hidden1Layer.project(outputLayer);

    myNetwork = new Network({
        input: inputLayer,
        hidden: [hidden1Layer],
        output: outputLayer
    });
    console.log(myNetwork)
    console.log('OK');
})();