/*
 * View model for OctoPrint-AutoCollapse
 *
 * Author: ntoff
 * License: AGPLv3
 */
$(function() {
    function AutocollapseViewModel(parameters) {
        var self = this;
        'use strict';
        self.settings = parameters[0];
        self.filesInitialTimer = null;
        self.filesIntervalTimer = null;
        self.gcodeInitialTimer = null;
        self.gcodeIntervalTimer = null;

        self.filesCollapse = function() {
            var filesTrigger = $('[data-target="#files"]');
            if (!filesTrigger.hasClass('collapsed')) {
                filesTrigger.click();
            }
        }
        
        self.gcodeCollapse = function() {
            var gcodeTrigger = $('[data-target="#sidebar_plugin_gcodebar"]');
            if (!gcodeTrigger.hasClass('collapsed')) {
                gcodeTrigger.click();
            }
        }
        
        self.initInitial = function () {
            var filesInitialTimeout = parseInt(self.settings.settings.plugins.autocollapse.filesInitialTimeout());
            var gcodeInitialTimeout = parseInt(self.settings.settings.plugins.autocollapse.gcodeInitialTimeout());
            clearTimeout(self.filesInitialTimer);
            if (filesInitialTimeout) {
                self.filesInitialTimer = setTimeout(self.filesCollapse, filesInitialTimeout * 1000);
            }
            clearTimeout(self.gcodeInitialTimer);
            if (gcodeInitialTimeout) {
                self.gcodeInitialTimer = setTimeout(self.gcodeCollapse, gcodeInitialTimeout * 1000);
            }
        }
        
        self.initFilesInterval = function () {
            var filesIntervalTimeout = parseInt(self.settings.settings.plugins.autocollapse.filesIntervalTimeout());
            clearTimeout(self.filesIntervalTimer);
            if (filesIntervalTimeout) {
                self.filesIntervalTimer = setTimeout(self.filesCollapse, filesIntervalTimeout * 1000);
            }
        }
        
        self.initGcodeInterval = function () {
            var gcodeIntervalTimeout = parseInt(self.settings.settings.plugins.autocollapse.gcodeIntervalTimeout());
            clearTimeout(self.gcodeIntervalTimer);
            if (gcodeIntervalTimeout) {
                self.gcodeIntervalTimer = setTimeout(self.gcodeCollapse, gcodeIntervalTimeout * 1000);
            }
        }
        
        self.initInterval = function () {
            self.initFilesInterval();
            self.initGcodeInterval();
        }
        
        $('#files_wrapper')
            .on('mouseover', function() {
                clearTimeout(self.filesInitialTimer);
                clearTimeout(self.filesIntervalTimer);
            })
            .on('mouseout', function() {
                self.initFilesInterval();
            });
        
        $('#sidebar_plugin_gcodebar_wrapper')
            .on('mouseover', function() {
                clearTimeout(self.gcodeInitialTimer);
                clearTimeout(self.gcodeIntervalTimer);
            })
            .on('mouseout', function() {
                self.initGcodeInterval();
            });        

        self.onBeforeBinding = function () {
            self.initInitial();
            self.initInterval();
        }

        self.onSettingsHidden = function () {
            self.initInterval();
        }
        
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: AutocollapseViewModel,
        dependencies: [ "settingsViewModel"],
    });
});
