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
    add,
    download
} from '../redux/action/common';
import {
    getCarousel,
    getDailyRecommendSongs,
    getRecommendCollections,
    getSpecialColumn,
    getLatestSingers,
    getSingers
} from '../redux/action/dashboard';

const mapStateToProps = state => ({
    dashboard: state.dashboard,
    common: state.common
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getCarousel,
        getDailyRecommendSongs,
        getRecommendCollections,
        getSpecialColumn,
        getLatestSingers,
        getSingers,
        play,
        playAll,
        add,
        download
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

    playAll(index, page) {
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
        }), 'playlist', index + page * 9);
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

    download(song) {
        this.props.action.download(song.SongId, song.SongType);
    }

    componentDidMount() {
        this.props.action.getCarousel(26);
        this.props.action.getDailyRecommendSongs(1, 27);
        this.props.action.getSpecialColumn();
        this.props.action.getLatestSingers(1, 5);
        this.props.action.getSingers(1, 5);
        this.props.action.getRecommendCollections();

        const ele = document.querySelector('.list-item');
        console.log(ele);
    }

    render() {
        let carousels = this.props.dashboard.carousels || [];
        let dailyRecommends = this.props.dashboard.dailyRecommends || [];
        let specialColumns = this.props.dashboard.specialColumns || [];
        let recommendSingers = this.props.dashboard.recommendSingers || [];
        let latestSingers = this.props.dashboard.latestSingers || [];
        let collectionRecommends = this.props.dashboard.recommendCollections || [];

        return (
            <article className="i-panel dashboard">
                <div className="i-panel-body">
                    <section className="carousel">
                        {this._buildCarousel(carousels)}
                    </section>

                    {this._buildCollections(collectionRecommends)}

                    {this._buildDailyRecommend(dailyRecommends)}

                    {this._buildSpecialColumn(specialColumns)}

                    {this._buildSingers(latestSingers, '新入驻音乐人')}

                    {this._buildSingers(recommendSingers, '热门音乐人')}
                </div>
            </article>
        );
    }

    _buildCollections(collections) {
        collections = collections.slice(0, 5);

        return (<section className="box">
            <div className="box-header"><h3>推荐歌单</h3></div>
            <div className="box-body">
                <ul className="list list-rect">
                    {collections.map(collection => {
                        return (
                            <li className="list-item" key={collection.SongListId}>
                                <Link to={`/collections/${collection.SongListId}`}>
                                    <img className="list-item-img" src={collection.Picture}/>
                                </Link>
                                <div className="list-item-word">
                                    <Link to={`/collections/${collection.SongListId}`}>{collection.Title}</Link>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>);
    }

    _buildSingers(singers, name) {
        singers = singers.slice(0, 5);
        return (<section className="box">
            <div className="box-header"><h3>{name}</h3></div>
            <div className="box-body">
                <ul className="list list-circle">
                    {singers.map(singer => {
                        return (
                            <li className="list-item" key={singer.ID}>
                                <Link to={`/user/${singer.ID}`}><img className="list-item-img" src={singer.I}/></Link>
                                <div className="list-item-word">
                                    <Link to={`/user/${singer.ID}`}>{singer.NN}</Link>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>);
    }

    _buildSpecialColumn(specialColumns) {
        if (specialColumns.length > 0) {
            specialColumns = specialColumns.filter(column => {
                return column.title == '有声专栏';
            })
        }

        return specialColumns.length > 0 && (<section className="box">
                <div className="box-header">
                    <h3>有声专栏</h3>
                    <div className="tools">
                        <div className="pull-right">
                            <Link to={`/programa`}>更多</Link>
                        </div>
                    </div>
                </div>
                <div className="box-body">
                    <ul className="list list-2-columns">
                        {specialColumns[0].list.map((column, index) => {
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
            </section>);
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
            <section className="box">
                <div className="box-header">
                    <h3>每日推荐</h3>
                    <div className="tools">
                        <a className="pointer"
                           onClick={this.playAll.bind(this, 0)}>
                            <i className="fa fa-play btn"/>播放全部
                        </a>
                        <div className="pull-right">
                            <i className={leftBtnClasses} style={{marginRight: 5}}
                               onClick={this.previousDailyPage.bind(this)}/>
                            <i className={rightBtnClasses}
                               onClick={this.nextDailyPage.bind(this)}/>
                        </div>
                    </div>
                </div>
                <div className="box-body">
                    <ul className="list list-3-columns">
                        {dailyRecommends.map((daily, index) => {
                            return (
                                <li className="list-item" key={daily.SongId}>
                                    <Link to={`/user/${daily.UserId}`}>
                                        <img className="list-item-img" src={daily.Image}/>
                                    </Link>
                                    <div className="list-item-desc">
                                        <div className="list-item-desc-title">{daily.RecommendName}</div>
                                        <Link to={`/user/${daily.UserId}`}>
                                            <div className="list-item-desc-content light-color">{daily.NickName}</div>
                                        </Link>
                                    </div>
                                    <span className="btn-group list-item-desc-tools hidden">
                                    <i className="btn fa fa-play"
                                       onClick={this.playAll.bind(this, index, this.state.dailyPage)}/>
                                    <i className="btn fa fa-download"
                                       onClick={this.download.bind(this, daily)}/>
                                    <i className={`btn fa fa-plus`}
                                       onClick={this.add.bind(this, daily)}/>
                                </span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </section>
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