'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Todo = mongoose.model('Todo'),
    _ = require('lodash');


/**
 * Find todo by id
 */
exports.todo = function(req, res, next, id) {
    Todo.load(id, function(err, todo) {
        if (err) return next(err);
        if (!todo) return next(new Error('Failed to load todo ' + id));
        req.todo = todo;
        next();
    });
};

/**
 * Create an todo
 */
exports.create = function(req, res) {
    var todo = new Todo(req.body);
    todo.user = req.user;

    todo.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the todo',
                msg: err
            });
        }
        res.json(todo);
    });
};

/**
 * Update an todo
 */
exports.update = function(req, res) {
    var todo = req.todo;

    todo = _.extend(todo, req.body);

    todo.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the todo'
            });
        }
        res.json(todo);
    });
};

/**
 * Delete an todo
 */
exports.destroy = function(req, res) {
    if(req.todo){
        req.todo.remove(function(err) {
            if (err) {
                return res.json(500, {
                    error: 'Cannot delete the todo'
                });
            }
            res.json(req.todo);
        });
    }else{
        res.json(406, {
            error: 'Todo model is missing from request'
        });
    }
};

/**
 * Show an todo
 */
exports.show = function(req, res) {
    res.json(req.todo);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Todo.find({user: req.user}).sort('-created').populate('user', 'name').exec(function(err, todo) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the todos'
            });
        }
        res.json(todo);

    });
};
