const ping = require('ping');

module.exports = (host) => ping.promise.probe(host).then(res => res.alive);
