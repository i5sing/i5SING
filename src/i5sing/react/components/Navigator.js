/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import headImg from '../../../resources/icon.png';

import './Navigator.less';

const routeRE = /#\/(.*)\?.+/;

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: ''
        };

        setTimeout(() => {
            let result = routeRE.exec(location.hash);
            let route = result[1];
            if (!route) {
                this.setState({
                    current: route || 'dashboard',
                    openKeys: []
                });
                location.hash = '#/dashboard';
            }
        }, 0);

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {

    }

    handleClick(key, qs = '') {
        this.setState({
            current: key
        });

        location.hash = '#/' + key + qs;
    }

    render() {
        let info = this.props.info || {};

        return (
            <div className="elsa-navigator">
                <div className="user-info">
                    <img className="user-img" src={info.img || headImg}/>
                    {!info.name && (<div className="user-name pointer" onClick={this.props.login}>登录</div>)}
                    {info.name && (<div className="user-name">{info.name}</div>)}
                    {info.name && (<a className="logout light-color pointer" onClick={this.props.logout}>退出</a>)}
                </div>
                <div className="nav">
                    <h3>乐库</h3>
                    <ul>
                        <li onClick={this.handleClick.bind(this, 'dashboard', '')}
                            className={this.state.current == 'dashboard' && 'active'}>
                            <i className="fa fa-home btn"/>发现
                        </li>
                        <li onClick={this.handleClick.bind(this, 'rank', '')}
                            className={this.state.current == 'rank' && 'active'}>
                            <i className="fa fa-signal btn"/>排行
                        </li>
                        <li onClick={this.handleClick.bind(this, 'collections', '')}
                            className={this.state.current == 'collections' && 'active'}>
                            <i className="fa fa-reorder btn"/>歌单
                        </li>
                        <li onClick={this.handleClick.bind(this, 'programa', '')}
                            className={this.state.current == 'programa' && 'active'}>
                            <i className="fa fa-reorder btn"/>有声专栏
                        </li>
                        <li onClick={this.handleClick.bind(this, 'square', '')}
                            style={{display: 'none'}}
                            className={this.state.current == 'square' && 'active'}>
                            <i className="fa fa-square btn"/>广场
                        </li>
                    </ul>
                    <h3>我的音乐</h3>
                    <ul>
                        {!!info.sign && (
                            <span>
                                <li onClick={this.handleClick.bind(this, `user/${info.id}`, '')}
                                    className={this.state.current == `user/${info.id}` && 'active'}>
                                    <i className="fa fa-user btn"/>我的音乐
                                </li>
                                <li style={{display: 'none'}}><i className="fa fa-rss btn"/>动态</li>
                                <li onClick={this.handleClick.bind(this, 'favorite/songs', `?userId=${info.id}`)}
                                    className={this.state.current == 'favorite/songs' && 'active'}>
                                    <i className="fa fa-music btn"/>收藏音乐
                                </li>
                                <li onClick={this.handleClick.bind(this, 'favorite/collections', `?sign=${info.sign}`)}
                                    className={this.state.current == 'favorite/collections' && 'active'}>
                                    <i className="fa fa-star btn"/>收藏歌单
                                </li>
                                <li onClick={this.handleClick.bind(this, 'favorite/attention', `?userId=${info.id}`)}
                                    className={this.state.current == 'favorite/attention' && 'active'}>
                                    <i className="fa fa-heart btn"/>我的关注
                                </li>
                                <li onClick={this.handleClick.bind(this, 'favorite/fans', `?userId=${info.id}`)}
                                    className={this.state.current == 'favorite/fans' && 'active'}>
                                    <i className="fa fa-leaf btn"/>我的粉丝
                                </li>
                            </span>
                        )}
                        <li style={{display: 'none'}}><i className="fa fa-download btn"/>下载</li>
                    </ul>
                </div>
            </div>
        );
    }
}