import * as React from 'react';
import { shell } from 'electron';
import { resolve } from 'path';
import { useDispatch, useSelector } from 'react-redux';
import { CurrentAction, SongAction } from "../../actions";
import * as styles from './download-manage.m.less';
import { Link } from "react-router-dom";
import { IDownload, ISong, ISystem } from "../../interfaces";
import { prettyByte, toList, toMap } from "../../helpers";
import { Button, Layout, Table, Tool } from "../../components";
import { CloseOutlined, HeartFilled, HeartOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

export const DownloadManage = () => {
    const [selected, setSelected] = useState<null | number>();
    const { homePath } = useSelector<any, ISystem>(state => state.system);
    const loveSongs = useSelector<any, ISong[]>(state => state.love.songs);
    const downloads = useSelector<any, IDownload[]>(state => state.downloads);
    const songs = toList<IDownload>(downloads, i => `${i.songKind}-${i.songId}`);
    const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);
    const dispatch = useDispatch();

    // const download = (songId: number, songType: string) => {
    //     location.href = `http://127.0.0.1:56562/songs/${songId}/download?songType=${songType}`;
    // }

    const openFolder = () => {
        shell.showItemInFolder(resolve(homePath, 'i5sing/downloads'));
    }

    const love = (hasLoved: boolean, song: IDownload) => {
        const musicBoxSong = [{
            ID: song.songId,
            NN: song.username,
            SUID: song.userId,
            SK: song.songKind,
            SN: song.songName
        }];
        if (hasLoved) {
            dispatch(SongAction.syncLoveSongs([], musicBoxSong));
        } else {
            dispatch(SongAction.syncLoveSongs(musicBoxSong));
        }
    }

    const deleteSong = (song: IDownload) => {
        dispatch(SongAction.deleteLocalSong(song.songId, song.songKind));
    }

    const play = (song: IDownload) => {
        dispatch(CurrentAction.play(song.songId + '', song.songKind, {
            id: song.songId,
            name: song.songName,
            kind: song.songKind,
            user: {
                id: Number(song.userId),
                nickname: song.username,
                image: null
            },
            local: `http://127.0.0.1:56562/local/play?url=${encodeURIComponent(resolve(homePath, 'i5sing/downloads', song.filename))}`
        }));
    }

    const playAll = (songs: IDownload[]) => {
        dispatch(CurrentAction.plays(songs.map(song => ({
            id: song.songId,
            name: song.songName,
            kind: song.songKind,
            user: {
                id: Number(song.userId),
                nickname: song.username,
                image: null
            },
            local: `file:///${resolve(homePath, 'i5sing/downloads', song.filename)}`
        }))));
    }

    return (
        <Layout>
            <Tool direction="left">
                <Button type="primary" onClick={() => playAll(songs)}>
                    <PlayCircleOutlined/>播放全部
                </Button>
                <a className={styles.open_folder_btn} onClick={() => openFolder()}>
                    打开目录
                </a>
            </Tool>
            <div className={styles.content}>
                <Table style={{ background: 'none' }} header={<Table.Row>
                    <Table.Col type="header" style={{ width: 30 }}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={60}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={280}>歌曲标题</Table.Col>
                    <Table.Col type="header" width={180}>歌手</Table.Col>
                    <Table.Col type="header" width={70}>大小</Table.Col>
                    <Table.Col type="header" width={130}>下载时间</Table.Col>
                    <Table.Col type="header" style={{ width: 30 }}>&nbsp;</Table.Col>
                </Table.Row>}>
                    {songs?.map((song: IDownload, index: number) => {
                            const key = `${song.songKind}-${song.songId}`;
                            const hasLoved = !!loves[key];
                            return <Table.Row
                                id={`${key}--downloads`}
                                onDoubleClick={() => play(song)}
                                className={
                                    `${styles.download_table_row} ${selected === index ? 'selected' : ''}`
                                }
                                key={song.songId}
                                onClick={() => setSelected(index === selected ? null : index)}>
                                <Table.Col width={30}>&nbsp;</Table.Col>
                                <Table.Col width={60}>
                                    <span>{(index + 1) < 10 ? '0' + (index + 1) : index + 1}</span>
                                    <span>
                                        {hasLoved ?
                                            <HeartFilled
                                                className="song-icon highlight"
                                                onClick={() => love(hasLoved, song)}
                                            /> :
                                            <HeartOutlined
                                                className="song-icon highlight"
                                                onClick={() => love(hasLoved, song)}
                                            />
                                        }
                                    </span>
                                </Table.Col>
                                <Table.Col width={280}>{song.songName}</Table.Col>
                                <Table.Col width={180}>
                                    <Link to={`/musicians/${song.userId}`}>{song.username}</Link>
                                </Table.Col>
                                <Table.Col width={70}>{prettyByte(song.total, 'B')}</Table.Col>
                                <Table.Col width={130}>{song.createTime}</Table.Col>
                                <Table.Col width={30}>
                                    <CloseOutlined className={styles.delete_btn} onClick={e => {
                                        e.stopPropagation();
                                        deleteSong(song);
                                    }}/>
                                </Table.Col>
                            </Table.Row>
                        }
                    )}
                </Table>
            </div>
        </Layout>
    )
}
