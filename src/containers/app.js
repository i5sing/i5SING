/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
import {Router, Route, hashHistory, Redirect} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'
import {
    getPersonalInfo,
    checkLoginStatus,
    logout
} from '../actions/app';

//backend
const ipc = require('../backend/ipc');

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
import MySong from './my_song';
import PlayList from './playlist';
import Lrc from './lrc';
import Columns from './columns';
import Search from './search';
import Attention from './my_attention';
import Fans from './my_fans';
import MyCollectons from './my_collection';

let routes = (
    <Router>
        <Route path="/appearance" component={Appearance}/>
        <Route path="/special-column" component={Columns}/>
        <Route path="/user/:userId" component={Singer}/>
        <Route path="/rank/:rankId" component={RankList}/>
        <Route path="/rank" component={Rank}/>
        <Route path="/collection" component={Collections}/>
        <Route path="/collection/:collectionId" component={Collection}/>
        <Route path="/webview" component={WebView}/>
        <Route path="/square" component={Square}/>
        <Route path="/my_song" component={MySong}/>
        <Route path="/my_attention" component={Attention}/>
        <Route path="/my_fans" component={Fans}/>
        <Route path="/my_collections" component={MyCollectons}/>
        <Route path="/search" component={Search}/>
        <Route path="*" component={Appearance}/>
    </Router>
);

const mapStateToProps = state => ({
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getPersonalInfo,
        checkLoginStatus,
        logout
    }, dispatch),
    dispatch
});

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playListOpen: false,
            lrcOpen: false
        };
    }

    togglePlayListPanel() {
        this.setState({
            lrcOpen: false,
            playListOpen: !this.state.playListOpen
        })
    }

    toggleLrcPanel() {
        this.setState({
            playListOpen: false,
            lrcOpen: !this.state.lrcOpen
        })
    }

    openLoginWin() {
        ipc.render.send(`open-login-win`);
    }

    closePanel() {
        if (!this.state.playListOpen && !this.state.lrcOpen) return;

        this.setState({
            playListOpen: false,
            lrcOpen: false
        })
    }

    componentDidMount() {
        this.props.action.checkLoginStatus();
        ipc.render.on('login-success-to-main-win', (event, info) => {
            this.props.action.getPersonalInfo(info.userId, info.sign);
        })
    }

    render() {
        return (
            <div className="elsa-app-container">
                <header className="header">
                    <Header />
                </header>
                <nav className="navigator" onClick={this.closePanel.bind(this)}>
                    <Nav info={this.props.app.info}
                         logout={this.props.action.logout}
                         login={this.openLoginWin.bind(this)}/>
                </nav>
                <div className="panel" id="panel" onClick={this.closePanel.bind(this)}>
                    <Router history={hashHistory} routes={routes}/>
                </div>
                <footer className="footer">
                    <Footer info={this.props.app.info}
                            openLrc={this.toggleLrcPanel.bind(this)}
                            openPlayList={this.togglePlayListPanel.bind(this)}/>
                </footer>
                <ReactCSSTransitionGroup transitionName="slide"
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}>
                    {this.state.playListOpen && (<div className="play-list" key="play-list">
                        <PlayList />
                    </div>)}
                    {this.state.lrcOpen && (<div className="play-list" key="lrc-list">
                        <Lrc song={this.state.currentSong}/>
                    </div>)}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);