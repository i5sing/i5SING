/**
 * Created by zhaofeng on 21/07/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    on,
    removeAllListeners
} from '../../../utils/ipc';
import {
    SongList,
    EndScrollLoad,
    UserList
} from '../../../components';
import {
    search
} from '../../../redux/action/search';

const mapStateToProps = state => ({
    search: state.search
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        search
    }, dispatch),
    dispatch
});

class Search extends React.Component {
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
        on('search.event', (evt, searchObj) => {
            let {type, keyword} = searchObj;
            this.setState({type: type, keyword: keyword, page: 1});
            this.props.action.search(keyword, type, 1, this.state.pageSize);
        })
    }

    componentWillUnmount() {
        removeAllListeners('search.event');
    }

    nextPage() {
        this.state.page++;
        let {type, keyword, page, pageSize} = this.state;
        this.props.action.search(keyword, type, page, pageSize, true);
    }

    render() {
        let searchResult = this.props.search.searchResult || {songArray: [], user: [], songMenu: []};
        return (
            <EndScrollLoad target="panel" onLoad={this.nextPage.bind(this)}>
                <div className="elsa-panel rank-overview search">
                    <h3 className="title">搜索</h3>
                    {!!searchResult.songArray.length && <SongList
                        inSearch={true}
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
                    {!!searchResult.user.length && <UserList users={searchResult.user.map(user => {
                        return {
                            ID: user.userId,
                            I: user.url,
                            NN: user.nickName
                        }
                    })}/>}
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