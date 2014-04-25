describe('test Project', function() {
  it('hoge', function() {
    expect(1).to.be.ok();
  });

  it('test get Project', function(done) {
    var requests = [];
    var xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function(request) {
      requests.push(request);
    };

    var project = new egrid.model.Project()
    project.get('1')
      .then(function() {
        expect(project.name).to.be.eql('Test Project');
        done();
      });

    expect(requests.length).to.be(1);
    var request = requests[0];
    expect(request.method).to.be('GET');
    expect(request.url).to.be('/api/projects/1');

    request.respond('200', {}, JSON.stringify({
      key: '1',
      name: 'Test Project',
      note: 'Project for test',
      created_at: '2014-03-26T08:10:13Z',
      updated_at: '2014-03-26T08:10:13Z'
    }));

    xhr.restore();
  });
});
