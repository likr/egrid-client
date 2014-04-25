describe('test Project', function() {
  var requests = [];
  var xhr;
  var clock

  before(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function(request) {
      requests.push(request);
    };

    clock = sinon.useFakeTimers();
  });

  beforeEach(function() {
    requests = [];
    localStorage.clear();
  });

  after(function() {
    xhr.restore();
    clock.restore();
  });

  it('test new Project', function() {
    var project = new egrid.model.Project({
      name: 'Test Project',
      note: 'This is a memo'
    });

    expect(project.key).to.be(undefined);
    expect(project.createdAt).to.be(undefined);
    expect(project.updatedAt).to.be(undefined);
    expect(project.name).to.be('Test Project');
    expect(project.note).to.be('This is a memo');
  });

  it('test writing properties of Project', function() {
    var project = new egrid.model.Project();

    project.name = 'Test Project';
    project.note = 'This is a memo';

    expect(project.name).to.be('Test Project');
    expect(project.note).to.be('This is a memo');
    expect(function() {
      project.key = 'key';
    }).to.throwError();
    expect(function() {
      project.createdAt = new Date();
    }).to.throwError();
    expect(function() {
      project.updatedAt = new Date();
    }).to.throwError();
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

        var storageProject = JSON.parse(localStorage.lindo_de_remedio).Project['1'];
        expect(storageProject).to.be.eql(projectData);

        done();
      });

    expect(requests.length).to.be(1);
    var request = requests[0];
    expect(request.method).to.be('GET');
    expect(request.url).to.be('/api/projects/1');
    expect(request.requestHeaders['Content-Type']).to.be('application/json');

    request.respond(200, {}, JSON.stringify(projectData));
  });

  it('test get Project fallback', function(done) {
    $.ajaxSetup({
      timeout: 100
    });

    var projectData = {
      key: '1',
      name: 'Test Project',
      note: 'Project for test',
      createdAt: '2014-03-26T08:10:13Z',
      updatedAt: '2014-03-26T08:10:13Z'
    };

    localStorage.lindo_de_remedio = JSON.stringify({
      Project: {
        '1': projectData
      }
    });

    egrid.model.Project.get('1')
      .then(function(project) {
        expect(project.key).to.be('1');
        expect(project.name).to.be('Test Project');
        expect(project.note).to.be('Project for test');
        expect(project.createdAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());
        expect(project.updatedAt.getTime()).to.be(new Date('2014-03-26T08:10:13Z').getTime());

        done();
      });

    expect(requests.length).to.be(1);
    var request = requests[0];
    expect(request.method).to.be('GET');
    expect(request.url).to.be('/api/projects/1');
    expect(request.requestHeaders['Content-Type']).to.be('application/json');

    clock.tick(10000);
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

    request.respond(200, {}, JSON.stringify(projectsData));
  });

  it('test query Project fallback', function(done) {
    $.ajaxSetup({
      timeout: 100
    });

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

    localStorage.lindo_de_remedio = JSON.stringify({
      Project: {
        '1': projectsData[0],
        '2': projectsData[1]
      }
    });

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

        done();
      });

    expect(requests.length).to.be(1);
    var request = requests[0];
    expect(request.method).to.be('GET');
    expect(request.url).to.be('/api/projects');
    expect(request.requestHeaders['Content-Type']).to.be('application/json');

    clock.tick(10000);

  });
});
