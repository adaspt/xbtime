const Datastore = require('nedb');

const db = new Datastore({ filename: './db/logs', autoload: true });
db.ensureIndex({ fieldName: 'date', unique: true }, (err) => {
    if (err) {
        console.error('ERROR', 'failed to create index', err);
        process.exit(1);
    }
});

const findByDate = (date) => new Promise((resolve, reject) => {
    db.findOne({ date }, (err, doc) => {
        if (err) {
            reject(err);
        } else {
            resolve(doc);
        }
    });
});

const insert = (document) => new Promise((resolve, reject) => {
    db.insert(document, (err, doc) => {
        if (err) {
            reject(err);
        } else {
            resolve(doc);
        }
    });
});

const update = (query, updateQuery) => new Promise((resolve, reject) => {
    db.update(query, updateQuery, {}, (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

module.exports = {
    findByDate,
    insert,
    update
};
