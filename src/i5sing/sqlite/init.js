/**
 * Created by zhaofeng on 7/12/16.
 */
const sqlite3 = require('electron-sqlite3').verbose();
const db = new sqlite3.Database(process.resourcesPath + '/db.sqlite3', createTable);

function createTable(err) {
    if (err) {
        throw new Error(err);
    }

    let createHistorySql = `CREATE TABLE IF NOT EXISTS history (
        id varchar(50) primary key, 
        name varchar(255),
        type varchar(10),
        singer varchar(100),
        singer_id varchar(50),
        singer_img text
    )`;

    let createPlaylistSql = `CREATE TABLE IF NOT EXISTS playlist (
        id varchar(50) primary key, 
        name varchar(255),
        type varchar(10),
        singer varchar(100),
        singer_id varchar(50),
        singer_img text
    )`;

    let createUserInfoSql = `CREATE TABLE IF NOT EXISTS userinfo (
        id varchar(50) primary key,
        name varchar(255),
        img text,
        sign text
    )`;

    db.run(createPlaylistSql);
    db.run(createHistorySql);
    db.run(createUserInfoSql);
}

module.exports = db;