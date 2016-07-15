/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import {
    getSongCollection,
    getSongsInSongCollections
} from '../actions/collection';
import {play, playAll} from '../actions/common';
import Button from '../components/button';

const mapStateToProps = state => ({
    collection: state.collection
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getSongCollection,
        getSongsInSongCollections,
        play,
        playAll
    }, dispatch),
    dispatch
});

class Collection extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.collectionId = this.props.routeParams.collectionId;
        this.props.action.getSongsInSongCollections(this.collectionId);
        this.props.action.getSongCollection(this.collectionId);
    }

    playAll() {
        let songlist = this.props.collection.songlist;
        this.props.action.playAll(songlist.map(song => {
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
        let collectionInfo = this.props.collection.collectionInfo || {user: {}},
            songlist = this.props.collection.songlist || [];
        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list elsa-list-2">
                    <div className="elsa-panel-body elsa-panel-body-bg elsa-list-body clear-fix">
                        <img className="rect" src={collectionInfo.P}/>
                        <div className="elsa-list-info">
                            <h3 className="elsa-list-title highlight-bold">{collectionInfo.T}</h3>
                            <div className="light-color elsa-list-desc">
                                创建人: <Link to={`/user/${collectionInfo.user.ID}`}>{collectionInfo.user.NN}</Link>
                            </div>
                            <div className="light-color elsa-list-description">{collectionInfo.C}</div>
                            <div className="btn-group">
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
                            {songlist.map((song, index) => {
                                index++;
                                return (
                                    <tr key={song.ID}>
                                        <td className="center light-color no-wrap">
                                            {index < 10 ? `0${index}` : index}
                                        </td>
                                        <td className="no-wrap highlight-normal relative">
                                            {song.SN}
                                            <span className="btn-group menu-bar">
                                                <i className="btn fa fa-play"/>
                                                <i className="btn fa fa-download"/>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);