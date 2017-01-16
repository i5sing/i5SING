'use strict';
const utils = require('../utils');

const releaseForOs = {
    osx: require('./release_osx'),
    linux: require('./release_linux'),
    windows: require('./release_windows'),
};

return releaseForOs[utils.os()]();
