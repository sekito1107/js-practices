import enquirer from "enquirer";
const { Select } = enquirer;
import Database from "./database.js";

export default class App {
  constructor() {
    this.storage = new Database("./memo.sqlite3");
    this.options = process.argv.slice(2);
  }

  async run() {
    await this.storage.createTable();

    if (this.options.length === 0) {
      console.log("メモを入力してください");
      this.#handleInsert();
    } else if (this.options.length === 1 && this.options[0] === "-l") {
      this.#showList();
    } else if (this.options.length === 1 && this.options[0] === "-r") {
      this.#showMemo();
    } else if (this.options.length === 1 && this.options[0] === "-d") {
      this.#handleDelete();
    } else {
      console.log("引数が不正です");
    }
  }

  async #handleInsert() {
    let content = "";
    process.stdin.on("data", (data) => {
      content += data;
    });
    await new Promise((resolve) => process.stdin.on("end", resolve));
    if (content === "") return;
    this.storage.insert(content.trim());
  }

  async #showList() {
    const memos = await this.storage.getAll();
    memos.forEach((memo) => {
      const firstLineLength = this.#getFirstLineLength(memo.content);
      console.log(memo.content.substring(0, firstLineLength));
    });
  }

  async #showMemo() {
    const targetId =
      await this.#getTargetMemoId("表示したいメモを選んでください");
    const memo = await this.storage.fetch(targetId);
    console.log(memo.content);
  }

  async #handleDelete() {
    const targetId =
      await this.#getTargetMemoId("削除したいメモを選んでください");
    this.storage.delete(targetId);
  }

  async #getTargetMemoId(message) {
    const memos = await this.storage.getAll();
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
