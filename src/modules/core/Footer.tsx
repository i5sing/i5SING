import * as React from 'react';
import './Footer.less';
import { I5singPlayer } from "./Player";

export class Footer extends React.Component {
    render() {
        return <footer className="footer">
            <I5singPlayer preloadType="auto"/>
        </footer>
    }
}
