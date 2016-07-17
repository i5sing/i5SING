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
export default class SongTable extends Component {
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
        let songs = this.props.songs || [],
            page = this.props.page || 1,
            pageSize = this.props.pageSize || 20;

        return (
            <table className="table table-elsa">
                <thead className="light-color">
                <tr>
                    <th className="th-index">&nbsp;</th>
                    <th className="th-name center">歌曲</th>
                    <th className="th-singer">歌手</th>
                    <th className="th-type">风格</th>
                </tr>
                </thead>
                <tbody>
                {songs && songs.map((song, index) => {
                    let $index = index;
                    index++;
                    index = index + (page - 1) * pageSize;
                    return (
                        <tr key={song.ID}>
                            <td className="center light-color no-wrap">
                                {index < 10 ? `0${index}` : index}
                            </td>
                            <td className="no-wrap highlight-normal relative">
                                {song.SN}
                                            <span className="btn-group menu-bar">
                                                <i className="btn fa fa-play"
                                                   onClick={this.playAll.bind(this, $index)}/>
                                                <i className="btn fa fa-download"/>
                                                <i className="btn fa fa-plus"
                                                   onClick={this.add.bind(this, song)}/>
                                            </span>
                            </td>
                            <td className="no-wrap highlight-normal">
                                <Link to={`/user/${song.user.ID}`}>{song.user.NN}</Link>
                            </td>
                            <td className="no-wrap highlight-normal">
                                {song.LG ? `${song.LG}, ${song.SY}` : `--`}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SongTable);