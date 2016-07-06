/**
 * Created by Tyler on 5/11/2016.
 */
angular
  .module('app', [
    'ui.router',
    'ui.bootstrap'
  ])
  //range filter used in ProductWide and ProductSquare components for quantity selects
  .filter('range', function(){
    return function(input, min, max){
      min = parseInt(min);
      max = parseInt(max);
      return Array.apply(null, new Array(max-min+1)).map(function(item, index){
        return index+1;
      });
    }
  });