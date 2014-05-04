/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="project.ts"/>

module egrid.model {
var TYPE = 'Analysis';


function load(obj: SerializedAnalysisData): Analysis {
  var analysis: any = new Analysis(obj);
  analysis.key_ = obj.key;
  analysis.createdAt_ = new Date(obj.createdAt);
  analysis.updatedAt_ = new Date(obj.updatedAt);
  return analysis;
}


export interface AnalysisData {
  name? : string;
  project?: ProjectData;
  projectKey: string;
}


interface SerializedAnalysisData extends AnalysisData {
  key: string;
  createdAt: string;
  updatedAt: string;
}


export class Analysis extends Entity implements AnalysisData {
  public name: string;
  public project: ProjectData;
  public projectKey: string;

  constructor(obj: AnalysisData) {
    super();
    this.name = obj.name;
    this.project = obj.project;
    this.projectKey = obj.projectKey;
  }

  public static get(projectKey: string, key: string) {
    return storage.get<Analysis>(TYPE, projectKey, key)
      .then<Analysis>((data: SerializedAnalysisData) => {
        return load(data);
      });
  }

  public static query(projectKey: string) {
    return storage.retrieve<Analysis>(TYPE, projectKey)
      .then(data => {
        var result: Analysis[] = [];
        var key: string;
        for (key in data) {
          result.push(load(data[key]));
        }
        return result;
      });
  }

  public save(): JQueryPromise<void> {
    return storage.add<Analysis>(this, TYPE, this.projectKey, this.key);
  }

  public remove() : JQueryPromise<void> {
    return storage.remove<Analysis>(TYPE, this.projectKey, this.key);
  }
}
}
