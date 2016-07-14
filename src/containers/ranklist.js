/**
 * Created by zhaofeng on 7/13/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getRankDetail} from '../actions/rank';
import Button from '../components/button';
import {Link} from 'react-router';

const mapStateToProps = state => ({
    rank: state.rank
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getRankDetail
    }, dispatch),
    dispatch
});

class RankList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 20
        }
    }

    componentDidMount() {
        let rankId = this.props.routeParams.rankId,
            state = this.state;
        this.props.action.getRankDetail(rankId, state.page, state.pageSize);
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        let rankDetail = this.props.rank.rankDetail || {};

        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list">
                    <div className="elsa-panel-body elsa-panel-body-bg elsa-list-body clear-fix">
                        <img src={rankDetail.photoBig}/>
                        <div className="elsa-list-info">
                            <h3 className="elsa-list-title highlight-bold">{rankDetail.name}</h3>
                            <div className="light-color elsa-list-time">{rankDetail.time}</div>
                            <div className="btn-group">
                                <Button type="primary" size="large">
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
                            {rankDetail.songs && rankDetail.songs.map((song, index) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(RankList);