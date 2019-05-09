import * as React from 'react';
import { shell } from 'electron';
import { resolve } from 'path';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { CurrentAction, SongAction } from "../../actions";
import { actions } from "../../utils/ActionUtil";
import { Layout } from "../../components/Layout";
import { Table } from "../../components/Table";
import { Icon } from "antd";
import { IDownload } from "../../interfaces/IDownload";
import { prettyByte } from "../../utils/UnitUtil";
import { toList, toMap } from "../../utils/DataUtil";
import { Tool } from "../../components/Tool";
import { Button } from "../../components/Button";
import * as styles from './DownloadManage.module.less';
import { ISong } from "../../interfaces/ISong";
import { Link } from "react-router-dom";

export interface IDownloadManageProps {
    actions?: {
        song: typeof SongAction;
        current: typeof CurrentAction;
    };
    downloads?: { [key: string]: IDownload };
    homePath?: string;
    loveSongs?: ISong[];
}

@connect(
    (state: IState) => ({
        downloads: state.downloads,
        homePath: state.system.homePath,
        loveSongs: state.love.songs,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            song: bindActionCreators(actions(SongAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class DownloadManage extends React.Component<IDownloadManageProps> {
    public state = {
        selected: null,
    };

    selected(index: number) {
        this.setState({ selected: index === this.state.selected ? null : index });
    }

    download(songId: number, songType: string) {
        location.href = `http://127.0.0.1:56562/songs/${ songId }/download?songType=${ songType }`;
    }

    openFolder() {
        shell.showItemInFolder(resolve(this.props.homePath, 'i5sing/downloads'));
    }

    love(hasLoved: boolean, song: IDownload) {
        const musicboxSong = [{
            ID: song.songId,
            NN: song.username,
            SUID: song.userId,
            SK: song.songKind,
            SN: song.songName
        }];
        if (hasLoved) {
            this.props.actions.song.syncLoveSongs([], musicboxSong);
        } else {
            this.props.actions.song.syncLoveSongs(musicboxSong);
        }
    }

    delete(song: IDownload) {
        this.props.actions.song.deleteLocalSong(song.songId, song.songKind);
    }

    play(song: IDownload) {
        this.props.actions.current.play(song.songId + '', song.songName, {
            id: song.songId,
            name: song.songName,
            kind: song.songKind,
            user: {
                id: Number(song.userId),
                nickname: song.username,
                image: null
            },
            local: `file:///${ resolve(this.props.homePath, 'i5sing/downloads', song.filename) }`
        });
    }

    playAll(songs: IDownload[]) {
        this.props.actions.current.plays(songs.map(song => ({
            id: song.songId,
            name: song.songName,
            kind: song.songKind,
            user: {
                id: Number(song.userId),
                nickname: song.username,
                image: null
            },
            local: `file:///${ resolve(this.props.homePath, 'i5sing/downloads', song.filename) }`
        })));
    }

    render() {
        const { downloads, loveSongs } = this.props;
        const songs = toList<IDownload>(downloads, i => `${ i.songKind }-${ i.songId }`);
        const loves = toMap<ISong>(loveSongs, i => `${ i.kind }-${ i.id }`);

        return <Layout>
            <Tool direction="left">
                <Button type="primary" onClick={ () => this.playAll(songs) }>
                    <Icon type="play-circle"/>播放全部
                </Button>
                <a className={ styles.open_folder_btn } onClick={ () => this.openFolder() }>打开目录</a>
            </Tool>
            <div className={ styles.content }>
                <Table header={ <Table.Row>
                    <Table.Col type="header" style={ { width: 30 } }>&nbsp;</Table.Col>
                    <Table.Col type="header" width={ 60 }>&nbsp;</Table.Col>
                    <Table.Col type="header" width={ 280 }>歌曲标题</Table.Col>
                    <Table.Col type="header" width={ 180 }>歌手</Table.Col>
                    <Table.Col type="header" width={ 70 }>大小</Table.Col>
                    <Table.Col type="header" width={ 130 }>下载时间</Table.Col>
                    <Table.Col type="header" style={ { width: 30 } }>&nbsp;</Table.Col>
                </Table.Row> }>
                    { songs.map((song: IDownload, index: number) => {
                            const key = `${ song.songKind }-${ song.songId }`;
                            const hasLoved = !!loves[key];
                            return <Table.Row id={ `${ key }--downloads` }
                                              onDoubleClick={ () => this.play(song) }
                                              className={
                                                  `${ styles.download_table_row } ${ this.state.selected === index ? 'selected' : '' }`
                                              }
                                              key={ song.songId }
                                              onClick={ () => this.selected(index) }>
                                <Table.Col width={ 30 }>&nbsp;</Table.Col>
                                <Table.Col width={ 60 }>
                                    <span>{ (index + 1) < 10 ? '0' + (index + 1) : index + 1 }</span>
                                    <span>
                                        <Icon type="heart" theme={ hasLoved ? 'filled' : 'outlined' }
                                              onClick={ () => this.love(hasLoved, song) }
                                              className={ `song-icon ${ hasLoved ? 'highlight' : '' }` }/>
                                    </span>
                                </Table.Col>
                                <Table.Col width={ 280 }>{ song.songName }</Table.Col>
                                <Table.Col width={ 180 }>
                                    <Link to={ `/musicians/${ song.userId }` }>{ song.username }</Link>
                                </Table.Col>
                                <Table.Col width={ 70 }>{ prettyByte(song.total, 'B') }</Table.Col>
                                <Table.Col width={ 130 }>{ song.createTime }</Table.Col>
                                <Table.Col width={ 30 }>
                                    <Icon className={ styles.delete_btn } type="close" onClick={ e => {
                                        e.stopPropagation();
                                        this.delete(song);
                                    } }/>
                                </Table.Col>
                            </Table.Row>
                        }
                    ) }
                </Table>
            </div>
        </Layout>;
    }
}
