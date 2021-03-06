'use strict';

module.exports = function (grunt) {

  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    mochaTest: {
      test: {
        src: ['test/**/*_test.js'],
        options: {
          timeout: 30000
        }

      },
      live: {
        src: ['test/**/*_live.js']
      }
    },
    mocha_istanbul: {
      test: {
        src: ['test/it/*_it.js', 'test/**/*_test.js'],
        options: {
          coverage: true,
          require: ['test/common.js'],
          timeout: 30000
        }
      },
      coverage: {
        src: 'test', // the folder, not the files,
        options: {
          mask: '**/*_test.js',
          require: ['test/common.js'],
          timeout: 30000
        }
      },
      it: {
        src: 'test', // the folder, not the files,
        options: {
          mask: '**/*_it.js',
          require: ['test/common.js'],
          timeout: 30000
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'mochaTest']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochaTest']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task.
  grunt.registerTask('test', ['mochaTest:test']);
  grunt.registerTask('it', ['jshint','mocha_istanbul:it']);
  grunt.registerTask('live', ['mochaTest:live']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  grunt.registerTask('default', ['jshint', 'mocha_istanbul:test']);

  // Once our coverage reports have been generated, fire off coverage reports to
  // coveralls.io so our coverage is made public.
  grunt.event.on('coverage', function(lcov, done) {
    require('coveralls').handleInput(lcov, function(err) {
      done(err);
    });
  });
};
