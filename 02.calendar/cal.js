#!/usr/bin/env node

import * as luxon from "luxon";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const currentDate = luxon.DateTime.now();

const year = args.y ?? currentDate.year;
const month = args.m ?? currentDate.month;

const firstDate = luxon.DateTime.local(year, month, 1);
const lastDate = firstDate.endOf("month");

let calendar = `\
      ${firstDate.month}月 ${firstDate.year}
日 月 火 水 木 金 土
`;

calendar += "   ".repeat(firstDate.weekday % 7);

for (let dayOfMonth = 1; dayOfMonth <= lastDate.day; dayOfMonth++) {
  calendar += dayOfMonth.toString().padStart(2, " ");
  if (dayOfMonth === lastDate.day) {
    break;
  }
  if ((dayOfMonth + firstDate.weekday) % 7 === 0) {
    calendar += "\n";
  } else {
    calendar += " ";
  }
}

calendar += lastDate.weekday === 7 ? "\n" : "\n\n";

process.stdout.write(calendar);
