// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
//     /**
//      * @param {typeof sap.ui.core.mvc.Controller} Controller
//      */
//     function (Controller) {
//         "use strict";

//         return Controller.extend("zpj.pro.sd.sk.zpronatsaleshead.controller.View1", {
//             onInit: function () {

//             }
//         });
//     });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "zpj/pro/sd/sk/zpronatsaleshead/model/formatter",
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter, MessageBox) {
        "use strict";

        return Controller.extend("zpj.pro.sd.sk.zpronatsaleshead.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                 
                var sID = oEvent.getParameter("arguments").ID;
                if (sID === "Page1" || sID === undefined || sID === "") {
                    this.getView().byId("idIconTabBar").setSelectedKey("All");
                    this.getView().byId("id.orderNumber.Input").setValue("");
                    this.getView().byId("idIconTabBar").focus()
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

                this.getView().setBusy(true);
                this.getView().getModel().read(sPath, {
                    filters: aFilter,
                    success: function (Data) {

                        this.getView().setBusy(false);
                        if (sForWhat === "count") {
                            switch (sStatusText) {
                                case "":
                                    this.getView().getModel("count").getData().Total = Data.results.length;
                                    break;
                                case "P":
                                    this.getView().getModel("count").getData().Pending = Data.results.length;
                                    break;
                                case "D":
                                    this.getView().getModel("count").getData().Delayed = Data.results.length;
                                    break;
                                case "A":
                                    this.getView().getModel("count").getData().Approved = Data.results.length;
                                    break;
                                case "R":
                                    this.getView().getModel("count").getData().Rejected = Data.results.length;
                                    break;
                                case "DL":
                                    this.getView().getModel("count").getData().Deleted = Data.results.length;
                                    break;
                                default:

                                    break;
                            }
                        } else {
                            var dataTableModel = Data.results;
                            this.getView().setModel(new JSONModel(dataTableModel), "JSONModelForTable");
                        }
                        this.getView().getModel("count").refresh(true);


                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
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
                    }.bind(this)
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
            onOrderNumber: function (oEvent) {
                var vValue = oEvent.getParameter('value');
                var filter = new sap.ui.model.Filter({
                    path: 'Pafno',
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
                        pafID: oEvent.getSource().getCells()[0].getText()
                    });
                //this.oRouter.navTo("page2");
            },





        });
    });

