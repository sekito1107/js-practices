#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

// エラー無し
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (?)", "sample", function () {
      console.log(`id: ${this.lastID}`);
      db.get("SELECT * FROM books", (_, row) => {
        console.log(row);
        db.run("DROP TABLE books");
      });
    });
  },
);

// 前回の処理が終わるまで待機
await timers.setTimeout(100);

// エラー有り
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (price) VALUES (?)", 2980, (err) => {
      console.error(err.message);
      db.get("SELECT price FROM books", (err) => {
        console.error(err.message);
        db.run("DROP TABLE books");
      });
    });
  },
);
