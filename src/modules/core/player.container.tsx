import * as React from 'react';
import { get } from 'lodash';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import * as Lyrics from 'lyrics.js';
import ReactSlider from 'react-slider';
import { Timer } from 'react-soundplayer/components';
import * as styles from './player.m.less';
import * as defaultUserImage from '../../assets/i5sing.png';

import { withCustomAudio } from 'react-soundplayer/addons';
import { IState } from "../../reducers";
import { Slider, Tag } from "antd";
import {
    LoadingOutlined,
    HeartFilled,
    VerticalRightOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    VerticalLeftOutlined,
    MenuUnfoldOutlined,
    SoundOutlined,
} from '@ant-design/icons';
import { bindActionCreators, Dispatch } from "redux";
import { CurrentAction, SongAction } from "../../actions";
import { ISong } from "../../interfaces";
import { SONG_CHANGE_EVENT, SONG_NOTIFY_EVENT, SYNC_LRC_EVENT } from "../../constants/events.constant";
import { actions, toMap } from "../../helpers";
import { PlaySongs } from "./play-songs.container";

export interface IPlayerProps {
    current?: number;
    songList?: any[];
    soundCloudAudio?: any;
    actions?: {
        current: typeof CurrentAction;
        song: typeof SongAction;
    };
    loveSongs?: ISong[];
    duration?: number;
    currentTime?: number;
    seq?: string;
    loading?: boolean;
    showPlaying?: boolean;
}

interface IPlayerState {
    preload: boolean;
    visible: boolean;
    current: number;
    isSeeking: boolean;
}

class Player extends React.Component<IPlayerProps, IPlayerState> {
    public state = {
        preload: false,
        visible: false,
        current: 0,
        isSeeking: false,
    };
    private lrc = null;
    private timer;

