/**
 * Created by zhaofeng on 2016/7/24.
 */
win.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    item.setSavePath('/tmp/save.pdf')

    item.on('updated', (event, state) => {
        if (state === 'interrupted') {
            console.log('Download is interrupted but can be resumed')
        } else if (state === 'progressing') {
            if (item.isPaused()) {
                console.log('Download is paused')
            } else {
                console.log(`Received bytes: ${item.getReceivedBytes()}`)
            }
        }
    })
    item.once('done', (event, state) => {
        if (state === 'completed') {
            console.log('Download successfully')
        } else {
            console.log(`Download failed: ${state}`)
        }
    })
})