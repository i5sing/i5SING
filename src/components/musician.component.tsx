import * as React from 'react';
import * as styles from './musician.m.less';
import { Button } from "./button.component";
import { CaretUpOutlined, CaretDownOutlined, SelectOutlined } from "@ant-design/icons";

export interface IMusicianProps {
    image: string;
    title: string;
    description?: string;
    onLike?: () => void;
    isLike?: boolean;
    hideLike?: boolean;
}

interface IMusicianState {
    spread: boolean;
}

export class Musician extends React.Component<IMusicianProps, IMusicianState> {
    public state = {
        spread: false,
    };

    renderInfo() {
        const { description } = this.props;
        const spread = this.state.spread;
        return [
            <p className={!spread ? 'balabala' : ''} style={{ paddingRight: 14 }}>
                描<i style={{ visibility: 'hidden' }}>描</i>述：{description}
                {spread ?
                    <CaretUpOutlined
                        className={styles.spread_btn}
                        onClick={() => this.setState({ spread: !this.state.spread })}
                    /> :
                    <CaretDownOutlined
                        className={styles.spread_btn}
                        onClick={() => this.setState({ spread: !this.state.spread })}
                    />
                }
            </p>
        ]
    }

    renderTools() {
        const { isLike, onLike, hideLike } = this.props;
        return <div className={styles.tools}>
            {!hideLike ? <Button onClick={onLike}>
                <SelectOutlined/>{isLike ? '已' : ''}收藏
            </Button> : null}
        </div>
    }

    render() {
        const { image, title } = this.props;
        return <div className={styles.play}>
            <div className={styles.play_top}>
                <img src={image} alt={title}/>
                <div className={styles.play_info}>
                    <h1>{title}</h1>
                    {[this.renderInfo(), this.renderTools()]}
                </div>
            </div>
            <div className={styles.play_content}>
                {this.props.children}
            </div>
        </div>
    }
}
