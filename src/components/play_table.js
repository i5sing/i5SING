/**
 * Created by zhaofeng on 7/16/16.
 */
import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {play, playAll, add} from '../actions/common';
import toastr from 'toastr';

const mapStateToProps = state => ({
    common: state.common
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        add,
        play,
        playAll
    }, dispatch),
    dispatch
});
export default class PlayTable extends Component {
    constructor(props) {
        super(props);
    }

    playAll(index) {
        let songs = this.props.songs;
        this.props.action.playAll(songs.map(song => {
            return {
                id: song.ID,
                type: song.SK,
                name: song.SN,
                singer: song.user.NN,
                singerId: song.user.ID,
                singerImg: song.user.I
            }
        }), 'playlist', index);
    }

    add(song) {
        this.props.action.add({
            id: song.ID,
            type: song.SK,
            name: song.SN,
            singer: song.user.NN,
            singerId: song.user.ID,
            singerImg: song.user.I
        });
        toastr.success('添加成功');
    }

    render() {
        let songs = this.props.songs || [];

        return (
            <table className="table table-elsa">
                <tbody>
                {songs && songs.map((song, index) => {
                    return (
                        <tr key={song.ID}>
                            <td className="center light-color no-wrap">
                                <Link to={`/user/${song.user.ID}`}>
                                    <img className="pointer"
                                         src={song.user.I}
                                         style={{width: '50px !important', height: '50px !important'}}/>
                                </Link>
                            </td>
                            <td className="no-wrap highlight-normal relative">
                                <span className="song-name no-wrap">{song.SN}</span>
                                <span className="singer-name no-wrap light-color pointer">
                                    <Link to={`/user/${song.user.ID}`}>{song.user.NN}</Link>
                                </span>
                                <span className="btn-group menu-bar">
                                    <i className="btn fa fa-play"
                                       onClick={this.playAll.bind(this, index)}/>
                                    <i className="btn fa fa-download"/>
                                    <i className="btn fa fa-close"/>
                                </span>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayTable);