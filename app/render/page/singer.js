/**
 * Created by zhaofeng on 7/13/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    getUserInfo,
    getUserSongs,
    addToMyAttention,
    removeFromMyAttention,
    getUserCollections,
    getUserFans
} from '../redux/action/singer';
import {
    play,
    playAll
} from '../redux/action/common';
import {
    SongList,
    Pagination,
    Button,
    UserList
} from '../components';

const mapStateToProps = state => ({
    singer: state.singer,
    common: state.common
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getUserInfo,
        getUserSongs,
        play,
        playAll,
        addToMyAttention,
        removeFromMyAttention,
        getUserCollections,
        getUserFans
    }, dispatch),
    dispatch
});

class Singer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songType: 'yc',
            page: 1,
            pageSize: 20,
            userPageSize: 42
        };
    }

    componentDidMount() {
        this.userId = this.props.routeParams.userId;
        this.sign = this.props.common.info ? this.props.common.info.sign : null;
        this.myId = this.props.common.info ? this.props.common.info.id : null;
        let state = this.state;
        this.props.action.getUserInfo(this.userId, this.sign);
        this.props.action.getUserSongs(this.userId, state.songType, state.page, state.pageSize);
    }

    componentDidUpdate(prevProps) {
        let oldId = prevProps.params.userId;
        let newId = this.props.params.userId;
        if (newId !== oldId) {
            let state = this.state;
            this.userId = newId;
            this.props.action.getUserInfo(this.userId, this.sign);
            this.props.action.getUserSongs(this.userId, state.songType, state.page, state.pageSize);
            this.setState({
                songType: 'yc',
                page: 1
            });
        }
    }

    changeSongType(type) {
        let state = this.state;
        if (type == state.songType) return;

        this.setState({songType: type, page: 1});

        if (type == 'fans') {
            return this.props.action.getUserFans(this.userId, 1, state.userPageSize);
        }

        if (type == 'attention') {
            return this.props.action.getUserCollections(this.userId, 1, state.userPageSize);
        }

        this.props.action.getUserSongs(this.userId, type, 1, state.pageSize);
    }

    onPageChange(page) {
        let state = this.state;
        this.setState({page: page});

        if (state.songType == 'fans') {
            return this.props.action.getUserFans(this.userId, page, state.userPageSize);
        }

        if (state.songType == 'attention') {
            return this.props.action.getUserCollections(this.userId, page, state.userPageSize);
        }

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

    getPageSize() {
        if (this.state.songType == 'fans' || this.state.songType == 'attention') {
            return this.state.userPageSize;
        }

        return this.state.pageSize;
    }

    render() {
        let userInfo = this.props.singer.userInfo || {},
            userSongs = this.props.singer.userSongs || [],
            users = this.props.singer.users || [];

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
                                    <li className={`pointer ${this.state.songType == 'fans' ? 'active' : ''}`}
                                        onClick={this.changeSongType.bind(this, 'fans')}>粉丝
                                    </li>
                                    <li className={`pointer ${this.state.songType == 'attention' ? 'active' : ''}`}
                                        onClick={this.changeSongType.bind(this, 'attention')}>关注
                                    </li>
                                    <li className={`pointer ${this.state.songType == 'comment' ? 'active' : ''}`}
                                        onClick={this.changeSongType.bind(this, 'comment')}>评论
                                    </li>
                                </ul>
                                <Button type="primary" size="large" onClick={this.playAll.bind(this)}>
                                    <i className="fa fa-play"/>播放全部
                                </Button>
                                {!!this.sign && userInfo.ID != this.myId && (userInfo.follow === 0 ?
                                        <Button type="default" size="large"
                                                onClick={this.props.action.addToMyAttention.bind(this, userInfo.ID, this.sign)}>
                                            <i className={`fa fa-heart`}/>关注
                                        </Button> :
                                        <Button type="default" size="large"
                                                onClick={this.props.action.removeFromMyAttention.bind(this, userInfo.ID, this.sign)}>
                                            <i className={`fa fa-heart red`}/>取消关注
                                        </Button>
                                )}
                                <Button type="default" size="large">
                                    <i className="fa fa-download"/>下载
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="elsa-panel-body elsa-list-body clear-fix">
                        {this.state.songType !== 'fans' && this.state.songType !== 'comment' &&
                        this.state.songType !== 'attention' && (
                            <SongList songs={userSongs}
                                      page={this.state.page}
                                      pageSize={this.state.pageSize}/>
                        )}

                        {(this.state.songType === 'fans' || this.state.songType === 'attention') && (
                            <UserList users={users}/>
                        )}

                        <Pagination count={this.props.singer.count}
                                    onChange={this.onPageChange.bind(this)}
                                    page={this.state.page}
                                    pageSize={this.getPageSize.bind(this).call()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Singer);