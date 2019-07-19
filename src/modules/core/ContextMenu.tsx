import * as React from 'react';
import { find, get } from 'lodash';
import { connect } from 'react-redux';
import { remote } from "electron";
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { CurrentAction, SongAction } from "../../actions";
import { resolve } from "path";
import { DownloadQueue } from "../../utils/DownloadQueue";

const { Menu, MenuItem } = remote;

export interface IContextMenuProps {
    actions?: {
        current: typeof CurrentAction;
        song: typeof SongAction;
    };
    state?: IState;
}

@connect(
    (state: IState) => ({ state }),
    (dispatch: Dispatch) => ({
        actions: {
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
        }
    })
)
export class ContextMenu extends React.Component<IContextMenuProps> {
    private menu;
    private selected: string;

    private parse(): { song: any, path: string, chunks: string[], info: any } {
        const state = this.props.state;
        const info = this.selected.split('--');
        const chunks = info[0].split('-');
        const path = info[1];
        let song;
        if (path.includes('downloads')) {
            song = get(get(state, path, {}), `${chunks[0]}-${chunks[1]}`);
        } else if (path.includes('cloud.songs')) {
            song = {
                name: info[0],
                kind: null,
                user: {
                    id: -1,
                    nickname: '我的音乐云盘'
                }
            }
        } else {
            song = find(get(state, path, []), { id: chunks[1] }) as any;
            if (!song) {
                song = find(get(state, path, []), { id: Number(chunks[1]) }) as any;
            }
        }

        return { song, path, chunks, info };
    }

    componentDidMount(): void {
        this.menu = new Menu();
        this.menu.append(new MenuItem({
            label: '播放',
            click: () => {
                const state = this.props.state;
                const { song, path, chunks, info } = this.parse();

                if (song) {
                    this.props.actions.current.play(chunks[1], chunks[0], {
                        id: song.id || song.songId,
                        name: song.name || song.songName,
                        kind: song.kind || song.songKind,
                        user: song.user || { id: song.userId, nickname: song.username },
                        local: path.includes('downloads') ?
                            `file:///${resolve(state.system.homePath, 'i5sing/downloads', song.filename)}` :
                            path.includes('cloud.songs') ?
                                state.cloud.domain + '/' + encodeURIComponent(info[0]) : null,
                    });
                }
            }
        }));
        this.menu.append(new MenuItem({
            label: '下载到本地',
            click: () => {
                const { song } = this.parse();
                if (song) {
                    DownloadQueue.downloads([
                        { songId: song.id || song.songId, songType: song.kind || song.songKind }
                    ]);
                }

            }
        }));
        this.menu.append(new MenuItem({
            label: '下载到音乐云盘',
            click: () => {
                const { song } = this.parse();
                if (song) {
                    this.props.actions.song.transformSong(
                        song.id || song.songId,
                        song.kind || song.songKind,
                    );
                }
            }
        }));
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