    componentDidMount(): void {
        this.props.soundCloudAudio.on('ended', () => this.next());
        this.props.soundCloudAudio.on('loadeddata', () => this.props.actions.current.loaded());
        this.props.soundCloudAudio.on('error', (e) => {
            console.log('play error', e);
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => this.next(), 100);
        });
        this.props.soundCloudAudio.on('interrupted', () => {
            console.log('play interrupted');
            this.next();
        });
        this.props.soundCloudAudio.on('playing', () => {
            this.setState({ isSeeking: false });
        })
        this.props.soundCloudAudio.on('timeupdate', (e) => {
            if (this.props.soundCloudAudio.playing && !this.state.isSeeking) {
                this.setState({ current: this.props.currentTime });
            }

            if (this.lrc) {
                const index = this.lrc.select(this.props.currentTime);
                const text = this.lrc.getLyric(index);
                ipcRenderer.send(SYNC_LRC_EVENT, text);
                this.props.actions.current.updateLyricId(index);
            } else {
                ipcRenderer.send(SYNC_LRC_EVENT, { text: this.props.currentTime < 3 ? '暂无歌词' : '' });
            }
        });
        ipcRenderer.on(SONG_CHANGE_EVENT, (evt, type) => {
            switch (type) {
                case 'pre':
                    this.previous();
                    break;
                case 'next':
                    this.next();
                    break;
                default:
                    if (this.props.soundCloudAudio.playing) {
                        this.previous()
                    } else {
                        const song = this.props.songList[this.props.current];
                        if (song) {
                            this.play(song);
                        }
                    }
            }
        });
    }

    next(index?: number) {
        this.props.actions.current.next(index);
    }

    previous() {
        this.props.actions.current.previous();
    }

    componentWillReceiveProps(nextProps: Readonly<IPlayerProps>, nextContext: any): void {
        console.log(nextProps.current, nextProps.songList[nextProps.current], this.props.current);
        if (nextProps.current >= 0 && nextProps.current !== this.props.current) {
            const song: ISong = nextProps.songList[nextProps.current];
            const url = song.local || song.hqurl || song.squrl || song.lqurl;
            if (url) {
                this.play(song);
            } else {
                this.setState({ preload: true });
            }
        } else if (nextProps.current >= 0 && this.state.preload) {
            const song: ISong = nextProps.songList[nextProps.current];
            const url = song.local || song.hqurl || song.squrl || song.lqurl;
            if (url) {
                this.setState({ preload: false });
                this.play(song);
            }
        } else if (nextProps.current === -1 && this.props.current !== -1) {
            this.props.soundCloudAudio.stop();
        } else if (nextProps.current <= -2 && this.props.current !== nextProps.current) {
            this.next(this.props.current);
        }
    }

    play(song: ISong, notify: boolean = true) {
        const url = song.local || song.hqurl || song.squrl || song.lqurl;
        this.props.soundCloudAudio.play({
            streamUrl: song.local ? url : `http://127.0.0.1:56562/play-music?url=${encodeURIComponent(url)}`
        });

        if (notify) {
            ipcRenderer.send(SONG_NOTIFY_EVENT, {
                title: song.name,
                body: song.user.nickname,
                icon: song.user.image || defaultUserImage
            });
        }

        if (song.dynamicWords) {
            this.lrc = new Lyrics(song.dynamicWords);
            this.props.actions.current.updateDynamicLyrics(this.lrc.getLyrics());
        } else {
            this.lrc = null;
            this.props.actions.current.updateDynamicLyrics([]);
        }
    }

    love(hasLoved: boolean, song: ISong) {
        const musicboxSong = [{
            ID: song.id,
            NN: song.user.nickname,
            SUID: song.user.id + '',
            SK: song.kind,
            SN: song.name
        }];
        if (hasLoved) {
            this.props.actions.song.syncLoveSongs([], musicboxSong);
        } else {
            this.props.actions.song.syncLoveSongs(musicboxSong);
        }
    }

    pause() {
        this.props.soundCloudAudio.pause();
    }

    togglePlayList() {
        this.setState({ visible: !this.state.visible });
    }

    prettySeq(seq) {
        switch (seq) {
            case 'sequence':
                return '顺序';
            case 'loop':
                return '循环';
            case 'random':
                return '随机';
        }
    }

    nextSeq() {
        this.props.actions.current.nextSequence();
    }

    goPlaying() {
        this.props.actions.current.showPlayingPage(!this.props.showPlaying);
    }

    onClickUsername(user) {
        this.props.actions.current.showPlayingPage(false);
        location.hash = user.id === -1 ? `/clouds` : `/musicians/${user.id}`;
    }

    render() {
        const { current, soundCloudAudio, songList, loveSongs, seq } = this.props;
        const song: ISong = songList[current] || { songName: '', name: '' };
        const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);
        const user = get(song, 'user', { image: defaultUserImage, nickname: '', id: '' });
        const key = `${song.kind}-${song.id}`;
        const hasLoved = !!loves[key];
        return <div className={styles.player}>
            <div className={styles.user_image}>
                {this.props.loading && <div className={styles.loading_layer}>
                    <LoadingOutlined className={styles.loading}/>
                </div>}
                <img src={user.image || defaultUserImage} alt={user.nickname}
                     onClick={() => this.goPlaying()}/>
            </div>
            <div className={styles.info}>
                <h3 className="balabala">{song.name}</h3>
                <h3 className="balabala">
                    <a onClick={() => this.onClickUsername(user)}>{user.nickname}</a>
                </h3>
            </div>
            <div className={styles.play_btn_group}>
                <HeartFilled
                    onClick={() => this.love(hasLoved, song)}
                    className={`${styles.like_btn} ${hasLoved ? styles.highlight : ''}`}/>
                <Timer className={styles.time} {...this.props} />
                <VerticalRightOutlined className={styles.prev_btn} onClick={() => this.previous()}/>
                {!soundCloudAudio.playing ?
                    <PlayCircleOutlined className={styles.play_btn} onClick={() => this.play(song)}/> :
                    <PauseCircleOutlined className={styles.pause_btn} onClick={() => this.pause()}/>
                }
                <VerticalLeftOutlined className={styles.next_btn} onClick={() => this.next()}/>
                <span className={styles.sequence} onClick={() => this.nextSeq()}>
                    <Tag>{this.prettySeq(seq)}</Tag>
                </span>
                {/*<Icon className={ styles.share_btn } type="export"/>*/}
            </div>

            <MenuUnfoldOutlined className={styles.list_btn} onClick={() => this.togglePlayList()}/>
            <Slider className={styles.voice_slider} defaultValue={100} max={100} min={0}
                    onChange={(value: number) => soundCloudAudio.setVolume(value / 100)}/>
            <SoundOutlined className={styles.voice_btn}/>
            <ReactSlider
                step={0.01}
                onBeforeChange={() => {
                    this.pause();
                    this.setState({ isSeeking: true });
                }}
                onChange={val => this.setState({ current: val })}
                onAfterChange={val => {
                    this.props.soundCloudAudio.setTime(val);
                    this.play(song, false);
                }}
                value={this.state.current}
                max={this.props.duration}/>
            {this.state.visible ? <PlaySongs onHide={() => this.setState({ visible: false })}/> : null}
        </div>
    }
}

export const I5singPlayer = withCustomAudio(connect(
    (state: IState) => ({
        current: state.current.current,
        songList: state.current.list,
        loveSongs: state.love.songs,
        seq: state.current.sequence,
        loading: state.current.loading,
        showPlaying: state.current.showPlaying,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
        }
    })
)(Player));
