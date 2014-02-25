/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  /**
  * @class Collection
  */
  export class Collection<T extends Entity> {
    private collection: T[] = [];

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   Y     Entity  戻り値
     * @param   type  Y       モデルのコンストラクタ (TypeScript の制限より)
     */
    public retrieve(type: new() => T): JQueryPromise<T[]> {
      var $deferred = $.Deferred();
      var entity = new type(); // 申し訳ない

      $.ajax({
          url: entity.getUri(),
          type: 'GET',
        })
        .then((result: string) => {
          var items: any[] = JSON.parse(result);

          window.localStorage.setItem(entity.getType(), JSON.stringify(items));

          return $deferred.resolve(items.map((item: any) => {
              var i = new type();

              return i.deserialize(item);
            }));
        }, (...reasons: any[]) => {
          return $deferred
            .resolve(JSON.parse(window.localStorage.getItem('projects'))
              .map((o: any) => {
                var i = new type();

                return i.deserialize(o);
              }));
        });

      return $deferred.promise();
    }

    /**
     * this.collection に対し Entity.publish() を呼び出します。
     */
    public flush(type: new() => T): JQueryPromise<T[]> {
      var $deferred = $.Deferred();
      var unsavedItems: any[];

      $.when.apply($, unsavedItems
        .map((o: any) => {
          var item = new type();

          return item.deserialize(o).publish();
        }))
        .then((...items: T[]) => {
          window.localStorage.removeItem('queues');

          return $deferred.resolve(items);
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }

    public getItem(n: number): T {
      return this.collection[n];
    }

    public setItem(item: T): void {
      this.collection.push(item);
    }

    public toArray(): T[] {
      return this.collection;
    }
  }
}
