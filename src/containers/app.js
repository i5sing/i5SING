/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
import {Router, Route, hashHistory, Redirect} from 'react-router'

//components
import Nav from '../components/nav';
import Header from '../components/header';
import Footer from '../components/footer';

//containers
import Welcome from './welcome';
import Home from './home';
import Appearance from './appearance';

let routes = (
    <Router>
        <Route path="/appearance" component={Appearance}/>
        <Route path="*" component={Appearance}/>
    </Router>
);

export default class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="elsa-app-container">
                <header className="header">
                    <Header />
                </header>
                <nav className="navigator">
                    <Nav />
                </nav>
                <div className="panel">
                    <Router history={hashHistory} routes={routes}/>
                </div>
                <footer className="footer">
                    <Footer />
                </footer>
            </div>
        )
    }
}