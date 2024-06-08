#!/usr/bin/env node

import * as luxon from "luxon";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const currentDateTime = luxon.DateTime.now();

const year = args.y ?? currentDateTime.year;
const month = args.m ?? currentDateTime.month;

const firstDateTimeOfMonth = luxon.DateTime.local(year, month, 1);
const lastDateTimeOfMonth = firstDateTimeOfMonth.endOf("month");

console.log(
  `      ${firstDateTimeOfMonth.month}月 ${firstDateTimeOfMonth.year}`,
);
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(firstDateTimeOfMonth.weekday % 7));

for (
  let dateTime = firstDateTimeOfMonth;
  dateTime <= lastDateTimeOfMonth;
  dateTime = dateTime.plus({ days: 1 })
) {
  process.stdout.write(String(dateTime.day).padStart(2, " "));
  process.stdout.write(
    dateTime.weekday === 6 || dateTime.day === dateTime.daysInMonth
      ? "\n"
      : " ",
  );
}

if (lastDateTimeOfMonth.weekday !== 7) {
  console.log;
}
