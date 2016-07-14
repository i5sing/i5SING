/**
 * Created by zhaofeng on 7/12/16.
 */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite3', createTable);

function createTable() {
    let createHostorySql = `CREATE TABLE IF NOT EXISTS history (
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
    db.run(createPlaylistSql);
    db.run(createHostorySql);
}

module.exports = db;