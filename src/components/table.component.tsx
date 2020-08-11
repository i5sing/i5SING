import * as React from 'react';
import * as styles from './table.m.less';

export interface ITableProps {
    header?: string | React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface IColProps {
    type?: 'header' | 'column';
    style?: React.CSSProperties;
    width?: number | string;
}

class Row extends React.Component<any> {
    render() {
        const { props } = this;
        return <tr {...props}>{props.children}</tr>
    }
}

class Col extends React.Component<IColProps> {
    render() {
        const { style, width = 'auto', children } = this.props;
        const css = { ...style, width, maxWidth: width } as React.CSSProperties;
        return this.props.type === 'header' ?
            <th style={css}>
                <div style={css}>{children}</div>
            </th> :
            <td style={css}>
                <div style={css}>{children}</div>
            </td>
    }
}

export class Table extends React.Component<ITableProps> {
    public static Row = Row;
    public static Col = Col;

    render() {
        const { header, className, style } = this.props;
        return <table className={`${styles.table} ${className}`} style={style}>
            {header && <thead>{header}</thead>}
            {this.props.children && <tbody>{this.props.children}</tbody>}
        </table>
    }
}
