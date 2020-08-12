import * as React from 'react';
import { connect } from 'react-redux';
import './footer.less';
import { I5singPlayer } from "./player.container";
import { IState } from "../../reducers";

@connect(
    (state: IState) => ({
        visible: state.current.showFooter,
    }),
)
export class Footer extends React.Component<any> {
    render() {
        return this.props.visible ? <footer className="footer">
            <I5singPlayer preloadType="auto"/>
        </footer> : ''
    }
}
