import * as React from 'react';
import { find, get } from 'lodash';
import { connect } from 'react-redux';
import { remote } from "electron";
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { CurrentAction } from "../../actions";
import { resolve } from "path";

const { Menu, MenuItem } = remote;

export interface IContextMenuProps {
    actions?: {
        current: typeof CurrentAction;
    };
    state?: IState;
}

@connect(
    (state: IState) => ({ state }),
    (dispatch: Dispatch) => ({
        actions: {
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class ContextMenu extends React.Component<IContextMenuProps> {
    private menu;
    private selected: string;

    componentDidMount(): void {
        this.menu = new Menu();
        this.menu.append(new MenuItem({
            label: '播放',
            click: () => {
                const state = this.props.state;
                const info = this.selected.split('--');
                const chunks = info[0].split('-');
                const path = info[1];
                console.log(chunks, path, info[0]);
                let song;
                if (path.includes('downloads')) {
                    song = get(get(state, path, {}), `${ chunks[0] }-${ chunks[1] }`);
                } else if (path.includes('cloud.songs')) {
                    song = {
                        name: info[0],
                        kind: null,
                        user: {
                            id: null,
                            nickname: '我的音乐云盘'
                        }
                    }
                } else {
                    song = find(get(state, path, []), { id: Number(chunks[1]) }) as any;
                }

                if (song) {
                    this.props.actions.current.play(chunks[1], chunks[0], {
                        id: song.id || song.songId,
                        name: song.name || song.songName,
                        kind: song.kind || song.songKind,
                        user: song.user || { id: song.userId, nickname: song.username },
                        local: path.includes('downloads') ?
                            `file:///${ resolve(state.system.homePath, 'i5sing/downloads', song.filename) }` :
                            path.includes('cloud.songs') ?
                                state.cloud.domain + '/' + encodeURIComponent(info[0]) : null,
                    });
                }
            }
        }));
        this.menu.append(new MenuItem({ label: '下一首播放' }));
        this.menu.append(new MenuItem({ label: '下载' }));
        window.addEventListener('contextmenu', this.rightClick.bind(this), false)
    }

    rightClick(e) {
        e.preventDefault();
        for (let i = 0; i < e.path.length; i++) {
            const path = e.path[i];
            if (path.localName === 'tr' && path.id) {
                this.selected = path.id;
                this.menu.popup({ window: remote.getCurrentWindow() });
                return;
            }
        }
    }

    componentWillUnmount(): void {
        window.removeEventListener('contextmenu', this.rightClick);
    }

    render() {
        return '';
    }
}
