import { TouchBar, nativeImage, BrowserWindow } from 'electron';
import { resolve } from "path";
import { SEARCH_EVENT } from "../constants/events.constant";

export const initTouchBar = (window: BrowserWindow): TouchBar => {
    const favoriteIcon = nativeImage.createFromPath(resolve(__dirname, '../../src/assets/touch-bar/TouchBarFavorite.png'));
    const searchIcon = nativeImage.createFromPath(resolve(__dirname, '../../src/assets/touch-bar/TouchBarSearch.png'));
    const touchBar = new TouchBar({
        items: [
            new TouchBar.TouchBarButton({ icon: favoriteIcon }),
            new TouchBar.TouchBarButton({ icon: searchIcon, click: () => window.webContents.send(SEARCH_EVENT) }),
            new TouchBar.TouchBarSpacer({ size: 'large',  }),
        ]
    });

    window.setTouchBar(touchBar);

    return touchBar;
};
