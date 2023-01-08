var express = require('express');
var router = express.Router();
var post = require('../data/post.js');
var event = require('../data/event.js');
var settings = require('../data/settings.js');
var tte = require('../enums/toastrtypeenum.js');
var pce = require('../enums/postcategoryenum.js');

// index admin dashboard
router.get('/', (req, res, next) => {
    if (req.session.isauthenticated) {

        let viewmodel = {
            'title': 'admin dashboard',
            'isauthenticated': req.session.isauthenticated
        };

        res.render('admin/index', viewmodel);
    } else {
        res.redirect('../login');
    }
});

// all posts
router.get('/posts', (req, res, next) => {
    if (req.session.isauthenticated) {
        Promise.all(([post.getAll()]))
            .then((result) => {
                var allPostsViewModel = {
                    title: 'all posts',
                    isauthenticated: req.session.isauthenticated,
                    posts: result[0],
                    toastr_messages: req.session.toastr_messages
                };
                req.session.toastr_messages = null;
                res.render('admin/posts', allPostsViewModel);
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// add
router.get('/add', (req, res, next) => {
    if (req.session.isauthenticated) {
        res.render('admin/add', {
            'title': 'add new post',
            'isauthenticated': req.session.isauthenticated,
            'categories': [
                { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
                { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
                { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
                { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
                { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
                { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
            ]
        });
    } else {
        res.redirect('../login');
    }
}).post('/add', (req, res, next) => {
    if (req.session.isauthenticated) {
        let postHeader = req.body.postHeader,
            postDescription = req.body.postDescription,
            postName = req.body.postName,
            postCategory = req.body.postCategory,
            postBody = req.body.postBody;

        Promise.all([post.insertPost(postHeader, postDescription, postName, postCategory, postBody)])
            .then((result) => {

                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: `The post ${postName} was added!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');

            }).catch((error) => {
                return next(error);
            });
    } else {
        res.redirect('../login');
    }
});

// update
router.get('/update/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;

        Promise.all(([post.getPostById(id)]))
            .then((result) => {
                const postClass = result[0];

                let viewmodel = {
                    'id': postClass.id,
                    'header': postClass.header,
                    'ispublished': postClass.ispublished,
                    'description': postClass.description,
                    'name': postClass.name,
                    'category': postClass.category,
                    'body': postClass.body,
                    'categories': [
                        { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
                        { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
                        { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
                        { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
                        { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
                        { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
                    ]
                };

                res.render('admin/edit', {
                    title: viewmodel.header,
                    isauthenticated: req.session.isauthenticated,
                    post: viewmodel
                });
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
}).post('/update', (req, res, next) => {
    if (req.session.isauthenticated) {
        let postHeader = req.body.postHeader,
            postIsPublished = req.body.postIsPublished,
            postDescription = req.body.postDescription,
            postId = req.body.postId,
            postCategory = req.body.postCategory,
            postBody = req.body.postBody;

        Promise.all([post.updatePost(postCategory, postHeader, postIsPublished, postDescription, postBody, postId)])
            .then((result) => {

                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: `The post ${postId} was updated!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            })
            .catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// activate
router.get('/activate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        Promise.all(([post.updatePostPublished(true, id)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: `The post ${id} was activated!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// deactivate
router.get('/deactivate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        Promise.all(([post.updatePostPublished(false, id)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Warning,
                                msg: `The post ${id} was deactivated!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// delete permanently
router.get('/delete/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        Promise.all(([post.deletePostPermanently(id)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Error,
                                msg: `The post ${id} was permanently deleted!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            }).catch((error) => {
                return next(err);
            })
    } else {
        res.redirect('../login');
    }
});


// events
router.get('/events', (req, res, next) => {
    if (req.session.isauthenticated) {
        Promise.all(([event.getAll()]))
            .then((result) => {
                    res.render('admin/events', {
                        'title': 'events',
                        'isauthenticated': req.session.isauthenticated,
                        'events': result[0]
                    })
            })
            .catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// settings
router.get('/settings', (req, res, next) => {
    if (req.session.isauthenticated) {
        let settingsViewModel = {
            'title': 'settings',
            'isauthenticated': req.session.isauthenticated,
            'about_section': '',
            'archive_view': '',
            'archive_view_categories': [
                { 'value': 'category', 'name': 'category' },
                { 'value': 'date', 'name': 'date' }
            ],
            'toastr_messages': req.session.toastr_messages
        };
        Promise.all(([settings.getSettings()]))
            .then((result) => {

                const settingsClass = result[0];

                try {
                    settingsViewModel.about_section = settingsClass.about_section;
                    settingsViewModel.archive_view = settingsClass.archive_view;
                    req.session.toastr_messages = null;
                    res.render('admin/settings', settingsViewModel);
                }
                catch {
                    Promise.all(([settings.insertDefaultSettings()]))
                        .then((result) => {

                            if (result[0] > 0) {
                                settingsViewModel.archive_view = Settings.defaultSettings[0];
                                settingsViewModel.about_section = Settings.defaultSettings[1];

                            }
                            req.session.toastr_messages = null;
                            res.render('admin/settings', settingsViewModel);
                        })
                        .catch((error) => {
                            return next(error);
                        })
                }
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
}).post('/settings/update', (req, res, next) => {
    if (req.session.isauthenticated) {
        let archiveView = req.body.archiveView,
            aboutSection = req.body.aboutSection;

        Promise.all(([settings.updateSettings(archiveView, aboutSection)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: 'The settings were successfully updated!'
                            }
                        ]
                    );
                }
                res.redirect('/admin/settings');
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

module.exports = router;



// index admin dashboard
router.get('/', (req, res, next) => {
    if (req.session.isauthenticated) {

        let viewmodel = {
            'title': 'admin dashboard',
            'isauthenticated': req.session.isauthenticated
        };

        res.render('admin/index', viewmodel);
    } else {
        res.redirect('../login');
    }
});

// all posts
router.get('/posts', (req, res, next) => {
    if (req.session.isauthenticated) {
        Promise.all(([post.getAll()]))
            .then((result) => {
                var allPostsViewModel = {
                    title: 'all posts',
                    isauthenticated: req.session.isauthenticated,
                    posts: result[0],
                    toastr_messages: req.session.toastr_messages
                };
                req.session.toastr_messages = null;
                res.render('admin/posts', allPostsViewModel);
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// add
router.get('/add', (req, res, next) => {
    if (req.session.isauthenticated) {
        res.render('admin/add', {
            'title': 'add new post',
            'isauthenticated': req.session.isauthenticated,
            'categories': [
                { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
                { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
                { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
                { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
                { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
                { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
            ]
        });
    } else {
        res.redirect('../login');
    }
}).post('/add', (req, res, next) => {
    if (req.session.isauthenticated) {
        let postHeader = req.body.postHeader,
            postDescription = req.body.postDescription,
            postName = req.body.postName,
            postCategory = req.body.postCategory,
            postBody = req.body.postBody;

        Promise.all([post.insertPost(postHeader, postDescription, postName, postCategory, postBody)])
            .then((result) => {

                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: `The post ${postName} was added!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');

            }).catch((error) => {
                return next(error);
            });
    } else {
        res.redirect('../login');
    }
});

// update
router.get('/update/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;

        Promise.all(([post.getPostById(id)]))
            .then((result) => {
                const postClass = result[0];

                let viewmodel = {
                    'id': postClass.id,
                    'header': postClass.header,
                    'ispublished': postClass.ispublished,
                    'description': postClass.description,
                    'name': postClass.name,
                    'category': postClass.category,
                    'body': postClass.body,
                    'categories': [
                        { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
                        { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
                        { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
                        { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
                        { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
                        { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
                    ]
                };

                res.render('admin/edit', {
                    title: viewmodel.header,
                    isauthenticated: req.session.isauthenticated,
                    post: viewmodel
                });
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
}).post('/update', (req, res, next) => {
    if (req.session.isauthenticated) {
        let postHeader = req.body.postHeader,
            postIsPublished = req.body.postIsPublished,
            postDescription = req.body.postDescription,
            postId = req.body.postId,
            postCategory = req.body.postCategory,
            postBody = req.body.postBody;

        Promise.all([post.updatePost(postCategory, postHeader, postIsPublished, postDescription, postBody, postId)])
            .then((result) => {

                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: `The post ${postId} was updated!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            })
            .catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// activate
router.get('/activate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        Promise.all(([post.updatePostPublished(true, id)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: `The post ${id} was activated!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// deactivate
router.get('/deactivate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        Promise.all(([post.updatePostPublished(false, id)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Warning,
                                msg: `The post ${id} was deactivated!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// delete permanently
router.get('/delete/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        Promise.all(([post.deletePostPermanently(id)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Error,
                                msg: `The post ${id} was permanently deleted!`
                            }
                        ]
                    );
                }
                res.redirect('/admin/posts');
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});


// events
router.get('/events', (req, res, next) => {
    if (req.session.isauthenticated) {
        Promise.all(([event.getAll()]))
            .then((result) => {
                res.render('admin/events', {
                    'title': 'events',
                    'isauthenticated': req.session.isauthenticated,
                    'events': result[0]
                })

            })
            .catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

// settings
router.get('/settings', (req, res, next) => {
    if (req.session.isauthenticated) {
        let settingsViewModel = {
            'title': 'settings',
            'isauthenticated': req.session.isauthenticated,
            'about_section': '',
            'archive_view': '',
            'archive_view_categories': [
                { 'value': 'category', 'name': 'category' },
                { 'value': 'date', 'name': 'date' }
            ],
            'toastr_messages': req.session.toastr_messages
        };
        Promise.all(([settings.getSettings()]))
            .then((result) => {

                const settingsClass = result[0];

                try {
                    settingsViewModel.about_section = settingsClass.about_section;
                    settingsViewModel.archive_view = settingsClass.archive_view;
                    req.session.toastr_messages = null;
                    res.render('admin/settings', settingsViewModel);
                }
                catch {
                    Promise.all(([settings.insertDefaultSettings()]))
                        .then((result) => {

                            if (result[0] > 0) {
                                settingsViewModel.archive_view = Settings.defaultSettings[0];
                                settingsViewModel.about_section = Settings.defaultSettings[1];

                            }
                            req.session.toastr_messages = null;
                            res.render('admin/settings', settingsViewModel);
                        })
                        .catch((error) => {
                            return next(error);
                        })
                }
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
}).post('/settings/update', (req, res, next) => {
    if (req.session.isauthenticated) {
        let archiveView = req.body.archiveView,
            aboutSection = req.body.aboutSection;

        Promise.all(([settings.updateSettings(archiveView, aboutSection)]))
            .then((result) => {
                if (result[0] > 0) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: tte.Success,
                                msg: 'The settings were successfully updated!'
                            }
                        ]
                    );
                }
                res.redirect('/admin/settings');
            }).catch((error) => {
                return next(error);
            })
    } else {
        res.redirect('../login');
    }
});

module.exports = router;
