import json
import webapp2
from api.models import Project
from api.models import SemProject


class SemProjectHandler(webapp2.RequestHandler):
    def get(self, project_id, sem_project_id):
        sem_project = SemProject.get(sem_project_id)
        self.response.write(json.dumps(sem_project.to_dict()))


class SemProjectListHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        sem_projects = SemProject.all()\
            .filter('project =', project)\
            .order('created_at')
        self.response.write(json.dumps([p.to_dict() for p in sem_projects]))

    def post(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        sem_project = SemProject(
            name=data.get('name'),
            project=project)
        sem_project.put()
        self.response.write(json.dumps(sem_project.to_dict()))
