import { I5singResponse, I5singCarousel } from "../interfaces/i5sing";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { DISCOVERY_CAROUSEL } from "../constants/action-types.constant";
import { SET } from "../constants/actions.constant";
import { instance } from "../helpers";

export class CarouselAction {
    public static getCarousels() {
        return async (dispatch: Dispatch) => {
            const response: AxiosResponse<I5singResponse<I5singCarousel[]>> = await instance.get(
                'http://mobileapi.5sing.kugou.com/other/getAdvert',
                { params: { advert_id: 26 } }
            );
            const carousels = response.data.data.map(item => ({
                id: item.id,
                thumb: item.thumb,
                title: item.title,
                url: item.url,
                urlType: item.url_type,
            }));
            dispatch({ type: DISCOVERY_CAROUSEL, action: SET, data: carousels });
        }
    }
}
