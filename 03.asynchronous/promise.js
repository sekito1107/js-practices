#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { run, get } from "./sqlite_functions.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES (?)", "sample"))
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return get(db, "SELECT * FROM books");
  })
  .then((row) => {
    console.log(row);
    return run(db, "DROP TABLE books");
  });

// 前回の処理が終わるまで待機
await timers.setTimeout(100);

// エラーあり
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (price) VALUES (?)", 2980))
  .catch((err) => {
    console.error(err.message);
    return get(db, "SELECT price FROM books");
  })
  .catch((err) => {
    console.error(err.message);
    return run(db, "DROP TABLE books");
  });
