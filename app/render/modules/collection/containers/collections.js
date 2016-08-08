/**
 * Created by zhaofeng on 7/14/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    EndScrollLoad,
    CollectionList
} from '../../../components';
import {
    getSongCollections
} from '../actions/collection';

const mapStateToProps = state => ({
    collection: state.collection
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getSongCollections
    }, dispatch),
    dispatch
});

class Collections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1
        };
    }

    componentDidMount() {
        this.props.action.getSongCollections(this.state.pageIndex);
    }

    onLoad() {
        this.state.pageIndex += 2;
        this.props.action.getSongCollections(this.state.pageIndex, true);
    }

    render() {
        let collections = this.props.collection.collections || [];

        return (
            <EndScrollLoad target={'panel'} onLoad={this.onLoad.bind(this)}>
                <div className="elsa-panel collection">
                    <h3 className="title">歌单</h3>
                    <CollectionList collections={collections}/>
                </div>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections);