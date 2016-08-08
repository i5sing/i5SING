/**
 * Created by zhaofeng on 7/13/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getSquareList} from '../actions/square';

const mapStateToProps = state => ({
    square: state.square
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators({
        getSquareList
    }, dispatch),
    dispatch
});

class Square extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.action.getSquareList(1, 20);
    }

    render() {
        let squareList = this.props.square.squareList || [];

        squareList.forEach(square => {
            try {
                square.content = JSON.parse(square.content);
            } catch (e) {

            }
        });

        return (
            <div>
                <div className="elsa-panel elsa-panel-no-margin elsa-list comment-list">
                    <div className="elsa-panel-body elsa-list-body clear-fix">
                        <h3 className="title">广场</h3>
                        <ul>
                            {squareList.map(square => {
                                console.log(square);
                                return <li key={square.id} className="comment-item">
                                    <div className="clear-fix">
                                        <img src={square.user.I} className="head-img"/>
                                        <div className="user-name">{square.user.NN}</div>
                                        <div className="create-time"></div>
                                    </div>
                                    <div className="clear-fix content">
                                        <div>{square.content.Content}</div>
                                        {(square.category == 3 || square.category == 6) && (
                                            <div className="clear-fix"><img src={square.content.FileName}/></div>
                                        )}
                                        {square.category == 1 && (
                                            <div className="file-area">
                                                <i className="fa fa-play-circle"/>
                                                <span className="song-name">{square.content.SongName}</span>
                                                <span className="singer-name">{square.content.Singer}</span>
                                            </div>
                                        )}
                                        <div className="btn-group">
                                            <span>
                                                <i className="fa fa-comment btn"/>({square.content.Comments || 0})
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Square);