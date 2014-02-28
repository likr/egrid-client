/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class ProjectCollection extends CollectionBase<Project> {
    constructor() {
      super(new Dictionary<Project>());
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(key?: string): JQueryPromise<Project[]> {
      var $deferred = $.Deferred();
      var k = CollectionBase.pluralize(Project.type);
      var mapper = (o: any) => {
          var item = new Project().load(o);

          this.pairs.value.setItem(item.key, item);

          return item;
        };

      $.ajax({
          url: Project.listUrl(),
          type: 'GET',
        })
        .then((result: string) => {
          var objects = JSON.parse(result) || [];

          objects
            .map(mapper);

          window.localStorage.setItem(k, JSON.stringify(this.pairs.value));

          this
            .flush()
            .then((ps) => {
                ps.forEach((p) => {
                    this.addItem(p);
                  });
              });

          return $deferred
            .resolve(this.pairs.value.toArray());
        }, (...reasons: any[]) => {
          var objects = window.localStorage.getItem(k);
          var unsaved = window.localStorage.getItem('unsavedItems.' + k);
          var serials = $.merge(NotationDeserializer.load(objects), NotationDeserializer.load(unsaved));

          for (var i = 0, j = Object.keys(serials), l = j.length; i < l; i++) {
            mapper(serials[j[i]]);
          }

          return $deferred
            .resolve(this.pairs.value.toArray());
        });

      return $deferred.promise();
    }

    /**
     * this.collection に対し Entity.save() を呼び出します。
     *
     * @override
     */
    public flush(): JQueryPromise<Project[]> {
      var $deferred = $.Deferred();
      var k = 'unsavedItems.' + CollectionBase.pluralize(Project.type);
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      $.when(Object
        .keys(unsavedItems)
        .map((value: any, index: number, ar: any[]) => {
            var item = new Project();

            return item.load(unsavedItems[value]).save();
          }))
        .then((...items: Project[]) => {
            window.localStorage.removeItem(k);

            return $deferred.resolve(this.pairs.value.toArray());
          }, () => {
            return $deferred.reject();
          });

      return $deferred.promise();
    }
  }
}
