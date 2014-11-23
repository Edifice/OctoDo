'use strict';

angular.module('mean.todo').factory('Todo',
  function($resource) {
      return $resource('todo/:todoId', {
          todoId: '@_id'
      }, {
          update: {
              method: 'PUT'
          }
      });
  }
);
