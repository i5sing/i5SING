import * as React from 'react';
import * as moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Upload } from "antd";
import * as styles from "./cloud-songs.m.less";
import { CurrentAction } from "../../actions";
import { ICloud, ICloudSong } from "../../interfaces";
import { instance, prettyByte } from "../../helpers";
import { Button, Layout, Table, Tool } from "../../components";
import { CloseOutlined, CloudUploadOutlined, PlayCircleOutlined } from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { buildCloudSongsUrl, buildDeleteCloudSongUrl } from "../../constants/urls.constant";
import { useState } from "react";

export const CloudSongs = () => {
    const [selected, setSelected] = useState<null | number>();
    const { domain } = useSelector<any, ICloud>(state => state.cloud);
    const { data } = useSWR<{ items: ICloudSong[] }>(buildCloudSongsUrl());
    const songs = data?.items;
    const dispatch = useDispatch();

    const handleBeforeUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        await instance.post(buildCloudSongsUrl(), formData, {});
        await mutate(buildCloudSongsUrl());
        return false;
    }

    const deleteSong = async (key: string) => {
        await instance.delete(buildDeleteCloudSongUrl(key));
        await mutate(buildCloudSongsUrl());
    }

    const play = (song: ICloudSong) => {
        dispatch(CurrentAction.play(song.key, 'cloud', {
            id: song.key,
            name: song.key,
            kind: 'cloud',
            user: {
                id: -1,
                nickname: '我的音乐云盘'
            },
            local: domain + '/' + encodeURIComponent(song.key),

        }));
    }

    const playAll = (songs: ICloudSong[]) => {
        dispatch(CurrentAction.plays(songs.map(song => ({
            id: song.key,
            name: song.key,
            kind: 'cloud',
            user: {
                id: -1,
                nickname: '我的音乐云盘'
            },
            local: domain + '/' + encodeURIComponent(song.key),
        }))));
    }

    return (
        <Layout>
            <Tool direction="left">
                <Button type="primary" disabled={!domain} onClick={() => playAll(songs)}>
                    <PlayCircleOutlined/>播放全部
                </Button>
                <span style={{ marginTop: 8 }}>
                <Upload
                    accept=".mp3,.wma,.avi,.rm,.rmvb,.flv,.mpg,.mov,.mkv"
                    showUploadList={false}
                    beforeUpload={file => handleBeforeUpload(file)}>
                    <Button disabled={!domain}><CloudUploadOutlined/>上传</Button>
                </Upload>
                </span>
            </Tool>
            <div className={styles.content}>
                <Table style={{ background: 'none' }} header={<Table.Row>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={40}>&nbsp;</Table.Col>
                    <Table.Col type="header" width={400}>歌曲标题</Table.Col>
                    <Table.Col type="header" width={90}>格式</Table.Col>
                    <Table.Col type="header" width={70}>大小</Table.Col>
                    <Table.Col type="header" width={130}>上传时间</Table.Col>
                    <Table.Col type="header" width={30}>&nbsp;</Table.Col>
                </Table.Row>}>
                    {songs.map((song: ICloudSong, index: number) => (
                        <Table.Row
                            id={`${song.key}--cloud.songs`}
                            onDoubleClick={() => play(song)}
                            className={
                                `${styles.cloud_table_row} ${selected === index ? 'selected' : ''}`
                            }
                            key={song.key}
                            onClick={() => setSelected(index === selected ? null : index)}>
                            <Table.Col width={30}>&nbsp;</Table.Col>
                            <Table.Col width={40}>
                                <span>{(index + 1) < 10 ? '0' + (index + 1) : index + 1}</span>
                                <span>

                                </span>
                            </Table.Col>
                            <Table.Col width={400}>{song.key}</Table.Col>
                            <Table.Col width={90}>{song.mimeType}</Table.Col>
                            <Table.Col width={70}>{prettyByte(song.fsize, 'B')}</Table.Col>
                            <Table.Col width={130}>
                                {moment(song.putTime / 10000).format('YYYY-MM-DD HH:mm')}
                            </Table.Col>
                            <Table.Col width={30}>
                                <CloseOutlined className={styles.delete_btn} onClick={e => {
                                    e.stopPropagation();
                                    deleteSong(song.key);
                                }}/>
                            </Table.Col>
                        </Table.Row>
                    ))}
                </Table>
            </div>
        </Layout>
    )
}
