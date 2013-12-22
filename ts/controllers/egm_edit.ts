/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>

module Controllers {
  interface Data {
    nodes : Egm.Node[];
    links : Egm.Link[];
  }


  export function EgmEditController($scope, $routeParams, $http, $location, $dialog) {
    var projectId = $scope.projectId = $routeParams.projectId;
    var participantId = $scope.participantId = $routeParams.participantId;
    var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";
    var overallJsonUrl = "/api/projects/" + projectId + "/grid";
    var overallTexts = [];

    var egm = new Egm.EgmUi;
    egm.showRemoveLinkButton(true);
    egm.options().scalingConnection = false;
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
        var textsDict = {};
        var texts = overallTexts.map(d => {
          var obj = {
            text: d.text,
            weight: d.weight,
          };
          d.participants.forEach(p => {
            if (p == participantId) {
              obj.weight -= 1;
            }
          });
          textsDict[d.text] = obj;
          return obj;
        });
        egm.nodes().forEach(node => {
          if (textsDict[node.text]) {
            textsDict[node.text].weight += 1;
          } else {
            texts.push({
              text: node.text,
              weight: 1,
            });
          }
        });
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
            d3.select("#undoButtonContainer").classed("disabled", false);
          })
          .onDisable(() => {
            d3.select("#undoButtonContainer").classed("disabled", true);
          }));
    d3.select("#redoButton")
      .call(egm.redoButton()
          .onEnable(() => {
            d3.select("#redoButtonContainer").classed("disabled", false);
          })
          .onDisable(() => {
            d3.select("#redoButtonContainer").classed("disabled", true);
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

    function moveNodeController(selection) {
      var nodeRect = selection.node().getBoundingClientRect();
      var controllerWidth = $("#nodeController").width();
      d3.select("#nodeController")
        .style("top", nodeRect.top + nodeRect.height + 10 + "px")
        .style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px")
        ;
    }

    d3.select("#ladderUpButton")
      .call(egm.radderUpButton()
          .onClick(openInputTextDialog)
          .onEnable(showNodeController)
          .onDisable(hideNodeController)
      );
    d3.select("#ladderDownButton")
      .call(egm.radderDownButton()
          .onClick(openInputTextDialog)
          .onEnable(showNodeController)
          .onDisable(hideNodeController)
      );
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
    d3.select("#editNodeButton")
      .call(egm.editNodeButton()
          .onClick(openInputTextDialog)
          .onEnable(showNodeController)
          .onDisable(hideNodeController)
      );

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


    $http.get(overallJsonUrl).success((data : Data) => {
      overallTexts = data.nodes;
    });
  }


  function InputTextDialogController($scope, dialog, texts) {
    texts.sort((t1, t2) => t2.weight - t1.weight);
    $scope.result = "";
    $scope.texts = texts;
    $scope.close = function(result) {
      dialog.close(result);
    }
  }
}
