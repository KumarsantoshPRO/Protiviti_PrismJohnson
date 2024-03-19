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
                this.getData();
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
            },
            getData: function () {

                var oGetDataModel = new JSONModel(
                    {
                        // "customer": "Bharath Marble",
                        // "siz": "300X150",
                        // "des": "TINTONDK",
                        // "sour": "Coral",
                        // "vol": "20000",
                        // "val": "20",
                        // "mfg": "WDGIDOL",
                        // "dis": "25%",
                        // "nef": "202.5",
                        // "neff": "18.8",
                        // "fs": "No",
                        // "sts": "Pending",
                        // "rem": "Long term dealer",
                        // "ren": "-"
                        "Pafno" : "000000120017",
                        "Kunnr" : "MH0S0114",
                       "Zsmm" : "",
                     "Design" : "AVEO SF RP",
                     "Validity": "",
                    
                     
                    });
                    var oGetDataModel1 = new JSONModel([
                        {
                            "Buyingpricesqft" : "0.000",
          "Grossmarginper" : "15.42",
          "Source" : "Y - ANTIQU",
          "Zvolumepft" : "10000.00",
          "Mfrgr" : "OMA00016",
          "Discountper" : "0.00",
          "Nefsqft" : "393.91",
          "Nef" : "25.42",
          "Frightsqft" : "4.52",
          "Remarks" : "",
          "ApprovedBuyingprice" : "0.00"
                        }]);
                this.getView().setModel(oGetDataModel1, "oRequestModel1");
                this.getView().setModel(oGetDataModel, "oRequestModel");

            },


            onRouteMatched: function (oEvent) {
                var pafID = oEvent.getParameter("arguments").ID;
                if (pafID !== "null" || pafID !== undefined) {
                    // this.getView().byId("idObjectHeader").setObjectTitle("PAF NO : " + pafID.replace(/^0+/, ''));
                    this.getRequestDetails(pafID);
                 
                    //this.getSourceDetails(pafID);
                }else{
                    this.getDataWRTPafNo(pafID);
                }
            },

            getRequestDetails: function (pafID) {



                // if (pafID.includes('120027')) {
                 
                // }
                if(pafID.includes('120018')){
                    this.getDataWRTPafNo(pafID);
                }


            },
            getDataWRTPafNo: function (pafID) {
                debugger;
                if (pafID.includes('120018')) {
                    var payload = {
                        "pafNo":"120018",
                        "customer": "India Tile Gallery Plot no 489,H.No",
                        "siz": "600X600",
                        "des": "AVEO SF RP",
                        "sour": "Y - Antique",
                        "vol": "1000.00",
                        "val": "007",
                        "mfg": "OMA00016",
                        "dis": "18.00",
                        "nef": "22.66",
                        "neff": "",
                        "fs": "4.52",
                        "sts": "",
                        "rem": ""
                    };
                }

                var oModelWRTPafNo = new JSONModel();
                oModelWRTPafNo.setData(payload);
                this.getView().setModel(oModelWRTPafNo, "oRequestModel");

            },
            onBack: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1", {});
            },
            onRenegotiationButtonPress: function(){
                 
                if(this.getView().byId("id.Renegotiation.Input").getValue()){
                var payload = {
                    "Pafno" :  "120018",
                    "Posnr" : "01",
                    "Action": "BPRENG",
                    "ApprovedBuyingprice" : this.getView().byId("id.Renegotiation.Input").getValue()
                }

                var serviceURL = "/sap/opu/odata/sap/ZPAF_PM_APPROVAL_SRV/";
                var oODataModel = new sap.ui.model.odata.ODataModel(serviceURL, true);

                oODataModel.create("/ET_PM_APPROVALSet", payload, {
                    async: false,
                    success: function (oData) {
                        debugger;
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
                        
                        debugger;

                    }
                });


            }else{
                sap.m.MessageBox.error("Please enter Renegotiation(BP) value");
            }
                
            },
            onNegotiationNotPossibleButtonPress: function(){
                var payload = {
                    "Pafno" :  "120018",
                    "Posnr" : "01",
                    "Action": "NBPRENG",
                    "ApprovedBuyingprice" : ""
                }

                var serviceURL = "/sap/opu/odata/sap/ZPAF_PM_APPROVAL_SRV/";
                var oODataModel = new sap.ui.model.odata.ODataModel(serviceURL, true);

                oODataModel.create("/ET_PM_APPROVALSet", payload, {
                    async: false,
                    success: function (oData) {
                        debugger;
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