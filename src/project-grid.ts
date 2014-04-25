/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="project-grid-node.ts"/>
/// <reference path="project-grid-link.ts"/>
/// <reference path="storage.ts"/>

module egrid.model {
  export interface ProjectGridData {
    projectKey : string;
    nodes? : ProjectGridNodeData[];
    links? : ProjectGridLinkData[];
    name? : string;
    note? : string;
  }


  interface ApiProjectGridData extends ProjectGridData, SerializedData {
    key : string;
    createdAt : string;
    updatedAt : string;
  }


  export class ProjectGrid extends Entity implements ProjectGridData {
    name : string;
    note : string;
    projectKey : string;
    nodes : ProjectGridNodeData[];
    links : ProjectGridLinkData[];
    public static type : string = 'ProjectGrid';

    constructor(obj : ProjectGridData) {
      super();

      this.projectKey = obj.projectKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
      this.name = obj.name;
      this.note = obj.note;
    }

    save() : JQueryPromise<void> {
      return storage.add<ProjectGrid>(this, ProjectGrid.type, this.projectKey, this.key);
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
      (<any>this).key_ = obj.key;
      (<any>this).createdAt_ = new Date(obj.createdAt);
      (<any>this).updatedAt_ = new Date(obj.updatedAt);
      return this;
    }

    static get(projectKey : string, projectGridId? : string) : JQueryPromise<ProjectGrid> {
      var key = projectGridId
        ? projectGridId
        : 'current';

      return storage.get<ProjectGrid>(ProjectGrid.type, projectKey, key).then((projectGrid: ApiProjectGridData) => {
          return ProjectGrid.load(projectGrid);
        });
    }

    static query(projectKey : string) : JQueryPromise<ProjectGrid> {
      return storage.retrieve<ProjectGrid>(ProjectGrid.type, projectKey);
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
