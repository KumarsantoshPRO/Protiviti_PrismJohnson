sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "prj/salescoordinator/model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter) {
        "use strict";

        return Controller.extend("prj.salescoordinator.controller.View1", {

            formatter: formatter,
            onInit: function () {
                this.mapLocalJSONDataToTable("AllRequestData");
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
                    this.mapLocalJSONDataToTable("AllRequestData");
                } else if (sKey === "OnGoing") {
                    this.mapLocalJSONDataToTable("OnGoingData");
                } else if (sKey === "Approved") {
                    this.mapLocalJSONDataToTable("ApprovedData");
                } else if (sKey === "Rejected") {
                    this.mapLocalJSONDataToTable("RejectedData");
                } else if (sKey === "Delay") {
                    this.mapLocalJSONDataToTable("DelayData");
                }

            },
            mapLocalJSONDataToTable: function (DataFor) {
                var dataModel = this.getOwnerComponent().getModel("tableData").getData();
                var dataLocalModels;
                switch (DataFor) {
                    case "AllRequestData":
                        dataLocalModels = dataModel.AllRequestData;
                        break;
                    case "OnGoingData":
                        dataLocalModels = dataModel.OnGoingData;
                        break;
                    case "ApprovedData":
                        dataLocalModels = dataModel.ApprovedData;
                        break;
                    case "RejectedData":
                        dataLocalModels = dataModel.RejectedData;
                        break;
                    case "DelayData":
                        dataLocalModels = dataModel.DelayData;
                        break;

                    default:
                        break;
                }

                this.getView().setModel(new JSONModel(dataLocalModels), "RequestModel");
            }
        });
    });
