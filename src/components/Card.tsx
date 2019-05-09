import * as React from 'react';

import './Card.less';

export interface ICardProps {
    title: string | React.ReactNode;
    style?: React.CSSProperties;
}

export class Card extends React.Component<ICardProps> {
    render() {
        const { title, style } = this.props;
        return <div className="card" style={ style }>
            <h3>{ title }</h3>
            <div className="card-content">
                { this.props.children }
            </div>
        </div>
    }
}
