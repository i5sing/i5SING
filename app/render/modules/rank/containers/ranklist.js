/**
 * Created by zhaofeng on 7/13/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    SongList,
    Pagination,
    Button
} from '../../../components';
import {
    getRankDetail
} from '../../../redux/action/rank';
import {
    playAll
} from '../../../redux/action/common';

const mapStateToProps = state => ({
    rank: state.rank
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getRankDetail,
        playAll
    }, dispatch),
    dispatch
});

class RankList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 20
        }
    }

    componentDidMount() {
        this.rankId = this.props.routeParams.rankId;
        let state = this.state;
        this.props.action.getRankDetail(this.rankId, state.page, state.pageSize);
    }

    onPageChange(page) {
        let state = this.state;
        this.setState({page: page});
        this.props.action.getRankDetail(this.rankId, page, state.pageSize);
    }

    playAll(index) {
        let songs = this.props.rank.rankDetail.songs;
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
                                <Button type="primary" size="large" onClick={this.playAll.bind(this, 0)}>
                                    <i className="fa fa-play"/>播放全部
                                </Button>
                                <Button type="default" size="large">
                                    <i className="fa fa-download"/>下载
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="elsa-panel-body elsa-list-body clear-fix">
                        <SongList songs={rankDetail.songs}
                                  page={this.state.page}
                                  pageSize={this.state.pageSize}/>
                        <Pagination count={rankDetail.count}
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

export default connect(mapStateToProps, mapDispatchToProps)(RankList);