/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class Dictionary<TValue> {
    private pairs = {};

    public add(k: string, v: TValue) {
      this.pairs[k] = v;
    }

    public toArray(): TValue[] {
      return Object.keys(this.pairs).map((v: string, i: number, ar: string[]) => {
        return this.pairs[v];
      });
    }
  }

  /**
  * @class Collection
  */
  export class Collection<T extends Entity> {
    private testest = new Dictionary<T>();
    private collection: T[] = [];

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public retrieve(type: new() => T): JQueryPromise<T[]> {
      var $deferred = $.Deferred();
      var entity = new type(); // 申し訳ない

      $.ajax({
          url: entity.url(),
          type: 'GET',
        })
        .then((result: string) => {
          var objects: any[] = JSON.parse(result);

          window.localStorage.setItem(Collection.pluralize(entity.getType()), result);

          return $deferred
            .resolve(objects
              .map((o: any) => {
                var i = new type();

                return i.deserialize(o);
              }));
        }, (...reasons: any[]) => {
          var objects = JSON.parse(window.localStorage.getItem(Collection.pluralize(entity.getType()))) || [];

          return $deferred
            .resolve(objects
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
      var entity = new type();
      var k = 'unsavedItems.' + Collection.pluralize(entity.getType());
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      $.when.apply($, Object
        .keys(unsavedItems)
        .map((value: any, index: number, ar: any[]) => {
          var item = new type();

          return item.deserialize(unsavedItems[value]).publish();
        }))
        .then((...items: T[]) => {
          window.localStorage.removeItem(k);

          return $deferred.resolve(items);
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }

    public getItem(n: string): T {
      return this.collection[n];
    }

    public addItem(item: T): void {
      this.testest.add(item.key, item);
    }

    public isDirty(type: new() => T): boolean {
      var entity = new type();
      var k = 'unsavedItems.' + Collection.pluralize(entity.getType());
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      return !!Object.keys(unsavedItems).length;
    }

    public toArray(): T[] {
      return this.testest.toArray();
    }

    public static pluralize(word: string): string {
      return word + 's';
    }
  }
}
