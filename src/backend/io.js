/**
 * Created by zhaofeng on 7/12/16.
 */
const fs = require('fs');

exports.readFile = function (path) {
    return fs.readFileSync(path);
};