sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./NavigationJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "zpj.pro.sk.sd.supplychain.zprosupchain.zprosupplychain.view.",
		autoWait: true
	});
});
