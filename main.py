import datetime
import os
import jinja2
import webapp2
from google.appengine.ext import db
from google.appengine.api import users

class Project(db.Model):
    name = db.StringProperty(required=True)
    owner = db.UserProperty()


class Participant(db.Model):
    name = db.StringProperty(required=True)
    json = db.TextProperty()
    project = db.ReferenceProperty(Project)


#class Node(db.Model):
#    index = db.IntegerProperty()
#    text = db.StringProperty()
#    children = db.ListProperty(int)
#    participant = db.ReferenceProperty(Participant)


def show_project_url(project_id):
    return '/project/show?id={}'.format(project_id)


def create_project_url():
    return '/project/create'


def json_project_url(project_id):
    return '/project/json?id={}'.format(project_id)


def show_grid_url(project_id):
    return '/project/grid?id={}'.format(project_id)


def show_participant_url(participant_id):
    return '/participant/show?id={}'.format(participant_id)


def create_participant_url(project_id):
    return '/participant/create?id={}'.format(project_id)


def update_participant_url(participant_id):
    return '/participant/edit?id={}'.format(participant_id)


def json_participant_url(participant_id):
    return '/participant/json?id={}'.format(participant_id)


JINJA_ENVIRONMENT = jinja2.Environment(
        loader=jinja2.FileSystemLoader(
            os.path.dirname(__file__) + '/templates'),
        extensions=['jinja2.ext.autoescape'])
JINJA_ENVIRONMENT.globals.update(
        show_project_url=show_project_url,
        create_project_url=create_project_url,
        json_project_url=json_project_url,
        show_grid_url=show_grid_url,
        show_participant_url=show_participant_url,
        create_participant_url=create_participant_url,
        update_participant_url=update_participant_url,
        json_participant_url=json_participant_url,
        )


class MainHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(template_values))


class MyPageHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        template_values['projects'] =\
            Project.all().filter('owner =', users.get_current_user())
        template = JINJA_ENVIRONMENT.get_template('mypage.html')
        self.response.write(template.render(template_values))


class ProjectHandler(webapp2.RequestHandler):
    def get(self):
        project = Project.get(self.request.get('id'))
        template_values = {}
        template_values['project'] = project
        template_values['participants'] =\
                Participant.all().filter('project =', project)
        template = JINJA_ENVIRONMENT.get_template('project/show.html')
        self.response.write(template.render(template_values))


class CreateProjectHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        template = JINJA_ENVIRONMENT.get_template('project/create.html')
        self.response.write(template.render(template_values))

    def post(self):
        project = Project(
                name=self.request.get('name'),
                owner=users.get_current_user())
        project.put()
        self.redirect(show_project_url(project.key()))


class GridHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        template_values['project'] = Project.get(self.request.get('id'))
        template = JINJA_ENVIRONMENT.get_template('project/grid.html')
        self.response.write(template.render(template_values))


class ParticipantHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        template_values['participant'] =\
            Participant.get(self.request.get('id'))
        template = JINJA_ENVIRONMENT.get_template('participant/show.html')
        self.response.write(template.render(template_values))


class CreatePerticipantHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        template_values['project'] = Project.get(self.request.get('id'))
        template = JINJA_ENVIRONMENT.get_template('participant/create.html')
        self.response.write(template.render(template_values))

    def post(self):
        project = Project.get(self.request.get('id'))
        participant = Participant(
                name=self.request.get('name'),
                json='{"nodes":[]}',
                project=project)
        participant.put()
        self.redirect(show_participant_url(participant.key()))


class EditParticipantHandler(webapp2.RequestHandler):
    def post(self):
        participant = Participant.get(self.request.get('id'))
        participant.json = self.request.get('json')
        participant.put()
        self.redirect(show_project_url(participant.project.key()))


class JsonParticipantHandler(webapp2.RequestHandler):
    def get(self):
        participant = Participant.get(self.request.get('id'))
        self.response.write(participant.json)


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/mypage', MyPageHandler),
    ('/project/show', ProjectHandler),
    ('/project/create', CreateProjectHandler),
    ('/project/grid', GridHandler),
    ('/participant/show', ParticipantHandler),
    ('/participant/create', CreatePerticipantHandler),
    ('/participant/edit', EditParticipantHandler),
    ('/participant/json', JsonParticipantHandler),
], debug=True)
