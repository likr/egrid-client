import json
import webapp2
from api.models import Collaborator
from api.models import Project
from api.models import User


class CollaboratorHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        collaborators = Collaborator.all()\
            .filter('project =', project)
        content = json.dumps([c.to_dict() for c in collaborators])
        self.response.write(content)

    def post(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        user = User.all()\
            .filter('email =', data.get('userEmail'))\
            .get()
        if not project or not user:
            raise Exception()
        collaborator = Collaborator.all()\
            .filter('project =', project)\
            .filter('user =', user)\
            .get()
        if collaborator:
            raise Exception()
        collaborator = Collaborator(
            project=project,
            user=user,
            is_manager=data.get('isManager'))
        collaborator.put()

        content = json.dumps(collaborator.to_dict())
        self.response.write(content)
