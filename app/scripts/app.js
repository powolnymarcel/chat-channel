'use strict';

/**
 * @ngdoc overview
 * @name projet10LeChatApp
 * @description
 * # projet10LeChatApp
 *
 * Main module of the application.
 */
angular
  .module('projet10LeChatApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pubnub.angular.service'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/principal', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/joindre', {
        templateUrl: 'views/joindre.html',
        controller: 'joindreCtrl'
      })
      .otherwise({
        redirectTo: '/joindre'
      });
  });
