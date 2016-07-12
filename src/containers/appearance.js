/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
import Carousel from 'nuka-carousel';

export default class Appearance extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {

    }

    render() {
        return (
            <div className="appearance">
                <div className="carousel">
                    <Carousel autoplay={true} wrapAround={true}>
                        <img src="http://img5.5sing.kgimg.com/m/T1M0bnB7YT1RXrhCrK.jpg"/>
                        <img src="http://img4.5sing.kgimg.com/m/T1LUC7BmWT1RXrhCrK.jpg"/>
                        <img src="http://img4.5sing.kgimg.com/m/T1.8KnB7VT1RXrhCrK.jpg"/>
                        <img src="http://img2.5sing.kgimg.com/m/T10Bh7B7YT1RXrhCrK.jpg"/>
                    </Carousel>
                </div>
                <div className="elsa-panel daily-recommend">
                    <h3>每日推荐</h3>
                    <div className="elsa-panel-bar">
                        <span><i className="fa fa-play btn"></i>播放全部</span>
                        <div className="pull-right">
                            <i className="fa fa-chevron-circle-left btn"></i>
                            <i className="fa fa-chevron-circle-right btn"></i>
                        </div>
                    </div>
                    <ul>
                        <li>
                            <img src="http://img1.5sing.kgimg.com/force/T1giK0BmhT1RXrhCrK.jpg"/>
                            <div className="info-wrapper">
                                <div className="song-name">神武三世桥（《神武2》游戏主题曲）</div>
                                <div className="singer-name">晨悠组合</div>
                            </div>
                        </li>
                        <li>
                            <img src="http://img1.5sing.kgimg.com/force/T1giK0BmhT1RXrhCrK.jpg"/>
                            <div className="info-wrapper">
                                <div className="song-name">神武三世桥（《神武2》游戏主题曲）</div>
                                <div className="singer-name">晨悠组合</div>
                            </div>
                        </li>
                        <li>
                            <img src="http://img1.5sing.kgimg.com/force/T1giK0BmhT1RXrhCrK.jpg"/>
                            <div className="info-wrapper">
                                <div className="song-name">神武三世桥（《神武2》游戏主题曲）</div>
                                <div className="singer-name">晨悠组合</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="elsa-panel daily-recommend special-column">
                    <h3>有声专栏</h3>
                    <div className="elsa-panel-bar clear-fix">
                        <div className="pull-right">
                            更多
                        </div>
                    </div>
                    <ul>
                        <li>
                            <img src="http://img2.5sing.kgimg.com/m/T1nsCaB7JT1RXrhCrK.jpg"/>
                            <div className="info-wrapper">
                                <div className="song-name">【广播剧】《最好的我们》 第二期（下）</div>
                                <div className="song-description">最幸福的，是在身边。</div>
                                <div className="singer-name">七濑薰</div>
                            </div>
                        </li>
                        <li>
                            <img src="http://img5.5sing.kgimg.com/m/T1M.EkBThT1RXrhCrK.jpg"/>
                            <div className="info-wrapper">
                                <div className="song-name">【广播剧】《最好的我们》 第一期 （上）</div>
                                <div className="song-description">如果你还记得当年最好的时光</div>
                                <div className="singer-name">七濑薰</div>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}