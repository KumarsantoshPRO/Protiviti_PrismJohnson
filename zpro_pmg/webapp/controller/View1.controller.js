sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "pj/zpmg/model/formatter",
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter, MessageBox) {
        "use strict";

        return Controller.extend("pj.zpmg.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                var sID = oEvent.getParameter("arguments").ID;
                if (sID === "Page1" || sID === undefined) {
                    this._getRequestData("", "count");
                    this._getRequestData("P", "count");
                    this._getRequestData("D", "count");
                    this._getRequestData("A", "count");
                    this._getRequestData("R", "count");
                    this._getRequestData("DL", "count");
                    this._getRequestData("", "tableData");
                }
            },
            _getRequestData: function (sStatusText, sForWhat) {
                
                var aFilter = [];
                var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sStatusText)], false);
                aFilter.push(oFilter);
                var sPath = "/ET_ZDI_TP_BILLSet"
                var that = this;
                this.getView().setBusy(true);
                this.getView().getModel().read(sPath, {
                    filters: aFilter,
                    success: function (Data) {
                        
                        that.getView().setBusy(false);
                        if (sForWhat === "count") {
                            switch (sStatusText) {
                                case "":
                                    that.getView().getModel("count").getData().Total = Data.results.length;
                                    break;
                                case "P":
                                    that.getView().getModel("count").getData().Pending = Data.results.length;
                                    break;
                                case "D":
                                    that.getView().getModel("count").getData().Delayed = Data.results.length;
                                    break;
                                case "A":
                                    that.getView().getModel("count").getData().Approved = Data.results.length;
                                    break;
                                case "R":
                                    that.getView().getModel("count").getData().Rejected = Data.results.length;
                                    break;
                                case "DL":
                                    that.getView().getModel("count").getData().Deleted = Data.results.length;
                                    break;
                                default:

                                    break;
                            }
                        } else {
                            var dataTableModel = Data.results;
                            that.getView().setModel(new JSONModel(dataTableModel), "JSONModelForTable");
                        }
                        that.getView().getModel("count").refresh(true);


                    },
                    error: function (sError) {
                        that.getView().setBusy(false);
                        MessageBox.error(JSON.parse(sError.responseText).error.message.value, {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                // navigator.toExternal({
                                //     target: {
                                //         semanticObject: "#"
                                //     }
                                // });

                                window.location.reload()
                            }
                        });
                    }
                });

            },

            _onFilterSelect: function (oEvent) {
     
                var sKey = oEvent.getParameter("key");
                if (sKey === "All") {
                    this._getRequestData("", "tableData");
                } else if (sKey === "Pending") {
                    this._getRequestData("P", "tableData");
                }
                else if (sKey === "Approved") {
                    this._getRequestData("A", "tableData");
                }
                else if (sKey === "Delayed") {
                    this._getRequestData("D", "tableData");
                } else if (sKey === "Rejected") {
                    this._getRequestData("R", "tableData");
                } else if (sKey === "Deleted") {
                    this._getRequestData("DL", "tableData");
                }
                //  else if (sKey === "Forwarded") {
                //     this.getForwardedData();
                // } else if (sKey === "BP") {
                //     this.getBPData();
                // } else if (sKey === "Frieght") {
                //     this.getFrieghtData();
                // }

            },
            onClickofItem: function (oEvent) {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page2",
                    {
                        pafID: oEvent.getSource().getCells()[0].getText()
                    });
                //this.oRouter.navTo("page2");
            },





        });
    });