import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'antd';

import './header.less';
import { ISystem } from "../../interfaces";
import { ipcRenderer } from "electron";
import { SystemAction } from "../../actions/system.action";
import { GO_BACK_EVENT, GO_FORWARD_EVENT, SEARCH_EVENT } from "../../constants/events.constant";
import { useMount } from "react-use";
import { BarsOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

export interface IHeaderProps {
    noSide?: boolean;
}

export const Header = ({ noSide }: IHeaderProps) => {
    const current = location.hash;
    let searchEl;
    let searchValue = '';
    if (current.includes('#/search')) {
        const chunks = current.split('/');
        searchValue = chunks[chunks.length - 1];
    }

    const dispatch = useDispatch();
    const { canGoForward, canGoBack } = useSelector<any, ISystem>(state => state.system);

    useMount(() => {
        ipcRenderer.on(SEARCH_EVENT, evt => {
            if (searchEl) {
                searchEl.input.focus();
            }
        });
    });

    const go = () => {
        ipcRenderer.send(GO_FORWARD_EVENT);
        dispatch(SystemAction.refreshSystem());
    }

    const back = () => {
        ipcRenderer.send(GO_BACK_EVENT)
        dispatch(SystemAction.refreshSystem());
    }

    const onSearch = (value: string) => {
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
    }

    return (
        <div className={`header ${noSide ? 'no-side' : ''}`}>
            <div className="histories-btn-group">
                <LeftOutlined className={`histories-btn ${canGoBack ? '' : 'disabled'}`} onClick={() => back()}/>
                <RightOutlined className={`histories-btn ${canGoForward ? '' : 'disabled'}`} onClick={() => go()}/>
            </div>
            <Input.Search
                ref={el => searchEl = el}
                className="search-input"
                size="small"
                defaultValue={decodeURIComponent(searchValue)}
                onSearch={value => onSearch(value)}
            />
            <a onClick={() => location.hash = '#/settings'} className="settings-btn">
                <BarsOutlined className="settings-btn-icon"/>
            </a>
        </div>
    );
}
