/**
 * Created by zhaofeng on 7/12/16.
 */
const db = require('./db');

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

exports.insertSong = function (song) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT id, name, type, singer, singer_id as singId, singer_img as singerImg 
            FROM playlist where id='${song.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            if (rows[0]) {
                return resolve(song);
            }

            let stmt = db.prepare(`INSERT into playlist VALUES (?, ?, ?, ?, ?, ?)`);

            stmt.run(song.id, song.name, song.type, song.singer, song.singerId, song.singerImg);
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