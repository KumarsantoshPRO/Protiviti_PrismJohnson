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
                var vValidation = 0;
                var aTablePayload = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results;
                var len = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results.length;
                for (let index = 0; index < len; index++) {
                    for (const key in aTablePayload[index]) {
                        if (Object.hasOwnProperty.call(aTablePayload[index], key)) {
                            if (key === 'ApprovedBuyingprice') {
                                const element = aTablePayload[index]['ApprovedBuyingprice'];
                                if (element === '0.00') {
                                    vValidation = 0;

                                    this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[9].setValueState("Error");
                                    // this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3]
                                } else {
                                    vValidation = 1;
                                    this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[9].setValueState("None")
                                }
                            }
                        }
                    }

                }
                if (vValidation === 1) {
                    var payload = {
                        "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                        "Action": "BPRENG",
                        "NAV_PM_REQUEST": []
                    }
                    var nLen = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results.length;
                    for (let index = 0; index < nLen; index++) {
                        delete this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].__metadata
                        payload.NAV_PM_REQUEST.push(
                            {
                                "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                                "Posnr": (index+1).toString(),
                                "ApprovedBuyingprice": this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].ApprovedBuyingprice
                            }
                        )
                    }

                    
                    var sPath = "/ET_PM_HEADERSet";
                    this.getView().setBusy(true);
                    this.getView().getModel().create(sPath, payload, {
                        async: false,
                        success: function (oData) {
                            this.getView().setBusy(false);
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
                        }.bind(this),
                        error: function (err) {

                            this.getView().setBusy(false);

                        }
                    });


                } else {
                    sap.m.MessageBox.error("Please enter 'Approved Buying Price'");
                }

            },
            onNegotiationNotPossibleButtonPress: function () {

                var nLen = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results.length;
                for (let index = 0; index < nLen; index++) {
                    delete this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].__metadata
                }


                var payload = {
                    "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                    "Action": "NBPRENG",
                    "NAV_PM_REQUEST": this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results
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