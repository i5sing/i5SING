import * as React from 'react';
import './tag.less';

export interface ITagProps {
    title: string;
    selected?: boolean;
    onClick?: () => void;
}

export class Tag extends React.Component<ITagProps> {
    render() {
        return <div className={ `tag ${ this.props.selected ? 'selected' : '' }` } onClick={ this.props.onClick }>
            { this.props.title }
        </div>
    }
}
