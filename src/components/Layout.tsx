import * as React from 'react';

import * as styles from './Layout.module.less';

export interface ILayoutProps {
    id?: string;
    header?: string | React.ReactNode;
    className?: string;
    background?: string;
    transparent?: boolean;
    noSide?: boolean;
    noFooter?: boolean;
}

export class Layout extends React.Component<ILayoutProps> {
    render() {
        const { className, background, id, header, transparent, noFooter, noSide } = this.props;
        return <div className={`
            ${styles.layout} 
            ${noSide ? styles.no_side : ''} 
            ${noFooter ? styles.no_footer : ''} 
            ${className}`}>
            <div className={styles.layout_background}
                 style={{ background: `url(${background}) center no-repeat` }}/>
            <div className={styles.layout_layer}/>
            <div className={styles.layout_header}>
                {header}
            </div>
            <div className={`${styles.layout_content} ${transparent ? styles.transparent : ''}`} id={id}>
                {this.props.children}
            </div>
        </div>
    }
}
