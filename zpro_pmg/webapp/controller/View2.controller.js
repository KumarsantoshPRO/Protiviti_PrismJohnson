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
                this.pafNoTemp;
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
              var sPath = "/ET_PMG_REQUEST_ITEMSet('"+pafID+"')"

              if(pafID.includes('120018') || pafID.includes('120017')){
                this.getDataWRTPafNo(pafID);
              }

                this.getOwnerComponent().getModel().read(sPath, {
                     
                    urlParameters: {
                        "$expand": "NAV_PMG_ITEM_PRODUCT"
                    },
                    success: function (oData) {
                        var oModel = this.getView().getModel("oRequestModel");
                        oModel.setData(oData);
                        this.getView().setModel(oModel, "oRequestModel");

                        var oPrdModel = this.getView().getModel("ProductModel");
                        oPrdModel.setData(oData.NAV_PMG_ITEM_PRODUCT.results);
                        this.getView().setModel(oPrdModel, "ProductModel");
                        this.getView().setBusy(false);
                     
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            getDataWRTPafNo: function(pafID){
                if(pafID.includes('120017')){
                    this.pafNoTemp = 120017;
                    var payload = {
                        "CS_Value": "164.55",
                        "CS_GrossMargin": "4.05",
                        "CS_Volume": "4.11",
                        "CS_GrossMarginPer": "7.2",
                        "RD_Region": "West 2 ROM",
                        "RD_Value": "1936.69",
                        "RD_GrossMargin": "3.09",
                        "RD_Volume": "59.24 Lakhs",
                        "RD_GrossMarginPer": "9.3",
                        "TD_NetExFactory": "25.42",
                        "TD_FreightSqft": "4.52",

                        "MD_GrossMargin": "15.42",
                        "MD_BenchMarkGrossMargin": "",
                        "MD_RecommendedGM": "12",
                        "MD_RecommendedDis": "",
                        "MD_TargetEquivalentGMpersqft": "4.07",
                        "MD_CurrentEquivalentGMpersqft": "3.92",
                        "MD_EffectOnCurrentEquivalentGMpersqft": "-",
                        "MD_DiscountPer": "8",
                        "MD_RecommendedAction": "Accept Transaction",
                        
                        "CD_SVC_BP": "21.5 sq ft",
                        "CD_S_DCost": "0",
                        "CD_S_DCostPer": ""
                    };
                }
                if(pafID.includes('120018')){
                    this.pafNoTemp = 120018;
                    var payload = {
                        "CS_Value": "164.55",
                        "CS_GrossMargin": "4.05",
                        "CS_Volume": "4.11",
                        "CS_GrossMarginPer": "7.2",
                        "RD_Region": "West 2 ROM",
                        "RD_Value": "1936.69",
                        "RD_GrossMargin": "3.09",
                        "RD_Volume": "59.24 Lakhs",
                        "RD_GrossMarginPer": "9.3",
                        "TD_NetExFactory": "22.66",
                        "TD_FreightSqft": "4.52",

                        "MD_GrossMargin": "5.12",
                        "MD_BenchMarkGrossMargin": "",
                        "MD_RecommendedGM": "12",
                        "MD_RecommendedDis": "",
                        "MD_TargetEquivalentGMpersqft": "4.07",
                        "MD_CurrentEquivalentGMpersqft": "1.16",
                        "MD_EffectOnCurrentEquivalentGMpersqft": "-",
                        "MD_DiscountPer": "8",
                        "MD_RecommendedAction": "Reject Transaction or Request for Special Buying Price",
                        
                        "CD_SVC_BP": "21.5 sq ft",
                        "CD_S_DCost": "0",
                        "CD_S_DCostPer": ""
                    };
                }

                var oModelWRTPafNo = new JSONModel();
                oModelWRTPafNo.setData(payload);
                        this.getView().setModel(oModelWRTPafNo, "oRequestModelPaf");

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
         
                var oModeldata = this.getView().getModel("ProductModel").getData();
// debugger;
               if(this.pafNoTemp === "120018") {
                this.getView().getModel("ProductModel").getData()[0].Grossmargper = 5.1;
          
                this.getView().getModel("ProductModel").getData()[0].Buyingprice = 21.5;
               }else{
                this.getView().getModel("ProductModel").getData()[0].Grossmargper = 15.42;
          
                this.getView().getModel("ProductModel").getData()[0].Buyingprice = 21.5;
            }

           
                this.getView().getModel("ProductModel").refresh(true);
                // var newEntry = {
                //     "Pafno": this.pafID,
                //     "NAV_PMG_ITEM_PRODUCT": newProductArr
                // };
                //return;
                // this.getOwnerComponent().getModel().create('/ET_PMG_REQUEST_ITEMSet', newEntry, {
                //     success: function (oData, response) {
                //         debugger;
                //         var oPrdModel = this.getView().getModel("ProductModel");
                //         oPrdModel.setData(oData.NAV_PMG_ITEM_PRODUCT.results);
                //         this.getView().setModel(oPrdModel, "ProductModel");
                //         this.getView().getModel("ProductModel").refresh(true);
                //         this.getView().setBusy(false);
                //     }.bind(this),
                //     error: function (error) {
                //         this.getView().setBusy(false);
                //         MessageBox.error(error.responseText);
                //     }.bind(this)
                // });

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
