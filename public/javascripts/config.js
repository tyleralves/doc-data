/**
 * Created by Tyler on 5/16/2016.
 */
angular
  .module('app')
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('home', {
        url: '/',
        template:'<h1>HOME</h1>'
      })
      .state('register', {
        url: '/register',
        template: '<register></register>'
      })
      .state('login', {
        url:'/login',
        template: '<login></login>'
      })
      .state('productList', {
        url:'/products',
        template:'<products-list></products-list>'
      })
      .state('cart', {
        url:'/cart',
        template: '<cart></cart>'
      })
      .state('deals', {
        url: '/deals',
        template: '<deals></deals>'
      });
    //$urlRouterProvider.otherwise('/');
  });