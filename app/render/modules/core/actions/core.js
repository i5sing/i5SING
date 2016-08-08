/**
 * App Action
 * Created by zhaofeng on 7/16/16.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../../common/sdk';
import db from '../../../../common/db/user.db';

const {
    GET_PERSONAL_INFO,
    LOGOUT
} = ACTIONS;

/**
 * 获取个人信息
 * @param userId
 * @param sign
 * @returns {function(*)}
 */
export function getPersonalInfo(userId, sign) {
    return (dispatch) => {
        SingSdk.getUserInfo({
            userId: userId
        }).then(result => {
            return new Promise((resolve, reject) => {
                let user = {
                    id: result.data.ID,
                    name: result.data.NN,
                    img: result.data.I,
                    sign: sign
                };
                db.insertUser(user).then(() => {
                    resolve(user);
                }, reject);
            });
        }).then(user => {
            dispatch({type: GET_PERSONAL_INFO, data: user});
        }, err => {

        })
    };
}

/**
 * 检查登录状态,登录Token是否有效
 * @returns {function(*)}
 */
export function checkLoginStatus() {
    return (dispatch) => {
        return db.readUser().then(result => {
            return new Promise((resolve, reject) => {
                return SingSdk.isLogin({
                    sign: result.user.sign
                }).then(function (res) {
                    if (!res.success) {
                        return reject(result);
                    }

                    resolve(result.user);
                });
            })
        }).then(user => {
            dispatch({type: GET_PERSONAL_INFO, data: user});
        }, err => {

        })
    };
}

/**
 * 退出登录
 * @returns {function(*)}
 */
export function logout() {
    return (dispatch) => {
        return db.deleteUser().then(() => {
            dispatch({type: LOGOUT});
        }, err => {

        })
    };
}