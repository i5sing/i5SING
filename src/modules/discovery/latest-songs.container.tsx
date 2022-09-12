import * as React from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';

import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

import './latest-songs.less';
import { ICurrent, ILatestSong } from "../../interfaces";
import { Card } from "../../components";
import useSWR from "swr";
import { buildLatestSongsUrl } from "../../constants/urls.constant";
import { IResponse } from "../../interfaces/response.interface";

export const LatestSongs = () => {
    const { current, list } = useSelector<any, ICurrent>(state => state.current);
    const playingSong = list[current];
    const { data } = useSWR<IResponse<ILatestSong[]>>(buildLatestSongsUrl());
    const songs = data?.data;

    const play = (song: ILatestSong) => {
        const songKind = song.singType === 1 ? 'yc' : song.singType === 2 ? 'fc' : 'bz';
        this.props.actions.current.play(
            song.singId + '',
            songKind,
            {
                kind: songKind,
                name: song.songName,
                id: song.singId,
                user: {
                    id: song.singerId,
                    nickname: song.singer
                }
            },
        );
    }

    if (songs?.length === 0) {
        return <span/>;
    }
    return <Card title={"最新音乐"}>
        <div className="latest-songs">
            {songs?.slice(0, 10)?.map((song: ILatestSong, index: number) =>
                <div key={song.singId} className="latest-songs-item">
                    <div className={
                        `latest-songs-item-content ${playingSong && playingSong.id === song.singId ? 'active' : ''}`
                    }>
                        <div className="latest-songs-item-img" onClick={() => play(song)}>
                            <img src={song.image} alt={song.songName}/>
                            <div className="play-btn-wrap">
                                <PlayCircleOutlined className="play-btn"/>
                            </div>
                        </div>
                        <span>{index + 1 >= 10 ? index + 1 : '0' + (index + 1)}</span>
                        <div className="latest-songs-item-info">
                            <h3 className="balabala">{song.songName}</h3>
                            <p className="balabala">
                                <Link to={`/musicians/${song.singerId}`}>{song.singer}</Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Card>
}
