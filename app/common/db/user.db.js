/**
 * Created by zhaofeng on 7/12/16.
 */
const db = require('./db');

exports.insertSong = function (tableName, song, isClear) {
    let stmt = db.prepare(`INSERT into ${tableName} VALUES (?, ?, ?, ?, ?, ?)`);

    stmt.run(song.id, song.name, song.type, song.singer, song.singerId, song.singerImg);
};

exports.insertUser = function (userInfo) {
    return new Promise((resolve, reject) => {
        db.run(`delete from userinfo`, () => {
            let stmt = db.prepare(`INSERT into userinfo VALUES (?, ?, ?, ?)`);

            stmt.run(userInfo.id, userInfo.name, userInfo.img, userInfo.sign);
            stmt.finalize(resolve);
        });
    });
};

exports.readUser = function () {
    return new Promise((resolve, reject) => {
        db.all(`SELECT id, name, img, sign FROM userinfo`, function (err, rows) {
            if (err || rows.length == 0) {
                console.log('error: ', err);
                return reject(err);
            }
            resolve({user: rows[0]});
        });
    });
};

exports.deleteUser = function () {
    return new Promise((resolve, reject) => {
        db.run(`delete from userinfo`, resolve);
    });
};