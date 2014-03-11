/// <reference path="../model/interfaces/ientity.ts"/>

module egrid.utils {
  class Uri {
    public static collaborators(projectId: string): string {
      return '/api/projects/:projectId/collaborators'.replace(':projectId', projectId);
    }

    public static collaborator(projectId: string, participantId: string): string {
      return '/api/projects/:projectId/collaborators/:collaboratorId'
        .replace(':projectId', projectId)
        .replace(':collaboratorId', participantId);
    }

    public static participants(projectId: string): string {
      return '/api/projects/:projectId/participants'.replace(':projectId', projectId);
    }

    public static participant(projectId: string, participantId: string): string {
      return '/api/projects/:projectId/participants/:participantId'
        .replace(':projectId', projectId)
        .replace(':participantId', participantId);
    }

    public static participantGrid(projectId: string, participantId: string): string {
      return '/api/projects/:projectId/participants/:participantId/grid'
        .replace(':projectId', projectId)
        .replace(':participantId', participantId);
    }

    public static projects(): string {
      return '/api/projects';
    }

    public static project(projectId: string): string {
      return '/api/projects/:projectId'.replace(':projectId', projectId);
    }

    public static projectGrids(projectId: string): string {
      return '/api/projects/:projectId/grid'.replace(':projectId', projectId);
    }

    public static projectGrid(projectId: string, projectGridId: string): string {
      return '/api/projects/:projectId/grid/:projectGridId'
        .replace(':projectId', projectId)
        .replace(':projectGridId', projectGridId);
    }

    public static semProjects(projectId: string): string {
      return '/api/projects/:projectId/sem-projects'.replace(':projectId', projectId);
    }

    public static semProject(projectId: string, participantId: string): string {
      return '/api/projects/:projectId/sem-projects/:semProjectId'
        .replace(':projectId', projectId)
        .replace(':semProjectId', participantId);
    }
  }

