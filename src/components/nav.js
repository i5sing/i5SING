/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';
const routeRE = /#\/(.*)\?.+/;

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: ''
        };

        setTimeout(() => {
            let result = routeRE.exec(location.hash);
            let route = result[1];
            this.setState({
                current: route || 'appearance',
                openKeys: []
            });
        }, 0);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(key) {
        this.setState({
            current: key
        });

        location.hash = '#/' + key;
    }

    render() {
        return (
            <div className="elsa-navigator">
                <div className="user-info">
                    <img className="user-img" src="#"/>
                    <div className="user-name">测试帐号</div>
                </div>
                <div className="nav">
                    <h3>乐库</h3>
                    <ul>
                        <li onClick={this.handleClick.bind(this, 'appearance')}
                            className={this.state.current=='appearance' && 'active'}>
                            <i className="fa fa-home btn"/>发现
                        </li>
                        <li onClick={this.handleClick.bind(this, 'rank')}
                            className={this.state.current=='rank' && 'active'}>
                            <i className="fa fa-signal btn"/>排行
                        </li>
                        <li onClick={this.handleClick.bind(this, 'collection')}
                            className={this.state.current=='collection' && 'active'}>
                            <i className="fa fa-reorder btn"/>歌单
                        </li>
                        <li><i className="fa fa-square btn"/>广场</li>
                    </ul>
                    <h3>我的音乐</h3>
                    <ul>
                        <li><i className="fa fa-rss btn"/>动态</li>
                        <li><i className="fa fa-heart btn"/>收藏音乐</li>
                        <li><i className="fa fa-star btn"/>收藏歌单</li>
                        <li><i className="fa fa-history btn"/>播放历史</li>
                    </ul>
                </div>
            </div>
        );
    }
}