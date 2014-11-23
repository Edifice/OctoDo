'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Todo = new Module('todo');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Todo.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Todo.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Todo.menus.add({
    title: 'Todo list',
    link: 'todo list',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Todo.aggregateAsset('css', 'todo.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Todo.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Todo.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Todo.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Todo;
});
