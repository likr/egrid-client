angular.module('collaboegm', []).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when("/projects", {
            templateUrl: "/partials/project-list.html",
            controller: ProjectListController
        }).when("/projects/:projectId", {
            templateUrl: "/partials/project-detail.html",
            controller: ProjectDetailController
        }).when("/participants/:projectId/:participantId", {
            templateUrl: "/partials/participant-detail.html",
            controller: ParticipantDetailController
        }).otherwise({
            redirectTo: "/projects"
        });
    }
]);

function ProjectListController($scope, $http, $templateCache) {
    $http.get("/api/projects").success(function (data) {
        $scope.projects = data;
    });
    $scope.newProject = {};
    $scope.createProject = function () {
        $http({
            method: 'PUT',
            url: '/api/projects',
            data: $scope.newProject
        }).success(function (data, status, headers, config) {
            $scope.projects.push(data);
            $scope.newProject = {};
        });
    };
}

function ProjectDetailController($scope, $routeParams, $http) {
    var projectId = $routeParams.projectId;
    $scope.projectId = projectId;
    $http.get("/api/projects/" + projectId).success(function (data) {
        $scope.project = data;
    });
    $http.get("/api/participants/" + projectId).success(function (data) {
        $scope.participants = data;
    });
    $scope.newParticipant = {};
    $scope.createParticipant = function () {
        $http({
            method: 'PUT',
            url: '/api/participants/' + projectId,
            data: $scope.newParticipant
        }).success(function (data) {
            $scope.participants.push(data);
            $scope.newParticipant = {};
        });
    };
}

function ParticipantDetailController($scope, $routeParams, $http) {
    var projectId = $routeParams.projectId;
    var participantId = $routeParams.participantId;
    $http.get("/api/participants/" + projectId + "/" + participantId).success(function (data) {
        $scope.participant = data;
    });
}
