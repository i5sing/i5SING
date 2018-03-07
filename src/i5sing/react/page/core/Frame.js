/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {send, on} from '../../utils/ipc';
import {
    getPersonalInfo,
    checkLoginStatus,
    logout
} from '../../redux/action/core';

//components
import Nav from '../../components/Navigator';
import Header from './Header';
import Footer from './Footer';
import PlayList from './PlayList';
import Lrc from './LRC';

import './Frame.less';

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

class Core extends React.Component {

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
        send(`open-login-win`);
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
        on('login-success-to-main-win', (event, info) => {
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
                    {this.props.children}
                </div>
                <footer className="footer">
                    <Footer info={this.props.app.info}
                            openLrc={this.toggleLrcPanel.bind(this)}
                            openPlayList={this.togglePlayListPanel.bind(this)}/>
                </footer>
                <ReactCSSTransitionGroup transitionName="slide"
                                         transitionEnterTimeout={400}
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

export default connect(mapStateToProps, mapDispatchToProps)(Core);