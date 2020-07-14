import * as os from 'os';
import { app, autoUpdater, dialog, shell } from 'electron';
import * as request from 'request';
import { i5SING_WEB_URL } from "./constants";

export function checkForUpdatesByReq(): any {
    let platform = `${os.platform()}_${os.arch()}`;
    let version = app.getVersion();
    let url = `${i5SING_WEB_URL}/check-version/${platform}/${version}`;

    return new Promise((resolve, reject) => {
        request({
                method: 'get',
                uri: url,
                json: true
            },
            function (err, response, body) {
                if (err) {
                    return reject(err);
                }

                return resolve(body);
            });
    });
}

export async function checkVersion(notShowLatest?: boolean) {
    const data = await checkForUpdatesByReq();

    let title = '',
        message = '',
        buttons = ['确定', '取消'];

    if (!data.latest) {
        title = '检查更新';
        message = `发现新版本 ${data.app.version}, 点击 "确定" 前往下载!`;
    } else {
        title = '检查更新';
        message = '您的版本已经是最新版了!';
        buttons = ['确定'];
    }

    if (data.latest && notShowLatest) {
        return false;
    }
    dialog.showMessageBox({
        type: 'none',
        title: title,
        message: message,
        buttons: buttons
    }).then(() => {
        if (!data.latest) {
            return shell.openExternal(i5SING_WEB_URL);
        }
    });
}

export function checkForUpdates() {
    let platform = `${os.platform()}_${os.arch()}`;
    let version = app.getVersion();
    autoUpdater.setFeedURL({ url: `${i5SING_WEB_URL}/check-version/${platform}/${version}` });
    return autoUpdater.checkForUpdates();
}

checkVersion(true);
