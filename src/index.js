const Layer = require('synaptic').Layer
const Network = require('synaptic').Network
const Tesseract = require('tesseract.js')

class Shakalov {
    constructor() {
        const trainingData = [];
        const LEARNING_RATE = .1;
        const ETHALON_WIDTH = 50;
        const ETHALON_HEIGHT = 50;
        console.log('Initializing neural network...\nCreating layers...');
        var inputLayer = new Layer(ETHALON_HEIGHT * ETHALON_WIDTH);
        var hidden1Layer = new Layer(250);
        var outputLayer = new Layer(1);

        console.log('Linking layers...');
        inputLayer.project(hidden1Layer);
        hidden1Layer.project(outputLayer);

        console.log('Creating network...');
        let myNetwork = new Network({
            input: inputLayer,
            hidden: [hidden1Layer],
            output: outputLayer
        });
        console.log(myNetwork);
        console.log('Done!');
    }

    activate(images) {
        Array.from(images).forEach(image => {
            Tesseract.recognize(image, 'rus')
                .progress(function (p) { console.log('progress', p) })
                .then(function (result) {
                    let normalBoxes = this.normalize(result.blocks[0].bbox, result.words.map(w => w.bbox));
                    let vector =this. boxesToVector(normalBoxes);
                    console.log(this.myNetwork.activate({
                        data: vector
                    }));
                });
        });
    }

    propagate(images, answer) {
        console.log(images);
        Array.from(images).forEach((image, index) => {
            Tesseract.recognize(image, 'rus')
                .progress(function (p) {
                    console.log(p);
                })
                .then(function (result) {
                    let normalBoxes = this.normalize(result.blocks[0].bbox, result.words.map(w => w.bbox));
                    let vector = this.boxesToVector(normalBoxes);
                    this.trainingData.push({
                        data: vector,
                        answer
                    });
                    /* let canvas2 = appendCanvas(block);
                    let canvasContext2 = canvas2.getContext("2d");
                    for (let i = 0; i < vector.length; i++) {
                        vector[i] && canvasContext2.fillRect(i % ETHALON_HEIGHT, Math.trunc(i / ETHALON_HEIGHT), 1, 1);
                    } */
                });
        });
    }

    training() {
        console.log(this.trainingData);
        for (let i = 0; i < 10; i++) {
            this.trainingData.forEach((t, i, arr) => {
                console.log(`Progress ${Math.round(i / arr.length * 100 )}%`);
                this.myNetwork.activate(t.data);
                this.myNetwork.propagate(this.LEARNING_RATE, [t.answer]);
            });
        }
    }

    normalize(outerBox, boxes) {
        const koefX = (outerBox.x1 - outerBox.x0) / this.ETHALON_WIDTH;
        const koefY = (outerBox.y1 - outerBox.y0) / this.ETHALON_HEIGHT;
        return boxes.map(b => {
            return {
                x0: (b.x0 - outerBox.x0) / koefX,
                x1: (b.x1 - outerBox.x0) / koefX,
                y0: (b.y0 - outerBox.y0) / koefY,
                y1: (b.y1 - outerBox.y0) / koefY
            }
        });
    }

    boxesToVector(boxes) {
        let vector = new Array(this.ETHALON_WIDTH * this.ETHALON_HEIGHT)
        boxes.forEach(box => {
            console.trace(box);
            let x0 = Math.round(box.x0);
            let x1 = Math.round(box.x1);
            let y0 = Math.round(box.y0);
            let y1 = Math.round(box.y1);
            for (let i = x0; i < x1; i++) {
                for (let j = y0; j < y1; j++) {
                    vector[i + j * this.ETHALON_WIDTH] = 1;
                }
            }
        });
        return vector;
    }
}

module.exports = Shakalov;