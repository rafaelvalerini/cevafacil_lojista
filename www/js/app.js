// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers' , 'starter.services'])

.run(function($ionicPlatform , $rootScope, $timeout, $http,  $state) {

    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

     $rootScope.authStatus = false;
     //stateChange event
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

      $rootScope.authStatus = toState.authStatus;
      if($rootScope.authStatus){
        
      
      }
    });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(toState.url=='/dashboard'){
      $timeout(function(){
        angular.element(document.querySelector('#leftMenu' )).removeClass("hide");
      },1000);
    } 
  });

})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

  $ionicConfigProvider.views.maxCache(0);

  $httpProvider.defaults.useXDomain = true;

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
//--------------------------------------

  .state('app.meet', {
      url: '/meet',
      views: {
        'menuContent': {
          templateUrl: 'templates/home_meet.html',
          controller: 'HomeMeetCtrl'
        }
      }
    })

  .state('app.term', {
      url: '/term',
      views: {
        'menuContent': {
          templateUrl: 'templates/termofuse.html',
          controller: 'TermOfUseCtrl'
        }
      }
    })

    .state('app.typesmeet', {
      url: '/meet/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/types_meet.html',
          controller: 'TypesMeetCtrl'
        }
      }
    })

 .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    },
  authStatus: false
  })

 .state('app.logout', {
    url: '/logout',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LogoutCtrl'
      }
    },
  authStatus: false
  })

//--------------------------------------
.state('app.initial', {
      url: '/initial',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-signin.html',
          controller: 'HomeCtrl'
        }
      }
    })

.state('app.signup', {
      url: '/up',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-signup.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.profiles', {
      url: '/profiles',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'ProfilesCtrl'
        }
      }
    })

    .state('app.type', {
      url: '/type/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'TypeHomeCtrl'
        }
      }
    })

    .state('app.types', {
      url: '/type/:id/brand/:brand',
      views: {
        'menuContent': {
          templateUrl: 'templates/types.html',
          controller: 'TypesCtrl'
        }
      }
    })

    .state('app.dashboard', {
      url: '/seller',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashBoardCtrl'
        }
      }
    })
    
    .state('app.result', {
      url: '/type/:id/brand/:brand/size/:size',
      views: {
        'menuContent': {
          templateUrl: 'templates/result.html',
          controller: 'ResultCtrl'
        }
      }
    })

    .state('app.new', {
      url: '/company/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/new.html',
          controller: 'NewCompanyCtrl'
        }
      }
    }) 

    .state('app.signature', {
      url: '/company/signature',
      views: {
        'menuContent': {
          templateUrl: 'templates/signature.html',
          controller: 'SignatureCtrl'
        }
      }
    }) 

    .state('app.show', {
      url: '/type/:id/brand/:brand/size/:size/company/:company',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashBoardCtrl'
        }
      }
    })

    .state('app.location', {
      url: '/location',
      views: {
        'menuContent': {
          templateUrl: 'templates/location.html',
          controller: 'LocationCtrl'
        }
      }
    })

     .state('app.cupons', {
      url: '/cupons',
      views: {
        'menuContent': {
          templateUrl: 'templates/cupons.html',
          controller: 'CupomCtrl'
        }
      }
    })

     .state('app.newcupom', {
      url: '/new/cupom',
      views: {
        'menuContent': {
          templateUrl: 'templates/newcupons.html',
          controller: 'NewCupomCtrl'
        }
      }
    })

    .state('app.altercupom', {
      url: '/cupom/:cupomId',
      views: {
        'menuContent': {
          templateUrl: 'templates/altercupons.html',
          controller: 'AlterCupomCtrl'
        }
      }
    })

  .state('app.profile', {
    url: '/profile/:profileId',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'ProfileCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});