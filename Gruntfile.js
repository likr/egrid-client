module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngtemplates: {
      collaboegm: {
        cwd: 'static',
        dest: 'static/scripts/templates.js',
        options: {
          prefix: '/',
        },
        src: 'partials/**/*.html'
      }
    },
    ts: {
      dev: {
        out: 'static/scripts/collaboegm.js',
        src: ['ts/app/app.ts'],
        options: {
          sourceMap: false,
          target: 'es5',
        },
      },
      prod: {
        out: 'static/scripts/collaboegm.min.js',
        src: ['ts/app/app.ts'],
        options: {
          removeComments: true,
          sourceMap: false,
          target: 'es5',
        },
      }
    },
    watch: {
      scripts: {
        files: ['ts/**/*.ts'],
        tasks: ['ts:dev'],
      },
      templates: {
        files: ['static/partials/**/*.html'],
        tasks: ['ngtemplates'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', ['watch']);
};
