import enquirer from "enquirer";
const { Select } = enquirer;
import Database from "./database.js";

export default class App {
  constructor() {
    this.db = new Database("./memo.sqlite3");
    this.options = process.argv.slice(2);
  }

  async run() {
    await this.db.createTable();

    if (this.options.length === 0) {
      console.log("メモを入力してください");
      this.#handleInsert();
    } else if (this.options.length === 1 && this.options[0] === "-l") {
      this.#showList();
    } else if (this.options.length === 1 && this.options[0] === "-r") {
      this.#showMemo();
    } else if (this.options.length === 1 && this.options[0] === "-d") {
      this.#handleDelete();
    }
  }

  async #handleInsert() {
    let content = "";
    process.stdin.on("data", (data) => {
      content += data;
    });
    await new Promise((resolve) => process.stdin.on("end", resolve));
    if (content === "") return;
    this.db.insert(content.trim());
  }

  async #showList() {
    const memos = await this.db.getAll();
    memos.forEach((memo) => {
      const firstLineLength = this.#getFirstLineLength(memo.content);
      console.log(memo.content.substring(0, firstLineLength));
    });
  }

  async #showMemo() {
    const targetId =
      await this.#getTargetMemoId("表示したいメモを選んでください");
    const memo = await this.db.fetch(targetId);
    console.log(memo.content);
  }

  async #handleDelete() {
    const targetId =
      await this.#getTargetMemoId("削除したいメモを選んでください");
    this.db.delete(targetId);
  }

  async #getTargetMemoId(message) {
    const memos = await this.db.getAll();
    const choices = memos.map((memo) => {
      const firstLineLength = this.#getFirstLineLength(memo.content);
      return {
        name: memo.content.substring(0, firstLineLength),
        value: memo.id,
      };
    });
    const prompt = new Select({
      message: message,
      choices: choices,
      result(name) {
        return this.choices.find((choices) => choices.name === name).value;
      },
    });
    return await prompt.run();
  }

  #getFirstLineLength(memo) {
    return memo.indexOf("\n") === -1 ? memo.length : memo.indexOf("\n");
  }
}
