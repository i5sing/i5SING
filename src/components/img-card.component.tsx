import * as React from 'react';

import './img-card.less';

export interface IImgCardItemProps {
    title: string;
    extra?: string | React.ReactNode;
    description?: string | React.ReactNode;
    img: string;
    height?: number;
    onClick?: () => void;
}

export interface IImgCardProps {
    count?: number;
}

class ImgCardItem extends React.Component<IImgCardItemProps> {
    render() {
        const { title, extra, description, img, onClick = () => void 0, height } = this.props;
        return <div className="img-card-item">
            <span className="img-card-extra">{ extra }</span>
            <img src={ img } alt={ title } onClick={ () => onClick() } style={ { height } }/>
            <h3 onClick={ () => onClick() }>{ title }</h3>
            <p>{ description }</p>
        </div>
    }
}

export class ImgCard extends React.Component<IImgCardProps> {
    public static Item = ImgCardItem;

    render() {
        const { count = 5 } = this.props;
        return <div className={ `img-card count-${ count }` }>
            { this.props.children }
        </div>
    }
}

