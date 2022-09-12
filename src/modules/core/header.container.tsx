import * as React from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';
import { LeftOutlined, RightOutlined, BarsOutlined } from '@ant-design/icons';

import './header.less';
import { IState } from "../../reducers";
import { ISystem } from "../../interfaces";
import { bindActionCreators, Dispatch } from "redux";
import { ipcRenderer } from "electron";
import { SystemAction } from "../../actions/system.action";
import { HistoryAction } from "../../actions/history.action";
import { actions } from "../../helpers";
import { SEARCH_EVENT } from "../../constants/events.constant";

export interface IHeaderProps {
    system?: ISystem;
    noSide?: boolean;
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
    private el = null;

    componentDidMount(): void {
        ipcRenderer.on(SEARCH_EVENT, evt => {
            if (this.el) {
                this.el.input.focus();
            }
        });
    }

    go() {
        this.props.actions.history.go();
        this.props.actions.system.refreshSystem();
    }

    back() {
        this.props.actions.history.back();
        this.props.actions.system.refreshSystem();
    }

    render() {
        const { noSide } = this.props;
        const { canGoForward, canGoBack } = this.props.system;
        const current = location.hash;
        let searchValue = '';
        if (current.includes('#/search')) {
            const chunks = current.split('/');
            searchValue = chunks[chunks.length - 1];
        }
        return <div className={`header ${noSide ? 'no-side' : ''}`}>
            <div className="histories-btn-group">
                <LeftOutlined className={`histories-btn ${canGoBack ? '' : 'disabled'}`} onClick={() => this.back()}/>
                <RightOutlined className={`histories-btn ${canGoForward ? '' : 'disabled'}`} onClick={() => this.go()}/>
            </div>
            <Input.Search
                ref={el => this.el = el}
                className="search-input"
                size="small"
                defaultValue={decodeURIComponent(searchValue)}
                onSearch={value => {
                    const current = location.hash;
                    if (current.includes('#/search')) {
                        const chunks = current.split('/');
                        chunks.pop();
                        chunks.shift();
                        let hash = '/';
                        chunks.forEach(chunk => hash += chunk + '/');
                        if (hash.charAt(hash.length - 1) === '/') {
                            hash = hash.substring(0, hash.length - 1);
                        }
                        location.hash = hash + '/' + encodeURIComponent(value);
                    } else {
                        location.hash = `search/song/${encodeURIComponent(value)}`;
                    }
                }}
            />
            <a onClick={() => location.hash = '#/settings'} className="settings-btn">
                <BarsOutlined className="settings-btn-icon"/>
            </a>
        </div>
    }
}
