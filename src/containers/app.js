/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
import {Router, Route, hashHistory, Redirect} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//components
import Nav from '../components/nav';

//containers
import Header from './header';
import Footer from './footer';
import RankList from './ranklist';
import Rank from './rank';
import Appearance from './appearance';
import Singer from './singer';
import Collections from './collections';
import Collection from './collection';
import WebView from './webview';
import Square from './square';

let routes = (
    <Router>
        <Route path="/appearance" component={Appearance}/>
        <Route path="/user/:userId" component={Singer}/>
        <Route path="/rank/:rankId" component={RankList}/>
        <Route path="/rank" component={Rank}/>
        <Route path="/collection" component={Collections}/>
        <Route path="/collection/:collectionId" component={Collection}/>
        <Route path="/webview" component={WebView}/>
        <Route path="/square" component={Square}/>
        <Route path="*" component={Appearance}/>
    </Router>
);

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playListOpen: false
        };
    }

    togglePlayListPanel() {
        this.setState({
            playListOpen: !this.state.playListOpen
        })
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
                <div className="panel" id="panel">
                    <Router history={hashHistory} routes={routes}/>
                </div>
                <footer className="footer">
                    <Footer openPlayList={this.togglePlayListPanel.bind(this)}/>
                </footer>
                <ReactCSSTransitionGroup transitionName="slide"
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}>
                    {this.state.playListOpen && (<div className="play-list" key="play-list">

                    </div>)}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}