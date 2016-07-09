/**
 * Created by Tyler on 5/16/2016.
 */
function UserFactory($http, $window){
  var UserFactory = {};


  UserFactory.saveToken = function(token){
    $window.localStorage['doc-token'] = token;
  };

  UserFactory.getToken = function(){
    return $window.localStorage['doc-token'];
  };

  UserFactory.isLoggedIn = function(){
    var token = UserFactory.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    }else{
      return false;
    }
  };

  UserFactory.currentUser = function(){
    if(UserFactory.isLoggedIn()){
      var token = UserFactory.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  UserFactory.register = function(user){
    return $http
      .post('/register', user)
      .then(function(response){
        UserFactory.saveToken(response.data.token);
        return response;
      }, function(error){
        return error;
      });
  };

  UserFactory.logIn = function(user){
    return $http
      .post('/login', user)
      .then(function(response){
        UserFactory.saveToken(response.data.token);
        return response;
      }, function(error){
        return error;
      });
  };

  UserFactory.logOut = function(){
    $window.localStorage.removeItem('stork-delivery-token');
  };

  return UserFactory;
}

angular
  .module('app')
  .factory('UserFactory', UserFactory);