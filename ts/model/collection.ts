/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class Dictionary<TValue> {
    private pairs = {};

    public getItem(k: string) {
      return this.pairs[k];
    }

    public setItem(k: string, v: TValue) {
      this.pairs[k] = v;
    }

    public toArray(): TValue[] {
      var test = Object.keys(this.pairs).map((v: string, i: number, ar: string[]) => {
        return this.pairs[v];
      });
      return test;
    }

    public toJSON(): any {
      var replacement = {};

      Object.keys(this.pairs).forEach((k) => {
        replacement[k] = this.pairs[k];
      });

      return replacement;
    }
  }

  export class NotationDeserializer {
    public static load(o: any): any {
      var b = JSON.parse(o);
      return Object.keys(b)
        .map((v, i, ar) => {
            return b[v];
          });
    }
  }

  /**
  * @class Collection
  */
  export class Collection<T extends Entity> {
    private pairs = new Dictionary<T>();

    public addItem(item: T): void {
      this.pairs.setItem(item.key, item);
    }

    public getItem(n: string): T {
      return this.pairs.getItem(n);
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(type: new() => T): JQueryPromise<T[]> {
      var $deferred = $.Deferred();
      var entity = new type(); // 申し訳ない
      var k = Collection.pluralize(entity.getType());
      var mapper = (o: any) => {
          var item = <T>new type().load(o);

          this.pairs.setItem(item.key, item);

          return item;
        };

      $.ajax({
          url: entity.url(),
          type: 'GET',
        })
        .then((result: string) => {
          var objects = JSON.parse(result) || [];

          objects
            .map(mapper);

          window.localStorage.setItem(k, JSON.stringify(this.pairs));

          return $deferred
            .resolve(this.pairs.toArray());
        }, (...reasons: any[]) => {
          var objects = window.localStorage.getItem(k) || [];
          var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

          $.extend(NotationDeserializer.load(objects), NotationDeserializer.load(unsaved))
            .map(mapper);

          return $deferred
            .resolve(this.pairs.toArray());
        });

      return $deferred.promise();
    }

    /**
     * this.collection に対し Entity.save() を呼び出します。
     */
    public flush(type: new() => T): JQueryPromise<T[]> {
      var $deferred = $.Deferred();
      var entity = new type();
      var k = 'unsavedItems.' + Collection.pluralize(entity.getType());
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      $.when(Object
        .keys(unsavedItems)
        .map((value: any, index: number, ar: any[]) => {
            var item = new type();

            return item.load(unsavedItems[value]).save();
          }))
        .then((...items: T[]) => {
            // window.localStorage.removeItem(k);

            return $deferred.resolve(this.toArray());
          }, () => {
            return $deferred.reject();
          });

      return $deferred.promise();
    }

    public isDirty(type: new() => T): boolean {
      var entity = new type();
      var k = 'unsavedItems.' + Collection.pluralize(entity.getType());
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      return !!Object.keys(unsavedItems).length;
    }

    public toArray(): T[] {
      return this.pairs.toArray();
    }

    public static pluralize(word: string): string {
      return word + 's';
    }
  }
}
