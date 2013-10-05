/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>

module Controllers {
  export function ParticipantDetailController($scope, $routeParams, $http) {
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
          var nodes = data.nodes.map(d => new Egm.Node(d.text, d.weight, d.original));
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
}
