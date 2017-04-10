'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
            $scope.dishes = menuFactory.getDishes().query(
            function(response) {
                $scope.dishes = response;
                $scope.showMenu = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            });
                        
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
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'contactFactory', function($scope, contactFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                    
                }
                else {
                    // save valid feedback to the server
                    $scope.feedback = contactFactory.saveFeedback().save($scope.feedback);

                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                    
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            $scope.showDish = false;
            $scope.message = "Loading ...";
            
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
                                .$promise.then(
                                    function(response) {
                                        $scope.dish = response;
                                        $scope.showDish = true;
                                    },
                                    function(response) {
                                        $scope.message = "Error:  "+response.status + " " + response.statusText;
                                    }
                                );
                        
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
                
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        // implement the IndexController and AboutController here
        .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
            $scope.showDish = false;
            $scope.showProm = false;
            $scope.showLeader = false;
            $scope.dishMessage = "Loading ...";
            $scope.promMessage = "Loading ...";
            $scope.leaderMessage = "Loading ...";
            
            $scope.dish = menuFactory.getDishes().get({id:0})
                            .$promise.then(
                                function(response){
                                    $scope.dish = response;
                                    $scope.showDish = true;
                                },
                                function(response) {
                                    $scope.dishMessage = "Error: "+response.status + " " + response.statusText;
                                }
                            );
            
            $scope.promotion = menuFactory.getPromotions().get({id:0})
                            .$promise.then(
                                function(response){
                                    $scope.promotion = response;
                                    $scope.showProm = true;
                                },
                                function(response) {
                                    $scope.promMessage = "Error: "+response.status + " " + response.statusText;
                                }
                            ); 
            
            $scope.leader = corporateFactory.getLeaders().get({id:3})
                            .$promise.then(
                                function(response){
                                    $scope.leader = response;
                                    $scope.showLeader = true;
                                },
                                function(response) {
                                    $scope.leaderMessage = "Error: "+response.status + " " + response.statusText;
                                }
                            );            
            
        }])

        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
            $scope.showLeaders = false;
            $scope.message = "Loading ...";

            $scope.leaders = corporateFactory.getLeaders().query(
                function(response) {
                    $scope.leaders = response;
                    $scope.showLeaders = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
        }])

;