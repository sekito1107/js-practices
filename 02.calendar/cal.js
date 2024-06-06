#!/usr/bin/env node

import * as luxon from "luxon";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const currentDate = luxon.DateTime.now()

const year = args.y ?? currentDate.year
const month = args.m ?? currentDate.month;

const firstDay = luxon.DateTime.local(year, month, 1)
const lastDay = firstDay.endOf("month");

let calendar = `\
      ${firstDay.month}月 ${firstDay.year}
日 月 火 水 木 金 土
`;

if (firstDay.weekday !== 7) {
  calendar += "   ".repeat(firstDay.weekday);
}

for (let day = 1; day <= lastDay.day; day++) {
  calendar += day.toString().padStart(2, " ") + " ";
  if ((day + firstDay.weekday) % 7 === 0 && day !== lastDay.day) {
    calendar += "\n";
  }
}

calendar += lastDay.weekday === 7 ? "\n" : "\n\n";

process.stdout.write(calendar);
