/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"prj/sales_coordinator/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
