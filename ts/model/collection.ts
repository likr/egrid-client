/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>

module egrid.model {
  /**
  * @class Collection
  */
  export class Collection<T extends EntityBase> {
    private collection: T;

    public static retrieve<T>(): JQueryPromise<T[]> {
      var $deferred = $.Deferred();

      $.ajax({
          url: this.url(),
          type: 'GET',
        })
        .then((items: T[]) => {
          window.localStorage.setItem('', JSON.stringify(items));

          return $deferred.resolve(items);
        }, () => {
          return $deferred.resolve(JSON.parse(window.localStorage.getItem('')).map(EntityBase.deserialize<T>()));
        });

      return $deferred.promise();
    }
  }
}
