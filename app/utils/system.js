/**
 * Created by feng on 24/12/2016.
 */

exports.DARWIN = 'darwin';
exports.WIN32 = 'win32';

exports.isWindows = () => process.platform === 'win32';

exports.isMacOS = () => process.platform === 'darwin';

exports.getSystem = () => process.platform;