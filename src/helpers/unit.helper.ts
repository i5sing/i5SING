export function prettyByte(oldData, oldUnit) {
    oldData = parseFloat(oldData);
    let transitionObj = {
        value: oldData,
        units: oldUnit
    };
    if (oldData === 0) {
        return transitionObj
    }
    let k = 1024,
        sizes = [],
        i = Math.floor(Math.log(oldData) / Math.log(k));
    switch (oldUnit) {
        case 'B':
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
            break;
        case 'GB':
            sizes = ['GB', 'TB', 'PB', 'EB'];
            break;
        case 'MB':
            sizes = ['MB', 'GB', 'TB', 'PB', 'EB'];
            break;
        case 'bps':
            sizes = ['bps', 'kbps', 'mbps'];
            break;
        default:
            return transitionObj.value + transitionObj.units;
    }
    transitionObj.value = parseFloat((oldData / Math.pow(k, i)).toPrecision(3));
    transitionObj.units = sizes[i];
    return transitionObj.value + transitionObj.units;
}