  // API 通信をなんとかしてくれるはず
  export class Api {
    public static get<T>(name: string, projectId: string, participantId?: string): JQueryPromise<T> {
      var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); });

      return $.ajax({
          url: participantId ? Uri[n](projectId, participantId) : Uri[n](projectId),
          type: 'GET',
          contentType: 'application/json',
        })
        .then((r: string) => {
            return JSON.parse(r);
          });
    }

    public static post<T>(data: T, name: string, projectId?: string): JQueryPromise<T> {
      var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); }) + 's';

      return $.ajax({
          url: projectId ? Uri[n](projectId) : Uri[n](),
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
        })
        .then((r: string) => {
            return JSON.parse(r);
          });
    }

    public static put<T>(data: T, name: string, projectId: string, participantId?: string): JQueryPromise<T> {
      var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); });

      return $.ajax({
          url: participantId ? Uri[n](projectId, participantId) : Uri[n](projectId),
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(data),
        })
        .then((r: string) => {
            return JSON.parse(r);
          });
    }

    // HTTP メソッド名にあわせたいが、delete は予約されていた
    public static remove(name: string, projectId: string, participantId?: string): JQueryPromise<boolean> {
      var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); });

      return $.ajax({
          url: participantId ? Uri[n](projectId, participantId) : Uri[n](projectId),
          type: 'DELETE',
        })
          .then(() => true, () => false);
    }

    public static retrieve<T extends model.interfaces.IEntity>(name: string, projectId?: string): JQueryPromise<T[]> {
      var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); }) + 's';

      return $.ajax({
          url: projectId ? Uri[n](projectId) : Uri[n](),
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
      this.store = JSON.parse(localStorage.getItem(Storage.key)) || {};

      this.flush<any>();
    }

    private flush<T extends model.interfaces.IEntity>(): JQueryPromise<boolean> {
      var $deferred = $.Deferred();
      var $promises = [];
      var n = Storage.outOfService;

      if (this.store[n]) for (var type in this.store[n]) if (this.store[n].hasOwnProperty(type)) {
        var v = this.store[n][type];
        var w;

        for (var unsaved in v) if (v.hasOwnProperty(unsaved)) {
          w = v[unsaved];

          if (w.key && w.createdAt) {
            $promises.push(Api.put<T>(w, type, w.key));
          } else {
            if (w.projectKey) {
              $promises.push(Api.post<T>(w, type, w.projectKey));
            } else {
              $promises.push(Api.post<T>(w, type));
            }
          }
        }
      }

      $.when.apply($, $promises)
        .then((v) => {
            if (Array.isArray(v) && !v.length) {
              $deferred.reject(false);
            } else {
              delete this.store[Storage.outOfService];

              $deferred.resolve(true);
            }
          }, () => {
            $deferred.reject(false);
          });

      return $deferred.promise();
    }

    /**
     * @throws Error Out of memory
     */
    public add<T extends model.interfaces.IEntity>(value: T, name: string, projectId?: string, participantId?: string): JQueryPromise<T> {
      var $promise;
      var alreadyStored = !!value.key;

      if (alreadyStored) {
        $promise = Api.put<T>(value, name, projectId, participantId);
      } else {
        if (projectId) {
          $promise = Api.post<T>(value, name, projectId);
        } else {
          $promise = Api.post<T>(value, name);
        }
      }

      return $promise
        .then((v: T) => {
            var r: any;

            if (!this.store[name]) {
              this.store[name] = {};
            }

            r = Miscellaneousness.merge(this.store[name][v.key], v);

            if (participantId) {
              this.store[name][projectId][v.key] = r;
            } else {
              this.store[name][v.key] = r;
            }

            localStorage.setItem(Storage.key, JSON.stringify(this.store));

            return v;
          }, () => {
            this.store = JSON.parse(localStorage.getItem(Storage.key)) || {}; // FIXME

            var k = (value.key) ? value.key : Storage.outOfService + Object.keys(this.store[name]).length.valueOf();

            if (!this.store[Storage.outOfService]) {
              this.store[Storage.outOfService] = Miscellaneousness.construct(name);
            }

            if (!value.key) {
              value.key = k;
            }

            this.store[Storage.outOfService][name][k] = value;

            localStorage.setItem(Storage.key, JSON.stringify(this.store));

            // PUT, POST を分けたいがうまく動作していない
            // オフライン POST 時は participantId など存在しないのだ
            // しかし直後に retrieve するので今のところ問題は起きない
            if (participantId) {
              this.store[name][projectId][k] = value;
            } else {
              this.store[name][k] = value;
            }

            return value;
          });
    }

    public get<T extends model.interfaces.IEntity>(name: string, projectId: string, participantId?: string): JQueryPromise<T> {
      var $deferred = $.Deferred();
      var $promise = Api.get<T>(name, projectId, participantId);

      $promise
        .then((value: T) => {
            $deferred.resolve(value);
          }, (...reasons) => {
            if (this.store[name]) {
              if (participantId) {
                $deferred.resolve(this.store[name][projectId][participantId]);
              } else {
                $deferred.resolve(this.store[name][projectId]);
              }
            } else {
              $deferred.reject();
            }
          });

      return $deferred.promise();
    }

    public remove<T extends model.interfaces.IEntity>(name: string, projectId: string, participantId?: string): JQueryPromise<boolean> {
      // TODO: localStorage から削除する
      return Api.remove(name, projectId, participantId);
    }

    public retrieve<T extends model.interfaces.IEntity>(name: string, projectId?: string): JQueryPromise<any> {
      var $deferred = $.Deferred();
      var $promise = Api.retrieve<T>(name, projectId);

      $promise
        .then((values: T[]) => {
            if (!this.store[name]) {
              this.store[name] = {};
            }

            if (projectId) {
              this.store[name][projectId] = values;
            } else {
              this.store[name] = values;
            }

            localStorage.setItem(Storage.key, JSON.stringify(this.store));

            $deferred.resolve(projectId ? this.store[name][projectId] : this.store[name]);
          }, (...reasons) => {
            var r = {};

            if (!this.store[name]) {
              $deferred.reject();
            }

            if (this.store[Storage.outOfService]) {
              r = this.store[Storage.outOfService][name];
            }

            if (this.store[name]) {
              if (projectId) {
                r = Miscellaneousness.merge(this.store[name][projectId], r);
              } else {
                r = Miscellaneousness.merge(this.store[name], r);
              }
            }

            $deferred.resolve(r);
          });

      return $deferred.promise();
    }
  }

  export class Miscellaneousness {
    /**
     * オブジェクトの第一層をコピーしかえします。
     * o と b が同じプロパティを持っている場合、b を優先します。
     *
     * 非破壊的操作
     *
     * @param o any
     * @param b any
     */
    public static merge(o: any = {}, b: any = {}): any {
      var j: any = o;

      for (var i = 0, t = Object.keys(b), l = t.length; i < l; i++) {
        j[t[i]] = b[t[i]];
      }

      return j;
    }

    public static construct(...properties: string[]): any {
      return properties.reduceRight((p: any, c: string) => {
          var o: any = {};

          o[c] = p;

          return o;
        }, {});
    }
  }
}