module Controllers {
  export function ProjectDetailController($scope, $routeParams, $http, $location) {
    var projectId = $routeParams.projectId;
    $scope.projectId = projectId;
    $http.get("/api/projects/" + projectId).success(data => {
      $scope.project = data;
    });
    $http.get("/api/participants/" + projectId).success(data => {
      $scope.participants = data;
    });
    $http.get("/api/collaborators/" + projectId).success(data => {
      $scope.collaborators = data;
    });

    $scope.newParticipant = {};
    $scope.createParticipant = function() {
      $http({
        method : 'PUT',
        url : '/api/participants/' + projectId,
        data : $scope.newParticipant
      }).success(function(data) {
        var path = "/participants/" + projectId + "/" + data.key;
        $location.path(path);
      });
    };

    $scope.newCollaborator = {};
    $scope.createCollaborator = function() {
      $http({
        method: 'PUT',
        url: '/api/collaborators/' + projectId,
        data: $scope.newCollaborator,
      }).success(data => {
        $scope.collaborators.push(data);
        $scope.newCollaborator = {};
      });
    };
  }
}
