/// <reference path="../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../egrid/egm.ts"/>

module Controllers {
  interface Data {
    nodes : egrid.Node[];
    links : egrid.Link[];
  }


  export function EgmShowController($scope, $routeParams, $http, $location) {
    var projectId = $scope.projectId = $routeParams.projectId;
    var participantId = $scope.participantId = $routeParams.participantId;
    var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";

    var egm = new egrid.EGM;
    d3.select("#display")
      .call(egm.display())
      ;

    $http.get(jsonUrl).success(data => {
      var nodes = data.nodes.map(d => new egrid.Node(d.text, d.weight, d.original));
      var links = data.links.map(d => new egrid.Link(nodes[d.source], nodes[d.target], d.weight));
      egm
        .nodes(nodes)
        .links(links)
        .draw()
        .focusCenter()
        ;
    });
  }
}
