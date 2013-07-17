'use strict';

/* Directives */

angular.module('mapa.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  // }).
  // directive('filterYear', function () {
  // 	return function (scope, elem, attrs){
  // 		elem.bind("ngChange", function (){
  // 			if(!attrs.checked){
  // 				for(var i in scope.years[attrs.value]){
  // 					for(var j in scope.countries){
  // 						scope.countries[j].remove(scope.years[attrs.value][i])
  // 					}
  // 				}
  // 			}
  // 		});
  // 	}
  });
