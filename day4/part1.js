#!/usr/bin/env node

function parseLog(rawLogs) {
  // year-month-day hour:minute
  const regex = /\[\d+-\d+-\d+ \d+:(\d+)\] (Guard #(\d+) begins shift|falls asleep|wakes up)/
  return rawLogs.reduce((acc, log, i) => {
    const array = regex.exec(log)
    if (array) {
      const [, minute, action, id] = array
      acc.push({
        minute: parseInt(minute, 10),
        action,
        id: id ? parseInt(id, 10) : undefined,
      })
    }
    return acc
  }, [])
}

function guardSleepRanges(logs) {
  return logs.reduce((records, log) => {
    if (log.id) {
      records.push({ id: log.id, sleepRanges: [] })
      return records
    }

    if (records.length === 0) {
      throw new Error('A guard must begins his shift')
    }
    const last = records[records.length - 1]

    if (log.action === 'falls asleep') {
      last.sleepRanges.push({ start: log.minute, end: null })
      return records
    }

    if (log.action === 'wakes up') {
      if (last.sleepRanges.length === 0) {
        throw new Error('Guard should falls asleep before wakes up')
      }
      const [lastSleep] = last.sleepRanges.slice(-1)
      lastSleep.end = log.minute
      return records
    }
    throw new Error(`Unknown action ${log.action}`)
  }, [])
}

function sumSleepRanges(range) {
  return range.reduce((sum, { start, end }) => sum + end - start, 0)
}

function findSleepiestGuard(records) {
  const guards = records.reduce((guards, record) => {
    const sleepTime = { sleepRanges: [], sum: 0, ...guards.get(record.id) }
    guards.set(record.id, {
      sleepRanges: sleepTime.sleepRanges.concat(record.sleepRanges),
      sum: sleepTime.sum + sumSleepRanges(record.sleepRanges),
    })
    return guards
  }, new Map())

  return Array.from(guards.entries()).reduce(
    (sleepy, [id, guard]) => {
      if (guard.sum > sleepy.sum) {
        return { id, ...guard }
      }
      return sleepy
    },
    { sum: 0, sleepRanges: [] }
  )
}

function findMostSleepMinutes(ranges) {
  const minutes = ranges.reduce((minutes, range) => {
    for (let i = range.start; i < range.end; i++) {
      minutes[i]++
    }
    return minutes
  }, Array.apply(null, { length: 60 }).map(Number.call, _ => 0))

  return Object.entries(minutes).reduce(
    (max, [minute, count]) => (count > max.count ? { minute, count } : max),
    { count: 0 }
  ).minute
}

const data = require('../utils/readInput')(__dirname)
const schedule = parseLog(data.sort())
const records = guardSleepRanges(schedule)
const guard = findSleepiestGuard(records)
const minute = findMostSleepMinutes(guard.sleepRanges)
console.log(`The guard ${guard.id} sleeps the most at ${minute}.`)
console.log('Checksum', guard.id * minute)
