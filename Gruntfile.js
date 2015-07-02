module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            project: {
                options: {
                    mangle: true
                },
                src: ['ng-slim-scroll.js'],
                dest: 'ng-slim-scroll.min.js'    
            }
        },
        less: {
            project: {
                options: {
                    compress: true
                },
                src: ['ng-slim-scroll.less'],
                dest: 'ng-slim-scroll.css'    
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('build', ['uglify', 'less']);
};