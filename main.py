import json
import webapp2
from google.appengine.ext import db
from google.appengine.api import users


class Project(db.Model):
    name = db.StringProperty(required=True)
    owner = db.UserProperty()

    def dump(self):
        return {
            'key': str(self.key()),
            'name': self.name,
        }


class Participant(db.Model):
    name = db.StringProperty(required=True)
    json = db.TextProperty()
    project = db.ReferenceProperty(Project)

    def dump(self):
        return {
            'key': str(self.key()),
            'name': self.name,
            'json': self.json,
        }


class ProjectsHandler(webapp2.RequestHandler):
    def get(self):
        projects = Project.all().filter('owner =', users.get_current_user())
        self.response.write(json.dumps([p.dump() for p in projects]))

    def put(self):
        data = json.loads(self.request.body)
        project = Project(
                name=data['name'],
                owner=users.get_current_user())
        project.put()
        self.response.write(json.dumps(project.dump()))


class ProjectHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        self.response.write(json.dumps(project.dump()))


class ParticipantsHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        participants = Participant.all().filter('project =', project)
        self.response.write(json.dumps([p.dump() for p in participants]))

    def put(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        participant = Participant(
                name=data['name'],
                project=project,
                json='{"nodes":[],"links":[]}')
        participant.put()
        self.response.write(json.dumps(participant.dump()))


class ParticipantHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        self.response.write(json.dumps(participant.dump()))


class ParticipantJsonHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        self.response.write(participant.json)


app = webapp2.WSGIApplication([
    ('/api/projects', ProjectsHandler),
    ('/api/projects/([\w\-]+)', ProjectHandler),
    ('/api/participants/([\w\-]+)', ParticipantsHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)', ParticipantHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)/grid', ParticipantJsonHandler),
], debug=True)
