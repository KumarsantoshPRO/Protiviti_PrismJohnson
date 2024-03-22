/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zpjprosksdsupplychainzprosupchain/zpro_supplychain/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
