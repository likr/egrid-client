module egrid.app {
  export class ProjectListController {
    public projects: model.Project[] = [];
    public itemsPerPage = 2;
    public currentPage = 1;
    public predicate = 'created_at';
    public reverse = false;

    constructor($q, $scope) {
      $q
        .when(model.Project.query())
        .then((projects : model.Project[]) => {
          this.projects = projects;
        });
    }
  }
}
