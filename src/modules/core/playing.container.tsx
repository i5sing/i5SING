import * as React from 'react';
import * as styles from './playing.m.less';
import { Icon } from "antd";
import * as $ from 'jquery';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { ISong } from "../../interfaces";
import { get } from "lodash";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../helpers";
import { CurrentAction } from "../../actions";

@connect(
    (state: IState) => ({
        current: state.current.current,
        songList: state.current.list,
        loveSongs: state.love.songs,
        seq: state.current.sequence,
        loading: state.current.loading,
        lyrics: state.current.dynamicLyrics,
        id: state.current.lyricId,
        visible: state.current.showPlaying,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class Playing extends React.Component<any, any> {
    componentWillReceiveProps(props: Readonly<any>, nextContext: any) {
        if (props.id !== this.props.id) {
            const lineElement = $(`.lyric-${props.id}`)[0] || { offsetTop: 0 };
            const windowHeight = 380;
            const AdditionOffset = -158;
            const offset = lineElement.offsetTop - windowHeight / 2 + AdditionOffset;
            $('.lyric-content').animate({
                scrollTop: `${offset}px`,
            }, 500);
        }
    }

    onClickUsername(user) {
        this.props.actions.current.showPlayingPage(false);
        location.hash = user.id === -1 ? `/clouds` : `/musicians/${user.id}`;
    }

    render() {
        const { current, songList, lyrics = [], id, visible } = this.props;
        const song: ISong = songList[current] || { songName: '', name: '' };
        const user = get(song, 'user', { image: void 0, nickname: '', id: '' });
        return visible ? <div className={styles.player_detail}>
            <Icon type="down"
                  className={styles.close_btn}
                  onClick={() => this.props.actions.current.showPlayingPage(false)}/>
            <div>
                <div className={styles.image}>
                    <img src={user.image} alt={user.nickname}/>
                </div>
                <div className={styles.lrc}>
                    <h1>{song.name}</h1>
                    <div className={styles.description}>
                        <span>歌手：</span>
                        <a onClick={() => this.onClickUsername(user)}>{user.nickname}</a>
                    </div>
                    <div className={`${styles.content} lyric-content`}>
                        {lyrics.map((lyric, index) => <p
                            className={`${styles.lyrics} ${id === index ? styles.selected : ''} lyric-${index}`}>
                            {lyric.text}
                        </p>)}
                    </div>
                </div>
            </div>
        </div> : '';
    }
}
