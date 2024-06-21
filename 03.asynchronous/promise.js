#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import sqliteFunctions from "./sqlite_functions.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
sqliteFunctions
  .run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
  .then(() =>
    sqliteFunctions.run(db, "INSERT INTO books (title) VALUES (?)", "sample"),
  )
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return sqliteFunctions.get(db, "SELECT * FROM books");
  })
  .then((row) => {
    console.log(row);
    return sqliteFunctions.run(db, "DROP TABLE books");
  });

// 前回の処理が終わるまで待機
await timers.setTimeout(100);

// エラーあり
sqliteFunctions
  .run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
  .then(() =>
    sqliteFunctions.run(db, "INSERT INTO books (price) VALUES (?)", 2980),
  )
  .catch((err) => {
    console.error(err.message);
    return sqliteFunctions.get(db, "SELECT price FROM books");
  })
  .catch((err) => {
    console.error(err.message);
    return sqliteFunctions.run(db, "DROP TABLE books");
  });
