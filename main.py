import webapp2
from api.collaborator_handler import CollaboratorHandler
from api.participant_handler import ParticipantHandler
from api.participant_handler import ParticipantGridHandler
from api.project_handler import ProjectHandler
from api.project_handler import ProjectGridHandler
from api.user_handler import UserHandler
from api.user_handler import UserLogoutHandler


app = webapp2.WSGIApplication([
    ('/api/collaborators/([\w\-]+)', CollaboratorHandler),
    ('/api/participants/([\w\-]+)', ParticipantHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)', ParticipantHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)/grid', ParticipantGridHandler),
    ('/api/projects', ProjectHandler),
    ('/api/projects/([\w\-]+)', ProjectHandler),
    ('/api/projects/([\w\-]+)/grid', ProjectGridHandler),
    ('/api/users', UserHandler),
    ('/api/users/logout', UserLogoutHandler),
], debug=True)
