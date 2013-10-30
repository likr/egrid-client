import json
import webapp2
from api.models import Participant
from api.models import Project
DEFAULT_JSON = '{"nodes":[],"links":[]}'


class ParticipantHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id=None):
        if participant_id:
            participant = Participant.get(participant_id)
            self.response.write(json.dumps(participant.dump()))
        else:
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


class ParticipantGridHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        self.response.write(participant.json)

    def put(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        participant.json = self.request.body.decode('utf-8') or DEFAULT_JSON
        participant.put()
        self.response.write(json.dumps(participant.dump()))
