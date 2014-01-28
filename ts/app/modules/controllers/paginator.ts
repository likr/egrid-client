/// <reference path="../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../model/project.ts"/>

module egrid.app.modules.paginator.controllers {
  export class PaginatorController {
    private processedItems: Object[] = [];
    private items: Object[] = [];
    private currentPage: number = 1;
    private reverse: boolean = true;
    private predicate: string = 'created_at';
    private size: number = 0;
    private itemsPerPage: number = 2;
    private paginatedItems: Object[][] = [];
    private query: string;

    constructor(private $q, private $scope, private $filter: ng.IFilterService) {
      this.$q
        .when(model.Project.query())
        .then((items : Object[]) => {
          this.processedItems = this.items = items;

          this.render();
        });
    }

    public render() {
      this.processedItems = this.$filter('orderBy')(this.processedItems, this.predicate, this.reverse);

      this.paginatedItems = [];
      this.size = this.processedItems.length;

      for (var i = 0, l = this.processedItems.length; i < l; i++) {
        if ((i % this.itemsPerPage) === 0) {
          this.paginatedItems[Math.floor(i / this.itemsPerPage) + 1] = [ this.processedItems[i] ];
        } else {
          this.paginatedItems[Math.floor(i / this.itemsPerPage) + 1].push(this.processedItems[i]);
        }
      }
    }

    public search() {
      this.processedItems = this.$filter('filter')(this.items, (item: any) => {
        if (!this.query) return true;

        return item.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1;
      });

      this.render();
    }

    public setPage(page: number) {
      this.currentPage = page;
    }
  }
}
