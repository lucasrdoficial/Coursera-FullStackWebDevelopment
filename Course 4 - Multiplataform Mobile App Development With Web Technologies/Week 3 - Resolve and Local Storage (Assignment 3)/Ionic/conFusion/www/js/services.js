'use strict';

angular.module('conFusion.services', ['ngResource'])
.constant("baseURL","http://192.168.0.11:3000/")
.factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

  return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});

}])

.factory('promotionFactory', ['$resource', 'baseURL', function($resource, baseURL) {
  return   $resource(baseURL+"promotions/:id");
}])

.factory('favoriteFactory', ['$resource', '$localStorage', 'baseURL', function($resource, $localStorage, baseURL){
  var favFac = {};
  var platform = ionic.Platform.platform();
  //contains dish ids
  var favorites = $localStorage.getObject(platform+'_favorites','[]');

  favFac.addToFavorites = function(dishid) {
    for(var i=0;i<favorites.length;i++){
      if(favorites[i].id == dishid){
        console.log("dishid: "+dishid+" is already in favorites, returning!");
        return;
      }
    }
    favorites.push({id: dishid});
    $localStorage.storeObject(platform+'_favorites', favorites);
  };

  favFac.getFavorites = function() {
    return favorites;
  };

  favFac.deleteFromFavorites = function(dishid) {
    for(var i=0; i<favorites.length; i++){
      if(favorites[i].id == dishid) {
        favorites.splice(i,1);//evades corner case because it only removes one
        $localStorage.storeObject(platform+'_favorites', favorites);
      }
    }
  };

  return favFac;
}])

.factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {


  return $resource(baseURL+"leadership/:id");

}])

.factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {


  return $resource(baseURL+"feedback/:id");

}])

.factory('$localStorage', ['$window', function($window){
  return{
    store: function(key, value){
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue){
      return $window.localStorage[key] || defaultValue;
    },
    storeObject: function(key, value){
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key, defaultValue){
      try{
      return JSON.parse($window.localStorage[key] || defaultValue);
      }
      catch(err){
        //just fixing the invalid storage value case, i'm assuming default value is valid since I pass it
        $window.localStorage.removeItem(key);
        //if there is an invalid value, flush and return parsed value of defaultValue, subsequent calls should work correctly
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    }
  }
}])

;
