/// <reference path="../ts-definitions/DefinitelyTyped/q/Q.d.ts"/>
/// <reference path="../model/interfaces/ientity.ts"/>

module egrid.utils {
  class Uri {
    public static participants(projectId: string): string {
      return '/api/projects/:projectId/participants'.replace(':projectId', projectId);
    }

    public static participant(projectId: string, participantId: string): string {
      return '/api/projects/:projectId/participants/:participantId'
        .replace(':projectId', projectId)
        .replace(':participantId', participantId);
    }

    public static projects(): string {
      return '/api/projects';
    }

    public static project(projectId: string): string {
      return '/api/projects/:projectId'.replace(':projectId', projectId);
    }
  }

  // API 通信をなんとかしてくれるはず
  export class Api {
    public static get<T>(name: string, key: string): JQueryPromise<T> {
      return $.ajax({
          url: '/api/' + name.toLowerCase() + 's/' + key,
          type: 'GET',
          contentType: 'application/json',
        });
    }

    public static post<T>(data: T, name: string): JQueryPromise<T> {
      return $.ajax({
          url: Uri[name.toLowerCase() + 's'](),
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
        })
        .then((r: string) => {
            return JSON.parse(r);
          });
    }

    public static put<T>(data: T, name: string, key: string): JQueryPromise<T>;
    public static put<T>(data: T, name: string, key: any): JQueryPromise<T> {
      var k: string;
      var e: string;

      if (key && typeof key === 'string') {
        k = key;
      } else if (key) {
        k = key.projectId;
        e = key.participantId;
      }

      return $.ajax({
          url: e ? Uri[name.toLowerCase()](k, e) : Uri[name.toLowerCase()](k),
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(data),
        })
        .then((r: string) => {
            return JSON.parse(r);
          });
    }

    public static retrieve<T extends egrid.model.interfaces.IEntity>(name: string): JQueryPromise<T[]> {
      return $.ajax({
          url: Uri[name.toLowerCase() + 's'](),
          type: 'GET',
          contentType: 'application/json',
        })
        .then((r: string) => {
            return JSON.parse(r);
          })
        .then((values: T[]) => {
            var o = {};

            for (var i = 0, l = values.length; i < l; i++) {
              o[values[i].key] = values[i];
            }

            return o;
          });
    }
  }

  /**
   * localStorage 用 Proxy クラス
   */
  export class Storage {
    private static key: string = 'lindo_de_remedio';
    private static outOfService: string = 'unsavedItems';
    /**
     * { name: { key: value, key: value, ..., key: value } }
     */
    private store: any = {};

    public constructor() {
      this.store = JSON.parse(localStorage.getItem(Storage.key));

      this.flush<any>();
    }

    private flush<T extends egrid.model.interfaces.IEntity>(): JQueryPromise<boolean> {
      var $deferred = $.Deferred();

      for (var type in this.store[Storage.outOfService]) {
        $.when(this.store[Storage.outOfService][type].map((v, i, ar) => {
            return v.key
              ? Api.put<T>(v, type, v.key)
              : Api.post<T>(v, type);
          }))
            .then(() => {
                delete this.store[Storage.outOfService];

                return $deferred.resolve(true);
              }, () => {
                return $deferred.reject(false);
              });
      }

      return $deferred.promise();
    }

    /**
     * @throws Error Out of memory
     */
    public add<T extends egrid.model.interfaces.IEntity>(value: T, name: string): JQueryPromise<boolean>;
    public add<T extends egrid.model.interfaces.IEntity>(value: T, name: string, key?: string): JQueryPromise<boolean> {
      var $promise;
      var alreadyStored = (key && typeof key === 'string');

      $promise = alreadyStored
        ? Api.put(value, name, key)
        : Api.post(value, name);

      return $promise
        .then((v: T) => {
            if (!alreadyStored) {
              this.store[name] = {};
            }

            this.store[name][v.key] = Miscellaneousness.merge(this.store[name][v.key], v);

            localStorage.setItem(Storage.key, JSON.stringify(this.store));

            return v;
          }, () => {
            var v = {};
            var o = JSON.parse(localStorage.getItem(Storage.key));

            v[Storage.outOfService] = {};
            v[Storage.outOfService][name] = [];
            v[Storage.outOfService][name].push(value);

            localStorage.setItem(Storage.key, JSON.stringify(Miscellaneousness.merge(o, v)));
          });
    }

    public get<T extends egrid.model.interfaces.IEntity>(name: string, key: string): JQueryPromise<T> {
      var $deferred = $.Deferred();
      var $promise = this.retrieve<T>(name); // 本当は一覧を取る必要はないが、今はこうしておこう

      $promise
        .then((values: T) => {
            $deferred.resolve(values[key]);
          }, (...reasons) => {
            if (this.store[name].hasOwnProperty(key))
              $deferred.resolve(this.store[name][key]);
            else
              $deferred.reject();
          });

      return $deferred.promise();
    }

    public retrieve<T extends egrid.model.interfaces.IEntity>(name: string): JQueryPromise<any> {
      var $deferred = $.Deferred();
      var $promise = Api.retrieve<T>(name);

      $promise
        .then((values: T[]) => {
            this.store[name] = values;

            localStorage.setItem(Storage.key, JSON.stringify(this.store));

            $deferred.resolve(this.store[name]);
          }, (...reasons) => {
            this.store = JSON.parse(localStorage.getItem(Storage.key));

            if (this.store[name])
              $deferred.resolve(this.store[name]);
            else
              $deferred.reject();
          });

      return $deferred.promise();
    }
  }

  export class Miscellaneousness {
    /**
     * 新しいオブジェクトを作成し、o がもつプロパティを代入します。
     * その後 b がもつプロパティで上書きします。
     *
     * 非破壊的操作。
     *
     * @param o any
     * @param b any
     */
    public static merge(o: any, b: any = {}): any {
      var j: any = o;

      for (var i = 0, t = Object.keys(b), l = t.length; i < l; i++) {
        j[t[i]] = b[t[i]];
      }

      return j;
    }
  }
}
