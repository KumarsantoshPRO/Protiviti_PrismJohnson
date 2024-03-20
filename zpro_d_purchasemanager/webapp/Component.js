/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "pj/zpurchasemanager/model/models",
        "pj/zpurchasemanager/model/formatter"
    ],
    function (UIComponent, Device, models, formatter) {
        "use strict";

        return UIComponent.extend("pj.zpurchasemanager.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // var oRenderer = sap.ushell.Container.getRenderer("fiori2");
                // oRenderer.setHeaderVisibility(false, false, ["home", "app"]);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);