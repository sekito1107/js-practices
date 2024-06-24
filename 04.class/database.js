import sqlite3 from "sqlite3";

export default class Database {
  constructor(fileName) {
    this.db = new sqlite3.Database(`${fileName}`);
  }

  async createTable() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
    );
  }

  insert(content) {
    this.db.run("INSERT INTO memos (content) VALUES (?)", content);
  }

  async getAll() {
    return new Promise((resolve) => {
      this.db.all("SELECT * FROM memos ORDER BY id", (err, rows) => {
        if (err) {
          throw err; // エラーは想定していないので、エラーが起きれば例外で終了
        } else {
          resolve(rows);
        }
      });
    });
  }

  async fetch(id) {
    return new Promise((resolve) => {
      this.db.get("SELECT * FROM memos WHERE id = ?", id, (err, row) => {
        if (err) {
          throw err; // エラーは想定していないので、エラーが起きれば例外で終了
        } else {
          resolve(row);
        }
      });
    });
  }

  delete(id) {
    this.db.run("DELETE FROM memos WHERE id = ?", id);
  }
}
