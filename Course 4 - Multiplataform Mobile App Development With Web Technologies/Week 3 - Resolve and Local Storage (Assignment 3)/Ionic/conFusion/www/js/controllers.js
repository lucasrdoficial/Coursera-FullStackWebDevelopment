angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  
  //$scope.loginData = {};
  $scope.loginData = $localStorage.getObject('userinfo','{}');
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginForm = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginForm.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginForm.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

//Modal Reserve Form

// Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveForm = modal;
  });

  // Perform the login action when the user submits the login form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };

// Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveForm.show();
  };

// Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveForm.hide();
  };

  

})

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate','$localStorage', 
                            function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate,$localStorage) {
            
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
            $scope.dishes =  dishes;

                        
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

            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
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

        .controller('DishDetailController', ['$scope', '$stateParams', 'dish','menuFactory','favoriteFactory','baseURL','$ionicListDelegate','$ionicPopover','$ionicLoading','$timeout','$ionicModal','$localStorage',  
                    function($scope, $stateParams,dish,menuFactory,favoriteFactory,baseURL,$ionicListDelegate,$ionicPopover,$ionicLoading,$timeout,$ionicModal,$localStorage ) {
            
            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.commentForm = {};
            
            
            $scope.dish = dish;

            $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
              scope: $scope,
            }).then(function(popover) {
              $scope.popover = popover;
            });
            $scope.openPopover = function($event) {
              $scope.popover.show($event);
            };
            $scope.closePopover = function() {
              $scope.popover.hide();
            };
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function() {
              $scope.popover.remove();
            });
            // Execute action on hide popover
            $scope.$on('popover.hidden', function() {
              // Execute action
            });
            // Execute action on remove popover
            $scope.$on('popover.removed', function() {
            // Execute action
            });
            //add Favorite
            $scope.popoverAddFavorite = function(){
                var id = $scope.dish.id;
                console.log("index is " + id);
                favoriteFactory.addToFavorites(id);
                $scope.closePopover();
            }

            $scope.popoverAddComment = function(){
                $scope.showCommentForm();
                $scope.closePopover();
            }
            //Modal CommentForm

            // Create the reserve modal that we will use later
            $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.commentForm = modal;
            });

            // Perform the login action when the user submits the login form
            $scope.addComment = function() {
                if (($scope.mycomment.author != "") && ($scope.mycomment.comment != "")){
                    $scope.mycomment.date = new Date().toISOString();
                    console.log('add the comment', $scope.mycomment);                
                    $scope.dish.comments.push($scope.mycomment);
                    menuFactory.update({id:$scope.dish.id},$scope.dish);
                    //$scope.commentForm.$setPristine();
                    $scope.mycomment = {rating:5, comment:"", author:"", date:""};
                }
                $scope.closeCommentForm();
            };

            // Open the reserve modal
            $scope.showCommentForm = function() {
                $scope.commentForm.show();
            };

            // Triggered in the reserve modal to close it
            $scope.closeCommentForm = function() {
                $scope.commentForm.hide();
            };



            
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

        .controller('IndexController', ['$scope', 'menuFactory','dish',
            'promotion','corporateFactory','baseURL', function($scope, 
                menuFactory,dish,promotion,corporateFactory,baseURL) {
                                        
                        $scope.baseURL = baseURL;
                        $scope.leader = corporateFactory.get({id:3});
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        /*
                        $scope.dish = menuFactory.get({id:0})
                        .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
                        );
                        $scope.promotion = menuFactory.get({id:0});
                        */
                        $scope.dish = dish;
                        $scope.promotion = promotion;
            
                    }])

        .controller('AboutController', ['$scope', 'leaders','baseURL', 
                    function($scope, leaders,baseURL) {
            
                    $scope.baseURL = baseURL;
                    $scope.leaders = leaders;
                    console.log($scope.leaders);
            
                    }])

        .controller('FavoritesController', ['$scope', 'dishes','favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate','$ionicPopup','$ionicLoading','$timeout', 
                                            function ($scope, dishes,favorites,favoriteFactory, baseURL, $ionicListDelegate,$ionicPopup,$ionicLoading,$timeout) {
            $scope.baseURL = baseURL;
            $scope.shouldShowDelete = false;


            
            $scope.favorites = favorites;

            $scope.dishes = dishes;
            
            console.log($scope.dishes, $scope.favorites);

            $scope.toggleDelete = function () {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
            console.log($scope.shouldShowDelete);
        }

            $scope.deleteFavorite = function (index) {
                var confirmPopup = $ionicPopup.confirm({
                    title: "Confirm Delete",
                    template: "Are you sure you want to delete this item?"
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        console.log("ok to delete");
                        favoriteFactory.deleteFromFavorites(index);
                    }
                    else {
                        console.log("Canceled Delete");
                    }
                });
             $scope.shouldShowDelete = false;
            }

        }])

        .filter('favoriteFilter', function () {
            return function (dishes, favorites) {
                var out = [];
                for (var i = 0; i < favorites.length; i++) {
                    for (var j = 0; j < dishes.length; j++) {
                        if (dishes[j].id === favorites[i].id)
                            out.push(dishes[j]);
                    }
                }
                return out;
            }})

;


