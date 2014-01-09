import webapp2
from webapp2 import Route
from api.collaborator_handler import CollaboratorHandler
from api.participant_handler import ParticipantHandler
from api.participant_handler import ParticipantGridHandler
from api.project_handler import ProjectHandler
from api.project_handler import ProjectGridHandler
from api.sem_project_handler import SemProjectHandler
from api.sem_project_handler import SemProjectListHandler
from api.user_handler import UserHandler
from api.user_handler import UserLogoutHandler


app = webapp2.WSGIApplication([
    Route('/api/projects', ProjectHandler),
    Route('/api/projects/<project_id:[\w\-]+>', ProjectHandler),
    Route('/api/projects/<project_id:[\w\-]+>/collaborators', CollaboratorHandler),
    Route('/api/projects/<project_id:[\w\-]+>/grid', ProjectGridHandler),
    Route('/api/projects/<project_id:[\w\-]+>/participants', ParticipantHandler),
    Route('/api/projects/<project_id:[\w\-]+>/participants/<participant_id:[\w\-]+>', ParticipantHandler),
    Route('/api/projects/<project_id:[\w\-]+>/participants/<participant_id:[\w\-]+>/grid', ParticipantGridHandler),
    Route('/api/projects/<project_id:[\w\-]+>/sem-projects', SemProjectListHandler),
    Route('/api/projects/<project_id:[\w\-]+>/sem-projects/<sem_project_id:[\w\-]+>', SemProjectHandler),
    Route('/api/users', UserHandler),
    Route('/api/users/logout', UserLogoutHandler),
], debug=True)
