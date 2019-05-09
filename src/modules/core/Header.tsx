import * as React from 'react';
import { connect } from 'react-redux';
import { Icon, Input } from 'antd';

import './Header.less';
import { IState } from "../../reducers";
import { ISystem } from "../../interfaces/ISystem";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { SystemAction } from "../../actions/SystemAction";
import { HistoryAction } from "../../actions/HistoryAction";

export interface IHeaderProps {
    system?: ISystem;
    actions?: {
        system: typeof SystemAction;
        history: typeof HistoryAction;
    }
}

@connect(
    (state: IState) => ({
        system: state.system,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            system: bindActionCreators(actions(SystemAction), dispatch),
            history: bindActionCreators(actions(HistoryAction), dispatch),
        }
    })
)
export class Header extends React.Component<IHeaderProps> {
    go() {
        this.props.actions.history.go();
        this.props.actions.system.refreshSystem();
    }

    back() {
        this.props.actions.history.back();
        this.props.actions.system.refreshSystem();
    }

    render() {
        const { canGoForward, canGoBack } = this.props.system;
        return <div className="header">
            <div className="histories-btn-group">
                <Icon className={ `histories-btn ${ canGoBack ? '' : 'disabled' }` }
                      type="left"
                      onClick={ () => this.back() }/>
                <Icon className={ `histories-btn ${ canGoForward ? '' : 'disabled' }` }
                      type="right"
                      onClick={ () => this.go() }/>
            </div>
            <Input.Search
                className="search-input"
                size="small"
                onSearch={ value => console.log(value) }
            />
            <a onClick={ () => location.hash = '#/settings' } className="settings-btn">
                <Icon type="bars" className="settings-btn-icon"/>
            </a>
        </div>
    }
}
