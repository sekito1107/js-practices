#!/usr/bin/env node

import * as luxon from "luxon";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const currentDate = luxon.DateTime.now();

const year = args.y ?? currentDate.year;
const month = args.m ?? currentDate.month;

const firstDateOfMonth = luxon.DateTime.local(year, month, 1);
const lastDateOfMonth = firstDateOfMonth.endOf("month");

let calendar = `\
      ${firstDateOfMonth.month}月 ${firstDateOfMonth.year}
日 月 火 水 木 金 土
${"   ".repeat(firstDateOfMonth.weekday % 7)}`;


for (let i = 1; i <= lastDateOfMonth.day; i++) {
  calendar += i.toString().padStart(2, " ");
  if (i === lastDateOfMonth.day) {
    calendar += "\n";
  } else {
    calendar += (i + firstDateOfMonth.weekday) % 7 === 0 ? "\n" : " ";
  }
}

calendar += lastDateOfMonth.weekday === 7 ? "\n" : "\n\n";

process.stdout.write(calendar);
