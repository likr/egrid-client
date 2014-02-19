/// <reference path="../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/angularLocalStorage/angularLocalStorage.d.ts"/>
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
  angular.module('collaboegm', ['paginator', 'ui.router', "ui.bootstrap", 'angularLocalStorage', "pascalprecht.translate"])
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
        .state('projects.get.analyses', {
          abstract: true,
          url: '/sem-projects',
        })
        .state('projects.get.analyses.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/analyses/analyses.html',
            },
          },
        })
        .state('projects.get.analyses.all.create', {
          url: '/create',
          views: {
            'content@projects.get.analyses.all': {
              templateUrl: '/partials/project/analyses/create.html',
            },
          },
        })
        .state('projects.get.analyses.all.list', {
          url: '/list',
          views: {
            'content@projects.get.analyses.all': {
              templateUrl: '/partials/project/analyses/list.html',
            },
          },
        })
        .state('projects.get.analyses.get', {
          abstract: true,
          url: '/:semProjectId',
          views: {
            '@': {
              controller: 'SemProjectController as semProject',
              templateUrl: '/partials/project/analyses/analysis/analysis.html',
            },
            'content@projects.get.analyses.get': {
              controller: 'SemProjectQuestionnaireEditController as questionnaire',
            },
          },
        })
        .state('projects.get.analyses.get.analysis', {
          url: '/analysis',
          views: {
            'content@projects.get.analyses.get': {
              templateUrl: '/partials/project/analyses/analysis/analyses.html',
            },
          },
        })
        .state('projects.get.analyses.get.design', {
          url: '/design',
          views: {
            'content@projects.get.analyses.get': {
              templateUrl: '/partials/project/analyses/analysis/design.html',
            },
          },
        })
        .state('projects.get.analyses.get.questionnaire', {
          url: '/questionnaire',
          views: {
            'content@projects.get.analyses.get': {
              templateUrl: '/partials/project/analyses/analysis/questionnaire.html',
            },
          },
        })
        .state('projects.get.collaborators', {
          abstract: true,
          url: '/collaborators',
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
              controller: 'ParticipantController as participant',
              templateUrl: '/partials/project/participants/participant/participant.html',
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
        .state("/help", {
          templateUrl: '/partials/help.html',
        })
        .state("/about", {
          templateUrl: '/partials/about.html',
        });

      // ほんとは $state.go にしたい
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
    .controller('CollaboratorCreateController', ['$q', '$stateParams', '$state', '$timeout', CollaboratorCreateController])
    .controller('CollaboratorListController', ['$q', '$stateParams', '$scope', '$modal', 'storage', CollaboratorListController])
    .controller('ParticipantController', ['$q', '$stateParams', '$scope', '$location', '$modal', 'storage', ParticipantController])
    .controller('ParticipantCreateController', ['$q', '$stateParams', '$state', ParticipantCreateController])
    .controller('ParticipantGridController', ['$q', '$stateParams', '$scope', ParticipantGridController])
    .controller('ParticipantGridEditController', ['$q', '$stateParams', '$location', '$modal', '$scope', ParticipantGridEditController])
    .controller('ParticipantListController', ['$q', '$stateParams', 'storage', ParticipantListController])
    .controller('ProjectController', ['$q', '$stateParams', '$location', '$scope', '$modal', 'storage', ProjectController])
    .controller('ProjectCreateController', ['$q', '$state', ProjectCreateController])
    .controller('ProjectGridController', ['$q', '$stateParams', '$modal', '$scope', ProjectGridController])
    .controller('ProjectListController', ['$q', '$scope', 'storage', ProjectListController])
    .controller('SemProjectController', ['$q', '$stateParams', 'storage', SemProjectController])
    .controller('SemProjectAnalysisController', ['$q', '$stateParams', SemProjectAnalysisController])
    .controller('SemProjectCreateController', ['$q', '$stateParams', '$state', '$timeout', SemProjectCreateController])
    .controller('SemProjectListController', ['$q', '$stateParams', 'storage', SemProjectListController])
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
