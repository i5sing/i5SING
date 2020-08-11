import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './navigation.less';

export interface INavigateItemProps {
    to: string;
}

export interface INavigateProps {
    title?: string | React.ReactNode;
}

class NavigateItem extends React.Component<Readonly<INavigateItemProps>> {
    render() {
        const { to } = this.props;
        return <li className="navigate-item">
            <NavLink to={to as any} activeClassName="active">{this.props.children}</NavLink>
        </li>;
    }
}

export class Navigation extends React.Component<INavigateProps> {
    public static Item = NavigateItem;

    render() {
        const { title } = this.props;
        return <div className="navigate">
            <h3>{title}</h3>
            <ul>{this.props.children}</ul>
        </div>;
    }
}
