import * as React from 'react';
import * as styles from './HeadBtn.module.less';
import { NavLink } from "react-router-dom";

export class HeadBtn extends React.Component<{ to: string }> {
    render() {
        return <NavLink className={ styles.head_btn } to={ this.props.to } activeClassName={ styles.active }>
            { this.props.children }
        </NavLink>
    }
}
