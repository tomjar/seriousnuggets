var express = require('express');
var router = express.Router();
var tte = require('../enums/toastrtypeenum.js');
var eventTypeEnum = require('../enums/eventcategoryenum.js');
var post = require('../data/post.js');
var auth = require('../data/auth.js');
var event = require('../data/event.js');
var aboutViewModel = require('../models/aboutView.js');
var postViewModel = require('../models/postView.js');
var homeViewModel = require('../models/homeView.js');


// home
router.get('/', (req, res, next) => {

  Promise.all([post.getAllPublishedLastThirtyDays(), post.getAllArchived()])
    .then((result) => {

      homeViewModel.lastThirtyDaysPosts = result[0];
      homeViewModel.yearAndPosts = result[1];
      homeViewModel.isauthenticated = req.session.isauthenticated;

      res.render('index', homeViewModel);
    }).catch((error) => {
      return next(error);
    })
});

// post/id
router.get('/post/:name', (req, res, next) => {
  const name = req.params.name;

  Promise.all([post.getPostByName(name), post.getAllArchived()])
    .then((result) => {
      postViewModel.post = result[0];
      postViewModel.yearAndPosts = result[1];
      postViewModel.isauthenticated = req.session.isauthenticated;
      res.render('post', postViewModel);
    }).catch((error) => {
      return next(error);
    })

});

// about
router.get('/about', (req, res, next) => {

  Promise.all([post.getAllArchived()])
    .then((result) => {
      aboutViewModel.yearAndPosts = result[0];
      aboutViewModel.isauthenticated = req.session.isauthenticated;
      res.render('about', aboutViewModel);
    }).catch((error) => {
      return next(error);
    })

});


// login
router.get('/login', (req, res, next) => {
  if (req.session.lockout) {
    res.redirect('../');
  } else {
    let tstrmsgs = req.session.toastr_messages;
    req.session.toastr_messages = null;
    res.render('login',
      {
        title: 'login',

      });
  }
}).post('/login', (req, res, next) => {
  if (req.session.lockout) {
    res.redirect('../');
  } else {
    Promise.all([auth.validatePassword(req.body.secretKey)])
      .then((result) => {
        const valid = result[0];
        if (valid) {

          // welcome valid user
          req.session.isauthenticated = true;
          res.redirect('../');
        } else {
          req.session.lockout = true;

          req.session.toastr_messages = JSON.stringify(
            [
              {
                type: tte.Warning,
                msg: 'This failed login attempt has been logged.'
              }
            ]
          );

          let description = 'It appears someone attempted to login to the website and failed.',
            category = eventTypeEnum.LoginFailure,
            ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

          Promise.all([event.insertEvent(ipAddress, category, description)])
            .then((result) => {
              res.redirect('../');
            }).catch((error) => {
                return next(err);
            })
        }
      })
  }
});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;