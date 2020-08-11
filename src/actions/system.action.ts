import { Dispatch } from "redux";
import { ipcRenderer } from 'electron';
import { INIT_SYSTEM_EVENT } from "../constants/events.constant";
import { ISystem } from "../interfaces";
import { SYSTEM } from "../constants/action-types.constant";
import { SET } from "../constants/actions.constant";

export class SystemAction {
    public static refreshSystem() {
        return (dispatch: Dispatch) => {
            const system: ISystem = ipcRenderer.sendSync(INIT_SYSTEM_EVENT);
            dispatch({ type: SYSTEM, action: SET, data: system });
        }
    }
}
