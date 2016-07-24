/**
 * Created by zhaofeng on 21/07/2016.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'
import ipc from '../backend/ipc';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {SongTable, EndScrollLoad} from '../components';
import {
    search
} from '../actions/search';

const mapStateToProps = state => ({
    search: state.search
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        search
    }, dispatch),
    dispatch
});

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 35,
            keyword: '',
            type: ''
        }
    }

    componentDidMount() {
        ipc.render.on('search.event', (evt, searchObj) => {
            console.log('receive');
            let {type, keyword} = searchObj;
            this.setState({type: type, keyword: keyword, page: 1});
            this.props.action.search(keyword, type, 1, this.state.pageSize);
        })
    }

    componentWillUnmount() {
        ipc.render.removeAllListeners('search.event');
    }

    nextPage() {
        this.state.page++;
        let {type, keyword, page, pageSize} = this.state;
        this.props.action.search(keyword, type, page, pageSize, true);
    }

    render() {
        let searchResult = this.props.search.searchResult || {songArray: [], user: [], songMenu: []};
        console.log(searchResult);
        return (
            <EndScrollLoad target="panel" onLoad={this.nextPage.bind(this)}>
                <div className="elsa-panel rank-overview search">
                    <h3 className="title">搜索</h3>
                    {!!searchResult.songArray.length && <SongTable
                        songs={searchResult.songArray.map(song => {
                            return {
                                ID: song.songId,
                                SN: song.songName,
                                SK: song.type == 1 ? 'yc' : (song.type == 2 ? 'fc' : 'bz'),
                                user: {
                                    ID: song.singerId,
                                    NN: song.singer
                                }
                            }
                        })}/>
                    }
                    {!!searchResult.user.length && <ul className="elsa-list user-list">
                        <ReactCSSTransitionGroup transitionName="opacity"
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={300}>
                            {searchResult.user.map((user, index) => {
                                index++;
                                return (
                                    <li className={`user-item ${index % 5 == 0 ? 'last-child' : ''}`}
                                        key={`${user.userId}`}>
                                        <Link to={`/user/${user.userId}`}>
                                            <img src={user.url}/>
                                        </Link>
                                        <div className="user-item-title highlight-normal no-wrap">
                                            <Link to={`/user/${user.userId}`}>{user.nickName}</Link>
                                        </div>
                                    </li>
                                )
                            })}
                        </ReactCSSTransitionGroup>
                    </ul>}
                    {!!searchResult.songMenu.length && <ul className="elsa-list collection-list">
                        <ReactCSSTransitionGroup transitionName="opacity"
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={300}>
                            {searchResult.songMenu.map((collection, index) => {
                                index++;
                                return (
                                    <li className={`collection-item ${index % 5 == 0 ? 'last-child' : ''}`}
                                        key={`${collection.ID}${index}`}>
                                        <Link to={`/collection/${collection.listId}`}>
                                            <img src={collection.url}/>
                                        </Link>
                                        <div className="collection-title highlight-normal no-wrap">
                                            <Link to={`/collection/${collection.listId}`}>{collection.listName}</Link>
                                        </div>
                                    </li>
                                )
                            })}
                        </ReactCSSTransitionGroup>
                    </ul>}
                </div>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);