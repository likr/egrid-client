/// <reference path="../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egrid/egm.ts"/>
/// <reference path="controllers/egm_edit.ts"/>
/// <reference path="controllers/egm_show.ts"/>
/// <reference path="controllers/egm_show_all.ts"/>
/// <reference path="controllers/participant_detail.ts"/>
/// <reference path="controllers/project_detail.ts"/>
/// <reference path="controllers/project_list.ts"/>
/// <reference path="controllers/sem_project_detail.ts"/>

angular.module('collaboegm', ["ui.bootstrap", "pascalprecht.translate"])
  .directive("egmApplicationView", function() {
    return {
      restrict: "EA",
      transclude: true,
      templateUrl: "/partials/base.html"
    };
  })
  .directive('focusMe', (...params : any[]) : ng.IDirective => {
    var $timeout = params[0];
    return {
       link: function (scope, element, attrs, model) {
          $timeout(function () {
            element[0].focus();
          });
        }
    };
  })
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when("/projects", {
        templateUrl : "/partials/project-list.html",
        controller : Controllers.ProjectListController
      })
      .when("/projects/:projectId/grid", {
        templateUrl : "/partials/egm-show-all.html",
        controller : Controllers.EgmShowAllController
      })
      .when("/projects/:projectId", {
        templateUrl : "/partials/project-detail.html",
        controller : Controllers.ProjectDetailController
      })
      .when("/participants/:projectId/:participantId/grid", {
        templateUrl : "/partials/egm-show.html",
        controller : Controllers.EgmShowController
      })
      .when("/participants/:projectId/:participantId/edit", {
        templateUrl : "/partials/egm-edit.html",
        controller : Controllers.EgmEditController
      })
      .when("/participants/:projectId/:participantId", {
        templateUrl : "/partials/participant-detail.html",
        controller : Controllers.ParticipantDetailController
      })
      .when("/sem-projects/:projectId/:semProjectId", {
        templateUrl : "/partials/sem-project-detail.html",
        controller : Controllers.SemProjectDetailController,
      })
      .when("/help", {
        templateUrl: "/partials/help.html",
      })
      .when("/about", {
        templateUrl: "/partials/about.html",
      })
      .otherwise({
        redirectTo : "/projects"
      });
  }])
  .config(["$translateProvider", function ($translateProvider) {
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'locations/',
        suffix: '.json'
      })
      .fallbackLanguage("en")
      .preferredLanguage("ja");
  }])
  .run(['$rootScope', '$translate', '$http', function($rootScope, $translate, $http) {
    $rootScope.changeLanguage = function(langKey) {
      $translate.uses(langKey);
      $http({
        method: "POST",
        url: '/api/users',
        data: {
          location: langKey,
        },
      });
    };

    $http.get("/api/users").success(user => {
      $rootScope.user = user;
      $translate.uses(user.location);
    });

    var dest_url = "/";
    $http.get("/api/users/logout?dest_url=" + encodeURIComponent(dest_url)).success(data => {
      $rootScope.logoutUrl = data.logout_url;
    });
  }])
  ;
