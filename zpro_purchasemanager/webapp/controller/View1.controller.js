sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "pj/zpurchasemanager/model/formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        formatter,
        MessageBox) {
        "use strict";

        return Controller.extend("pj.zpurchasemanager.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                var sID = oEvent.getParameter("arguments").ID;
                var oEditFlag = {
                    "Editable": false
                }
                var oModelEditFlag = new JSONModel(oEditFlag);
                this.getView().setModel(oModelEditFlag, "modelEditFlag");
                if (sID === "null" || sID === undefined) {
                    // this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.main.IconTabBar")).setSelectedKey("All");
                    var dataCount = this.getOwnerComponent().getModel("count").getData().count;
                    this.getView().setModel(new JSONModel(dataCount), "count");

                    this._getRequestData("", "count");
                    this._getRequestData("P", "count");
                    this._getRequestData("A", "count");
                    this._getRequestData("R", "count");
                    // this._getRequestData("D", "count");
                    this._getRequestData("", "tableData");


                }
            },
            onOrderNumber: function (oEvent) {
                var vValue = oEvent.getParameter('value');
                var filter = new sap.ui.model.Filter({
                    path: 'Paf',
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: vValue
                });
                var oTable = this.getView().byId("productsTable");

                oTable.getBinding("items").filter(filter);
                oTable.setShowOverlay(false);

            },
            onClickofItem: function (oEvent) {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page2",
                    {
                        ID: oEvent.getSource().getCells()[0].getText()
                    });

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
                            if (sStatusText === 'P') {
                                that.aDelayedData = [];
                                that.aPendingData = [];
                                for (var i = 0; i < Data.results.length; i++) {
                                    var obj = Data.results[i];
                                    for (var key in obj) {
                                        debugger;
                                        if (obj['Requestdate']) {
                                            if (key === 'Status') {
                                                if (obj['Status'] === 'P') {
                                                    var today = new Date();
                                                    if (Math.floor((today - obj['Requestdate']) / (1000 * 3600 * 24)) > 10) {
                                                        obj['Status'] = 'D';
                                                        that.aDelayedData.push(obj);
                                                    } else {
                                                        that.aPendingData.push(obj);
                                                    }

                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            switch (sStatusText) {
                                case "":
                                    that.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                                    that.getView().getModel("count").getData().Total = Data.results.length;
                                    break;
                                case "P":
                                    that.getView().getModel("modelEditFlag").setProperty("/Editable", true);

                                    that.getView().getModel("count").getData().onGoing = that.aPendingData.length;
                                    that.getView().getModel("count").getData().Delayed = that.aDelayedData.length;
                                    break;
                                case "A":
                                    that.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                                    that.getView().getModel("count").getData().Approved = Data.results.length;
                                    break;
                                case "R":
                                    that.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                                    that.getView().getModel("count").getData().Rejected = Data.results.length;
                                    break;
                                case "D":

                                    that.getView().getModel("modelEditFlag").setProperty("/Editable", true);
                                    that.getView().getModel("count").getData().Delayed = that.aDelayedData.length;
                                    break;
                                default:

                                    break;
                            }
                        } else {
                            var dataTableModel;
                            if (sForWhat === 'tableData' && sStatusText === 'P') {
                                dataTableModel = that.aPendingData;
                            } else if (sForWhat === 'tableData' && sStatusText === 'D') {
                                dataTableModel = that.aDelayedData;
                            } else {
                                dataTableModel = Data.results;
                            }

                            that.getView().setModel(new JSONModel(dataTableModel), "ModelForTable");
                        }
                        that.getView().getModel("count").refresh(true);


                    },
                    error: function (oError) {
                        that.getView().setBusy(false);
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {

                            }
                        });
                    }
                });

            },
            onFilterSelect: function (oEvent) {
                // this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.orderNumber.Input")).setValue("");
                var sKey = oEvent.getParameter("key");
                if (sKey === "All") {
                    this._getRequestData("", "tableData");
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                }
                else if (sKey === "Delay") {
                    this._getRequestData("D", "tableData");
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", true);
                } else if (sKey === "OnGoing") {
                    this._getRequestData("P", "tableData");
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", true);
                } else if (sKey === "Approved") {
                    this._getRequestData("A", "tableData");
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                } else if (sKey === "Rejected") {
                    this._getRequestData("R", "tableData");
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                }

            }

        });
    });
