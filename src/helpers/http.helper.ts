import { AxiosInstance } from 'axios';
import Axios from 'axios';
import { ipcRenderer } from 'electron';
import { GET_SIGN_EVENT, LOGIN_SUCCESS_EVENT } from "../constants/events.constant";
import { version } from "../constants/version.constant";

let sign = ipcRenderer && ipcRenderer.sendSync(GET_SIGN_EVENT);

const handleLoginSuccess = (evt, system) => {
    sign = system.sign;
    instance = Axios.create({
        params: { version: version, sign: decodeURIComponent(sign) },
        headers: { sign: decodeURIComponent(sign) }
    });
};

ipcRenderer && ipcRenderer.removeListener(LOGIN_SUCCESS_EVENT, handleLoginSuccess);
ipcRenderer && ipcRenderer.on(LOGIN_SUCCESS_EVENT, handleLoginSuccess);

export let instance: AxiosInstance = Axios.create({
    params: { version: version, sign: decodeURIComponent(sign) },
    headers: { sign: decodeURIComponent(sign) }
});
