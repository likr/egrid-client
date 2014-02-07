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
        .state('projects', {
          abstract: true,
        })
        .state('projects.all', {
          abstract: true,
          url: Url.projectListUrlBase + '/all',
          views: {
            '@': {
              templateUrl: '/partials/projects/projects.html',
            },
          },
        })
        .state('projects.all.create', {
          url: '/create',
          views: {
            'content@projects.all': {
              controller: 'ProjectCreateController as newProject',
              templateUrl: '/partials/projects/create.html',
            },
          },
        })
        .state('projects.all.list', {
          url: '/list',
          views: {
            'content@projects.all': {
              controller: 'ProjectListController as ctrl',
              templateUrl: '/partials/projects/list.html',
            },
          },
        })
        .state('projects.get', {
          abstract: true,
          url: Url.projectUrlBase,
          views: {
            '@': {
              controller: 'ProjectController as project',
              templateUrl: '/partials/project/project.html',
            },
          },
        })
        .state('projects.get.analysis', {
          abstract: true,
          url: '/analysis',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/analysis/analysis.html',
            },
          },
        })
        .state('projects.get.analysis.create', {
          url: '/create',
          views: {
            'content@projects.get.analysis': {
              templateUrl: '/partials/project/analysis/create.html',
            },
          },
        })
        .state('projects.get.analysis.list', {
          url: '/list',
          views: {
            'content@projects.get.analysis': {
              templateUrl: '/partials/project/analysis/list.html',
            },
          },
        })
        .state('projects.get.collaborators', {
          abstract: true,
          url: '/collaborators',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/collaborators/collaborators.html',
            },
          },
        })
        .state('projects.get.collaborators.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/collaborators/collaborators.html',
            },
          },
        })
        .state('projects.get.collaborators.all.create', {
          url: '/create',
          views: {
            'c@projects.get.collaborators.all': {
              controller: 'CollaboratorCreateController as newCollaborator',
              templateUrl: '/partials/project/collaborators/create.html',
            },
          },
        })
        .state('projects.get.collaborators.all.list', {
          url: '/list',
          views: {
            'c@projects.get.collaborators.all': {
              controller: 'CollaboratorListController as collaborators',
              templateUrl: '/partials/project/collaborators/list.html',
            },
          },
        })
        .state('projects.get.detail', {
          url: '/detail',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/detail.html',
            },
          },
        })
        .state('projects.get.evaluation', {
          url: '/evaluation',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/evaluation.html',
            },
          },
        })
        .state('projects.get.participants', {
          abstract: true,
          url: '/participants',
        })
        .state('projects.get.participants.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/participants/participants.html',
            },
          },
        })
        .state('projects.get.participants.all.create', {
          url: '/create',
          views: {
            'content@projects.get.participants.all': {
              controller: 'ParticipantCreateController as newParticipant',
              templateUrl: '/partials/project/participants/create.html',
            },
          },
        })
        .state('projects.get.participants.all.list', {
          url: '/list',
          views: {
            'content@projects.get.participants.all': {
              controller: 'ParticipantListController as ctrl',
              templateUrl: '/partials/project/participants/list.html',
            },
          },
        })
        .state('projects.get.participants.get', {
          abstract: true,
          url: '/:participantId',
          views: {
            '@': {
              templateUrl: '/partials/project/participants/participant/participant.html',
              controller: 'ParticipantController as participant',
            },
          },
        })
        .state('projects.get.participants.get.detail', {
          url: '/detail',
          views: {
            'content@projects.get.participants.get': {
              templateUrl: '/partials/project/participants/participant/detail.html',
            },
          },
        })
        .state('projects.get.participants.get.evaluation', {
          url: '/evaluation',
          views: {
            'content@projects.get.participants.get': {
              templateUrl: '/partials/project/participants/participant/evaluation.html',
            },
          },
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
        .state("/help", {
          templateUrl: '/partials/help.html',
        })
        .state("/about", {
          templateUrl: '/partials/about.html',
        });
      $urlRouterProvider
        .otherwise(Url.projectListUrlBase + '/all/list');
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
