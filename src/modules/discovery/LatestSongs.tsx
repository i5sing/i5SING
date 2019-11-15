import * as React from 'react';
import { Icon } from 'antd';

import { ILatestSong } from "../../interfaces/ILatestSong";
import { Card } from "../../components/Card";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import './LatestSongs.less';
import { CurrentAction, SongAction } from "../../actions";
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { ISong } from "../../interfaces/ISong";

export interface ILatestSongsProps {
    actions?: {
        song: typeof SongAction;
        current: typeof CurrentAction;
    }
    songs?: ILatestSong[];
    current?: number;
    playlist?: ISong[];
}

interface LatestSongsState {
}

@connect(
    (state: IState) => ({
        songs: state.discoveryLatestSongs,
        current: state.current.current,
        playlist: state.current.list,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            song: bindActionCreators(actions(SongAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class LatestSongs extends React.Component<ILatestSongsProps, LatestSongsState> {

    componentDidMount(): void {
        this.props.actions.song.getLatestSongs();
    }

    play(song: ILatestSong) {
        const songKind = song.type === 1 ? 'yc' : song.type === 2 ? 'fc' : 'bz';
        this.props.actions.current.play(
            song.id + '',
            songKind,
            {
                kind: songKind,
                name: song.name,
                id: song.id,
                user: {
                    id: song.singerId,
                    nickname: song.singerName
                }
            })
    }

    render() {
        const { songs, playlist, current } = this.props;
        const playingSong = playlist[current];
        if (songs.length === 0) {
            return '';
        }
        return <Card title={"最新音乐"}>
            <div className="latest-songs">
                {songs.map((song: ILatestSong, index: number) =>
                    <div key={song.id} className="latest-songs-item">
                        <div className={
                            `latest-songs-item-content ${playingSong && playingSong.id === song.id ? 'active' : ''}`
                        }>
                            <div className="latest-songs-item-img" onClick={() => this.play(song)}>
                                <img src={song.image} alt={song.name}/>
                                <div className="play-btn-wrap">
                                    <Icon type="play-circle" className="play-btn"/>
                                </div>
                            </div>
                            <span>{index + 1 >= 10 ? index + 1 : '0' + (index + 1)}</span>
                            <div className="latest-songs-item-info">
                                <h3 className="balabala">{song.name}</h3>
                                <p className="balabala">
                                    <Link to={`/musicians/${song.singerId}`}>{song.singerName}</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    }
}
