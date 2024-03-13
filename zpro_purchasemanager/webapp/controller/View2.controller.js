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
                        "customer": "Bharath Marble",
                        "siz": "300X150",
                        "des": "TINTONDK",
                        "sour": "Coral",
                        "vol": "20000",
                        "val": "20",
                        "mfg": "WDGIDOL",
                        "dis": "25%",
                        "nef": "202.5",
                        "neff": "18.8",
                        "fs": "No",
                        "sts": "Pending",
                        "rem": "Long term dealer",
                        "ren": "-"
                    });
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



                if (pafID.includes('120027') || pafID.includes('120017')) {
                    this.getDataWRTPafNo(pafID);
                }


            },
            getDataWRTPafNo: function (pafID) {
                debugger;
                if (pafID.includes('120017')) {
                    var payload = {
                        "pafNo":"120017",
                        "customer": "India Tile Gallery Plot no 489,H.No",
                        "siz": "600X600",
                        "des": "AVEO SF RP",
                        "sour": "",
                        "vol": "",
                        "val": "",
                        "mfg": "",
                        "dis": "",
                        "nef": "",
                        "neff": "",
                        "fs": "",
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
            }
        });
    });