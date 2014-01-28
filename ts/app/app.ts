/// <reference path="../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="modules/app.ts"/>
/// <reference path="collaborator-create.ts"/>
/// <reference path="collaborator-list.ts"/>
/// <reference path="participant.ts"/>
/// <reference path="participant-create.ts"/>
/// <reference path="participant-grid.ts"/>
/// <reference path="participant-grid-edit.ts"/>
/// <reference path="participant-list.ts"/>
/// <reference path="project.ts"/>
/// <reference path="project-create.ts"/>
/// <reference path="project-grid.ts"/>
/// <reference path="project-list.ts"/>
/// <reference path="sem-project.ts"/>
/// <reference path="sem-project-analysis.ts"/>
/// <reference path="sem-project-create.ts"/>
/// <reference path="sem-project-questionnaire-edit.ts"/>
/// <reference path="sem-project-list.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  angular.module('collaboegm', ['paginator', 'ngRoute', "ui.bootstrap", "pascalprecht.translate"])
    .directive('focusMe', ['$timeout', function($timeout) {
      return {
         link: function (scope, element, attrs, model) {
            $timeout(function () {
              element[0].focus();
            });
          }
      };
    }])
    .config(['$routeProvider', $routeProvider => {
      $routeProvider
        .when(Url.projectGridUrlBase, {
          controller: 'ProjectGridController',
          controllerAs: 'projectGrid',
          templateUrl: '/partials/egm-show-all.html',
        })
        .when(Url.participantGridUrlBase, {
          controller: 'ParticipantGridEditController',
          controllerAs: 'participantGrid',
          templateUrl: '/partials/egm-edit.html',
        })
        .when(Url.participantUrlBase, {
          controller: 'ParticipantController',
          controllerAs: 'participant',
          templateUrl: '/partials/participant-detail.html',
        })
        .when(Url.semProjectUrlBase, {
          controller: 'SemProjectController',
          controllerAs: 'semProject',
          templateUrl: '/partials/sem-project-detail.html',
        })
        .when(Url.projectUrlBase, {
          controller: 'ProjectController',
          controllerAs: 'project',
          templateUrl: '/partials/project-detail.html',
        })
        .when(Url.projectListUrlBase, {
          templateUrl: '/partials/project-list.html',
        })
        .when("/help", {
          templateUrl: '/partials/help.html',
        })
        .when("/about", {
          templateUrl: '/partials/about.html',
        })
        .otherwise({
          redirectTo : Url.projectListUrl(),
        });
    }])
    .config(["$translateProvider", $translateProvider => {
      $translateProvider
        .useStaticFilesLoader({
          prefix: 'locations/',
          suffix: '.json'
        })
        .fallbackLanguage("en")
        .preferredLanguage("ja");
    }])
    .controller('CollaboratorCreateController', ['$q', '$routeParams', '$location', CollaboratorCreateController])
    .controller('CollaboratorListController', ['$q', '$routeParams', CollaboratorListController])
    .controller('ParticipantController', ['$q', '$routeParams', ParticipantController])
    .controller('ParticipantCreateController', ['$q', '$routeParams', '$location', ParticipantCreateController])
    .controller('ParticipantGridController', ['$q', '$routeParams', '$scope', ParticipantGridController])
    .controller('ParticipantGridEditController', ['$q', '$routeParams', '$location', '$modal', '$scope', ParticipantGridEditController])
    .controller('ParticipantListController', ['$q', '$routeParams', ParticipantListController])
    .controller('ProjectController', ['$q', '$routeParams', ProjectController])
    .controller('ProjectCreateController', ['$q', '$location', ProjectCreateController])
    .controller('ProjectGridController', ['$q', '$routeParams', '$modal', '$scope', ProjectGridController])
    .controller('ProjectListController', ['$q', '$scope', ProjectListController])
    .controller('SemProjectController', ['$q', '$routeParams', SemProjectController])
    .controller('SemProjectAnalysisController', ['$q', '$routeParams', SemProjectAnalysisController])
    .controller('SemProjectCreateController', ['$q', '$routeParams', '$location', SemProjectCreateController])
    .controller('SemProjectListController', ['$q', '$routeParams', SemProjectListController])
    .controller('SemProjectQuestionnaireEditController', ['$q', '$routeParams', SemProjectQuestionnaireEditController])
    .run(['$rootScope', '$translate', '$http', ($rootScope, $translate, $http) => {
      $rootScope.Url = Url;

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
}
