/// <reference path="../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>

module Controllers {
  interface Data {
    nodes : Egm.Node[];
    links : Egm.Link[];
  }


  export function EgmShowAllController($scope, $routeParams, $http, $location, $dialog) {
    var data;
    var participants;
    var projectId = $scope.projectId = $routeParams.projectId;
    var participantsUrl = "/api/participants/" + projectId;
    var jsonUrl = "/api/projects/" + projectId + "/grid";
    var filter = {};

    $scope.call = function(callback) {
      callback();
    };

    function callWithProxy(f) {
      $scope.callback = f;
      $("#ngClickProxy").trigger("click");
    }

    var egm = new Egm.EgmUi;
    d3.select("#display")
      .call(egm.display())
      ;

    function showNodeController(selection) {
      if (!selection.empty()) {
        var nodeRect = selection.node().getBoundingClientRect();
        var controllerWidth = $("#nodeController").width();
        d3.select("#nodeController")
          .classed("invisible", false)
          .style("top", nodeRect.top + nodeRect.height + 10 + "px")
          .style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px")
          ;
      }
    }

    function hideNodeController() {
      d3.select("#nodeController")
        .classed("invisible", true);
    }

    d3.select("#removeNodeButton")
      .call(egm.removeNodeButton()
          .onEnable(showNodeController)
          .onDisable(hideNodeController)
      );
    d3.select("#mergeNodeButton")
      .call(egm.mergeNodeButton()
          .onEnable(showNodeController)
          .onDisable(hideNodeController)
      );

    d3.select("#filterButton")
      .on("click", () => {
        callWithProxy(() => {
          var node = egm.selectedNode();
          participants.forEach(participant => {
            if (node) {
              participant.active = node.participants.indexOf(participant.key) >= 0;
            } else {
              participant.active = false;
            }
          });
          var d = $dialog.dialog({
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: '/partials/filter-participants-dialog.html',
            controller: FilterParticipantsDialogController,
            resolve: {
              participants : () => participants,
              filter : () => filter
            }
          });
          d.open().then(result => {
            egm.nodes().forEach(d => {
              d.active = d.participants.some(key => result[key]);
            });
            egm
              .draw()
              .focusCenter()
              ;
          });
        });
      });

    d3.select("#layoutButton")
      .on("click", () => {
        callWithProxy(() => {
          var d = $dialog.dialog({
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: '/partials/setting-dialog.html',
            controller: SettingDialogController,
            resolve: {options : () => egm.options()}
          });
          d.open().then(() => {
            egm.draw();
          });
        });
      });

    $http.get(jsonUrl).success((data_ : Data) => {
      data = data_
      var nodes = data.nodes.map(d => new Egm.Node(d.text, d.weight, d.original, d.participants));
      var links = data.links.map(d => new Egm.Link(nodes[d.source], nodes[d.target], d.weight));
      egm
        .nodes(nodes)
        .links(links)
        .draw()
        .focusCenter()
        ;
    });

    $http.get(participantsUrl).success(participants_ => {
      participants = participants_;
      participants.forEach(participant => {
        participant.active = false;
        filter[participant.key] = true;
      });
    });
  }


  function FilterParticipantsDialogController($scope, dialog, participants, filter) {
    $scope.results = filter;
    $scope.participants = participants;
    $scope.close = () => {
      dialog.close($scope.results);
    };
  }


  function SettingDialogController($scope, dialog, options) {
    $scope.options = options;
    $scope.ViewMode = Egm.ViewMode;
    $scope.InactiveNode = Egm.InactiveNode;
    $scope.close = () => {
      dialog.close();
    }
  }
}
