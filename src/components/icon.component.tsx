import * as React from 'react';
import './icon.less';

export interface IIconProps {
    type: string;
    size?: number;
}

export class Icon extends React.Component<IIconProps> {
    render() {
        const { type, size } = this.props;
        return <i className={ `icon icon-${ type }` } style={ { height: size, width: size, backgroundSize: size } }/>;
    }
}
