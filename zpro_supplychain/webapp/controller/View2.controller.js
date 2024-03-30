sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
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
                var aTablePayload = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results;
                var len = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results.length;
                for (let index = 0; index < len; index++) {
                    for (const key in aTablePayload[index]) {
                        if (Object.hasOwnProperty.call(aTablePayload[index], key)) {
                            if (key === 'ApprovedFrightprice') {
                                const element = aTablePayload[index]['ApprovedFrightprice'];
                                debugger;
                                if (element === '0.00') {
                                    vValidation = 0;

                                    this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[8].setValueState("Error");
                                    // this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3]
                                } else {
                                    vValidation = 1;
                                    this.getView().byId("idV2TblProducts").getItems()[index].getAggregation("cells")[8].setValueState("None")
                                }
                            }
                        }
                    }

                }
                if (vValidation === 1) {
                    var payload = {
                        "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                        "Action": "FRENG",
                        "NAV_SC_HEADER": []
                    }
                    var nLen = this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results.length;
                    for (let index = 0; index < nLen; index++) {
                        delete this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results[index].__metadata
                        payload.NAV_SC_HEADER.push(
                            {
                                "Pafno": this.getView().getModel("oRequestModel").getData().Pafno,
                                "Posnr": (index + 1).toString(),
                                "ApprovedFrightprice": this.getView().getModel("oRequestModel").getData().NAV_SC_HEADER.results[index].ApprovedFrightprice
                            }
                        )
                    }


                    var sPath = "/ET_SC_HEADERSet";
                    this.getView().setBusy(true);
                    this.getView().getModel().create(sPath, payload, {
                        async: false,
                        success: function (oData) {
                            this.getView().setBusy(false);
                            sap.m.MessageBox.success("Renegotiation sent successfully", {
                                onClose: function () {
                                    this.oRouter.navTo("page1", {});
                                }.bind(this)
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

                        sap.m.MessageBox.success("Renegotiation decision sent successfully", {
                            onClose: function () {
                                this.oRouter.navTo("page1", {});
                            }.bind(this)
                        });
                    
                    },
                    error: function (err) {



                    }
                });


            }
        });
    });