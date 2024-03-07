sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        MessageBox) {
        "use strict";

        return Controller.extend("zpj.pro.sk.sd.salescoordinator.zprosalesco.controller.Main", {

            onInit: function () {
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRouteMatched, this);

            },
            _onRouteMatched: function (oEvent) {
                var sID = oEvent.getParameter("arguments").ID;

                if (sID === "null" || sID === undefined) {
                    var dataCount = this.getOwnerComponent().getModel("payload").getData().count;
                    this.getView().setModel(new JSONModel(dataCount), "count");

                    this._getRequestData("", "count");
                    this._getRequestData("P", "count");
                    this._getRequestData("A", "count");
                    this._getRequestData("R", "count");
                    this._getRequestData("D", "count");
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
                                    that.getView().getModel("count").getData().onGoing = Data.results.length;
                                    break;
                                case "A":
                                    that.getView().getModel("count").getData().Approved = Data.results.length;
                                    break;
                                case "R":
                                    that.getView().getModel("count").getData().Rejected = Data.results.length;
                                    break;
                                case "D":
                                    that.getView().getModel("count").getData().Delayed = Data.results.length;
                                    break;
                                default:

                                    break;
                            }
                        } else {
                            var dataTableModel = Data.results;
                            that.getView().setModel(new JSONModel(dataTableModel), "ModelForTable");
                        }
                        that.getView().getModel("count").refresh(true);


                    },
                    error: function (sError) {
                        that.getView().setBusy(false);
                        return "Error";
                    }
                });

            },

            onNewPress: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page2",
                    {
                        "ID": "null"
                    });
            },

            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RouteView1", {
                });
            },

            onClickofItem: function (oEvent) {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page2",
                    {
                        ID: oEvent.getSource().getCells()[0].getText()
                    });

            },

            onFilterSelect: function (oEvent) {
                var sKey = oEvent.getParameter("key");
                if (sKey === "All") {
                    this._getRequestData("", "tableData");
                } else if (sKey === "OnGoing") {
                    this._getRequestData("P", "tableData");
                } else if (sKey === "Approved") {
                    this._getRequestData("A", "tableData");
                } else if (sKey === "Rejected") {
                    this._getRequestData("R", "tableData");
                } else if (sKey === "Delay") {
                    this._getRequestData("D", "tableData");
                }

            },

            _onDelete: function (oEvent) {


                var oTable = this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.main.Products.Table"));
                var oSelectedItem = oTable.getSelectedItems();


                if (oSelectedItem.length > 0) {
                    var sContextPath = oTable.getSelectedItem().oBindingContexts.ModelForTable.sPath;
                  
                    var oOrderNumber = this.getView().getModel("ModelForTable").getContext(sContextPath).getProperty("Pafno");
                    var sPath = "/ET_ZDI_TP_BILLSet('" + oOrderNumber + "')";
                    var that = this;
                    MessageBox.confirm("Are you sure you want to delete Order No:'" + oOrderNumber + "' ?", {
                        actions: ["Yes", "No"],
                        onClose: function (oAction) {
                            if (oAction === "Yes") {
                                that.getView().getModel().read(sPath, {
                                    success: function (Data) {
                                        MessageBox.success("Order No:'" + oOrderNumber + "' Deleted", {
                                            actions: ["Ok"],
                                            onClose: function (oAction) {
                                                window.location.reload();
                                            }
                                        });
                                     
                                    },
                                    error: function (sError) {
                                        MessageBox.error("Operation failed, Please contact your IT team",{
                                            actions: ["Close"],
                                            onClose: function (oAction) {
                                            if (oAction === "Close") {
                                                window.location.reload();
                                            }
                                        }

                                        });
                                        
                                       
                                    }
                                });
                            } else {

                            }

                        }
                    });
                } else {
                    MessageBox.error("Please Select a Row to Delete");
                }

            }

        });
    });
