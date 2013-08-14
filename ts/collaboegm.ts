/// <reference path="libs/angularjs/angular.d.ts"/>
/// <reference path="libs/d3/d3.d.ts"/>
/// <reference path="egm.ts"/>

angular.module('collaboegm', ["ui.bootstrap"])
  .directive("egmApplicationView", function() {
    return {
      restrict: "EA",
      transclude: true,
      templateUrl: "/partials/base.html"
    };
  })
  .directive('focusMe', function($timeout) {
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
        controller : ProjectListController
      })
      .when("/projects/:projectId/grid", {
        templateUrl : "/partials/egm-show-all.html",
        controller : EgmShowAllController
      })
      .when("/projects/:projectId", {
        templateUrl : "/partials/project-detail.html",
        controller : ProjectDetailController
      })
      .when("/participants/:projectId/:participantId/grid", {
        templateUrl : "/partials/egm-show.html",
        controller : EgmShowController
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
  }])
;


function ProjectListController($scope, $http, $templateCache, $location) {
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


function ProjectDetailController($scope, $routeParams, $http, $location) {
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


function ParticipantDetailController($scope, $routeParams, $http) {
  var projectId = $scope.projectId = $routeParams.projectId;
  var participantId = $scope.participantId = $routeParams.participantId;
  var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";

  $http.get("/api/participants/" + projectId + "/" + participantId).success(data => {
    $scope.participant = data;
  });

  var gridTabInitialized = false;
  $scope.gridTabSelected = function() {
    if (!gridTabInitialized) {
      var width = 960 / 12 * 10;
      var height = 500;
      var egm = new Egm.EgmUi;

      d3.select("#display")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("border", "solid")
        .call(egm.display(width, height))
        ;

      $http.get(jsonUrl).success(data => {
        var nodes = data.nodes.map(d => new Egm.Node(d.text, d.weight));
        var links = data.links.map(d => new Egm.Link(nodes[d.source], nodes[d.target], d.weight));
        egm
          .nodes(nodes)
          .links(links)
          .draw()
          .focusCenter()
          ;
      });
      gridTabInitialized = true;
    }
  }
}


interface Data {
  nodes : Egm.Node[];
  links : Egm.Link[];
}


function EgmShowController($scope, $routeParams, $http, $location) {
  var projectId = $scope.projectId = $routeParams.projectId;
  var participantId = $scope.participantId = $routeParams.participantId;
  var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";

  var egm = new Egm.EgmUi;
  d3.select("#display")
    .call(egm.display())
    ;

  $http.get(jsonUrl).success((data : Data) => {
    var nodes = data.nodes.map(d => new Egm.Node(d.text, d.weight));
    var links = data.links.map(d => new Egm.Link(nodes[d.source], nodes[d.target], d.weight));
    egm
      .nodes(nodes)
      .links(links)
      .draw()
      .focusCenter()
      ;
  });
}


function EgmEditController($scope, $routeParams, $http, $location, $dialog) {
  var projectId = $scope.projectId = $routeParams.projectId;
  var participantId = $scope.participantId = $routeParams.participantId;
  var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";
  var overallJsonUrl = "/api/projects/" + projectId + "/grid";
  var overallTexts = [];

  var egm = new Egm.EgmUi;
  d3.select("#display")
    .call(egm.display())
    ;

  $scope.call = function(callback) {
    callback();
  };

  function callWithProxy(f) {
    $scope.callback = f;
    $("#ngClickProxy").trigger("click");
  }

  function openInputTextDialog(callback) {
    callWithProxy(() => {
      var texts = overallTexts.concat(egm.nodes().map(node => node.text));
      var d = $dialog.dialog({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/input-text-dialog.html',
        controller: InputTextDialogController,
        resolve: {texts: () => texts}
      });
      d.open().then(result => {
        callback(result);
      });
    });
  }

  d3.select("#appendNodeButton")
    .call(egm.appendNodeButton()
      .onClick(openInputTextDialog)
    );
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
        .save(json => {
          $http({
            method : 'PUT',
            url : jsonUrl,
            data : json
          }).success(function(data) {
            var path = "/participants/" + projectId + "/" + participantId;
            $location.path(path);
          });
        }));

  d3.select("#display .contents")
    .append("circle")
    .classed("invisible", true)
    .attr("id", "radderUpButton")
    .attr("r", 15)
    .call(egm.radderUpButton()
        .onClick(openInputTextDialog)
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
        .onClick(openInputTextDialog)
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

  $http.get(jsonUrl).success((data : Data) => {
    var nodes = data.nodes.map(d => new Egm.Node(d.text, d.weight));
    var links = data.links.map(d => new Egm.Link(nodes[d.source], nodes[d.target], d.weight));
    egm
      .nodes(nodes)
      .links(links)
      .draw()
      .focusCenter()
      ;
  });


  $http.get(overallJsonUrl).success((data : Data) => {
    data.nodes.forEach(d => {
      overallTexts.push(d.text);
    });
  });
}


function EgmShowAllController($scope, $routeParams, $http, $location) {
  var projectId = $scope.projectId = $routeParams.projectId;
  var participantId = $scope.participantId = $routeParams.participantId;
  var jsonUrl = "/api/projects/" + projectId + "/grid";

  var egm = new Egm.EgmUi;
  d3.select("#display")
    .call(egm.display())
    ;

  $http.get(jsonUrl).success((data : Data) => {
    console.log(data);
    var nodes = data.nodes.map(d => new Egm.Node(d.text, d.weight));
    var links = data.links.map(d => new Egm.Link(nodes[d.source], nodes[d.target], d.weight));
    egm
      .nodes(nodes)
      .links(links)
      .draw()
      .focusCenter()
      ;
  });
}


function InputTextDialogController($scope, dialog, texts) {
  texts.sort();
  texts = unique(texts);
  $scope.texts = texts;
  $scope.close = function(result) {
    dialog.close(result);
  }
}


function unique(array : any[]) : any[] {
  var result = [];
  if (array.length > 0) {
    result.push(array[0]);
    array.forEach(item => {
      if (item != result[result.length - 1]) {
        result.push(item);
      }
    });
  }
  return result;
}
