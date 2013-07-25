import json
import webapp2
from google.appengine.ext import db
from google.appengine.api import users


DEFAULT_JSON = '{"nodes":[],"links":[]}'


class Project(db.Model):
    name = db.StringProperty(required=True)
    note = db.TextProperty()
    owner = db.UserProperty()
    created_at = db.DateTimeProperty(auto_now_add=True)
    updated_at = db.DateTimeProperty(auto_now=True)

    def dump(self):
        return {
            'key': str(self.key()),
            'name': self.name,
            'note': self.note,
        }


class Participant(db.Model):
    name = db.StringProperty(required=True)
    note = db.TextProperty()
    json = db.TextProperty()
    project = db.ReferenceProperty(Project)
    created_at = db.DateTimeProperty(auto_now_add=True)
    updated_at = db.DateTimeProperty(auto_now=True)

    def dump(self):
        return {
            'key': str(self.key()),
            'name': self.name,
            'note': self.note,
            'project': self.project.dump(),
            'json': self.json,
        }


class ProjectsHandler(webapp2.RequestHandler):
    def get(self):
        projects = Project.all()\
                .filter('owner =', users.get_current_user())\
                .order('created_at')
        self.response.write(json.dumps([p.dump() for p in projects]))

    def put(self):
        data = json.loads(self.request.body)
        project = Project(
                name=data.get('name'),
                note=data.get('note'),
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
        participants = Participant.all()\
                .filter('project =', project)\
                .order('created_at')
        self.response.write(json.dumps([p.dump() for p in participants]))

    def put(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        participant = Participant(
                name=data.get('name'),
                note=data.get('note'),
                project=project,
                json=DEFAULT_JSON)
        participant.put()
        self.response.write(json.dumps(participant.dump()))


class ParticipantHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        self.response.write(json.dumps(participant.dump()))


class ProjectGridHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        participants = Participant.all().filter('project =', project)
        all_nodes = []
        all_links = []
        index_offset = 0
        node_texts = {}
        for participant in participants:
            grid = json.loads(participant.json)
            nodes = grid['nodes']
            links = grid['links']
            index_map = []
            for i, node in enumerate(nodes):
                text = node['text']
                if text in node_texts:
                    #all_nodes[node_texts[text]]['weight'] += 1
                    index_map.append(node_texts[text])
                else:
                    node_texts[text] = index_offset
                    index_map.append(index_offset)
                    all_nodes.append(node)
                    index_offset += 1
            for link in links:
                all_links.append({
                    'source': index_map[link['source']],
                    'target': index_map[link['target']],
                })
        self.response.write(json.dumps({
            'nodes': all_nodes,
            'links': all_links,
        }))


class ParticipantJsonHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        self.response.write(participant.json)

    def put(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        participant.json = self.request.body.decode('utf-8') or DEFAULT_JSON
        participant.put()
        self.response.write(json.dumps(participant.dump()))


app = webapp2.WSGIApplication([
    ('/api/projects', ProjectsHandler),
    ('/api/projects/([\w\-]+)', ProjectHandler),
    ('/api/projects/([\w\-]+)/grid', ProjectGridHandler),
    ('/api/participants/([\w\-]+)', ParticipantsHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)', ParticipantHandler),
    ('/api/participants/([\w\-]+)/([\w\-]+)/grid', ParticipantJsonHandler),
], debug=True)
