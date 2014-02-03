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
  angular.module('collaboegm', ['paginator', 'ui.router', "ui.bootstrap", "pascalprecht.translate"])
    .directive('focusMe', ['$timeout', function($timeout) {
      return {
         link: function (scope, element, attrs, model) {
            $timeout(function () {
              element[0].focus();
            });
          }
      };
    }])
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('project', {
          url: Url.projectUrlBase,
          controller: 'ProjectController as project',
          templateUrl: '/partials/project-detail.html',
        })
        .state('details', {
          parent: 'project',
          url: '/details',
          template: 'Test1',
        })
        .state('grid', {
          url: Url.projectGridUrlBase,
          controller: 'ProjectGridController as projectGrid',
          templateUrl: '/partials/egm-show-all.html',
        })
        .state('gridedit', {
          url: Url.participantGridUrlBase,
          controller: 'ParticipantGridEditController as participantGrid',
          templateUrl: '/partials/egm-edit.html',
        })
        .state('sem', {
          url: Url.semProjectUrlBase,
          controller: 'SemProjectController as semProject',
          templateUrl: '/partials/sem-project-detail.html',
        })
        .state('projects', {
          url: Url.projectListUrlBase,
          templateUrl: '/partials/project-list.html',
        })
        .state("/help", {
          templateUrl: '/partials/help.html',
        })
        .state("/about", {
          templateUrl: '/partials/about.html',
        });
      //$urlRouterProvider
      //  .otherwise(Url.projectListUrlBase);
    }])
    .filter('count', () => {
      return (input : any[]) => input.length;
    })
    .config(["$translateProvider", $translateProvider => {
      $translateProvider
        .useStaticFilesLoader({
          prefix: 'locations/',
          suffix: '.json'
        })
        .fallbackLanguage("en")
        .preferredLanguage("ja");
    }])
    .controller('CollaboratorCreateController', ['$q', '$stateParams', '$location', CollaboratorCreateController])
    .controller('CollaboratorListController', ['$q', '$stateParams', '$scope', '$modal', CollaboratorListController])
    .controller('ParticipantController', ['$q', '$stateParams', '$scope', '$location', '$modal', ParticipantController])
    .controller('ParticipantCreateController', ['$q', '$stateParams', '$location', ParticipantCreateController])
    .controller('ParticipantGridController', ['$q', '$stateParams', '$scope', ParticipantGridController])
    .controller('ParticipantGridEditController', ['$q', '$stateParams', '$location', '$modal', '$scope', ParticipantGridEditController])
    .controller('ParticipantListController', ['$q', '$stateParams', ParticipantListController])
    .controller('ProjectController', ['$q', '$stateParams', '$location', '$scope', '$modal', ProjectController])
    .controller('ProjectCreateController', ['$q', '$location', ProjectCreateController])
    .controller('ProjectGridController', ['$q', '$stateParams', '$modal', '$scope', ProjectGridController])
    .controller('ProjectListController', ['$q', ProjectListController])
    .controller('SemProjectController', ['$q', '$stateParams', SemProjectController])
    .controller('SemProjectAnalysisController', ['$q', '$stateParams', SemProjectAnalysisController])
    .controller('SemProjectCreateController', ['$q', '$stateParams', '$location', SemProjectCreateController])
    .controller('SemProjectListController', ['$q', '$stateParams', SemProjectListController])
    .controller('SemProjectQuestionnaireEditController', ['$q', '$stateParams', SemProjectQuestionnaireEditController])
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
