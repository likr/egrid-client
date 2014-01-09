/// <reference path="../model/participant.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class Url {
    static participantUrlBase = '/projects/:projectId/participants/:participantId';
    static participantGridUrlBase = '/projects/:projectId/participants/:participantId/grid';
    static projectUrlBase = '/projects/:projectId';
    static projectGridUrlBase = '/projects/:projectId/grid';
    static projectListUrlBase = '/projects';
    static semProjectUrlBase = '/projects/:projectId/sem-projects/:semProjectId';

    static participantUrl(projectKey : string, participantKey : string) : string;
    static participantUrl(participant : model.Participant) : string;
    static participantUrl(arg : any, participantKey? : string) : string{
      var projectKey;
      if (participantKey === undefined) {
        projectKey = arg.projectKey;
        participantKey = arg.key();
      } else {
        projectKey = arg;
      }
      return '/projects/' + projectKey + '/participants/' + participantKey;
    }

    static participantGridUrl(projectKey : string, participantKey : string) : string;
    static participantGridUrl(participant : model.Participant) : string;
    static participantGridUrl(arg : any, participantKey? : string) : string{
      return Url.participantUrl(arg, participantKey) + '/grid';
    }

    static projectListUrl() : string {
      return Url.projectListUrlBase;
    }

    static projectUrl(projectKey : string) : string;
    static projectUrl(project : model.Project) : string;
    static projectUrl(project : any) : string {
      if (project instanceof model.Project) {
        return '/projects/' + project.key();
      } else {
        return '/projects/' + project;
      }
    }

    static projectGridUrl(projectKey : string) : string;
    static projectGridUrl(project : model.Project) : string;
    static projectGridUrl(project : any) : string {
      return Url.projectUrl(project) + '/grid';
    }

    static semProjectUrl(semProject : model.SemProject) : string {
      return '/projects/' + semProject.projectKey + '/sem-projects/' + semProject.key();
    }
  }
}
