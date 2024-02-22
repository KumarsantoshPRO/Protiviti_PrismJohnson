/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "prj/salescoordinator/model/models",
        "prj/salescoordinator/model/formatter",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, formatter, JSONModel) {
        "use strict";
      
        return UIComponent.extend("prj.salescoordinator.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                var oModel = new JSONModel("./model/tableJSONData.json");
                     oModel.setDefaultBindingMode("OneWay");

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