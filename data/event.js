var db = require('../db/connection.js');
var eventClass = require('../models/eventClass.js');

var Event = {
    getAll: async function () {
        const qres = await db.query('SELECT id, ip_address, createtimestamp, category, description FROM nn."Event" ORDER BY createtimestamp DESC;');
        let data = qres.rows,
            all = data.map(item => {
                return new eventClass(item)
            });

        return all;
    },
    insertEvent: async function (ipaddress, category, description) {
        let params = [ipaddress, category, description];
        const qres = await db.query('INSERT INTO nn."Event"(id, ip_address, category, description, createtimestamp)'
            + 'VALUES (uuid_generate_v1(), $1, $2, $3, now());', params);

        return qres.rowCount;
    }
}

module.exports = Event;