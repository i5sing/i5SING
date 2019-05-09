import * as React from 'react';
import { isUndefined } from 'lodash';
import * as styles from './Play.module.less';
import { Button } from "./Button";
import { Icon } from "antd";

export interface IPlayProps {
    image: string;
    title: string;
    songCount?: number;
    updatedAt?: string;
    description?: string;
    onPlayAll?: () => void;
    onDownloadAll?: () => void;
    onLike?: () => void;
    collects?: number;
    shares?: number;
    isLike?: boolean;
    type?: 'play' | 'top';
}

interface IPlayState {
    spread: boolean;
}

export class Play extends React.Component<IPlayProps, IPlayState> {
    public state = {
        spread: false,
    };

    renderInfo() {
        const { songCount, updatedAt, description } = this.props;
        const spread = this.state.spread;
        return [
            <p>
                <span>歌曲数：{ songCount }</span>
                <span>最近更新：{ updatedAt }</span>
            </p>,
            <p className={ !spread ? 'balabala' : '' } style={ { paddingRight: 14 } }>
                描<i style={ { visibility: 'hidden' } }>描</i>述：{ description }
                <Icon className={ styles.spread_btn }
                      type={ spread ? 'caret-up' : 'caret-down' }
                      onClick={ () => this.setState({ spread: !this.state.spread }) }/>
            </p>
        ]
    }

    renderTools() {
        const { collects, shares, isLike, onLike, onPlayAll } = this.props;
        return <div className={ styles.tools }>
            <Button type="primary" onClick={ onPlayAll }><Icon type="play-circle"/>播放全部</Button>
            <Button onClick={ this.props.onDownloadAll }><Icon type="download"/>下载全部</Button>
            { !isUndefined(collects) && <Button onClick={ onLike }>
                <Icon type="select"/>{ isLike ? '已' : '' }收藏({ collects })
            </Button> }
            { !isUndefined(shares) && <Button onClick={ this.props.onDownloadAll }>
                <Icon type="share-alt"/>分享({ shares })
            </Button> }
        </div>
    }

    render() {
        const { image, title, type = 'play' } = this.props;
        return <div className={ styles.play }>
            <div className={ styles.play_top }>
                <img src={ image } alt={ title }/>
                <div className={ styles.play_info }>
                    <h1><span>歌单</span>{ title }</h1>
                    { type === 'play' ?
                        [this.renderTools(), this.renderInfo()] :
                        [this.renderInfo(), this.renderTools()]
                    }
                </div>
            </div>
            <div className={ styles.play_content }>
                { this.props.children }
            </div>
        </div>
    }
}
