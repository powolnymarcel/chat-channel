'use strict';

/**
 * @ngdoc function
 * @name projet10LeChatApp.controller:joindreCtrl
 * @description
 * # AboutCtrl
 * Controller of the projet10LeChatApp
 */
angular.module('projet10LeChatApp')
                            //On injecte le scope et on place entre [] car à la minification il pourrait y avoir des erreurs
                                      //On aura besoin du rootscope pour par exemple le nm d'user loggé
                                                    //On aura besoin du location  pour les redirect
  .controller('joindreCtrl',['$scope','$rootScope','$location','PubNub', function ($scope,$rootScope,$location,PubNub) {
    //On genere un username
    $scope.data={
      pseudo:'Pseudo_'+ Math.floor(Math.random() * 1000)
    };

    // Au click sur le bouton joindre
    $scope.joindre=function(){
      console.log("Chargement...");
      var _ref, _ref2;
      $rootScope.data || ($rootScope.data ={});
      // Si le pseudo via le form n'est pas null alors on stockera le pseudo dans le $rootScope.data.pseudo
      $rootScope.data.pseudo = (_ref = $scope.data) != null ? _ref.pseudo : void 0;
      //On genere un username id
      $rootScope.data.uuid= Math.floor(Math.random()* 1000000) + '__' + $scope.data.pseudo;
      console.log($rootScope);
        //On utilise l'api de PubNub
      PubNub.init({
        subscribe_key:'sub-c-4d8656ac-85f8-11e5-bf00-02ee2ddab7fe',
        publish_key:'pub-c-5f5573a7-d911-4e80-80ed-5fbb4bd0507f',
        uuid: $rootScope.data.uuid
      });

    return $location.path('/principal')
    }
  }]);
