/**
 * Created by Tyler on 5/16/2016.
 */
function RegisterController(UserFactory, $state) {
  var ctrl = this;
  ctrl.user = {};
  
  ctrl.register = function(){
    UserFactory.register(ctrl.user)
      .then(function registerSuccess(response){
        if(response.status === 400){
          ctrl.message = response.data.message;
        }else if(response.status === 500){
          ctrl.message = 'User already exists!';
        }else{
            $state.go('home');
        }
      });
  };

  ctrl.logOut = function(){
    UserFactory.logOut();
  };
}

angular
  .module('app')
  .controller('RegisterController', RegisterController);