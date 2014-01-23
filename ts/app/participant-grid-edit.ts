/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../core/egm.ts"/>
/// <reference path="../core/egm-ui.ts"/>
/// <reference path="../model/participant-grid.ts"/>
/// <reference path="../model/project-grid.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ParticipantGridEditController {
    projectKey : string;
    participantKey : string;
    egm : EGM;
    grid : model.ParticipantGrid;
    overallNodes : model.ProjectGridNodeData[];
    disableCompletion : boolean = false;

    constructor($q, $routeParams, $location, private $dialog, private $scope) {
      this.projectKey = $routeParams.projectId;
      this.participantKey = $routeParams.participantId;
      if ($routeParams.disableCompletion) {
        this.disableCompletion = true;
      }

      var egmui = egrid.egmui();
      this.egm = egmui.egm();
      this.egm.showRemoveLinkButton(true);
      this.egm.options().scalingConnection = false;
      this.egm.options().showGuide = true;
      var calcHeight = () => {
        return $(window).height() - 82; //XXX
      };
      d3.select("#display")
        .attr({
          width: $(window).width(),
          height: calcHeight(),
        })
        .call(this.egm.display($(window).width(), calcHeight()))
        ;
      d3.select(window)
        .on('resize', () => {
          var width = $(window).width();
          var height = calcHeight();
          d3.select("#display")
            .attr({
              width: width,
              height: height,
            })
            ;
          this.egm.resize(width, height);
        })
        ;

      d3.select("#appendNodeButton")
        .call(egmui.appendNodeButton()
          .onClick(callback => this.openInputTextDialog(callback))
        );
      d3.select("#undoButton")
        .call(egmui.undoButton()
            .onEnable(() => {
              d3.select("#undoButton").classed("disabled", false);
            })
            .onDisable(() => {
              d3.select("#undoButton").classed("disabled", true);
            }));
      d3.select("#redoButton")
        .call(egmui.redoButton()
            .onEnable(() => {
              d3.select("#redoButton").classed("disabled", false);
            })
            .onDisable(() => {
              d3.select("#redoButton").classed("disabled", true);
            }));
      d3.select("#saveButton")
        .call(egmui.saveButton()
            .save(data => {
              this.grid.nodes = data.nodes;
              this.grid.links = data.links;
              $q.when(this.grid.update())
                .then(() => {
                  $location.path(Url.participantUrl(this.projectKey, this.participantKey));
                })
                ;
            }));

      d3.select("#ladderUpButton")
        .call(egmui.radderUpButton()
            .onClick(callback => this.openInputTextDialog(callback))
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
      d3.select("#ladderDownButton")
        .call(egmui.radderDownButton()
            .onClick(callback =>this.openInputTextDialog(callback))
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
      d3.select("#removeNodeButton")
        .call(egmui.removeNodeButton()
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
      d3.select("#mergeNodeButton")
        .call(egmui.mergeNodeButton()
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
      d3.select("#editNodeButton")
        .call(egmui.editNodeButton()
            .onClick(callback => {
              var node = this.egm.selectedNode();
              this.openInputTextDialog(callback, node.text)
            })
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );

      $q.when(model.ParticipantGrid.get(this.projectKey, this.participantKey))
        .then((grid : model.ParticipantGrid) => {
          this.grid = grid;
          var nodes = grid.nodes.map(d => new Node(d.text, d.weight, d.original));
          var links = grid.links.map(d => new Link(nodes[d.source], nodes[d.target], d.weight));
          this.egm
            .nodes(nodes)
            .links(links)
            .draw()
            .focusCenter()
            ;
        })
        ;

      $q.when(model.ProjectGrid.get(this.projectKey))
        .then((grid : model.ProjectGrid) => {
          this.overallNodes = grid.nodes;
        })
        ;
    }

    private openInputTextDialog(callback, initialText : string = '') {
      var texts;
      if (this.disableCompletion) {
        texts = [];
      } else {
        var textsDict = {};
        texts = this.overallNodes.map(d => {
          var obj = {
            text: d.text,
            weight: d.weight,
          };
          d.participants.forEach(p => {
            if (p == this.participantKey) {
              obj.weight -= 1;
            }
          });
          textsDict[d.text] = obj;
          return obj;
        });
        this.egm.nodes().forEach(node => {
          if (textsDict[node.text]) {
            textsDict[node.text].weight += 1;
          } else {
            texts.push({
              text: node.text,
              weight: 1,
            });
          }
        });
        texts.sort((t1, t2) => t2.weight - t1.weight);
      }
      var d = this.$dialog.dialog({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/input-text-dialog.html',
        controller: ($scope, dialog) => {
          $scope.result = initialText;
          $scope.texts = texts;
          $scope.close = function(result) {
            dialog.close(result);
          }
        },
      });
      d.open().then(result => {
        callback(result);
      });
      this.$scope.$apply();
    }

    private showNodeController(selection) {
      if (!selection.empty()) {
        var nodeRect = selection.node().getBoundingClientRect();
        var controllerWidth = $("#nodeController").width();
        d3.select("#nodeController")
          .classed("invisible", false)
          .style("top", nodeRect.top + nodeRect.height + 10 - 82 + "px")
          .style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px")
          ;
      }
    }

    private hideNodeController() {
      d3.select("#nodeController")
        .classed("invisible", true);
    }

    private moveNodeController(selection) {
      var nodeRect = selection.node().getBoundingClientRect();
      var controllerWidth = $("#nodeController").width();
      d3.select("#nodeController")
        .style("top", nodeRect.top + nodeRect.height + 10 + "px")
        .style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px")
        ;
    }
  }
}
