import { Dispatch } from 'redux';
import { instance } from "../helpers";

export class AuthAction {
    public static logout() {
        return async (dispatch: Dispatch) => {
            await instance.post(
                'http://127.0.0.1:56562/auth/logout',
                { params: { advert_id: 26 } }
            );

        }
    }
}
