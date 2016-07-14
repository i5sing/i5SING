/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
import Carousel from 'nuka-carousel';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {play, playAll} from '../actions/common';
import {
    getCarousel,
    getDailyRecommendSongs,
    getSpecialColumn,
    getLatestSingers,
    getSingers
} from '../actions/appearance';

const mapStateToProps = state => ({
    appearance: state.appearance,
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
        playAll
    }, dispatch),
    dispatch
});

class Appearance extends Component {
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
        if (this.state.dailyPage == 0) return;
        this.setState({dailyPage: this.state.dailyPage - 1});
    }

    playAll() {
        let dailyRecommends = this.props.appearance.dailyRecommends;
        this.props.action.playAll(dailyRecommends.map(song => {
            return {
                id: song.SongId,
                type: song.SongType,
                name: song.RecommendName,
                singer: song.NickName,
                singerId: song.UserId,
                singerImg: song.Image
            }
        }));
    }

    componentDidMount() {
        this.props.action.getCarousel(23);
        this.props.action.getDailyRecommendSongs(1, 27);
        this.props.action.getSpecialColumn();
        this.props.action.getLatestSingers(1, 5);
        this.props.action.getSingers(1, 5);
    }

    render() {
        let carousels = this.props.appearance.carousels || [];
        let dailyRecommends = this.props.appearance.dailyRecommends || [];
        let specialColumns = this.props.appearance.specialColumns || [];
        let recommendSingers = this.props.appearance.recommendSingers || [];
        let latestSingers = this.props.appearance.latestSingers || [];

        return (
            <div className="appearance">
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
            <div className="elsa-panel-bar clear-fix">
                <div className="pull-right">
                    更多
                </div>
            </div>
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
                        更多
                    </div>
                </div>
                <ul>
                    {specialColumns[0].list.map(column => {
                        return (
                            <li key={column.id}>
                                <img src={column.pic}/>
                                <div className="info-wrapper">
                                    <div className="song-name">{column.song_name}</div>
                                    <div className="song-description light-color">{column.words}</div>
                                    <div className="singer-name light-color">{column.nickname}</div>
                                </div>
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

        if (this.state.dailyPage == 0) {
            leftBtnClasses += 'disabled';
        }

        return (
            <div className="elsa-panel daily-recommend">
                <h3>每日推荐</h3>
                <div className="elsa-panel-bar">
                    <span><i className="fa fa-play btn"
                             onClick={this.playAll.bind(this, dailyRecommends)}/>播放全部</span>
                    <div className="pull-right">
                        <i className={leftBtnClasses}
                           onClick={this.previousDailyPage.bind(this)}/>
                        <i className={rightBtnClasses}
                           onClick={this.nextDailyPage.bind(this)}/>
                    </div>
                </div>
                <ul>
                    {dailyRecommends.map(daily => {
                        return (
                            <li key={daily.SongId}>
                                <img src={daily.Image}/>
                                <div className="info-wrapper">
                                    <div className="song-name">{daily.RecommendName}</div>
                                    <div className="singer-name light-color">{daily.NickName}</div>
                                </div>
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
                {carousels.map(item => {
                    return <img key={item.id} src={item.thumb}/>
                })}
            </Carousel>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Appearance);