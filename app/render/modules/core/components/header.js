/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import {
    broadcast
} from '../../../../common/event';
import {
    remote
} from '../../../../common/electron';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            type: 'yc'
        }
    }

    componentDidMount() {

    }

    forward() {
        send('go-back-forward', 'forward');
    }

    back() {
        send('go-back-forward', 'back');
    }

    search(evt) {
        if (evt.which == 13) {
            if (location.hash.replace(/\?.*/, '') != '#/search') {
                location.hash = `#/search`;
            }

            //noinspection JSUnresolvedFunction
            broadcast(remote.getCurrentWindow(), 'search.event', {
                type: this.state.type,
                keyword: this.state.keyword
            });
        }
    }

    /*
     <div className="btn-group pull-right">
     <i className="fa fa-cog btn btn-setting"/>
     <i className="fa fa-remove btn btn-close"/>
     </div>
     */

    render() {
        return (
            <div className="elsa-header clear-fix">
                <div className="btn-group pull-left">
                    <i className={`fa fa-arrow-left btn btn-left`}
                       onClick={this.back.bind(this)}/>
                    <i className="fa fa-arrow-right btn btn-right"
                       onClick={this.forward.bind(this)}/>
                </div>
                <div className="search-box pull-left">
                    <select value={this.state.type}
                            onChange={evt => this.setState({type: evt.target.value})}>
                        <option value="yc">原创</option>
                        <option value="fc">翻唱</option>
                        <option value="bz">伴奏</option>
                        <option value="collection">歌单</option>
                        <option value="user">用户</option>
                    </select>
                    <input type="text" placeholder="歌曲/用户/歌单"
                           value={this.state.keyword}
                           onChange={evt => this.setState({keyword: evt.target.value})}
                           onKeyDown={this.search.bind(this)}/>
                </div>
            </div>
        );
    }
}