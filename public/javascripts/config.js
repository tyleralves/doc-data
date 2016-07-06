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
      .state('map', {
        url: '/map',
        template: '<map></map>'
      })
      .state('register', {
        url: '/register',
        template: '<register></register>'
      })
      .state('login', {
        url:'/login',
        template: '<login></login>'
      });
    //$urlRouterProvider.otherwise('/');
  })
  .config(function(uiGmapGoogleMapApiProvider){
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyAWuwnjICGrycSCpKYz0PMoARttbpMS28M',
      v: '3.23',
      libraries: 'weather,geometry,visualization'
    });
  });