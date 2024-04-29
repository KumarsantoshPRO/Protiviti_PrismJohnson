sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        MessageToast,
        MessageBox) {
        "use strict";

        return Controller.extend("pj.zpurchasemanager.controller.View2", {
            onInit: function () {

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
                this.oRouter;
            },



            onRouteMatched: function (oEvent) {
                var pafID = oEvent.getParameter("arguments").ID;

                if (pafID === "null" || pafID === undefined) {

                } else {
                    this.oRouter = this.getOwnerComponent().getRouter();
                    var sPath = "/ET_PM_HEADERSet('" + pafID + "')";
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        // filters: aFilter,
                        urlParameters: {
                            "$expand": "NAV_PM_REQUEST"
                        },
                        success: function (Data) {
                            if (Data.NAV_PM_REQUEST.results[0].Status === 'A' || Data.NAV_PM_REQUEST.results[0].Status === 'R') {
                                this.getView().byId("id.bp.Column").setVisible(false);
                                this.getView().byId("id.negotiationnotpossible.Button").setVisible(false);
                                this.getView().byId("id.renegotiation.Button").setVisible(false);
                            } else {
                                this.getView().byId("id.bp.Column").setVisible(true);
                                this.getView().byId("id.negotiationnotpossible.Button").setVisible(true);
                                this.getView().byId("id.renegotiation.Button").setVisible(true);
                            }
                            
                            this.getView().setModel(new JSONModel(Data), "oRequestModel");
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {

                                }
                            });

                        }.bind(this)
                    });
                }
            },

            onBack: function () {

                this.oRouter.navTo("page1", {});
            },
            onRenegotiationButtonPress: function () {
                var vValidation = 1;
                var aTablePayload = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results;
                var len = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results.length;
                // for (let index = 0; index < len; index++) {
                //     for (const key in aTablePayload[index]) {
                //         if (Object.hasOwnProperty.call(aTablePayload[index], key)) {
                //             if (key === 'ApprovedBuyingprice') {
                //                 const element = aTablePayload[index]['ApprovedBuyingprice'];
                //                 if (element === '0.00') {
                //                     vValidation = 0;

                //                     this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[9].setValueState("Error");
                //                     // this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3]
                //                 } else {
                //                     vValidation = 1;
                //                     this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[9].setValueState("None")
                //                 }
                //             }
                //         }
                //     }

                // }
                if (vValidation === 1) {
                    var payload = {
                        "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                        "Action": "BPRENG",
                        "NAV_PM_REQUEST": []
                    }
                    var nLen = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results.length;
                    for (let index = 0; index < nLen; index++) {
                        delete this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].__metadata
                        var ApprovedBuyingprice = this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].ApprovedBuyingprice

                        if (ApprovedBuyingprice === null || ApprovedBuyingprice === undefined || ApprovedBuyingprice === '') {
                            ApprovedBuyingprice = '0.00';
                        }
                         
                        payload.NAV_PM_REQUEST.push(
                            {
                                "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                                "Posnr": this.getView().getModel("oRequestModel").getData().NAV_PM_REQUEST.results[index].Posnr,
                                "ApprovedBuyingprice": ApprovedBuyingprice
                            }
                        )
                    }


                    var sPath = "/ET_PM_HEADERSet";
                    this.getView().setBusy(true);
                    this.getView().getModel().create(sPath, payload, {
                        async: false,
                        success: function (oData) {
                            this.getView().setBusy(false);
                            sap.m.MessageBox.success("BP Renegotiation approved", {
                                onClose: function () {
                                    this.oRouter.navTo("page1", {});
                                }.bind(this)
                            });

                        }.bind(this),
                        error: function (oError) {

                            this.getView().setBusy(false);
                            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {

                                }
                            });

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

                        sap.m.MessageBox.success("BP Renegotiation rejected", {
                            onClose: function () {
                                this.oRouter.navTo("page1", {});
                            }.bind(this)
                        });

                    },
                    error: function (oError) {

                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {

                            }
                        });

                    }
                });


            },
            onApprovedBuyingpriceInputLiveChange: function (oEvent) {
                var sValue = oEvent.getSource().getValue();

                if (sValue.includes(".")) {
                    if (sValue.split(".")[1].length > 2) {
                        MessageToast.show("Only 2 Decimal allowed");
                        sValue = sValue.substring(0, sValue.length - 1);
                        oEvent.getSource().setValue(sValue);
                    }
                }
                if (isNaN(sValue)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue("");
                }
            }
        });
    });