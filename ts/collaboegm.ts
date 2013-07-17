/// <reference path="libs/angularjs/angular.d.ts"/>
/// <reference path="libs/d3/d3.d.ts"/>
/// <reference path="egm.ts"/>

angular.module('collaboegm', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when("/projects", {
        templateUrl : "/partials/project-list.html",
        controller : ProjectListController
      })
      .when("/projects/:projectId", {
        templateUrl : "/partials/project-detail.html",
        controller : ProjectDetailController
      })
      .when("/participants/:projectId/:participantId/edit", {
        templateUrl : "/partials/egm-edit.html",
        controller : EgmEditController
      })
      .when("/participants/:projectId/:participantId", {
        templateUrl : "/partials/participant-detail.html",
        controller : ParticipantDetailController
      })
      .otherwise({
        redirectTo : "/projects"
      });
  }]);


function ProjectListController($scope, $http, $templateCache) {
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
      $scope.projects.push(data);
      $scope.newProject = {};
    });
  };
}


function ProjectDetailController($scope, $routeParams, $http) {
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
      $scope.participants.push(data);
      $scope.newParticipant = {};
    });
  };
}


function ParticipantDetailController($scope, $routeParams, $http) {
  var projectId = $scope.projectId = $routeParams.projectId;
  var participantId = $scope.participantId = $routeParams.participantId;
  $http.get("/api/participants/" + projectId + "/" + participantId).success(data => {
    $scope.participant = data;
  });
}


interface Data {
  nodes : Egm.Node[];
  links : Egm.Link[];
}


function EgmEditController($scope, $routeParams, $http) {
  var egm = new Egm.EgmUi;
  d3.select("#display")
    .call(egm.display())
    ;
  d3.select("#appendNodeButton").call(egm.appendNodeButton());
  d3.select("#undoButton")
    .call(egm.undoButton()
        .onEnable(() => {
          d3.select("#undoButton").node().disabled = false;
        })
        .onDisable(() => {
          d3.select("#undoButton").node().disabled = true;
        }));
  d3.select("#redoButton")
    .call(egm.redoButton()
        .onEnable(() => {
          d3.select("#redoButton").node().disabled = false;
        })
        .onDisable(() => {
          d3.select("#redoButton").node().disabled = true;
        }));
  d3.select("#saveButton")
    .call(egm.saveButton()
        .save(jsonString => {
        }));

  d3.select("#display .contents")
    .append("circle")
    .classed("invisible", true)
    .attr("id", "radderUpButton")
    .attr("r", 15)
    .call(egm.radderUpButton()
        .onEnable(selection => {
          var node = selection.datum();
          d3.select("#radderUpButton")
            .classed("invisible", false)
            .attr("transform", new Svg.Transform.Translate(
                node.left().x,
                node.left().y))
            ;
        })
        .onDisable(() => {
          d3.select("#radderUpButton").classed("invisible", true);
        }));
  d3.select("#display .contents")
    .append("circle")
    .classed("invisible", true)
    .attr("id", "radderDownButton")
    .attr("r", 15)
    .call(egm.radderDownButton()
        .onEnable(selection => {
          var node = selection.datum();
          d3.select("#radderDownButton")
            .classed("invisible", false)
            .attr("transform", new Svg.Transform.Translate(
                node.right().x,
                node.right().y))
            ;
        })
        .onDisable(() => {
          d3.select("#radderDownButton").classed("invisible", true);
        }));
  d3.select("#display .contents")
    .append("circle")
    .classed("invisible", true)
    .attr("id", "removeNodeButton")
    .attr("r", 15)
    .call(egm.removeNodeButton()
        .onEnable(selection => {
          var node = selection.datum();
          d3.select("#removeNodeButton")
            .classed("invisible", false)
            .attr("transform", new Svg.Transform.Translate(
                node.bottom().x,
                node.bottom().y))
            ;
        })
        .onDisable(() => {
          d3.select("#removeNodeButton").classed("invisible", true);
        }));
  d3.select("#display .contents")
    .append("circle")
    .classed("invisible", true)
    .attr("id", "mergeNodeButton")
    .attr("r", 15)
    .call(egm.mergeNodeButton()
        .onEnable(selection => {
          var node = selection.datum();
          d3.select("#mergeNodeButton")
            .classed("invisible", false)
            .attr("transform", new Svg.Transform.Translate(
                node.top().x,
                node.top().y))
            ;
        })
        .onDisable(() => {
          d3.select("#mergeNodeButton").classed("invisible", true);
        }));

  var projectId = $scope.projectId = $routeParams.projectId;
  var participantId = $scope.participantId = $routeParams.participantId;
  var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";
  $http.get(jsonUrl).success((data : Data) => {
    egm
      .nodes(data.nodes)
      .links(data.links)
      .draw()
      ;
  });
}
