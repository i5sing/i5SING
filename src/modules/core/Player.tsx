import * as React from 'react';
import { get } from 'lodash';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import * as Lyrics from 'lyrics.js';
import { Progress, Timer } from 'react-soundplayer/components';
import * as styles from './Player.module.less';
import * as defaultUserImage from '../../assets/i5sing.png';

import { withCustomAudio } from 'react-soundplayer/addons';
import { IState } from "../../reducers";
import { Icon, Slider, Tag } from "antd";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { CurrentAction, SongAction } from "../../actions";
import { ISong } from "../../interfaces/ISong";
import { Link } from "react-router-dom";
import { toMap } from "../../utils/DataUtil";
import { PlaySongs } from "./PlaySongs";
import { SONG_CHANGE_EVENT, SYNC_LRC_EVENT } from "../../constants/Events";

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
}

interface IPlayerState {
    preload: boolean;
    visible: boolean;
}

class Player extends React.Component<IPlayerProps, IPlayerState> {
    public state = {
        preload: false,
        visible: false,
    };
    private lrc = null;

    componentDidMount(): void {
        this.props.soundCloudAudio.on('ended', () => {
            this.next();
        });
        this.props.soundCloudAudio.on('error', () => {
            console.log('play error');
            this.next();
        });
        this.props.soundCloudAudio.on('interrupted', () => {
            console.log('play interrupted');
            this.next();
        });
        this.props.soundCloudAudio.on('timeupdate', () => {
            if (this.lrc) {
                const index = this.lrc.select(this.props.currentTime);
                const text = this.lrc.getLyric(index);
                ipcRenderer.send(SYNC_LRC_EVENT, text);
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

    play(song: ISong) {
        const currentTime = this.props.currentTime;
        const url = song.local || song.hqurl || song.squrl || song.lqurl;
        this.props.soundCloudAudio.play({
            streamUrl: song.local ? url : `http://127.0.0.1:56562/play-music?url=${encodeURIComponent(url)}`
        });

        this.props.soundCloudAudio.setTime(currentTime);

        new Notification(song.name, {
            body: song.user.nickname,
            icon: song.user.image || defaultUserImage,
            silent: true
        });

        if (song.dynamicWords) {
            this.lrc = new Lyrics(song.dynamicWords);
        } else {
            this.lrc = null;
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

    render() {
        const { current, soundCloudAudio, songList, loveSongs, seq } = this.props;
        const song: ISong = songList[current] || { songName: '', name: '' };
        const loves = toMap<ISong>(loveSongs, i => `${i.kind}-${i.id}`);
        const user = get(song, 'user', { image: defaultUserImage, nickname: '', id: '' });
        const key = `${song.kind}-${song.id}`;
        const hasLoved = !!loves[key];
        return <div className={styles.player}>
            <img className={styles.user_image} src={user.image || defaultUserImage} alt={user.nickname}/>
            <div className={styles.info}>
                <h3 className="balabala">{song.name}</h3>
                <h3 className="balabala">
                    <Link to={user.id === -1 ? `/clouds` : `/musicians/${user.id}`}>{user.nickname}</Link>
                </h3>
            </div>
            <div className={styles.play_btn_group}>
                <Icon type="heart" theme="filled"
                      onClick={() => this.love(hasLoved, song)}
                      className={`${styles.like_btn} ${hasLoved ? styles.highlight : ''}`}/>
                <Timer className={styles.time} {...this.props} />
                <Icon className={styles.prev_btn} type="vertical-right" onClick={() => this.previous()}/>
                {!soundCloudAudio.playing ?
                    <Icon className={styles.play_btn} type="play-circle" onClick={() => this.play(song)}/> :
                    <Icon className={styles.pause_btn} type="pause-circle" onClick={() => this.pause()}/>
                }
                <Icon className={styles.next_btn} type="vertical-left" onClick={() => this.next()}/>
                <span className={styles.sequence} onClick={() => this.nextSeq()}>
                    <Tag>{this.prettySeq(seq)}</Tag>
                </span>
                {/*<Icon className={ styles.share_btn } type="export"/>*/}
            </div>

            <Icon className={styles.list_btn} type="menu-unfold" onClick={() => this.togglePlayList()}/>
            <Slider className={styles.voice_slider} defaultValue={100} max={100} min={0}
                    onChange={(value: number) => soundCloudAudio.setVolume(value / 100)}/>
            <Icon className={styles.voice_btn} type="sound"/>
            <Progress className={styles.progress} {...this.props}/>
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
    }),
    (dispatch: Dispatch) => ({
        actions: {
            current: bindActionCreators(actions(CurrentAction), dispatch),
            song: bindActionCreators(actions(SongAction), dispatch),
        }
    })
)(Player));
