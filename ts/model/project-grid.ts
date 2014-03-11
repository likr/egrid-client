/// <reference path="../ts-definitions/Definitelytyped/jquery/jquery.d.ts"/>
/// <reference path="interfaces/ientity.ts"/>
/// <reference path="project-grid-node.ts"/>
/// <reference path="project-grid-link.ts"/>

module egrid.model {
  export interface ProjectGridData {
    projectKey : string;
    nodes? : ProjectGridNodeData[];
    links? : ProjectGridLinkData[];
    name? : string;
    note? : string;
  }


  interface ApiProjectGridData extends ProjectGridData {
    key : string;
    createdAt : string;
    updatedAt : string;
  }


  export class ProjectGrid implements ProjectGridData, interfaces.IEntity {
    private key_ : string;
    private createdAt_ : Date;
    private updatedAt_ : Date;
    name : string;
    note : string;
    projectKey : string;
    nodes : ProjectGridNodeData[];
    links : ProjectGridLinkData[];
    public static type : string = 'ProjectGrid';

    constructor(obj : ProjectGridData) {
      this.projectKey = obj.projectKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
      this.name = obj.name;
      this.note = obj.note;
    }

    get key() : string {
      return this.key_;
    }

    get createdAt() : Date {
      return this.createdAt_;
    }

    get updatedAt() : Date {
      return this.updatedAt_;
    }

    save() : JQueryXHR {
      if (this.key === undefined) {
        return $.ajax({
          url: ProjectGrid.url(this.projectKey),
          type: 'POST',
          currentType: 'application/json',
          data: JSON.stringify({
            name: this.name,
            note: this.note,
            projectKey: this.projectKey,
            nodes: this.nodes,
            links: this.links,
          }),
          dataFilter: data => {
            var obj : ApiProjectGridData = JSON.parse(data);
            return this.load(obj);
          },
        });
      } else {
        return $.ajax({
          url: this.url(),
          type: 'PUT',
          currentType: 'application/json',
          data: JSON.stringify({
            name: this.name,
            note: this.note,
            projectKey: this.projectKey,
            nodes: this.nodes,
            links: this.links,
          }),
          dataFilter: data => {
            var obj : ApiProjectGridData = JSON.parse(data);
            return this.load(obj);
          },
        });
      }
    }

    private url() : string {
      return ProjectGrid.url(this.projectKey, this.key);
    }

    private load(obj : ApiProjectGridData) : ProjectGrid {
      this.name = obj.name;
      this.note = obj.note;
      this.projectKey = obj.projectKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
      this.key_ = obj.key;
      this.createdAt_ = new Date(obj.createdAt);
      this.updatedAt_ = new Date(obj.updatedAt);
      return this;
    }

    static get(projectKey : string, projectGridId? : string) : JQueryPromise<ProjectGrid> {
      var key = projectGridId
        ? projectGridId
        : 'current';

      return egrid.storage.get<ProjectGrid>(ProjectGrid.type, projectKey, key).then((projectGrid: ProjectGrid) => {
          return new ProjectGrid(projectGrid);
        });
    }

    static query(projectKey : string) : JQueryPromise<ProjectGrid> {
      return egrid.storage.retrieve<ProjectGrid>(ProjectGrid.type, projectKey);
    }

    private static load(obj : ApiProjectGridData) : ProjectGrid {
      var projectGrid = new ProjectGrid({
        projectKey: obj.projectKey,
      });
      return projectGrid.load(obj);
    }

    private static url(projectKey : string, projectGridKey? : string) : string {
      if (projectGridKey) {
        return '/api/projects/' + projectKey + '/grid/' + projectGridKey;
      } else {
        return '/api/projects/' + projectKey + '/grid';
      }
    }
  }
}
