#!/usr/bin/env node

import * as luxon from "luxon";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const now = luxon.DateTime.now();

const year = args.y ?? now.year;
const month = args.m ?? now.month;

const beginOfMonth = luxon.DateTime.local(year, month, 1);
const endOfMonth = beginOfMonth.endOf("month");

console.log(`      ${beginOfMonth.month}月 ${beginOfMonth.year}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(beginOfMonth.weekday % 7));

for (
  let dateTime = beginOfMonth;
  dateTime <= endOfMonth;
  dateTime = dateTime.plus({ days: 1 })
) {
  process.stdout.write(String(dateTime.day).padStart(2, " "));
  process.stdout.write(
    dateTime.weekday === 6 || dateTime.day === endOfMonth.day ? "\n" : " ",
  );
}

if (endOfMonth.weekday !== 7) {
  console.log;
}
