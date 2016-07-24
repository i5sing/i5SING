/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import {
    getMySongs
} from '../actions/favorite';
import {play, playAll} from '../actions/common';
import {SongTable, Button} from '../components';


const mapStateToProps = state => ({
    favorite: state.favorite,
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getMySongs,
        play,
        playAll
    }, dispatch),
    dispatch
});

class FavoriteSong extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeMap: {
                yc: '原创',
                fc: '翻唱',
                bz: '伴奏'
            },
            songType: ''
        }
    }

    componentDidMount() {
        this.userId = this.props.location.query.userId;
        this.props.action.getMySongs(this.userId);
    }

    playAll() {
        let userSongs = this.props.favorite.songs.filter(song => {
            return this.state.songType == '' || this.state.songType == song.SK
        });

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

    changeSongType(type) {
        this.setState({songType: type});
    }

    render() {
        let userSongs = this.props.favorite.songs || [];

        userSongs = userSongs.filter(song => {
            return this.state.songType == '' || this.state.songType == song.SK
        });

        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list elsa-list-2">
                    <h3 className="title">收藏</h3>
                    <div className="bar">
                        <div className="btn-group">
                            <ul className="tab">
                                <li className={`pointer ${this.state.songType == '' ? 'active' : ''}`}
                                    onClick={this.changeSongType.bind(this, '')}>全部
                                </li>
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
                    <div className="elsa-panel-body elsa-list-body clear-fix">
                        <SongTable songs={userSongs}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteSong);