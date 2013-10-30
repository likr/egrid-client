from google.appengine.api import users
from google.appengine.ext import db
from version import VERSION


class User(db.Model):
    location = db.StringProperty(default="ja", required=True)
    email = db.StringProperty(required=True)
    user = db.UserProperty()
    created_at = db.DateTimeProperty(auto_now_add=True)
    updated_at = db.DateTimeProperty(auto_now=True)
    version = db.IntegerProperty(default=VERSION)

    def to_dict(self):
        return {
            "location": self.location,
            'email': self.email,
            'nickname': self.user.nickname(),
            'user_id': self.user.user_id(),
            'federated_identity': self.user.federated_identity(),
            'federated_provider': self.user.federated_provider(),
        }

    @staticmethod
    def current_user():
        current_user = users.get_current_user()
        user = User.all().filter('user =', current_user).get()
        if not user:
            user = User(
                user=current_user,
                email=current_user.email())
            user.put()
        return user


class Project(db.Model):
    name = db.StringProperty(required=True)
    note = db.TextProperty()
    created_at = db.DateTimeProperty(auto_now_add=True)
    updated_at = db.DateTimeProperty(auto_now=True)
    version = db.IntegerProperty(default=VERSION)

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
    version = db.IntegerProperty(default=VERSION)

    def dump(self):
        return {
            'key': str(self.key()),
            'name': self.name,
            'note': self.note,
            'project': self.project.dump(),
            'json': self.json,
        }


class Collaborator(db.Model):
    project = db.ReferenceProperty(Project)
    user = db.ReferenceProperty(User)
    is_manager = db.BooleanProperty(default=False)
    created_at = db.DateTimeProperty(auto_now_add=True)
    updated_at = db.DateTimeProperty(auto_now=True)
    version = db.IntegerProperty(default=VERSION)

    def to_dict(self):
        return {
            'key': str(self.key()),
            'user': self.user.to_dict(),
            'is_manager': int(bool(self.is_manager))
        }
