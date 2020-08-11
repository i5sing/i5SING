import * as React from 'react';
import * as styles from './channel.m.less';
import { Link } from "react-router-dom";
import { Icon } from "antd";

export interface IChannelItemProps {
    key?: string;
    picture: string;
    name: string;
    username: string;
    to: string;
    onClick?: () => void;
    active?: boolean;
}

class ChannelItem extends React.Component<IChannelItemProps> {
    render() {
        const { key, picture, name, username, to, onClick, active } = this.props;
        return <div key={key} className={styles.item}>
            <div className={styles.content} style={{ backgroundColor: active ? '#f4f4f4' : null }}>
                <div className={styles.img_wrap} onClick={onClick}>
                    <img src={picture} alt={name}/>
                    <div className={styles.play_btn_wrap}>
                        <Icon type={active ? 'pause-circle' : 'play-circle'} className={styles.play_btn}/>
                    </div>
                </div>
                <div className={styles.info}>
                    <h3 className="balabala">{name}</h3>
                    <p className="balabala"><Link to={to}>{username}</Link></p>
                </div>
            </div>
        </div>;
    }
}

export class Channel extends React.Component {
    public static Item = ChannelItem;

    render() {
        return <div className={styles.channels}>
            {this.props.children}
        </div>;
    }
}
