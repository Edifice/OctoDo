'use strict';

angular.module('mean.todo').controller('TodoController',
    function ($scope, $modal, $log, Global, Todo) {

        $scope.global = Global;
        $scope.todoList = [];
        $scope.todo = new Todo();
        $scope.todo.priority = 3;
        $scope.todo.dueDate = moment().hour(0).format('YYYY-MM-DD');
        $scope.showEditFor = null;
        $scope.visibleExtra = null;

        $scope.priorities = [
            {id: 1, label: 'trivial'},
            {id: 2, label: 'minor'},
            {id: 3, label: 'major'},
            {id: 4, label: 'urgent'},
            {id: 5, label: 'critical'}
        ];

        $scope.datePickerOptions = {
            editable: false,
            format: 'yyyy-mm-dd'
        };

        $scope.showEdit = function (ticket) {
            $scope.showEditFor = $scope.showEditFor === ticket._id ? null : ticket._id;
        };

        $scope.create = function () {
            if (!validateTodo($scope.todo)) {
                return false;
            }
            $scope.todo.$save(function (resp) {
                safeApply($scope, function () {
                    $scope.todoList.push(angular.copy(resp));
                });
            });

            $scope.todo = new Todo();
            $scope.todo.priority = 3;
            $scope.todo.dueDate = moment().hour(0).format('YYYY-MM-DD');
        };

        $scope.changePriority = function (todo) {
            if (isNaN(todo.priority)) {
                todo.priority = 3;
            }
            todo.priority = ++todo.priority > $scope.priorities.length ? 1 : todo.priority;
            $scope.save(todo);
        };

        $scope.save = function (todo) {
            if (!validateTodo(todo)) {
                return false;
            }
            if (todo._id) {
                todo.$update(todo, function (resp) {
                    console.log(resp.title + ' updated');
                });
            }
            $scope.visibleExtra = null;
        };

        $scope.remove = function (todo) {
            if (todo) {
                todo.$delete(function () {
                    safeApply($scope, function () {
                        for (var i in $scope.todoList) {
                            if ($scope.todoList.hasOwnProperty(i)) {
                                if ($scope.todoList[i]._id === todo._id) {
                                    $scope.todoList.splice(i, 1);
                                }
                            }
                        }
                    });
                });
            } else {
                $scope.todo.$delete();
            }
        };

        $scope.find = function () {
            Todo.query(function (todoList) {
                $scope.todoList = todoList;
            });
        };
        $scope.find();

        // periodic refresh to get updates on all devices
        var interval = true;
        var intervalRefresh = function () {
            var intervalRefresh2 = setInterval(function () {
                if (interval) {
                    $scope.find();
                }
                clearInterval(intervalRefresh2);
                intervalRefresh();
            }, 3000);
        };
        intervalRefresh();
        var startRefresh = function () {
            interval = true;
        };
        var stopRefresh = function () {
            interval = false;
        };

        $scope.openAddingModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'todo/views/addingModal.html',
                controller: 'ModalAddingCtrl',
                //size: size,
                resolve: {
                    todoList: function () {
                        return $scope.todoList;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $log.info('Modal closed iwth data: "' + selectedItem + '" at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.setDueDate = function () {
            $scope.visibleExtra = !$scope.visibleExtra ? 'due-date' : null;
        };

        $scope.setPriority = function () {
            $scope.visibleExtra = !$scope.visibleExtra ? 'priority' : null;
        };

        $scope.ticketOnDueDateEdit = null;
        $scope.inlinePickADateOnOpen = function (ticket) {
            stopRefresh();
            $scope.ticketOnDueDateEdit = ticket;
        };

        $scope.inlinePickADateOnSet = function (resp) {
            if (!moment) {
                return 0;
            }
            if ($scope.ticketOnDueDateEdit) {
                $scope.ticketOnDueDateEdit.dueDate = moment(resp.select).format('YYYY-MM-DD');
                $scope.save($scope.ticketOnDueDateEdit);
                delete $scope.ticketOnDueDateEdit;
            }
            startRefresh();
            return 1;
        };

        $scope.showTicketSeparator = function (todo) {
            var todoList = $scope.todoList.sort(function (a, b) {
                var _a = moment(a.dueDate).hour(0).minute(0).second(0).millisecond(0);
                var _b = moment(b.dueDate).hour(0).minute(0).second(0).millisecond(0);
                if (_a.isBefore(_b)) {
                    return -1;
                }
                if (_a.isAfter(_b)) {
                    return 1;
                }
                return 0;
            });

            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i]._id === todo._id) {
                    if (typeof todoList[i - 1] !== 'undefined') {
                        var thisGroup = $scope.getTicketGroup(todoList[i]);
                        var previousGroup = $scope.getTicketGroup(todoList[i - 1]);

                        return thisGroup !== previousGroup;
                    }

                    return true;
                }
            }
            return true;
        };

        $scope.getTicketGroup = function (todo) {
            var today = moment().hour(0).minute(0).second(0);
            var diff = moment(todo.dueDate).hour(0).minute(0).second(0).millisecond(0).diff(today, 'days', true);
            if (diff < -1) {
                return 'overdue';
            }
            if (diff < 0) {
                return 'today';
            }
            if (diff < 1) {
                return 'tomorrow';
            }
            return 'in the future';
        };

        var validateTodo = function (todo) {
            if (todo.title == undefined || todo.title == "") {
                return false;
            }
            return true;
        };

        function safeApply(scope, fn) {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }
    }
);

angular.module('mean.todo').controller('ModalAddingCtrl', function ($scope, $modalInstance, todoList) {

    $scope.todoList = todoList;
    $scope.selected = {
        item: $scope.todoList[0]
    };

    $scope.ok = function () {
        $modalInstance.close(1);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
