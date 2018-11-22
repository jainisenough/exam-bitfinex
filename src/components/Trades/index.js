import React, {Component} from 'react';
import {socketConnection} from "../../helpers";
import {Collapse, Table} from 'react-bootstrap';

export default class TradesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trades: []
        };
        this.ws = null;
    }

    _createSocket() {
        let msg = JSON.stringify({
            event: 'subscribe',
            channel: 'trades',
            symbol: 'tBTCUSD'
        });
        this.ws = socketConnection(msg);
    }

    componentWillMount() {
        this._createSocket();
        this.ws.onmessage = msg => {
            try {
                const data = JSON.parse(msg.data);
                if(data.length && data[2] && Array.isArray(data[2]) && data[2].length) {
                    const date = new Date(data[2][1]);
                    const obj = {
                        time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                        amount: Math.abs(data[2][2]),
                        price: data[2][3],
                        tick: data[2][2] >= 0 ? 'U':'D'
                    };

                    let arr = [...this.state.trades];
                    arr.push(obj);

                    if(arr.length > 20)
                        arr = arr.splice(arr.length - 20);

                    this.setState({ trades: arr});
                }
            } catch(e) {}
        };

        this.ws.onclose = () => {
            this.ws = null;
            setTimeout(this._createSocket, 5000);
        }
        /*let url = `${API_URL}/trades/tBTCUSD/hist`;
        fetch(url)
            .then(response => response.json())
            .then(console.log.bind(console.log));*/
    }

    render() {
        return (
            <div style={{width: "33%", float: "left"}}>
                <p onClick={() => this.setState({ openTrader: !this.state.openTrader })}>Trader Component</p>
                <Collapse in={!this.state.openTrader}>
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
                        this.state.trades.map((trade, i) => {
                            return  <tr key={i}>
                                <th>{trade.tick}</th>
                                <th> {trade.time}</th>
                                <th> {trade.price}</th>
                                <th> {trade.amount}</th>
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
            channel: 'trades',
        });
        this.ws.send(msg);
    }
}