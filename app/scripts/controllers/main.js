'use strict';

/**
 * @ngdoc function
 * @name projet10LeChatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projet10LeChatApp
 */
angular.module('projet10LeChatApp')
  .controller('MainCtrl', ['$scope','$rootScope','$location','PubNub',function ($scope,$rootScope,$location,PubNub) {
      var _ref;
    if(!PubNub.initialized()){
      $location.path('/joindre')
    }

    $scope.controlChannel='__controlchannel';

    $scope.channels=[];


    // Créer le chat
      //voir le ng-submit du form dans main.html
    $scope.creerChat= function(){
    var chat;
      console.log('création d\'un chat');
          //Voir le input(ng-model)
      chat = $scope.nouveauChat;
        // on vide le champ.
      $scope.nouveauChat='';

      //Autoriser le chat via PubNub
      PubNub.ngGrant({
        channel: chat,
        read:true,
        write:true,
        callback:function(){
          return console.log(chat + ' activé', arguments);
        }
      });
      //Autoriser la "présence" du chat via PubNub
      PubNub.ngGrant({
        channel: chat + '-pnpres',
        read:true,
        write:false,
        callback:function(){
          return console.log(chat + ' présence activé', arguments);
        }
      });

      PubNub.ngPublish({
        channel: $scope.controlChannel,
        message:chat
      })

      return setTimeout(function(){
        $scope.subscribe(chat);
        return $scope.montrer=false;
      },100);
    }
    $scope.subscribe = function(chat){
      var _ref;
      console.log('Souscription....');
      if(chat === $scope.selectedChannel){
        return
      }
      if($scope.selectedChannel){
        PubNub.ngUnsubscribe({
          channel:$scope.selectedChannel
        });
      }

      $scope.selectedChannel=chat;
      $scope.messages = ['Bienvenue au chat ' + chat];

      PubNub.ngSubscribe({
        channel:$scope.selectedChannel
      });

      $rootScope.$on(PubNub.ngPrsEv($scope.selectedChannel),function(ngEvent,payload){
        return $scope.$apply(function(){
          var newData,userData;
          userData=PubNub.ngPresenceData($scope.selectedChannel);
          newData={};
          $scope.users = PubNub.map(PubNub.ngListPresence($scope.selectedChannel),function(x){
            var newX;
            newX=x;
            if(x.replace){
              newX= x.replace(/\w+__/, "");
            }
            if(x.uuid){
              newX= x.uuid.replace(/\w+__/, "");
            }
            newData[newX]=userData[x]||{};
            return newX;
          });
          return $scope.userData = newData;
        });
      });


      PubNub.ngHereNow({
        channel:$scope.selectedChannel
      });

      $rootScope.$on(PubNub.ngMsgEv($scope.selectedChannel),function(ngEvent,payload){
        var msg;
        msg=payload.message.user ? "["+ payload.message.user + "]" + payload.message.text: void 0;
        return $scope.$apply(function(){
          return $scope.message.unshift(msg);
        });
      });

      return PubNub.ngHistory({
        channel: $scope.selectedChannel,
        auth_key: $scope.authkey,
        count:500
      })
    };

PubNub.ngSubscribe({
  channel:$scope.controlChannel
});

    $rootScope.$on(PubNub.ngMsgEv($scope.controlChannel),function(ngEvent,payload){
      return $scope.$apply(function(){
        if($scope.channels.indexOf(payload.message)<0){
          return $scope.channels.push(payload.message);
        }
      })
    });

    PubNub.ngHistory({
      channel: $scope.controlChannel,
      count:500
    });


    $scope.nouveauChat='TheWaitingRoom';
    return $scope.creerChat();

  }]);
