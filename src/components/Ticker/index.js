import React, {Component} from 'react';
import {socketConnection} from "../../helpers";
import {Collapse, Table} from 'react-bootstrap';

export default class TickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tickers: []
        };
        this.ws = null;
    }

    _createSocket() {
        let msg = JSON.stringify({
            event: 'subscribe',
            channel: 'ticker',
            symbol: 'tBTCUSD'
        });
        this.ws = socketConnection(msg);
    }

    componentWillMount() {
        this._createSocket();
        this.ws.onmessage = msg => {
            try {
                const data = JSON.parse(msg.data);
                if(data.length && data[1] && Array.isArray(data[1]) && data[1].length) {
                    console.log(data);
                    /*const date = new Date(data[2][1]);
                    const obj = {
                        time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                        amount: Math.abs(data[2][2]),
                        price: data[2][3],
                        tick: data[2][2] >= 0 ? 'U':'D'
                    };

                    let arr = [...this.state.tickers];
                    arr.push(obj);

                    if(arr.length > 20)
                        arr = arr.splice(arr.length - 20);

                    this.setState({ tickers: arr});*/
                }
            } catch(e) {}
        };
        this.ws.onclose = () => {
            this.ws = null;
            setTimeout(this._createSocket, 5000);
        }
        /*let url = `${API_URL}/ticker/tBTCUSD`;
        fetch(url)
            .then(response => response.json())
            .then(console.log.bind(console.log));*/
    }

    render() {
        return (
            <div style={{width: "33%", float: "left"}}>
                <p onClick={() => this.setState({ openTicker: !this.state.openTicker })}>Ticker Component</p>
                <Collapse in={!this.state.openOrder}>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th> Time</th>
                        <th> Price</th>
                        <th> Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.tickers.map((ticker, i) => {
                            return  <tr key={i}>
                                <th>{ticker.tick}</th>
                                <th> {ticker.time}</th>
                                <th> {ticker.price}</th>
                                <th> {ticker.amount}</th>
                            </tr>;
                        })
                    }
                    </tbody>
                </Table>
                </Collapse>
            </div>
        )
    }

    componentWillUnmount() {
        let msg = JSON.stringify({
            event: 'unsubscribe',
            channel: 'ticker',
        });
        this.ws.send(msg);
    }
}