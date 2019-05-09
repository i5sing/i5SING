import { Dispatch } from "redux";
import { ipcRenderer } from 'electron';
import { INIT_SYSTEM_EVENT } from "../constants/Events";
import { ISystem } from "../interfaces/ISystem";
import { SYSTEM } from "../constants/ActionTypes";
import { SET } from "../constants/Actions";

export class SystemAction {
    public static refreshSystem() {
        return (dispatch: Dispatch) => {
            const system: ISystem = ipcRenderer.sendSync(INIT_SYSTEM_EVENT);
            dispatch({ type: SYSTEM, action: SET, data: system });
        }
    }
}
