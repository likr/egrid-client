/// <reference path="../ts-definitions/Definitelytyped/jquery/jquery.d.ts"/>
/// <reference path="project-grid-node.ts"/>
/// <reference path="project-grid-link.ts"/>

module egrid.model {
  export interface ProjectGridData {
    projectKey : string;
    nodes : ProjectGridNodeData[];
    links : ProjectGridLinkData[];
  }


  export class ProjectGrid implements ProjectGridData {
    projectKey : string;
    nodes : ProjectGridNodeData[];
    links : ProjectGridLinkData[];

    constructor(obj : ProjectGridData) {
      this.projectKey = obj.projectKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
    }

    static get(projectKey : string) : JQueryXHR {
      return $.ajax({
        url: ProjectGrid.url(projectKey),
        type: 'GET',
        dataFilter: data => {
          var obj : ProjectGridData = JSON.parse(data);
          return new ProjectGrid(obj);
        },
      });
    }

    private static url(projectKey : string) : string {
      return '/api/projects/' + projectKey + '/grid';
    }
  }
}
