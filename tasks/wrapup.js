/*
 * grunt-wrapup
 * https://github.com/arian/grunt-wrapup
 *
 * Copyright (c) 2013 Arian Stolwijk
 * Licensed under the MIT license.
 */

"use strict";

var wrapup = require('wrapup')
var path = require('path')

module.exports = function(grunt) {

    grunt.registerMultiTask('wrapup', 'Wraps node modules into web modules', function() {

        var done = this.async()

        var wrup = wrapup()

        if (this.data.options){
            wrup.options(this.data.options)
        }

        if (this.data.requires){
            for (var name in this.data.requires){
                var r = this.data.requires[name]
                var file = typeof r == 'string' ? r : name
                file = path.join(process.cwd(), file)
                if (typeof r == 'string') wrup.require(name, file)
                else wrup.require(file)
            }
        }

        wrup.up(done)

    })

};

