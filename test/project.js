describe('test Project', function() {
  var requests = [];
  var xhr;

  before(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function(request) {
      requests.push(request);
    };
  });

  beforeEach(function() {
    requests = [];
    localStorage.clear();
  });

  after(function() {
    xhr.restore();
  });

  it('test get Project', function(done) {
    var projectData = {
      key: '1',
      name: 'Test Project',
      note: 'Project for test',
      createdAt: '2014-03-26T08:10:13Z',
      updatedAt: '2014-03-26T08:10:13Z'
    };

    expect(localStorage['lindo_de_remedio']).to.be(undefined);

    egrid.model.Project.get('1')
      .then(function(project) {
        expect(project.key).to.be('1');
        expect(project.name).to.be('Test Project');
        expect(project.note).to.be('Project for test');
        expect(project.createdAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());
        expect(project.updatedAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());

        var storageProject = JSON.parse(localStorage.lindo_de_remedio).Project[1];
        expect(storageProject).to.be.eql(projectData);

        done();
      });

    expect(requests.length).to.be(1);
    var request = requests[0];
    expect(request.method).to.be('GET');
    expect(request.url).to.be('/api/projects/1');
    expect(request.requestHeaders['Content-Type']).to.be('application/json');

    request.respond('200', {}, JSON.stringify(projectData));
  });

  it('test query Project', function(done) {
    var projectsData = [
      {
        key: '1',
        name: 'Test Project 1',
        note: 'Project for test',
        createdAt: '2014-03-26T08:10:13Z',
        updatedAt: '2014-03-26T08:10:13Z'
      },
      {
        key: '2',
        name: 'Test Project 2',
        note: 'Project for test',
        createdAt: '2014-03-26T08:10:13Z',
        updatedAt: '2014-03-26T08:10:13Z'
      }
    ];

    expect(localStorage['lindo_de_remedio']).to.be(undefined);

    egrid.model.Project.query()
      .then(function(projects) {
        expect(projects[1].key).to.be('1');
        expect(projects[1].name).to.be('Test Project 1');
        expect(projects[1].note).to.be('Project for test');
        expect(projects[1].createdAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());
        expect(projects[1].updatedAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());

        expect(projects[2].key).to.be('2');
        expect(projects[2].name).to.be('Test Project 2');
        expect(projects[2].note).to.be('Project for test');
        expect(projects[2].createdAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());
        expect(projects[2].updatedAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());

        var storage = JSON.parse(localStorage.lindo_de_remedio);
        expect(storage.Project[1]).to.be.eql(projectsData[0]);
        expect(storage.Project[2]).to.be.eql(projectsData[1]);

        done();
      });

    expect(requests.length).to.be(1);
    var request = requests[0];
    expect(request.method).to.be('GET');
    expect(request.url).to.be('/api/projects');
    expect(request.requestHeaders['Content-Type']).to.be('application/json');

    request.respond('200', {}, JSON.stringify(projectsData));
  });
});
