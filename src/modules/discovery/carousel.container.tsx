import * as React from 'react';
import { Carousel } from "antd";
import { connect } from 'react-redux';

import "antd/lib/carousel/style/index.less";
import './carousel.less';
import { bindActionCreators, Dispatch } from "redux";
import { CarouselAction, CurrentAction } from "../../actions";
import { IState } from "../../reducers";
import { ICarousel } from "../../interfaces";
import { actions } from "../../helpers";

export interface ICarouselProps {
    actions?: {
        carousel: typeof CarouselAction;
        current: typeof CurrentAction;
    }
    carousels?: ICarousel[];
}

interface ICarouselState {
}

@connect(
    (state: IState) => ({
        carousels: state.discoveryCarousels
    }),
    (dispatch: Dispatch) => ({
        actions: {
            carousel: bindActionCreators(actions(CarouselAction), dispatch),
            current: bindActionCreators(actions(CurrentAction), dispatch),
        }
    })
)
export class Carousels extends React.Component<ICarouselProps, ICarouselState> {
    componentDidMount(): void {
        this.props.actions.carousel.getCarousels()
    }

    click(carousel: ICarousel) {
        if (carousel.urlType === '1') {
            const chunks = carousel.url.split('|');
            this.props.actions.current.play(chunks[1], chunks[0]);
        } else if (carousel.urlType === '2') {
            location.hash = `#/plays/${carousel.url}`;
        } else if (carousel.urlType === '4') {
            location.hash = '#/discoveries/webview?url=' + carousel.url;
        }
    }

    render() {
        const carousels = this.props.carousels;
        return <Carousel autoplay={true} autoplaySpeed={5000}>
            {carousels.map((carousel: ICarousel) =>
                <img className="carousel-img"
                     key={carousel.title}
                     src={carousel.thumb}
                     onClick={() => this.click(carousel)}
                />
            )}
        </Carousel>
    }
}
