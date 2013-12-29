import webapp2
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
    ('/api/collaborators/([\w\-]+)', CollaboratorHandler),
    ('/api/participants/([\w\-]+)', ParticipantHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)', ParticipantHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)/grid', ParticipantGridHandler),
    ('/api/projects', ProjectHandler),
    ('/api/projects/<project_id:[\w\-]+>', ProjectHandler),
    ('/api/projects/<project_id:[\w\-]+>/collaborators', CollaboratorHandler),
    ('/api/projects/<project_id:[\w\-]+>/grid', ProjectGridHandler),
    ('/api/projects/<project_id:[\w\-]+>/participants', ParticipantHandler),
    ('/api/projects/<project_id:[\w\-]+>/participants/<participant_id:[\w\-]+>', ParticipantHandler),
    ('/api/projects/<project_id:[\w\-]+>/participants/<participant_id:[\w\-]+>/grid', ParticipantGridHandler),
    ('/api/projects/<project_id:[\w\-]+>/sem-projects', SemProjectListHandler),
    ('/api/projects/<project_id:[\w\-]+>/sem-projects/<sem_project_id:[\w\-]+>', SemProjectHandler),
    ('/api/users', UserHandler),
    ('/api/users/logout', UserLogoutHandler),
    ('/api/sem-projects/<sem_project_id:[\w\-]+>', SemProjectHandler)
], debug=True)
