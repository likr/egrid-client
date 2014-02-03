module egrid.app {
  export class PaginationController {
    public itemsPerPage : number;
    public predicate : string;
    public currentPage : number = 1;
    public reverse : boolean = false;

    changeOrder(predicate : string) : void {
      if (predicate == this.predicate) {
        this.reverse = !this.reverse;
      } else {
        this.currentPage = 1;
        this.reverse = false;
        this.predicate = predicate;
      }
    }
  }
}
