'use strict';

// Declare app level module which depends on filters, and services

angular.module('mapa', [
  'mapa.controllers',
  'mapa.filters',
  'mapa.services',
  'mapa.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/pathology/:pathology', {
      templateUrl: 'partials/pathology',
      controller: 'Pathology'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
