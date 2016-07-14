/**
 * Created by zhaofeng on 7/12/16.
 */
const db = require('./db');

exports.insertSong = function (tableName, song, isClear) {
    let stmt = db.prepare(`INSERT into ${tableName} VALUES (?, ?, ?, ?, ?, ?)`);

    stmt.run(song.id, song.name, song.type, song.singer, song.singerId, song.singerImg);
};

exports.insertSongs = function (tableName, songs) {
    return new Promise((resolve, reject) => {
        db.run(`delete from ${tableName}`, () => {
            let stmt = db.prepare(`INSERT into ${tableName} VALUES (?, ?, ?, ?, ?, ?)`);

            songs.forEach(song => {
                stmt.run(song.id, song.name, song.type, song.singer, song.singerId, song.singerImg);
            });
            stmt.finalize(resolve);
        });
    });
};

exports.readSongs = function (tableName) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT id, name, type, singer, singer_id as singId, singer_img as singerImg FROM ${tableName}`, function (err, rows) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve({songs: rows});
        });
    });
};