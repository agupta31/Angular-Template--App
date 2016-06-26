
angular.module("ngClassified.controllers",[]).
controller("appCtrl",["$scope",function($scope,myService){

$scope.name="";

console.log(myService.country);
}]);
