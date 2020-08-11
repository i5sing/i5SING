import * as React from 'react';
import './footer.less';
import { I5singPlayer } from "./player.container";

export class Footer extends React.Component {
    render() {
        return <footer className="footer">
            <I5singPlayer preloadType="auto"/>
        </footer>
    }
}
