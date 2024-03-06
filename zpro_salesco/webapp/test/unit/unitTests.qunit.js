/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zpjprosksdsalescoordinator/zpro_salesco/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
