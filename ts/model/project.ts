/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="entity.ts"/>
/// <reference path="value-object.ts"/>

module egrid.model {
  export interface ProjectData {
    name: string;
    note: string;
  }


  interface ApiProjectData extends ProjectData {
    key: string;
    createdAt: string;
    updatedAt: string;
  }


  /**
  * @class Project
  */
  export class Project extends Entity {
    private createdAt_: ValueObject<Date>;
    private updatedAt_: ValueObject<Date>;

    public name: string;
    public note: string;

    public static type: string = 'Project';

    constructor(obj? : ProjectData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
      }
    }

    public get createdAt() : Date {
      return this.createdAt_ ? this.createdAt_.value : null;
    }

    public get updatedAt() : Date {
      return this.updatedAt_ ? this.updatedAt_.value : null;
    }

    // Accessors は同じ Accessibility を持っていなければいけないのでメソッドを用意する
    private setCreatedAt(date: Date) : void {
      if (!this.createdAt_)
        this.createdAt_ = new ValueObject<Date>(date);
    }

    private setUpdatedAt(date: Date) : void {
      if (!this.updatedAt_)
        this.updatedAt_ = new ValueObject<Date>(date);
    }

    /**
     * Object から Project に変換します。
     *
     * @override
     * @param   object
     */
    public load(o: any): Project {
      this.key = o.key;

      this.name = o.name;
      this.note = o.note;

      this.setCreatedAt(o.createdAt);
      this.setUpdatedAt(o.updatedAt);

      return this;
    }

    /**
     * @override
     */
    public get(key: string): JQueryPromise<Project> {
      var $deferred = $.Deferred();

      $.ajax({
          url: this.url(key),
          type: 'GET',
          dataFilter: data => {
            var obj : ApiProjectData = JSON.parse(data);

            return this.load(obj);
          },
        })
        .then((project : Project) => {
          return $deferred.resolve(project);
        }, () => {
          var k = CollectionBase.pluralize(Project.type);
          var objects = window.localStorage.getItem(k) || [];
          var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

          var target = $.extend(JSON.parse(objects), JSON.parse(unsaved));

          return target[key] ? $deferred.resolve(this.load(target[key])) : $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public save(): JQueryPromise<Project> {
      var $deferred = $.Deferred();
      var key = this.key;

      // url と dataFiletr をデリゲートとか
      return $.ajax({
          url: key ? this.url(key) : Project.listUrl(),
          type: key ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: key,
            name: this.name,
            note: this.note,
          }),
          dataFilter: data => {
            var obj : ApiProjectData = JSON.parse(data);

            return this.load(obj);
          },
        })
        .then((p: Project) => {
            return $deferred.resolve(p);
          }, (...reasons) => {
            var o = {};
            var storageKey = 'unsavedItems.' + CollectionBase.pluralize(Project.type);
            var unsavedItems = JSON.parse(window.localStorage.getItem(storageKey)) || {};
            var irregulars: any;

            if (this.key) {
              o[this.key] = this;
            } else {
              o[Object.keys(unsavedItems).length] = this; // FIXME
            }

            irregulars = $.extend({}, unsavedItems, o);

            window.localStorage.setItem(storageKey, JSON.stringify(irregulars));

            return $deferred.reject();
          });

      return $deferred.promise();
    }

    /**
     * @override
     */
    public static listUrl() : string {
      return '/api/projects';
    }

    /**
     * @override
     */
    public url(key? : string) : string {
      return Project.listUrl() + '/' + key;
    }

    public remove() : JQueryXHR {
      return $.ajax({
        url: this.url(this.key),
        type: 'DELETE',
      });
    }
  }
}
