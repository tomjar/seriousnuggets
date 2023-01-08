var db = require('../db/connection.js');
var postClass = require('../models/postClass.js');

var Post = {
    deletePostPermanently: async function (id) {
        const qres = await db.query('DELETE FROM nn."Post" WHERE id = $1;',[id]);
        return qres.rowCount;
    },
    updatePostPublished: async function (ispublished, id) {
        const qres = await db.query('UPDATE nn."Post" SET ispublished=$1, modifytimestamp=now() WHERE id = $2;',[ispublished, id]);
        return qres.rowCount;
    },
    updatePostModifiedTimestamp: async function (id) {
        const qres = await db.query('UPDATE nn."Post" SET modifytimestamp=now() WHERE id = $1;',[id]);
        return qres.rowCount;
    },
    updatePost: async function (category, header, ispublished, description, body, id) {
       const qres = await db.query('UPDATE nn."Post" SET category=$1, header=$2, modifytimestamp=now(), ispublished=$3, description=$4, body=$5 WHERE id = $6;',
            [category, header, ispublished, description, body, id]);

        return qres.rowCount;
    },
    insertPost: async function (header, description, name, category, body) {
        const qres = await db.query('INSERT INTO nn."Post"(id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body) '
            + 'VALUES (uuid_generate_v1(), $1, now(), NULL, false, $2, $3, $4, $5);',
            [header, description, name, category, body]);

        return qres.rowCount;
    },
    getPostById: async function (id) {
        const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" WHERE id=$1;',[id])
        return new postClass(qres.rows[0]);
    },
    getPostByName: async function (name) {
        const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" WHERE lower(name)=$1;',[name]);
        return new postClass(qres.rows[0]);
    },
    getAll: async function () {
        const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" ORDER BY createtimestamp DESC;');
        let data = typeof qres === 'undefined' ? [] : qres.rows, today = new Date(), all = data.map(item => {
            return new postClass(item);
        });
        return all;
    },
    getAllPublished: async function () {
        const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;');
        let data = typeof qres === 'undefined' ? [] : qres.rows,
            today = new Date(),
            all = data.map(item => {
                return new postClass(item)
            });
        return all;
    },
    getAllPublishedLastThirtyDays: async function () {

        const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;');
        let data = typeof qres === 'undefined' ? [] : qres.rows, today = new Date(), priorDate = new Date().setDate(today.getDate() - 30), lastThirtyDays = data.filter(item => {
            return item.createtimestamp.getTime() >= priorDate;
        }).map(item_1 => {
            return new postClass(item_1);
        });
        return lastThirtyDays;
    },

    getAllArchived: async function () {
        const qres = await db.query('SELECT id, header, ispublished, description, createtimestamp, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;');

        let data = typeof qres === 'undefined' ? [] : qres.rows,
            uniqueYears = data.map(item => {
                return item.createtimestamp.getFullYear();
            }).filter((item, index, arr) => {
                return arr.indexOf(item) === index;
            }),
            yearAndPosts = uniqueYears.map(uy => {
                return {
                    'year': uy, 
                    'posts': data.map(d => {
                        return new postClass(d)
                    }).filter(p => {
                        return p.createtimestamp.getFullYear() === uy;
                    })
                }
            });

        return yearAndPosts;
    }
}

module.exports = Post;