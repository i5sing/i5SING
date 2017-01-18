/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import {send} from '../../utils/ipc';
import {broadcast} from '../../../utils/event';
import {remote} from 'electron';
import {getSystem} from '../../../utils/system'

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

    close() {
        console.log('hide win');
        send('hide-win', 'main');
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
                <div className="drag-layer"></div>
                {getSystem() == 'win32' && (<div className="btn-group fixed-right" onClick={this.close.bind(this)}>
                    <i className="fa fa-remove btn btn-close"/>
                </div>)}
            </div>
        );
    }
}