sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("pj.zpurchasemanager.controller.View2", {
            onInit: function () {

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
            },



            onRouteMatched: function (oEvent) {
                var pafID = oEvent.getParameter("arguments").ID;
                
                if (pafID === "null" || pafID === undefined) {
                } else {
                    var sPath = "/ET_PM_HEADERSet('" + pafID + "')";
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        // filters: aFilter,
                        urlParameters: {
                            "$expand": "NAV_PM_REQUEST"
                        },
                        success: function (Data) {
                            debugger;
                            this.getView().setModel(new JSONModel(Data), "oRequestModel");
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {

                                }
                            });

                        }.bind(this)
                    });
                }
            },

            onBack: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1", {});
            },
            onRenegotiationButtonPress: function () {

                if (this.getView().byId("id.Renegotiation.Input").getValue()) {
                    var nLen = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results;
                    for (let index = 0; index < nLen; index++) {
                        delete this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].__metadata   
                    }
    
             
                    var payload = {
                        "Pafno": oEvent.getParameter("arguments").ID,
                        "Action": "BPRENG",
                        "NAV_PM_REQUEST":this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results 
                    }

                    oODataModel.create("/ET_PM_APPROVALSet", payload, {
                        async: false,
                        success: function (oData) {
                       
                            sap.m.MessageBox.success("Renegotiation sent successfully", {
                                onClose: function () {
                                    var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                    navigator.toExternal({
                                        target: {
                                            semanticObject: "#"
                                        }
                                    });
                                }
                            });
                        },
                        error: function (err) {

                            

                        }
                    });


                } else {
                    sap.m.MessageBox.error("Please enter Renegotiation(BP) value");
                }

            },
            onNegotiationNotPossibleButtonPress: function () {

                var nLen = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results;
                for (let index = 0; index < nLen; index++) {
                    delete this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].__metadata   
                }

                debugger;
                var payload = {
                    "Pafno": oEvent.getParameter("arguments").ID,
                    "Action": "NBPRENG",
                    "NAV_PM_REQUEST":this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results 
                }

                var sPath = "/ET_PM_HEADERSet";
                this.getView().setBusy(true);
                this.getView().getModel().create(sPath, payload, {
                    async: false,
                    success: function (oData) {

                        sap.m.MessageBox.success("Renegotiation decision sent successfully", {
                            onClose: function () {
                                var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                navigator.toExternal({
                                    target: {
                                        semanticObject: "#"
                                    }
                                });
                            }
                        });
                    },
                    error: function (err) {



                    }
                });


            }
        });
    });