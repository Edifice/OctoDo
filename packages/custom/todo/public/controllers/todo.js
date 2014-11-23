'use strict';

angular.module('mean.todo').controller('TodoController',
    function (
        $scope,
        $modal,
        $log,
        Global,
        Todo) {

        $scope.global = Global;
        $scope.todoList = [];
        $scope.todo = new Todo();
        $scope.showEditFor = '';

        $scope.$watch('showEditFor', function(a){
            console.log(a);
        });

        $scope.create = function () {
            $scope.todo.$save(function (resp) {
                console.log(resp);
                $scope.todoList.push(angular.copy(resp));
            });

            $scope.todo = new Todo();
        };

        $scope.remove = function (todo) {
            if (todo) {
                todo.$delete(function(){
                    for (var i in $scope.todoList) {
                        if ($scope.todoList[i]._id === todo._id) {
                            $scope.todoList.splice(i, 1);
                        }
                    }
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

        $scope.openAddingModal = function(){
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
