import * as React from 'react';
import { ipcRenderer } from 'electron';
import * as defaultAvatar from '../assets/i5sing.png';

import './user-info.less';
import { OPEN_LOGIN_WINDOW } from "../constants/events.constant";

export interface IUserInfoProps {
    avatar?: string;
    username: string;
    onLogout?: () => void;
}

export class UserInfo extends React.Component<IUserInfoProps> {
    login() {
        ipcRenderer.send(OPEN_LOGIN_WINDOW);
    }

    render() {
        const { avatar, username, onLogout } = this.props;
        return <div className="user-info">
            <div className="content">
                <i className="user-info-avatar">
                    <img src={avatar || defaultAvatar}/>
                </i>
                <span className="user-info-username">
                    {username ? username : <span onClick={() => this.login()}>未登录</span>}
                </span>
                {username ? <a className="user-info-exit-btn" onClick={onLogout}>退出</a> : null}
            </div>
        </div>
    }
}
