/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    getUserInfo,
    getUserSongs
} from '../actions/singer';
import {play, playAll} from '../actions/common';
import {SongTable, Pagination, Button} from '../components';

const mapStateToProps = state => ({
    singer: state.singer
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getUserInfo,
        getUserSongs,
        play,
        playAll
    }, dispatch),
    dispatch
});

class Singer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songType: 'yc',
            page: 1,
            pageSize: 20
        }
    }

    componentDidMount() {
        this.userId = this.props.routeParams.userId;
        let state = this.state;
        this.props.action.getUserInfo(this.userId);
        this.props.action.getUserSongs(this.userId, state.songType, state.page, state.pageSize);
    }

    changeSongType(type) {
        let state = this.state;
        if (type == state.songType) return;

        this.setState({songType: type, page: 1});
        this.props.action.getUserSongs(this.userId, type, 1, state.pageSize);
    }

    onPageChange(page) {
        let state = this.state;
        this.setState({page: page});
        this.props.action.getUserSongs(this.userId, state.songType, page, state.pageSize);
    }

    playAll() {
        let userSongs = this.props.singer.userSongs;
        this.props.action.playAll(userSongs.map(song => {
            return {
                id: song.ID,
                type: song.SK,
                name: song.SN,
                singer: song.user.NN,
                singerId: song.user.ID,
                singerImg: song.user.I
            }
        }));
    }

    render() {
        let userInfo = this.props.singer.userInfo || {},
            userSongs = this.props.singer.userSongs || [];
        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list elsa-list-2">
                    <div className="elsa-panel-body elsa-panel-body-bg elsa-list-body clear-fix">
                        <img src={userInfo.I}/>
                        <div className="elsa-list-info">
                            <h3 className="elsa-list-title highlight-bold">{userInfo.NN}</h3>
                            <div className="light-color elsa-list-desc">
                                {`${userInfo.P} ${userInfo.C},  ${userInfo.SX == 1 ? '女' : '男'},  生日:${userInfo.B}`}
                            </div>
                            <div className="light-color elsa-list-description">{userInfo.M}</div>
                            <div className="btn-group">
                                <ul className="tab">
                                    <li className={`pointer ${this.state.songType == 'yc' ? 'active' : ''}`}
                                        onClick={this.changeSongType.bind(this, 'yc')}>原创
                                    </li>
                                    <li className={`pointer ${this.state.songType == 'fc' ? 'active' : ''}`}
                                        onClick={this.changeSongType.bind(this, 'fc')}>翻唱
                                    </li>
                                    <li className={`pointer ${this.state.songType == 'bz' ? 'active' : ''}`}
                                        onClick={this.changeSongType.bind(this, 'bz')}>伴奏
                                    </li>
                                </ul>
                                <Button type="primary" size="large" onClick={this.playAll.bind(this)}>
                                    <i className="fa fa-play"/>播放全部
                                </Button>
                                <Button type="default" size="large">
                                    <i className="fa fa-download"/>下载
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="elsa-panel-body elsa-list-body clear-fix">
                        <SongTable songs={userSongs}
                                   page={this.state.page}
                                   pageSize={this.state.pageSize}/>
                        <Pagination count={this.props.singer.count}
                                    onChange={this.onPageChange.bind(this)}
                                    page={this.state.page}
                                    pageSize={this.state.pageSize}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Singer);