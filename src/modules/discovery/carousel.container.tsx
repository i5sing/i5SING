import * as React from 'react';
import { Carousel } from "antd";
import useSWR from 'swr';

import "antd/lib/carousel/style/index.less";
import './carousel.less';
import { ICarousel } from "../../interfaces";
import { buildCarouselsUrl } from "../../constants/urls.constant";
import { IResponse } from "../../interfaces/response.interface";

export const Carousels = () => {
    const { data } = useSWR<IResponse<ICarousel[]>>(buildCarouselsUrl(26));
    const carousels = data?.data;
    const click = (carousel: ICarousel) => {
        if (carousel.url_type === '1') {
            const chunks = carousel.url.split('|');
            this.props.actions.current.play(chunks[1], chunks[0]);
        } else if (carousel.url_type === '2') {
            location.hash = `#/plays/${carousel.url}`;
        } else if (carousel.url_type === '4') {
            location.hash = '#/discoveries/webview?url=' + carousel.url;
        }
    }
    return <Carousel autoplay={true} autoplaySpeed={5000}>
        {carousels?.map((carousel: ICarousel) =>
            <img className="carousel-img"
                 key={carousel.title}
                 src={carousel.thumb}
                 onClick={() => click(carousel)}
            />
        )}
    </Carousel>
}
