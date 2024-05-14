sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Core",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/library",
    "sap/m/TextArea",
    "zpj/pro/sd/sk/zprovertihead/model/formatter",
    "sap/m/MessageBox",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Core, Dialog, Button, Label, mobileLibrary, TextArea, formatter, MessageBox) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("zpj.pro.sd.sk.zprovertihead.controller.View2", {
            formatter: formatter,
            onInit: function () {
                var oProductModel = new JSONModel();
                this.getView().setModel(oProductModel, "ProductModel");

                var oSouceModel = new JSONModel();
                this.getView().setModel(oSouceModel, "SouceModel");

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
                this.getData();
                this.pafNoTemp;
                this._Posnr;
                this._rowIndex;
            },

            // Attach route matched method
            onRouteMatched: function (oEvent) {
                var pafID = oEvent.getParameter("arguments").pafID;
                if (pafID !== "Page1" || pafID !== undefined) {
                    if (pafID) {
                        // this.getView().byId("idObjectHeader").setObjectTitle("PAF NO : " + pafID.replace(/^0+/, ''));
                        this.getView().byId("idPage").setTitle("Details of PAF No: " + pafID.replace(/^0+/, ''));
                        this.getRequestDetails(pafID);
                        this.pafID = pafID;
                    }

                }
            },

            getRequestDetails: function (pafID) {
                this.getView().setBusy(true);
                var sPath = "/ZPAF_VH_HEADERSet('" + pafID + "')"



                this.getOwnerComponent().getModel().read(sPath, {

                    urlParameters: {
                        "$expand": "NAV_VH_ITEM_PRODUCT"
                    },
                    success: function (oData) {
                        var oModel = this.getView().getModel("oRequestModel");
                        debugger;
                        if (oData.Status === 'A' || oData.Status === 'R') {

                            this.getView().byId("id.Approve.Button").setVisible(false);
                            this.getView().byId("id.Reject.Button").setVisible(false);
                        } else {

                            this.getView().byId("id.Approve.Button").setVisible(true);
                            this.getView().byId("id.Reject.Button").setVisible(true);
                        }
                        // Grossmargper
                        // oData.NAV_VH_ITEM_PRODUCT.results
                        var len = oData.NAV_VH_ITEM_PRODUCT.results.length;
                        oData.Wgrossmargper = 0;
                        oData.Wbuyingprice = 0;
                        for (let index = 0; index < len; index++) {
                            var nGrossMargin = Number(oData.NAV_VH_ITEM_PRODUCT.results[index].Grossmargper);
                            var nBuyingpricesqft = Number(oData.NAV_VH_ITEM_PRODUCT.results[index].Buyingpricesqft);
                            oData.Wgrossmargper = Number(oData.Wgrossmargper) + nGrossMargin;
                            oData.Wbuyingprice = Number(oData.Wbuyingprice) + nBuyingpricesqft;
                        }
                        oData.Wgrossmargper = (oData.Wgrossmargper / len).toFixed(2);
                        oData.Wbuyingprice = (oData.Wbuyingprice / len).toFixed(2);

                        oData.Discb = ((oData.Wexfacsqft / 100) * oData.Disc).toFixed(2);
                        oData.Worc = ((oData.Wexfacsqft / 100) * oData.Worcper).toFixed(2);
                        // oData.Discb = oData.Discb;
                        oModel.setData(oData);
                        this.getView().setModel(oModel, "oRequestModel");

                        var oPrdModel = this.getView().getModel("ProductModel");
                        oPrdModel.setData(oData.NAV_VH_ITEM_PRODUCT.results);
                        this.getView().setModel(oPrdModel, "ProductModel");
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
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {

                            }
                        });
                    }.bind(this)
                });
            },

            onSourceHelp: function (oEvent) {

                var pathIndex = Number(oEvent.getSource().getParent().getBindingContextPath().split("/")[1]);
                this._rowIndex = pathIndex;
                this._Posnr = pathIndex + 1;

                if (!this._sourceFrag) {
                    this._sourceFrag = sap.ui.xmlfragment("zpj.pro.sd.sk.zprovertihead.view.fragments.source", this);
                    this.getView().addDependent(this._sourceFrag);
                    this._CustomerCodeTemp = sap.ui.getCore().byId("idSLSourceValueHelp").clone();
                    this._oTemp = sap.ui.getCore().byId("idSLSourceValueHelp").clone();
                }
                var aFilter = [],
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SOURCE")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false),
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, this.pafID)], false),
                    oFilterDomname3 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname3", sap.ui.model.FilterOperator.EQ, this._Posnr)], false);
                aFilter.push(oFilterDomname);
                aFilter.push(oFilterDomname1);
                aFilter.push(oFilterDomname2);
                aFilter.push(oFilterDomname3);
                // sap.ui.getCore().byId("idSDSourceF4").setModel("ZCUSTOMER_AUTOMATIONDISCOUNT_SRV");
                sap.ui.getCore().byId("idSDSourceF4").bindAggregation("items", {
                    path: "ZCUSTOMER_AUTOMATIONDISCOUNT_SRV>/ET_VALUE_HELPSSet",
                    filters: aFilter,
                    template: this._CustomerCodeTemp
                });

                this._sourceFrag.open();

            },
            onSourceValueHelpConfirm: function (oEvent) {

                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");

                var payload = {
                    "Pafno": this.pafID,
                    "Posnr": this._Posnr.toString(),
                    "NAV_VH_ITEM_PRODUCT": [
                        {
                            "Pafno": this.pafID,
                            "Posnr": this._Posnr.toString(),
                            "Source": sSelectedValue
                        }
                    ]
                }

                this.getOwnerComponent().getModel().create('/ZPAF_VH_HEADERSet', payload, {
                    success: function (oData, response) {
                        var vSVC_BP = oData.NAV_VH_ITEM_PRODUCT.results[0].Buyingpricesqft,
                            vGross_Margin = oData.NAV_VH_ITEM_PRODUCT.results[0].Grossmargper,
                            vSource = oData.NAV_VH_ITEM_PRODUCT.results[0].Source;

                        this.getView().getModel("ProductModel").getData()[this._rowIndex].Buyingpricesqft = vSVC_BP;
                        this.getView().getModel("ProductModel").getData()[this._rowIndex].Grossmargper = vGross_Margin;
                        this.getView().getModel("ProductModel").getData()[this._rowIndex].Source = vSource;

                        var len = this.getView().getModel("ProductModel").getData().length;
                        this.getView().getModel("oRequestModel").getData().Wgrossmargper = 0;
                        for (let index = 0; index < len; index++) {
                            var nGrossMargin = Number(this.getView().getModel("ProductModel").getData()[index].Grossmargper);


                            this.getView().getModel("oRequestModel").getData().Wgrossmargper = this.getView().getModel("oRequestModel").getData().Wgrossmargper + nGrossMargin;


                        }
                        this.getView().getModel("oRequestModel").getData().Wgrossmargper = this.getView().getModel("oRequestModel").getData().Wgrossmargper / len;
                        this.getView().getModel("oRequestModel").refresh(true);
                        this.getView().getModel("ProductModel").refresh(true);
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
            },

            onChangeSource: function (oEvent) {

                var oModeldata = this.getView().getModel("ProductModel").getData();
                this.getView().getModel("ProductModel").refresh(true);
                var newEntry = {
                    "Pafno": this.pafID,
                    "NAV_VH_ITEM_PRODUCT": newProductArr
                };

                this.getOwnerComponent().getModel().create('/ZPAF_VH_HEADERSet', newEntry, {
                    success: function (oData, response) {
                        var oPrdModel = this.getView().getModel("ProductModel");
                        oPrdModel.setData(oData.NAV_VH_ITEM_PRODUCT.results);
                        this.getView().setModel(oPrdModel, "ProductModel");
                        this.getView().getModel("ProductModel").refresh(true);
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
                this.oRouter.navTo("", {});
            },

         
            reject: function () {
                // this.oRejectDialog = new Dialog({
                //     title: "Remarks",
                //     type: DialogType.Message,

                //     content: [
                //         new Label({
                //             text: "Feedback",
                //         }),
                //         new TextArea({
                //             width: "100%",
                //             placeholder: ""
                //         })
                //     ],
                //     beginButton: new Button({
                //         text: "Cancel",
                //         press: function () {
                //             this.oRejectDialog.close();


                //             this.oRejectDialog.close();
                //         }.bind(this)
                //     }),
                //     endButton: new Button({
                //         type: ButtonType.Emphasized,
                //         text: "Submit",
                //         press: function (oEvent) {

                //             var remarks = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
                //             var payload = {
                //                 "Pafno": "",
                //                 "Action": "REJECT",
                //                 "Remark": remarks
                //             }
                //             this._sendPayload(payload, "Rejected");

                //         }.bind(this)
                //     })
                // });

                // this.oRejectDialog.open(); 

                var payload = {
                    "Pafno": "",
                    "Action": "REJECT"
                }
                this._sendPayload(payload, "Rejected");
            },
            Approved: function () {

                // this.oRejectDialog = new Dialog({
                //     title: "Remarks",
                //     type: DialogType.Message,

                //     content: [
                //         new Label({
                //             text: "Feedback",
                //         }),
                //         new TextArea({
                //             width: "100%",
                //             placeholder: ""
                //         })
                //     ],
                //     beginButton: new Button({
                //         text: "Cancel",
                //         press: function () {
                //             this.oRejectDialog.close();


                //             this.oRejectDialog.close();
                //         }.bind(this)
                //     }),
                //     endButton: new Button({
                //         type: ButtonType.Emphasized,
                //         text: "Submit",
                //         press: function (oEvent) {

                //             var remarks = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
                //             var payload = {
                //                 "Pafno": "",
                //                 "Action": "ACCEPT",
                //                 "Remark": remarks
                //             }

                //             this._sendPayload(payload, "Approved");

                //         }.bind(this)
                //     })
                // });

                // this.oRejectDialog.open();
                var payload = {
                    "Pafno": "",
                    "Action": "ACCEPT" 
                }

                this._sendPayload(payload, "Approved");
            },

            _sendPayload: function (payload, sAction) {

                payload.Pafno = this.getView().getModel("oRequestModel").getData().Pafno;

                //   ProductModel 

                // var aTablePayload = this.getView().getModel("ProductModel").getData(),
                //     len = aTablePayload.length,
                //     vValidation = 0;

                // for (let index = 0; index < len; index++) {
                //     for (const key in aTablePayload[index]) {
                //         if (Object.hasOwnProperty.call(aTablePayload[index], key)) {
                //             if (key === 'Source') {
                //                 const element = aTablePayload[index]['Source'];
                //                 if (element === '') {
                //                     vValidation = 0;
                //                     this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3].setValueState("Error");
                //                     // this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3]
                //                 } else {
                //                     vValidation = 1;
                //                     this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3].setValueState("None")
                //                 }
                //             }
                //         }
                //     }

                // }
                // if (vValidation === 1) {
                this.getView().setBusy(true);

                this.getOwnerComponent().getModel().create('/ZPAF_VH_HEADERSet', payload, {
                    success: function (oData, response) {

                        MessageBox.success("PAF " + sAction + " Successfully", {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                this.oRouter = this.getOwnerComponent().getRouter();
                                this.oRouter.navTo("page1", {});
                            }.bind(this)
                        });

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
                // } else {
                //     MessageBox.error("Please select Source(vendor)");
                //     this.oRejectDialog.close();
                // }
            }
        });
    });
