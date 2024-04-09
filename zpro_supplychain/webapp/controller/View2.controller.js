sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, MessageToast) { 
        "use strict";

        return Controller.extend("zpj.pro.sk.sd.supplychain.zprosupchain.zprosupplychain.controller.View2", {
            onInit: function () { 

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
            },



            onRouteMatched: function (oEvent) {
                var pafID = oEvent.getParameter("arguments").pafID;
                debugger;
                if (pafID === "null" || pafID === undefined) {

                } else {
                    this.oRouter = this.getOwnerComponent().getRouter();
                    var sPath = "/ET_SC_HEADERSet('" + pafID + "')";
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        // filters: aFilter,
                        urlParameters: {
                            "$expand": "NAV_SC_HEADER"
                        },
                        success: function (Data) {
                            if (Data.NAV_SC_HEADER.results[0].Status === 'A' || Data.NAV_SC_HEADER.results[0].Status === 'R') {
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
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1", {});
            },
            onRenegotiationButtonPress: function () {
                var vValidation = 0;
                var aTablePayload = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results;
                var len = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results.length;
                // for (let index = 0; index < len; index++) {
                //     for (const key in aTablePayload[index]) {
                //         if (Object.hasOwnProperty.call(aTablePayload[index], key)) {
                //             if (key === 'ApprovedFrightprice') {
                //                 const element = aTablePayload[index]['ApprovedFrightprice'];
                //                 debugger;
                //                 if (element === '0.00') {
                //                     vValidation = 0;

                //                     this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[8].setValueState("Error");
                //                     // this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3]
                //                 } else {
                //                     vValidation = 1;
                //                     this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[8].setValueState("None")
                //                 }
                //             }
                //         }
                //     }

                // }
                // if (vValidation === 1) {
                var payload = {
                    "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                    "Action": "FRENG",
                    "NAV_SC_HEADER": []
                }
                var nLen = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results.length;
                
                for (let index = 0; index < nLen; index++) {
                    delete this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results[index].__metadata;
                    var ApprovedFrightprice = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results[index].ApprovedFrightprice
                    if (ApprovedFrightprice === null || ApprovedFrightprice === undefined || ApprovedFrightprice === '') {
                        ApprovedFrightprice = '0.00';
                    } 
                    payload.NAV_SC_HEADER.push(
                        {
                            "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                            "Posnr": this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results[index].Posnr,
                            "ApprovedFrightprice": ApprovedFrightprice
                        }
                    )
                }


                var sPath = "/ET_SC_HEADERSet";
                this.getView().setBusy(true);
                this.getView().getModel().create(sPath, payload, {
                    async: false,
                    success: function (oData) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success("Freight Renegotiation approved", {
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


                // } else {
                //     sap.m.MessageBox.error("Please enter 'Approved Buying Price'");
                // }

            },
            onNegotiationNotPossibleButtonPress: function () {

                var nLen = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results.length;
                for (let index = 0; index < nLen; index++) {
                    delete this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results[index].__metadata
                }


                var payload = {
                    "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                    "Action": "NFRENG",
                    "NAV_SC_HEADER": this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results
                }

                var sPath = "/ET_SC_HEADERSet";
                this.getView().setBusy(true);
                this.getView().getModel().create(sPath, payload, {
                    async: false,
                    success: function (oData) {

                        sap.m.MessageBox.success("Freight Renegotiation rejected", {
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
            onApprovedFrightpriceInputLiveChange: function (oEvent) {
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