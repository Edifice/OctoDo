'use strict';

var crypto = require('crypto');

/**
 * Create a random hex string of specific length and
 * @todo consider taking out to a common unit testing javascript helper
 * @return string
 */
function getRandomString(len) {
    if (!len)
        len = 16;

    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Todo = mongoose.model('Todo');

/**
 * Globals
 */
var user1, user2, todo1, todo2, user1email;

/**
 * Test Suites
 */
describe('<Unit Test>', function () {
    describe('Model Todo:', function () {

        before(function (done) {
            user1email = 'test' + getRandomString() + '@test.com';
            user1 = new User({
                name: 'User 1',
                email: user1email,
                username: getRandomString(),
                password: 'password',
                provider: 'local'
            });

            user2 = new User({
                name: 'User 2',
                email: 'test' + getRandomString() + '@test.com',
                username: getRandomString(),
                password: 'password',
                provider: 'local'
            });

            todo1 = {
                title: getRandomString(30),
                content: getRandomString(100)
            };

            todo2 = {
                title: getRandomString(30),
                content: getRandomString(100)
            };

            user1.save(function (err) {
                should.not.exist(err);
                user2.save(function (err) {
                    should.not.exist(err);
                    done();
                });
            });
        });

        describe('Method Save', function () {
            it('should begin without the 2 test todo', function (done) {
                Todo.find({
                    title: todo1.title
                }, function (err, todos) {
                    todos.should.have.length(0);

                    Todo.find({
                        title: todo2.title
                    }, function (err, todos) {
                        todos.should.have.length(0);
                        done();
                    });

                });
            });

            it('should be able to save without problems', function (done) {

                var _todo = new Todo(todo1);
                _todo.save(function (err) {
                    should.not.exist(err);
                    _todo.remove();
                    done();
                });

            });

it('should check that default values are assigned and todo is created properly', function (done) {
    var _todo = new Todo(todo1);
    _todo.save(function (err) {
        should.not.exist(err);

        _todo.title.should.have.length(30);
        _todo.content.should.have.length(100);
        _todo.priority.should.equal(3);
        _todo.done.should.equal(false);
        _todo.remove(function (err) {
            should.not.exist(err);
            done();
        });
    });
});

            it('should be able to change property', function (done) {

                var _todo = new Todo(todo1);
                _todo.priority.should.equal(3);

                _todo.priority = 2;

                _todo.save(function (err) {
                    should.not.exist(err);
                    _todo.priority.should.equal(2);

                    _todo.priority = 4;
                    _todo.save(function (err) {
                        should.not.exist(err);
                        _todo.priority.should.equal(4);
                        _todo.remove(function () {
                            done();
                        });
                    });
                });
            });

            it('should be able to associate a user to a todo', function (done) {

                var _todo = new Todo(todo1);
                _todo.user = user1;
                _todo.save(function (err) {
                    should.not.exist(err);

                    Todo.findOne({_id: _todo._id}).populate('user').exec(function(err, _todo2){
                        should.not.exist(err);

                        should(_todo2.user.email).equal(user1email);
                        _todo2.remove(function (err) {
                            should.not.exist(err);
                            done();
                        });
                    });
                });
            });
        });

        after(function (done) {
            done();
        });
    });
});
