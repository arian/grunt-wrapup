/*
 * grunt-wrapup
 * https://github.com/arian/grunt-wrapup
 *
 * Copyright (c) 2013 Arian Stolwijk
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {

  grunt.loadTasks('tasks');

  grunt.initConfig({
    wrapup: {
      build: {
        requires: {
          "./test/main.js": true,
          "prime": "prime"
        },
        options: {
          "compress": true,
          "output": "built.js"
        }
      }
    }
  });

};
