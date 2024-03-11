sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Core",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/library",
    "sap/m/TextArea",
    "pj/zpmg/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Core, Dialog, Button, Label, mobileLibrary, TextArea, formatter) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("pj.zpmg.controller.View2", {
            formatter: formatter,
            onInit: function () {
                var oProductModel = new JSONModel();
                this.getView().setModel(oProductModel, "ProductModel");

                var oSouceModel = new JSONModel();
                this.getView().setModel(oSouceModel, "SouceModel");

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
                this.getData();
            },

            // Attach route matched method
            onRouteMatched: function (oEvent) {
                var pafID = oEvent.getParameter("arguments").pafID;
                if (pafID !== "null" || pafID !== undefined) {
                    this.getView().byId("idObjectHeader").setObjectTitle("PAF NO : " + pafID.replace(/^0+/, ''));
                    this.getRequestDetails(pafID);
                    this.pafID = pafID;
                    //this.getSourceDetails(pafID);
                }
            },

            getRequestDetails: function (pafID) {
                this.getView().setBusy(true);
                var filter = new sap.ui.model.Filter({
                    path: "Pafno",
                    operator: "EQ",
                    value1: pafID
                });

                this.getOwnerComponent().getModel().read("/ET_PMG_REQUEST_ITEMSet", {
                    filters: [filter],
                    urlParameters: {
                        "$expand": "NAV_PMG_ITEM_PRODUCT"
                    },
                    success: function (oData) {
                        var oModel = this.getView().getModel("oRequestModel");
                        oModel.setData(oData.results[0]);
                        this.getView().setModel(oModel, "oRequestModel");

                        var oPrdModel = this.getView().getModel("ProductModel");
                        oPrdModel.setData(oData.results[0].NAV_PMG_ITEM_PRODUCT.results);
                        this.getView().setModel(oPrdModel, "ProductModel");
                        this.getView().setBusy(false);
                        this.getSourceDetails(this.pafID);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            getSourceDetails: function (pafNo) {
                this.getView().setBusy(true);
                var newFilArray = new Array();
                var oDomfilter1 = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "SOURCE"  //pafID
                });
                newFilArray.push(oDomfilter1);

                var oDomfilter2 = new sap.ui.model.Filter({
                    path: "Domname1",
                    operator: "EQ",
                    value1: ""  //pafID
                });
                newFilArray.push(oDomfilter2);

                var oDomfilter3 = new sap.ui.model.Filter({
                    path: "Domname2",
                    operator: "EQ",
                    value1: pafNo  //pafID
                });
                newFilArray.push(oDomfilter3);

                //var oNewModel = ZCUSTOMER_AUTOMATIONDISCOUNT_SRV
                var newValHelpModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSTOMER_AUTOMATIONDISCOUNT_SRV/", true);
                newValHelpModel.read("/ET_VALUE_HELPSSet", {
                    filters: newFilArray,
                    success: function (oData) {
                        var oModel = this.getView().getModel("SouceModel");
                        oModel.setData(oData.results);
                        this.getView().setModel(oModel, "SouceModel");

                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            onChangeSource: function (oEvent) {
                this.getView().setBusy(true);
                var oModeldata = this.getView().getModel("ProductModel").getData();
                var newProductArr = new Array();
                for (var i = 0; i < oModeldata.length; i++) {
                    var newObj = {
                        "Pafno": oModeldata[i].Pafno,
                        "Posnr": oModeldata[i].Posnr,
                        "vkbur": oModeldata[i].vkbur,
                        "Mfrgr": oModeldata[i].Mfrgr,
                        "Volume": oModeldata[i].Volume,
                        "Szcm": oModeldata[i].Szcm,
                        "Design": oModeldata[i].Design,
                        "Source": oModeldata[i].Source,
                        "Zvolume": oModeldata[i].Zvolume,
                        "Zvolumepft": oModeldata[i].Zvolumepft,
                        "Discount": oModeldata[i].Discount,
                        "Netexfactory": oModeldata[i].Netexfactory,
                        "Buyingprice": oModeldata[i].Buyingprice,
                        "Grossmarg": oModeldata[i].Grossmarg,
                        "Buyingpricesqft": oModeldata[i].Buyingpricesqft
                    }
                    newProductArr.push(newObj);
                }
                var newEntry = {
                    "Pafno": this.pafID,
                    "NAV_PMG_ITEM_PRODUCT": newProductArr
                };
                //return;
                this.getOwnerComponent().getModel().create('/ET_PMG_REQUEST_ITEMSet', newEntry, {
                    success: function (oData, response) {
                        debugger;
                        var oPrdModel = this.getView().getModel("ProductModel");
                        oPrdModel.setData(oData.NAV_PMG_ITEM_PRODUCT.results);
                        this.getView().setModel(oPrdModel, "ProductModel");
                        this.getView().getModel("ProductModel").refresh(true);
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (error) {
                        this.getView().setBusy(false);
                        MessageBox.error(error.responseText);
                    }.bind(this)
                });

            },





            getData: function () {

                var oGetDataModel = new JSONModel();
                // {
                //     "customer": "Bharath Marble",
                //     "vol":"23000",
                //     "val":"9.2",
                //     "grmpe":"17%",
                //     "grmps":"17.1",
                //     "reg":"NI-CHANDIGAR",
                //     "vol1":"23000",
                //     "val1":"8.7",
                //     "grmpe1":"14%",
                //     "grmps1":"7.2",
                //     "custId":"TN0S0117",
                //     "siz":"300X150",
                //     "des":"TINTONDK",
                //     "sour":"Coral",
                //     "vol2":"20000",
                //     "vali":"20",
                //     "mfg":"WDGIDOL",
                //     "dis":"10%",
                //     "nefsf":"202.5",
                //     "neff":"18.81",
                //     "fsf":"no",
                //     "sts":"pending",
                //     "rem":"Long Term Dealer",
                //     "grmg":"9%",
                //     "bmgm":"24%",
                //     "dis1":"25%",
                //     "red":"20%",
                //     "egmpsf":"15",
                //     "tegps":"25",
                //     "cegps":"20",
                //     "effect":"-1",
                //     "vgm":"15",
                //     "recomnd":"Reject the Transaction",
                //     "hrlp":"202.5",
                //     "efp":"280",
                //     "oiv":"70", "oiv2":"25%",
                //     "sd":"-",
                //     "sd2":"-",
                //     "ptd":"10",
                //     "ptd2":"4%",
                //     "svc":"184",
                //     "fc":"-",
                //     "orc":"-",
                //     "orc2":"-",
                //     "snd":"25","snd2":"12.5%",
                //     "comn":"-",
                //     "comlp":"-",
                //     "mfg":"WDGIDOL",
                //     "nef":"202.5",
                //     "gm":"8%",
                //     "val2":"9.2",
                //     "gm2":"9%"  
                // });
                this.getView().setModel(oGetDataModel, "oRequestModel");
            },

            onBack: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1", {});
            },

            onForward: function () {
                if (!this.oRejectDialog) {
                    this.oRejectDialog = new Dialog({
                        title: "Gross Margin is less than 15%",
                        type: DialogType.Message,

                        content: [
                            new Label({
                                text: "Request will be forwarded to the National Head",
                            }),
                            new TextArea({
                                width: "100%",
                                placeholder: "Type the reason for acceptance"
                            })
                        ],
                        beginButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oRejectDialog.close();


                                this.oRejectDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Submit",
                            // press: function () {
                            //     var sText = Core.byId("rejectionNote").getValue();
                            // }.bind(this)
                        })
                    });
                }
                this.oRejectDialog.open();
            },
            bpRenegotiation: function () {

                this.oRejectDialog = new Dialog({
                    title: "Remarks",
                    type: DialogType.Message,

                    content: [
                        new Label({
                            text: "Feedback",
                        }),
                        new TextArea({
                            width: "100%",
                            placeholder: ""
                        })
                    ],
                    beginButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.oRejectDialog.close();


                            this.oRejectDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Submit",
                        press: function (oEvent) {

                            var remarks = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
                            var payload = {
                                "Pafno": "",
                                "Action": "BPRENG",
                                "Remark": remarks
                            }
                            this._sendPayload(payload);

                        }.bind(this)
                    })
                });

                this.oRejectDialog.open();
            },
            freightRenegotiation: function () {
                this.oRejectDialog = new Dialog({
                    title: "Remarks",
                    type: DialogType.Message,

                    content: [
                        new Label({
                            text: "Feedback",
                        }),
                        new TextArea({
                            width: "100%",
                            placeholder: ""
                        })
                    ],
                    beginButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.oRejectDialog.close();


                            this.oRejectDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Submit",
                        press: function (oEvent) {

                            var remarks = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
                            var payload = {
                                "Pafno": "",
                                "Action": "FRIGHTRENG",
                                "Remark": remarks
                            }
                            this._sendPayload(payload);

                        }.bind(this)
                    })
                });

                this.oRejectDialog.open();


            },
            reject: function () {
                this.oRejectDialog = new Dialog({
                    title: "Remarks",
                    type: DialogType.Message,

                    content: [
                        new Label({
                            text: "Feedback",
                        }),
                        new TextArea({
                            width: "100%",
                            placeholder: ""
                        })
                    ],
                    beginButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.oRejectDialog.close();


                            this.oRejectDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Submit",
                        press: function (oEvent) {

                            var remarks = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
                            var payload = {
                                "Pafno": "",
                                "Action": "REJECT",
                                "Remark": remarks
                            }
                            this._sendPayload(payload);

                        }.bind(this)
                    })
                });

                this.oRejectDialog.open();


            },
            Approved: function () {

                this.oRejectDialog = new Dialog({
                    title: "Remarks",
                    type: DialogType.Message,

                    content: [
                        new Label({
                            text: "Feedback",
                        }),
                        new TextArea({
                            width: "100%",
                            placeholder: ""
                        })
                    ],
                    beginButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.oRejectDialog.close();


                            this.oRejectDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Submit",
                        press: function (oEvent) {

                            var remarks = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
                            var payload = {
                                "Pafno": "",
                                "Action": "ACCEPT",
                                "Remark": remarks
                            }
                            this._sendPayload(payload);

                        }.bind(this)
                    })
                });

                this.oRejectDialog.open();
            },

            _sendPayload: function (payload) {

                payload.Pafno = this.getView().getModel("oRequestModel").getData().Pafno;
                var that = this;
                this.getOwnerComponent().getModel().create('/ET_PMG_REQUEST_ITEMSet', payload, {
                    success: function (oData, response) {
                        this.oRouter = this.getOwnerComponent().getRouter();
                        this.oRouter.navTo("page1", {});
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (error) {
                        this.getView().setBusy(false);
                        MessageBox.error(error.responseText);
                    }.bind(this)
                });
            }
        });
    });
