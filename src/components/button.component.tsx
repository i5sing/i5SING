import * as React from 'react';
import * as styles from './button.m.less';

export interface IButtonProps {
    type?: string;
    disabled?: boolean;
    suffix?: React.ReactNode;
    onClick?: () => void;
}

export class Button extends React.Component<IButtonProps> {
    render() {
        const { type, suffix, disabled } = this.props;
        return <a
            className={
                `${styles.button} ${type === 'primary' ? styles.primary : ''} ${disabled ? styles.disabled : styles.hover}`
            }
            onClick={!disabled ? this.props.onClick : void 0}>
            {this.props.children}
            <span>{suffix}</span>
        </a>
    }
}
