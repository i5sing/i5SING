import * as React from 'react';

import * as styles from './Layout.module.less';

export interface ILayoutProps {
    id?: string;
    header?: string | React.ReactNode;
    className?: string;
    background?: string;
}

export class Layout extends React.Component<ILayoutProps> {
    render() {
        const { className, background, id, header } = this.props;
        return <div className={ `${ styles.layout } ${ className }` }>
            <div className={ styles.layout_background }
                 style={ { background: `url(${ background }) center no-repeat` } }/>
            <div className={ styles.layout_layer }/>
            <div className={ styles.layout_header }>
                { header }
            </div>
            <div className={ styles.layout_content } id={ id }>
                { this.props.children }
            </div>
        </div>
    }
}
