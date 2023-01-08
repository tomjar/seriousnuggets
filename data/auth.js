var crypto = require('crypto');
var db = require('../db/connection.js');

var Auth = {

    /**
     * @description hash password with sha512.
     * thanks to https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
     * @param {string} password
     * @param {string} salt 
     */
    hashPassword: function (password, salt) {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('hex');
    },

    /**
     * @description validates the super secret password
     * @param {String} password the attempted password
     * @param {Object} db 
     * @param {Function} callback a function to be called after validation
     */
    validatePassword: async function (password) {
        const qres = await db.query('SELECT * FROM nn."Supersecretpassword";');

        let data = qres.rows[0],
            salt = data.salt,
            supersecretpassword = data.key,
            tempsupersecretpassword = this.hashPassword(password, salt),
            valid = supersecretpassword === tempsupersecretpassword;

        return valid;
    }
};

module.exports = Auth;