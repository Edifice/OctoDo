'use strict';

var todoCtrl = require('../controllers/todo');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.todo.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};


module.exports = function(Todo, app, auth) {
    app.route('/todo')
        .get(todoCtrl.all)
        .post(auth.requiresLogin, todoCtrl.create);
    app.route('/todo/:todoId')
        .get(todoCtrl.show)
        .put(auth.requiresLogin, hasAuthorization, todoCtrl.update)
        .delete(auth.requiresLogin, hasAuthorization, todoCtrl.destroy);

    // Finish with setting up the todoId param
    app.param('todoId', todoCtrl.todo);
};
