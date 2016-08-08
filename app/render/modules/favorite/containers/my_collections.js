/**
 * Created by zhaofeng on 2016/7/24.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    EndScrollLoad,
    CollectionList
} from '../../../components';
import {
    getMySongCollections
} from '../actions/favorite';

const mapStateToProps = state => ({
    favorite: state.favorite
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getMySongCollections
    }, dispatch),
    dispatch
});

class MyCollections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 20
        };
    }

    componentDidMount() {
        this.sign = this.props.location.query.sign;
        let {page, pageSize} = this.state;
        this.props.action.getMySongCollections(this.sign, page, pageSize, false);
    }

    onLoad() {
        this.state.pageIndex++;
        let {page, pageSize} = this.state;
        this.props.action.getMySongCollections(this.sign, page, pageSize, true);
    }

    render() {
        let attentionCollections = this.props.favorite.attentionCollections || [];

        return (
            <EndScrollLoad target={'panel'} onLoad={this.onLoad.bind(this)}>
                <div className="elsa-panel collection">
                    <h3 className="title">收藏歌单</h3>
                    <CollectionList collections={attentionCollections}/>
                </div>
            </EndScrollLoad>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);