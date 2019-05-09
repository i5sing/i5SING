import * as React from 'react';
import * as styles from './Musician.module.less';
import { Button } from "./Button";
import { Icon } from "antd";

export interface IPlayProps {
    image: string;
    title: string;
    description?: string;
    onLike?: () => void;
    isLike?: boolean;
    hideLike?: boolean;
}

interface IPlayState {
    spread: boolean;
}

export class Musician extends React.Component<IPlayProps, IPlayState> {
    public state = {
        spread: false,
    };

    renderInfo() {
        const { description } = this.props;
        const spread = this.state.spread;
        return [
            <p className={ !spread ? 'balabala' : '' } style={ { paddingRight: 14 } }>
                描<i style={ { visibility: 'hidden' } }>描</i>述：{ description }
                <Icon className={ styles.spread_btn }
                      type={ spread ? 'caret-up' : 'caret-down' }
                      onClick={ () => this.setState({ spread: !this.state.spread }) }/>
            </p>
        ]
    }

    renderTools() {
        const { isLike, onLike, hideLike } = this.props;
        return <div className={ styles.tools }>
            { !hideLike ? <Button onClick={ onLike }>
                <Icon type="select"/>{ isLike ? '已' : '' }收藏
            </Button> : null }
        </div>
    }

    render() {
        const { image, title } = this.props;
        return <div className={ styles.play }>
            <div className={ styles.play_top }>
                <img src={ image } alt={ title }/>
                <div className={ styles.play_info }>
                    <h1>{ title }</h1>
                    { [this.renderInfo(), this.renderTools()] }
                </div>
            </div>
            <div className={ styles.play_content }>
                { this.props.children }
            </div>
        </div>
    }
}
