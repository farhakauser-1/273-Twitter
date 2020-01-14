import cors from 'cors';
import config from '../config';
import constants from '../src/utils/constants';

const createError = require('http-errors');
const logger = require('morgan');
const express = require('express');

const app = express();
const kafka = require('../kafka/client');

// router for modules
const usersRouter = require('../src/modules/user/router/users');
const tweetsRouter = require('../src/modules/tweet/router/tweets');
const messageRouter = require('../src/modules/messages/router/messages');
const listRouter = require('../src/modules/list/router/list');
const searchRouter = require('../src/modules/search/router/search');

// database connections
require('../src/models/mongoDB/index');

const port = process.env.PORT || 9000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public/', express.static('./public/'));

// use cors to allow cross origin resource sharing
app.use(cors({ origin: '*', credentials: false }));

/*
app.post('/book', function(req, res){

    kafka.make_request('post_book',req.body, function(err,results){
        // console.log('in result');
        // console.log(results);
        if (err){
            // console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            // console.log("Inside else");
                res.json({
                    updatedList:results
                });

                res.end();
            }

    });
});

app.post('/users/searchByName', function (req, res) {
    // console.log('inn');
    req.body.endPoint = '/users/searchByName';
    kafka.make_request('users', req.body, function(err, results){
        // console.log('in result');
        // console.log(results);
        if (err){
            // console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            // console.log("Inside else");
            if(results.status == 200) {
                return res
                    .status(200)
                    .json(results)
            } else {
                return res
                    .status(500)
                    .json(results)
            }
        }
    });
});

app.get('/users/followersOfUserId/:userId', function(req, res) {
    // console.log('inn');
    req.body.endPoint = '/users/followersOfUserId';
    req.body.params = {};
    req.body.params.userId = req.params.userId;
    kafka.make_request('users', req.body, function(err, results){
        // console.log('in result');
        // console.log(results);
        if (err){
            // console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            // console.log("Inside else");
            if(results.status == 200) {
                return res
                    .status(200)
                    .json(results)
            } else {
                return res
                    .status(500)
                    .json(results)
            }
        }
    });
});
*/

// base routes for modules
app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);
app.use('/messages', messageRouter);
app.use('/lists', listRouter);
app.use('/search', searchRouter);

// Ping route to check health of instance for load balancer
app.get('/ping', (req, res) => res
  .status(constants.STATUS_CODE.SUCCESS_STATUS)
  .send());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port, () => { /* console.log(`Twitter server listening on ${port}`) */ });
module.exports = app;
