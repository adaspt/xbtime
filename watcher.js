#!/usr/bin/env node

const ping = require('./services/ping');
const daysRepository = require('./repositories/days');
const toISODate = require('./utils/date').toISODate;

const processDay = (now, isActive, day) => {
    if (!isActive && (!day || !day.active)) {
        return;
    }

    if (!day) {
        return daysRepository.insert({
            date: toISODate(now),
            active: true,
            periods: [{ start: now, end: now }]
        });
    }

    const wasActive = day.active;
    day.active = isActive;
    if (isActive && !wasActive) {
        day.periods.push({ start: now, end: now });
    } else {
        day.periods[day.periods.length - 1].end = now;
    }

    return daysRepository.update({ _id: day._id }, day);
};

const now = new Date();
const requests = [
    ping('192.168.1.3'),
    daysRepository.findByDate(toISODate(now))
];

Promise.all(requests)
    .then(([isActive, day]) => processDay(now, isActive, day))
    .catch(err => {
        console.error('ERROR', err);
        process.exit(1);
    });
