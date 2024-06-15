#!/usr/bin/env node

import sqlite3 from "sqlite3";
import * as sqliteFunctions from "./sqlite_functions.js";

const db = new sqlite3.Database(":memory:");

// エラー無し
await sqliteFunctions.run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

const result = await sqliteFunctions.run(
  db,
  "INSERT INTO books (title) VALUES (?)",
  "sample",
);
console.log(`id: ${result.lastID}`);

const row = await sqliteFunctions.get(db, "SELECT * FROM books");
console.log(row);

await sqliteFunctions.run(db, "DROP TABLE books");

// エラー有り
await sqliteFunctions.run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

try {
  await sqliteFunctions.run(db, "INSERT INTO books (price) VALUES (?)", 2980);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}

try {
  await sqliteFunctions.get(db, "SELECT price FROM books");
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}

sqliteFunctions.run(db, "DROP TABLE books");
