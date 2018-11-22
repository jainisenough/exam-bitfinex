import React, {Component} from 'react';
import {socketConnection} from "../../helpers";
import {Table, Collapse} from 'react-bootstrap';

export default class OrderBookComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        };
        this.ws = null;
    }

    _createSocket() {
        let msg = JSON.stringify({
            event: 'subscribe',
            channel: 'book',
            prec: 'P0',
            symbol: 'tBTCUSD'
        });
        this.ws = socketConnection(msg);
    }

    componentWillMount() {
        this._createSocket();
        this.ws.onmessage = msg => {
            try {
                const data = JSON.parse(msg.data);
                if (data.length && data[1] && Array.isArray(data[1]) && data[1].length) {
                    const obj = {
                        price: data[1][0],
                        count: data[1][1],
                        amount: data[1][2].toFixed(2),
                        total: data[1][2].toFixed(2)
                    };

                    let arr = [...this.state.orders];
                    arr.push(obj);

                    if (arr.length > 20)
                        arr = arr.splice(arr.length - 20);

                    this.setState({orders: arr});
                }
            } catch (e) {
            }
        };
        this.ws.onclose = () => {
            this.ws = null;

            //Reconnect on lost
            setTimeout(this._createSocket, 5000);
        };
        /*let url = `${API_URL}/book/tBTCUSD/P0`;
        fetch(url)
            .then(response => response.json())
            .then(console.log.bind(console.log));*/
    }

    render() {
        return (
            <div style={{width: "33%", float: "left"}}>
                <p onClick={() => this.setState({ openOrder: !this.state.openOrder })}>Order Component</p>
                <Collapse in={!this.state.openOrder}>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Count</th>
                        <th> Amount</th>
                        <th> Total</th>
                        <th> Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.orders.map((order, i) => {
                            return  <tr key={i}>
                                <th>{order.count}</th>
                                <th> {order.amount}</th>
                                <th> {order.total}</th>
                                <th> {order.price}</th>
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
            channel: 'book',
        });
        this.ws.send(msg);
    }
}