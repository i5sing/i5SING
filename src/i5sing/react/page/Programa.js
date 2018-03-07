/**
 * Created by zhaofeng on 7/12/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    EndScrollLoad
} from '../components';
import {
    getSpecialColumnDetail
} from '../redux/action/programa';
import {
    playAll
} from '../redux/action/common';

import './Programa.less';

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
                <article className="i-panel programa">
                    <div className="i-panel-header"><h3 className="i-panel-header-title">有声专栏</h3></div>
                    <div className="i-panel-body">
                        <ul className="list list-2-columns">
                            {specialColumns.map((column, index)=> {
                                return (
                                    <li className="list-item" key={column.id}>
                                        <img className="list-item-img" src={column.pic}/>
                                        <div className="list-item-desc">
                                            <div className="list-item-desc-title no-wrap">{column.song_name}</div>
                                            <div className="list-item-desc-content no-wrap light-color">{column.words}</div>
                                            <div className="list-item-desc-content no-wrap light-color">{column.nickname}</div>
                                        </div>
                                        <i className="fa fa-play play-btn pointer"
                                           onClick={this.playColumnAll.bind(this, index)}/>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </article>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Programa);