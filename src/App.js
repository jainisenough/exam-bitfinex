import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './stores';
import Routes from './routes';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <Routes />
            </Provider>
        );
    }
}