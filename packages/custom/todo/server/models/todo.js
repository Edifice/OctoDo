'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var TodoSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    dueDate:{
        type: Date
    },
    priority: {
        type: Number,
        default: 3,
        enum: [1, 2, 3, 4, 5]
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    done: {
        type: Boolean,
        default: false
    }
});

/**
 * Validations
 */
TodoSchema.path('title').validate(function (title) {
    return !!title;
}, 'Title cannot be blank');

/**
 * Statics
 */
TodoSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};
/*TodoSchema.statics.getPriorities = function(){
    return [
        {id: 1, label: 'trivial'},
        {id: 2, label: 'minor'},
        {id: 3, label: 'major'},
        {id: 4, label: 'urgent'},
        {id: 5, label: 'critical'}
    ];
};*/

mongoose.model('Todo', TodoSchema);
