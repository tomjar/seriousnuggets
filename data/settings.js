var db = require('../db/connection.js');
var settingsClass = require('../models/settingsClass.js');

var Settings = {
    defaultSettings: ['date', 'TODO, fill out your about section in the admin settings page.'],

    updateSettings: async function (archive_view, about_section) {
        const qres = await db.query('UPDATE nn."Settings" SET archive_view=$1, about_section=$2;', [archive_view, about_section]);
        return qres.rowCount;
    },
    getSettings: async function () {
        const qres = await db.query('SELECT id, archive_view, about_section FROM nn."Settings";');
        return new settingsClass(qres.rows[0]);
    },
    insertDefaultSettings: async function () {
        
        const qres = await db.query('INSERT INTO nn."Settings"(id, archive_view, about_section) '
            + 'VALUES (uuid_generate_v1(), $1, $2);', Settings.defaultSettings);

            return qres.rowCount;
    }
}

module.exports = Settings;