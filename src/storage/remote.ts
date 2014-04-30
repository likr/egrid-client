/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model.storage {
export var API_URL_BASE = '';


module Uri {
export function collaborators(projectId: string): string {
  return '/api/projects/:projectId/collaborators'.replace(':projectId', projectId);
}


export function collaborator(projectId: string, participantId: string): string {
  return '/api/projects/:projectId/collaborators/:collaboratorId'
    .replace(':projectId', projectId)
    .replace(':collaboratorId', participantId);
}


export function participants(projectId: string): string {
  return '/api/projects/:projectId/participants'.replace(':projectId', projectId);
}


export function participant(projectId: string, participantId: string): string {
  return '/api/projects/:projectId/participants/:participantId'
    .replace(':projectId', projectId)
    .replace(':participantId', participantId);
}


export function participantGrid(projectId: string, participantId: string): string {
  return '/api/projects/:projectId/participants/:participantId/grid'
    .replace(':projectId', projectId)
    .replace(':participantId', participantId);
}


export function projects(): string {
  return API_URL_BASE + '/api/projects';
}


export function project(projectId: string): string {
  return API_URL_BASE + '/api/projects/:projectId'.replace(':projectId', projectId);
}


export function projectGrids(projectId: string): string {
  return '/api/projects/:projectId/grid'.replace(':projectId', projectId);
}


export function projectGrid(projectId: string, projectGridId: string): string {
  return '/api/projects/:projectId/grid/:projectGridId'
    .replace(':projectId', projectId)
    .replace(':projectGridId', projectGridId);
}


export function semProjects(projectId: string): string {
  return '/api/projects/:projectId/sem-projects'.replace(':projectId', projectId);
}


export function semProject(projectId: string, participantId: string): string {
  return '/api/projects/:projectId/sem-projects/:semProjectId'
    .replace(':projectId', projectId)
    .replace(':semProjectId', participantId);
}
}

// API 通信をなんとかしてくれるはず
export module Api {
export function get<T>(name: string, projectId: string, participantId?: string): JQueryPromise<T> {
  var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); });

  return $.ajax({
      url: participantId ? (<any>Uri)[n](projectId, participantId) : (<any>Uri)[n](projectId),
      type: 'GET',
      contentType: 'application/json',
    })
    .then((r: string) => {
        return JSON.parse(r);
      });
}


export function post<T>(data: T, name: string, projectId?: string): JQueryPromise<T> {
  var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); }) + 's';

  return $.ajax({
      url: projectId ? (<any>Uri)[n](projectId) : (<any>Uri)[n](),
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
    .then((r: string) => {
        return JSON.parse(r);
      });
}


export function put<T>(data: T, name: string, projectId: string, participantId?: string): JQueryPromise<T> {
  var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); });

  return $.ajax({
      url: participantId ? (<any>Uri)[n](projectId, participantId) : (<any>Uri)[n](projectId),
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
    .then((r: string) => {
        return JSON.parse(r);
      });
}


export function remove(name: string, projectId: string, participantId?: string): JQueryPromise<void> {
  var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); });

  return $.ajax({
      url: participantId ? (<any>Uri)[n](projectId, participantId) : (<any>Uri)[n](projectId),
      type: 'DELETE',
    })
      .then((response) => response, (...reasons) => reasons[0]);
}


export function retrieve<T extends StorableData>(name: string, projectId?: string): JQueryPromise<T[]> {
  var n = name.replace(/^[A-Z]/, function(m) { return m.toLowerCase(); }) + 's';

  return $.ajax({
      url: projectId ? (<any>Uri)[n](projectId) : (<any>Uri)[n](),
      type: 'GET',
      contentType: 'application/json',
    })
    .then((r: string) => {
        return JSON.parse(r);
      })
    .then((values: T[]) => {
        var o: any = {};

        for (var i = 0, l = values.length; i < l; i++) {
          o[values[i].key] = values[i];
        }

        return o;
      });
}
}
}
