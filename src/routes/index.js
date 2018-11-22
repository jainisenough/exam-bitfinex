import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomeComponent from '../components/Home';

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Route path="/" component={HomeComponent} />
            </Router>
        )
    }
}