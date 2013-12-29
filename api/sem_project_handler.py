import webapp2
from api.models import SemProject


class SemProjectHandler(webapp2.RequestHandler):
    def get(self, sem_project_id, project_id=None):
        sem_project = SemProject.get(sem_project_id)
        self.response.write(json.dumps(sem_project.to_dict()))


class SemProjectListHandler(webapp2.RequestHandler):
    def get(self, project_id):
        pass
