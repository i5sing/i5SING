import { Dispatch } from "redux";
import { ipcRenderer } from 'electron';
import { GO_BACK_EVENT, GO_FORWARD_EVENT } from "../constants/events.constant";

export class HistoryAction {
    public static back() {
        return (dispatch: Dispatch) => {
            ipcRenderer.send(GO_BACK_EVENT);
        }
    }

    public static go() {
        return (dispatch: Dispatch) => {
            ipcRenderer.send(GO_FORWARD_EVENT);
        }
    }
}
