import * as React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { DOWNLOAD_SONG_EVENT, LOGIN_SUCCESS_EVENT } from "../../constants/Events";
import { DOWNLOAD, SYSTEM } from "../../constants/ActionTypes";
import { SET, UPDATE_PROPERTY } from "../../constants/Actions";
import { IState } from "../../reducers";

@connect(
    (state: IState) => ({
        downloads: state.downloads
    })
)
export class Event extends React.Component<any> {
    componentDidMount(): void {
        ipcRenderer.send(DOWNLOAD_SONG_EVENT);
        ipcRenderer.on(DOWNLOAD_SONG_EVENT, (evt, item) => {
            this.props.dispatch({
                type: DOWNLOAD,
                action: UPDATE_PROPERTY,
                path: `${item.songKind}-${item.songId}`,
                data: item
            });
            this.props.dispatch({ type: DOWNLOAD, action: SET, data: this.props.downloads });
        });
        ipcRenderer.on(LOGIN_SUCCESS_EVENT, (evt, system) => {
            console.log(system);
            this.props.dispatch({ type: SYSTEM, action: SET, data: system });
        });
    }

    render() {
        return '';
    }
}
