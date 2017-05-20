angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  var platform = ionic.Platform.platform();
  // Form data for the login modal
  $scope.loginData = $localStorage.getObject(platform+'_userinfo', '{}');
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  //Create the reserve table modal
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  $scope.doReserve = function() {
    console.log('Doing Reservation for user: ', $scope.loginData.username);
    $timeout(function(){
      $scope.closeReserve();
    }, 1000);
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login; user: ', $scope.loginData.username, '; password: ', $scope.loginData.password);
    //adding userinfo to localStorage
    $localStorage.storeObject(platform+'_userinfo', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('FavoritesController', ['$scope', 'favoriteFactory', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', 'baseURL', 'dishes', function($scope, favoriteFactory, $ionicListDelegate, $ionicPopup, $ionicLoading, baseURL, dishes) {
  $scope.baseURL = baseURL;
  $scope.shouldShowDelete = false;

  $scope.favorites = favoriteFactory.getFavorites();
  $scope.dishes = dishes;

    $scope.toggleDelete = function(){
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      console.log('shouldShowDelete : ',$scope.shouldShowDelete);
    };

    $scope.deleteFavorite = function(dishid) {
      var confirmDelete = $ionicPopup.confirm({
        title: 'Confirm Delete',
        template: 'Are you sure you want to delete this item ?'
      });

      confirmDelete.then(function(response){
        if(response){
          console.log('Ok to delete favorite : '+dishid);
          favoriteFactory.deleteFromFavorites(dishid);
          $scope.shouldShowDelete = false;
          console.log('deleted dish id : '+dishid);
        }else{
          console.log('canceled delete of dish : '+dishid);
          $scope.shouldShowDelete = false;
        }
      });
    };

  }])

  .filter('favoriteFilter', function(){
    return function(dishes, favorites){
      var out = [];
      //simple linear search, will be slow for large arrays
      for(var i=0;i<favorites.length;i++){
        for(var j=0;j<dishes.length;j++){
          if(dishes[j].id === favorites[i].id){
            out.push(dishes[j]);
          }
        }
      }
      return out;
    };
  })

  .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', '$ionicListDelegate', 'baseURL', function($scope, dishes, favoriteFactory, $ionicListDelegate, baseURL) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes = dishes;


      $scope.select = function(setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
          $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
          $scope.filtText = "mains";
        }
        else if (setTab === 4) {
          $scope.filtText = "dessert";
        }
        else {
          $scope.filtText = "";
        }
      };

      $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
      };

      $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
      };

      $scope.addFavorite = function(dishid){
        console.log("index is "+dishid);
        favoriteFactory.addToFavorites(dishid);
        $ionicListDelegate.closeOptionButtons();
      };
    }])

    .controller('ContactController', ['$scope', function($scope) {

      $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

      var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

      $scope.channels = channels;
      $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

      $scope.sendFeedback = function() {

        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
          $scope.invalidChannelSelection = true;
          console.log('incorrect');
        }
        else {
          $scope.invalidChannelSelection = false;
          feedbackFactory.save($scope.feedback);
          $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
          $scope.feedback.mychannel="";
          $scope.feedbackForm.$setPristine();
          console.log($scope.feedback);
        }
      };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'dish', 'favoriteFactory', '$ionicPopover', '$ionicModal', 'baseURL', function($scope, $stateParams, menuFactory, dish, favoriteFactory, $ionicPopover, $ionicModal, baseURL) {

      $scope.baseURL = baseURL;
      $scope.showDish = false;
      $scope.message="Loading ...";
      $scope.dish = dish;


      $scope.popover = $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
      }).then(function(popover){
        $scope.popover = popover;
      });

      $scope.showDishDetailPopover = function($event) {
        $scope.popover.show($event);
      };

      $scope.addFavorite = function(dishid) {
        console.log('Adding dish : '+dishid+' to favorites');
        favoriteFactory.addToFavorites(dishid);
        $scope.popover.hide();
      };

      $scope.commentModal = $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
      }).then(function(modal){
        console.log('Comment modal loaded successfully');
        $scope.commentModal = modal;
      });

      $scope.mycomment = {rating:"5", comment:"", author:"", date:""};

      $scope.showCommentModal = function(){
        $scope.commentModal.show();
        $scope.popover.hide();
      };

      $scope.closeCommentModal = function(){
        $scope.commentModal.hide();
      };

      $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);

        $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);

        console.log("Comment added from author : "+$scope.mycomment.author);

        $scope.mycomment = {rating:"5", comment:"", author:"", date:""};

        $scope.closeCommentModal();
      }

    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

      $scope.mycomment = {rating:5, comment:"", author:"", date:""};

      $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);

        $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);

        $scope.commentForm.$setPristine();

        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
      }
    }])

    // implement the IndexController and About Controller here

    .controller('IndexController', ['$scope', 'featuredDish', 'executiveChef', 'promotion', 'baseURL', function($scope, featuredDish, executiveChef, promotion, baseURL) {
      $scope.baseURL = baseURL;
      $scope.leader = executiveChef;
      $scope.showDish = false;
      $scope.message="Loading ...";
      $scope.dish = featuredDish;
      $scope.promotion = promotion;

    }])

    .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {

      $scope.leaders = leaders;
      $scope.baseURL = baseURL;
      //console.log($scope.leaders);

    }]);
