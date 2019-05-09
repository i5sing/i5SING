import * as React from 'react';

export interface IEndLoaderProps {
    target: string;
    onLoad?: () => void;
}

export class EndLoader extends React.Component<IEndLoaderProps> {
    private timer;

    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        let targetName = this.props.target;
        let el = document.getElementById(targetName);
        el.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        let targetName = this.props.target;
        let el = document.getElementById(targetName);
        el.removeEventListener('scroll', this.onScroll);
    }

    onScroll() {
        let targetName = this.props.target;
        let el = document.getElementById(targetName);
        clearTimeout(this.timer);
        if (el.scrollHeight - 50 <= el.offsetHeight + el.scrollTop) {
            this.timer = setTimeout(() => {
                this.props.onLoad && this.props.onLoad();
            }, 300);
        }
    }

    render() {
        return (
            <div>{ this.props.children }</div>
        );
    }
}
