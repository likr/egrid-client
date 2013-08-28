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
  }
}
