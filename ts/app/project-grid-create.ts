/// <reference path="../model/project-grid.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ProjectGridCreateController {
    projectKey : string;
    data : model.ProjectGrid;

    constructor(private $q, $routeParams, private $location) {
      this.projectKey = $routeParams.projectId;

      this.data = new model.ProjectGrid({
        projectKey: this.projectKey
      });
    }

    submit() {
      this.$q.when(this.data.save())
        .then((grid : model.ProjectGrid) => {
          this.$location.path(Url.projectGridUrl(grid));
        })
        ;
    }
  }
}
