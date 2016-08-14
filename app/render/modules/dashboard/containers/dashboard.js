/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import Carousel from 'nuka-carousel';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import toastr from 'toastr';

import {
    play,
    playAll,
    add} from '../../../redux/action/common';
import {
    getCarousel,
    getDailyRecommendSongs,
    getSpecialColumn,
    getLatestSingers,
    getSingers
} from '../../../redux/action/dashboard';

const mapStateToProps = state => ({
    dashboard: state.dashboard,
    common: state.common
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getCarousel,
        getDailyRecommendSongs,
        getSpecialColumn,
        getLatestSingers,
        getSingers,
        play,
        playAll,
        add
    }, dispatch),
    dispatch
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dailyPage: 0
        };
    }

    nextDailyPage() {
        if (this.state.dailyPage == 2) return;
        this.setState({dailyPage: this.state.dailyPage + 1});
    }

    previousDailyPage() {
        if (this.state.dailyPage === 0) return;
        this.setState({dailyPage: this.state.dailyPage - 1});
    }

    playAll(index) {
        let dailyRecommends = this.props.dashboard.dailyRecommends;
        this.props.action.playAll(dailyRecommends.map(song => {
            return {
                id: song.SongId,
                type: song.SongType,
                name: song.RecommendName,
                singer: song.NickName,
                singerId: song.UserId,
                singerImg: song.Image
            }
        }), 'playlist', index);
    }

    playColumnAll(index) {
        let specialColumns = this.props.dashboard.specialColumns[0].list;
        this.props.action.playAll(specialColumns.map(song => {
            return {
                id: song.id,
                type: song.song_type,
                name: song.name,
                singer: song.nickname,
                singerId: song.user_id,
                singerImg: song.pic
            }
        }), 'playlist', index);
    }

    add(song) {
        this.props.action.add({
            id: song.SongId,
            type: song.SongType,
            name: song.RecommendName,
            singer: song.NickName,
            singerId: song.UserId,
            singerImg: song.Image
        });
        toastr.success('添加成功');
    }

    componentDidMount() {
        this.props.action.getCarousel(26);
        this.props.action.getDailyRecommendSongs(1, 27);
        this.props.action.getSpecialColumn();
        this.props.action.getLatestSingers(1, 5);
        this.props.action.getSingers(1, 5);
    }

    render() {
        let carousels = this.props.dashboard.carousels || [];
        let dailyRecommends = this.props.dashboard.dailyRecommends || [];
        let specialColumns = this.props.dashboard.specialColumns || [];
        let recommendSingers = this.props.dashboard.recommendSingers || [];
        let latestSingers = this.props.dashboard.latestSingers || [];

        return (
            <div className="dashboard">
                <div className="carousel">
                    {this._buildCarousel(carousels)}
                </div>

                {this._buildDailyRecommend(dailyRecommends)}

                {this._buildSpecialColumn(specialColumns)}

                {this._buildSingers(latestSingers, '新入驻音乐人')}

                {this._buildSingers(recommendSingers, '热门音乐人')}
            </div>
        );
    }

    _buildSingers(singers, name) {
        singers = singers.slice(0, 5);
        return (<div className="elsa-panel daily-recommend singer-list">
            <h3>{name}</h3>
            <ul>
                {singers.map(singer => {
                    return (
                        <li key={singer.ID}>
                            <Link to={`/user/${singer.ID}`}><img src={singer.I}/></Link>
                            <div className="info-wrapper">
                                <Link to={`/user/${singer.ID}`}>
                                    <div className="song-name">{singer.NN}</div>
                                </Link>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>);
    }

    _buildSpecialColumn(specialColumns) {
        if (specialColumns.length > 0) {
            specialColumns = specialColumns.filter(column => {
                return column.title == '有声专栏';
            })
        }

        return specialColumns.length > 0 && (<div className="elsa-panel daily-recommend special-column">
                <h3>有声专栏</h3>
                <div className="elsa-panel-bar clear-fix">
                    <div className="pull-right">
                        <Link to={`/programa`}>更多</Link>
                    </div>
                </div>
                <ul>
                    {specialColumns[0].list.map((column, index) => {
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
            </div>);
    }

    _buildDailyRecommend(dailyRecommends) {
        let rightBtnClasses = 'fa fa-chevron-circle-right btn ';
        let leftBtnClasses = 'fa fa-chevron-circle-left btn ';

        if (dailyRecommends.length > 0) {
            dailyRecommends = dailyRecommends.slice(this.state.dailyPage * 9, (this.state.dailyPage + 1) * 9);
        }

        if (this.state.dailyPage == 2) {
            rightBtnClasses += 'disabled';
        }

        if (this.state.dailyPage === 0) {
            leftBtnClasses += 'disabled';
        }

        return (
            <div className="elsa-panel daily-recommend">
                <h3>每日推荐</h3>
                <div className="elsa-panel-bar">
                    <a className="pointer"
                       onClick={this.playAll.bind(this, 0)}>
                        <i className="fa fa-play btn"/>播放全部
                    </a>
                    <div className="pull-right">
                        <i className={leftBtnClasses}
                           onClick={this.previousDailyPage.bind(this)}/>
                        <i className={rightBtnClasses}
                           onClick={this.nextDailyPage.bind(this)}/>
                    </div>
                </div>
                <ul>
                    {dailyRecommends.map((daily, index) => {
                        return (
                            <li key={daily.SongId}>
                                <Link to={`/user/${daily.UserId}`}><img src={daily.Image}/></Link>
                                <div className="info-wrapper">
                                    <div className="song-name">{daily.RecommendName}</div>
                                    <Link to={`/user/${daily.UserId}`}>
                                        <div className="singer-name light-color">{daily.NickName}</div>
                                    </Link>
                                </div>
                                <span className="btn-group menu-bar">
                                    <i className="btn fa fa-play"
                                       onClick={this.playAll.bind(this, index)}/>
                                    <i className="btn fa fa-download"/>
                                    <i className={`btn fa fa-plus`}
                                       onClick={this.add.bind(this, daily)}/>
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }

    _buildCarousel(carousels) {
        return (
            <Carousel autoplay={true} wrapAround={true}>
                {carousels.filter(item => {
                    return item.url_type != 6;
                }).map(item => {
                    let webViewType = ['1', '4'];
                    let to;
                    if (~webViewType.indexOf(item.url_type))
                        to = {pathname: "/webview", query: {url: item.url}};
                    else if (item.url_type == 2)
                        to = `/collections/${item.url}`;
                    if (!to) return;

                    return (
                        <Link key={item.id} to={to}>
                            <img src={item.thumb}/>
                        </Link>
                    )
                })}
            </Carousel>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);