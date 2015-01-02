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

mongoose.model('Todo', TodoSchema);
