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
  let current = beginOfMonth;
  current <= endOfMonth;
  current = current.plus({ days: 1 })
) {
  process.stdout.write(String(current.day).padStart(2, " "));
  process.stdout.write(
    current.weekday === 6 || current.day === endOfMonth.day ? "\n" : " ",
  );
}

if (endOfMonth.weekday !== 7) {
  console.log();
}
