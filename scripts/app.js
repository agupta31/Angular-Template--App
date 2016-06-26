 var myApp=angular.module("ngClassified",["ngMaterial","ui.router"]);

//----------------------------------------------------------------------
//configuring my routes usin angular UI router
myApp.config(function($mdThemingProvider,$stateProvider){
    $mdThemingProvider.theme("default")
      .primaryPalette('teal')
      .accentPalette('orange')

       $stateProvider.
              state("state1",{
                     url:"/",
                      templateUrl:"partials/viewPage.html",
                      controller:"appCtrl"

              })
              .state("state1.newClassified",{
                          url:"/newClassified",
                          templateUrl:"partials/newItem.html",
                          controller:"classifiedCtrl"

              })
              .state("state1.edit",{
                     url:"/edit/:id",
                     templateUrl:"partials/editItem.html",
                     controller:"editCtrl",
                     params:{
                        item:null
                     }
              })
              .state("view",
                         {
                         url:"/view/:id",
                         templateUrl:"partials/detailedView.html",
                         controller:"viewCtrl",
                         params:{
                            item:null
                         }

              })


});


//======================================================================
//service
 myApp.service("myService",function($http){
      this.itemObj={};
      this.getData=function(){

          return $http({
                   method:"get",
                    url:"data/classified.json"
          });
      }


 });

//===========================================================================//
//main controller
 myApp.controller("appCtrl",function($scope,myService,$log,$mdSidenav,$state,$mdDialog,$mdMedia){

     $scope.status=" ";
     $scope.customFullscreen=$mdMedia("xs")||$mdMedia("sm");
      $scope.flag=false;
      $scope.adminFlag=false;
      $scope.item="";
      $scope.editing=false;
      $scope.setFilter=false;
      $scope.categories=[];


    $scope.showContact=function(item){

          $scope.id=item.id;
          $scope.flag=!$scope.flag;
    };

  $scope.showAdmin=function(item){

         $scope.adminId=item.id;
         $scope.adminFlag=!$scope.adminFlag;
  }

//using promises to remove asysnchronous behaviofunction(){
  myService.getData().then(function(response){

     $scope.classifiedInfo=response.data;


  });


//this function is used to open the sidebar when clicked on the ngClassified button
  $scope.openSidebar=function(){

    if($scope.editing){
       $scope.item={};
     }
    $state.go("state1.newClassified");


  };

$scope.closeSidebar=function(){
     $state.go("state1.newClassified");

};


//function for editing a particular item
$scope.editItem=function(itemObj){
//sending item data using route params
$state.go("state1.edit",{
      id:itemObj.id,
      item:itemObj
});

};

//function to delete an item
$scope.deleteItem=function(itemObj){
var k=$scope.classifiedInfo.indexOf(itemObj);
$scope.classifiedInfo.splice(k,1);
myService.getData();

};
 $scope.searchFilter=function(item){

     var keyword=new RegExp($scope.nameFilter,'i');
     return !$scope.nameFilter ||keyword.test(item.title)||keyword.test(item.price)||keyword.test(item.description);

 };

//function which defines what happens when you click on the filter button
 $scope.openFilter=function(){

   $scope.showFilter=true;
   var categories=[];
    $scope.setFilter=!$scope.setFilter;
    //this populates the select menu
    angular.forEach($scope.classifiedInfo,function(item){
         angular.forEach(item.categories,function(category){
            categories.push(category);
         });
    });
//returns unique category elements.This is neccessary as ng-repeat does not work with duplicates
    $scope.categories=_.uniq(categories);
 };


 $scope.closeFilter=function(){

    $scope.nameFilter="";
    $scope.category="";

 };

 $scope.viewDetails=function(itemObj){

   $state.go("view",{
       id:itemObj.id,
       item:itemObj
   });
 };

});


//-------------------------------------------------------------------------------
//controller for my sidenav
myApp.controller("classifiedCtrl",function($scope,$timeout,$mdSidenav,$state,myService){

   var self=this;
     $timeout(function(){
       $mdSidenav("left").open();
     });
//logic to watch whether my sidenav is pen or not.I fit si closed we go to the home page.
      $scope.$watch("sidenavOpen",function(newSidenav,oldSidenav){

           if(newSidenav===false){
              $mdSidenav("left").close().then(function(){
                console.log("value changed");
                        $state.go("state1");
              });
            }
      });

     $scope.closeSidebar=function(){
        this.sidenavOpen=false;
     };
     $scope.addItem=function(){
        if($scope.item){
         $scope.classifiedInfo.push($scope.item);
         myService.getData();
         $scope.item={};
         $scope.closeSidebar();
       }

     };

    $scope.updateItem=function(){
      if($scope.item){
           myService.getData();
           $scope.closeSidebar();
         }
    };

});


//--------------------------------------------------------------------------------
//this controller is used to handle any edit requests
myApp.controller("editCtrl",function($scope,$timeout,$mdSidenav,$state,myService){
  //we pass the edited items info using $state.params.item
   $scope.item=$state.params.item;
   var self=this;
     $timeout(function(){
       $mdSidenav("left").open();
     });
//logic to watch whether my sidenav is pen or not.I fit si closed we go to the home page.
      $scope.$watch("sidenavOpen",function(newSidenav,oldSidenav){

           if(newSidenav===false){
              $mdSidenav("left").close().then(function(){
                console.log("value changed in edit ctrl");
                        $state.go("state1");
              });
            }
      });

     $scope.closeSidebar=function(){
        this.sidenavOpen=false;
     };

    $scope.updateItem=function(){
      if($scope.item){
           myService.getData();
           $scope.closeSidebar();
         }
    };

});

myApp.controller("viewCtrl",function($scope,$state,myService){

      $scope.item=$state.params.item;

      $scope.goBack=function(){

         $state.go("state1");
      }

});
