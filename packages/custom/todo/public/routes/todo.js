'use strict';

angular.module('mean.todo').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('todo list', {
      url: '/todo',
      templateUrl: 'todo/views/list.html'
    });
  }
]);
