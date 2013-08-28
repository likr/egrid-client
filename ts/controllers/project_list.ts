module Controllers {
  export function ProjectListController($scope, $http, $templateCache, $location) {
    $http.get("/api/projects").success((data) => {
      $scope.projects = data;
    });
    $scope.newProject = {};
    $scope.createProject = function() {
      $http({
        method : 'PUT',
        url : '/api/projects',
        data : $scope.newProject
      }).success(function(data, status, headers, config) {
        var path = "/projects/" + data.key;
        $location.path(path);
      });
    };
  }
}
