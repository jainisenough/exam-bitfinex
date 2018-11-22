import React, {Component} from 'react';
import OrderBookComponent from '../OrderBook';
import TickerComponent from '../Ticker';
import TradesComponent from '../Trades';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                      integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                      crossOrigin="anonymous" />
                <TickerComponent/>
                <OrderBookComponent />
                <TradesComponent />
            </React.Fragment>
        )
    }
}

export default HomeComponent;