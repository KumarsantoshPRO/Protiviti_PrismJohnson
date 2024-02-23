/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Image/Image/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});