/**
 * Created by zhaofeng on 7/12/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    EndScrollLoad
} from '../../../components';
import {
    getSpecialColumnDetail
} from '../../../redux/action/programa';
import {
    playAll
} from '../../../redux/action/common';

const mapStateToProps = state => ({
    programa: state.programa
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getSpecialColumnDetail,
        playAll
    }, dispatch),
    dispatch
});

class Programa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            channelId: 1,
            pageIndex: 1,
            pageSize: 20
        };
    }

    componentDidMount() {
        this.props.action.getSpecialColumnDetail(this.state.channelId, this.state.pageIndex, this.state.pageSize);
    }

    onLoad() {
        this.state.pageIndex += 1;
        this.props.action.getSpecialColumnDetail(this.state.channelId, this.state.pageIndex, this.state.pageSize, true);
    }

    playColumnAll(index) {
        let specialColumns = this.props.programa.specialColumns;
        this.props.action.playAll(specialColumns.map(song => {
            return {
                id: song.id,
                type: song.type,
                name: song.name,
                singer: song.nickname,
                singerId: song.user_id,
                singerImg: song.pic
            }
        }), 'playlist', index);
    }

    render() {
        let specialColumns = this.props.programa.specialColumns || [];

        return (
            <EndScrollLoad target={'panel'} onLoad={this.onLoad.bind(this)}>
                <div className="elsa-panel columns">
                    <h3 className="title">有声专栏</h3>
                    <ul className="column-list">
                        {specialColumns.map((column, index)=> {
                            return (
                                <li key={column.id}>
                                    <img src={column.pic}/>
                                    <div className="info-wrapper">
                                        <div className="song-name">{column.song_name}</div>
                                        <div className="song-description light-color">{column.words}</div>
                                        <div className="singer-name light-color">{column.nickname}</div>
                                    </div>
                                    <i className="fa fa-play play-btn pointer"
                                       onClick={this.playColumnAll.bind(this, index)}/>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Programa);