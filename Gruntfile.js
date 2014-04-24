module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      dev: {
        out: 'egrid-client.js',
        src: ['src/egrid-client.ts'],
        options: {
          sourceMap: false,
          target: 'es5',
        },
      },
      prod: {
        out: 'egrid-client.min.js',
        src: ['src/egrid-client.ts'],
        options: {
          removeComments: true,
          sourceMap: false,
          target: 'es5',
        },
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.ts'],
        tasks: ['ts:dev'],
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', ['ts:prod']);
};
