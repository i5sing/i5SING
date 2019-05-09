import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { I5singCarousel } from "../interfaces/i5sing/I5singCarousel";
import { instance } from "../utils/HttpUtil";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { DISCOVERY_CAROUSEL } from "../constants/ActionTypes";
import { SET } from "../constants/Actions";

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
