/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectListController {
    list : model.Project[];
    predicate : string = 'name';

    constructor($q) {
      $q.when(model.Project.query())
        .then((projects : model.Project[]) => {
          this.list = projects;
        })
        ;
    }
  }
}
