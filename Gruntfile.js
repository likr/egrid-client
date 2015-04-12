module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    typescript: {
      base: {
        src: ['src/egrid-client.ts'],
        dest: 'egrid-client.js',
        options: {
          module: 'commonjs',
          declaration: true,
          target: 'es5',
          noImplicitAny: true
        }
      }
    },
    mocha_phantomjs: {
      options: {
        'reporter': 'dot'
      },
      all: ['test/**/*.html']
    },
    watch: {
      scripts: {
        files: ['src/**/*.ts'],
        tasks: ['typescript'],
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['typescript']);
  grunt.registerTask('test', ['mocha_phantomjs']);
};
