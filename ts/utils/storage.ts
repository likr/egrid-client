/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
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
    public static remove(name: string, projectId: string, participantId?: string): JQueryPromise<any> {
      var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); });

      return $.ajax({
          url: participantId ? Uri[n](projectId, participantId) : Uri[n](projectId),
          type: 'DELETE',
        })
          .then((response) => response, (...reasons) => reasons[0]);
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
      var $deferred = $.Deferred();
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

      $promise
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

            $deferred.resolve(v);
          }, (...reasons: any[]) => {
            var k: string;

            if (reasons[2] === 'Not authorized') {
              $deferred.reject(reasons[0]);
            }

            this.store = JSON.parse(localStorage.getItem(Storage.key)) || {}; // FIXME

            k = (value.key) ? value.key : Storage.outOfService + Object.keys(this.store[name]).length.valueOf();

            if (!this.store[Storage.outOfService]) {
              this.store[Storage.outOfService] = Miscellaneousness.construct(name);
            }

            if (!value.key) {
              value.key = k;
            }

            this.store[Storage.outOfService][name][k] = value;

            localStorage.setItem(Storage.key, JSON.stringify(this.store));

            if (projectId && /^unsavedItems[0-9]+$/.test(projectId)) {
              this.store[name][k] = value;
            } else if (participantId) {
              this.store[name][projectId][k] = value;
            } else {
              this.store[name][k] = value;
            }

            $deferred.reject(reasons[0]);
          });

      return $deferred.promise();
    }

    public get<T extends model.interfaces.IEntity>(name: string, projectId: string, participantId?: string): JQueryPromise<T> {
      var $deferred = $.Deferred();
      var $promise = Api.get<T>(name, projectId, participantId);

      this.store = JSON.parse(localStorage.getItem(Storage.key)) || {}; // FIXME

      $promise
        .then((value: T) => {
            if (!this.store[name]) {
              this.store[name] = {};
            }

            if (participantId) {
              this.store[name][projectId] = Miscellaneousness.construct(participantId);

              this.store[name][projectId][participantId] = value;
            } else {
              this.store[name][projectId] = value;
            }

            localStorage.setItem(Storage.key, JSON.stringify(this.store));

            $deferred.resolve(participantId ? this.store[name][projectId][participantId] : this.store[name][projectId]);
          }, (...reasons: any[]) => {
            var r = {};

            // 500 のときも
            if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
              $deferred.reject(reasons[0]);
            }

            // 1. ストレージからデータを取り出す
            if (!this.store[name]) {
              $deferred.reject(new Error('Storage is empty'));
            }

            if (this.store[Storage.outOfService]) {
              r = this.store[Storage.outOfService][name];
            }

            if (this.store[name]) {
              if (participantId) {
                r = Miscellaneousness.merge(this.store[name][projectId][participantId], r);
              } else {
                r = Miscellaneousness.merge(this.store[name][projectId], r);
              }
            }

            $deferred.resolve(r);
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
          }, (...reasons: any[]) => {
            var r = {};

            if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
              $deferred.reject(reasons[0]);
            }

            if (!this.store[name]) {
              $deferred.reject(new Error('Storeage is empty'));
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

module egrid {
  export var storage = new egrid.utils.Storage();
}
