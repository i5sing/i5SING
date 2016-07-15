/**
 * Created by zhaofeng on 7/11/16.
 */
import React, {Component} from 'react';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // window.addEventListener('hashchange', function (evt, result) {
        //     console.log(evt, result);
        // });
    }

    /*
     <div className="btn-group pull-right">
     <i className="fa fa-cog btn btn-setting"/>
     <i className="fa fa-remove btn btn-close"/>
     </div>
     */

    render() {
        return (
            <div className="elsa-header clear-fix">
                <div className="btn-group pull-left">
                    <i className="fa fa-arrow-left btn btn-left" onClick={history.back}/>
                    <i className="fa fa-arrow-right btn btn-right" onClick={history.forward}/>
                </div>

            </div>
        );
    }
}