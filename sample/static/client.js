class ShakalovApp extends React.Component {

    sendPropagation(event, answer) {
        var formData = new FormData();
        Array.from(event.target.files).forEach((file, i) => formData.append(`photo${i}`, file));
        axios.post(`/propagation?answer=${answer}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(answer);
        console.log(event.target.files);
    }

    training() {
        axios.get('/training')
            .then(response => console.log(response))
            .catch(error => console.error(error));
    }

    activate(event) {
        console.log(event.target.files);
    }

    render() {
        return (
            <div>
                <div id="good">
                    <h2>Годные паспорта</h2>
                    <input type="file" onChange={(event) => this.sendPropagation(event, 1)} multiple />
                </div>
                <div id="bad">
                    <h2>Плохие паспорта</h2>
                    <input type="file" onChange={(event) => this.sendPropagation(event, 0)} multiple />
                </div>
                <div>
                    <button onClick={this.training}>Обучить сеть</button>
                </div>

                <div id="test">
                    <h2>Контрольные изображения</h2>
                    <input type="file" onChange={this.activate} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <ShakalovApp />,
    document.getElementById('content')
);