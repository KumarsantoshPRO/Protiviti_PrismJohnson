/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "zpj/pro/sk/sd/supplychain/zprosupchain/zprosupplychain/model/models",
        "zpj/pro/sk/sd/supplychain/zprosupchain/zprosupplychain/model/formatter"
    ],
    function (UIComponent, Device, models, formatter) {
        "use strict";

        return UIComponent.extend("zpj.pro.sk.sd.supplychain.zprosupchain.zprosupplychain.Component", {
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

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);