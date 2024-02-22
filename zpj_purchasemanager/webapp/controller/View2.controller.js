sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("pj.zpurchasemanager.controller.View2", {
            onInit: function () {
                this.getData();
            },
            getData: function() {

                var oGetDataModel = new JSONModel(
                    {
                        "customer": "Bharath Marble",
                        "siz":"300X150",
                        "des":"TINTONDK",
                        "sour":"Coral",
                        "vol":"20000",
                        "val":"20",
                        "mfg":"WDGIDOL",
                        "dis":"25%",
                        "nef":"202.5",
                        "neff":"18.8",
                        "fs":"No",
                        "sts":"Pending",
                        "rem":"Long term dealer",
                        "ren":"-"
                    });
                    this.getView().setModel(oGetDataModel, "oRequestModel");
            },

            onBack: function() {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1",{});
            }
        });
    });