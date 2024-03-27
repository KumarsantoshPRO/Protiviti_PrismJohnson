sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/valueHelps',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        MessageBox, valueHelps) {
        "use strict";

        return Controller.extend("zpj.pro.sk.sd.salescoordinator.zprosalesco.controller.Main", {

            onInit: function () {
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRouteMatched, this);

            },
            onSalesOfficeHelp: function () {
                if (!this.SalesOfficerag) {
                    this.SalesOfficerag = sap.ui.xmlfragment("zpj.pro.sk.sd.salescoordinator.zprosalesco.view.fragments.main.salesOfficeF4", this);
                    this.getView().addDependent(this.SalesOfficerag);
                    this._SalesOfficeTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();
                    this._oTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();
                }
                var aFilter = [];

                var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
                var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false);
                var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
                aFilter.push(oFilterDomname);
                aFilter.push(oFilterDomname1);
                aFilter.push(oFilterDomname2);

                sap.ui.getCore().byId("idSDSalesOfficeF4").bindAggregation("items", {
                    path: "/ET_VALUE_HELPSSet",
                    filters: aFilter,
                    template: this._SalesOfficeTemp
                });
                this.SalesOfficerag.open();
            },
            onValueHelpSearch: function (evt) {

                var aFilter = [];
                var sValue = evt.getParameter("value");
                var sPath = "/ET_VALUE_HELPSSet";
                var oSelectDialog = sap.ui.getCore().byId(evt.getParameter('id'));
                var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
                var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sValue)], false);

                aFilter.push(oFilterDomname);
                aFilter.push(oFilterDomname1);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._oTemp
                });
            },
            onValueHelpConfirm: function (evt) {

                var oSelectedItem = evt.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.SalesOffice.Input")).setValue(sSelectedValue);
                // this.getView().byId("id.SalesOffice.Input").setValue(sSelectedValue);
            },
            // Submit action - Sales Office
            onSalesOfficeInputSubmit: function (oEvent) {
                var sTerm = oEvent.getParameter("value"),
                    aFilters = [],
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    sValue1 = "/Vkbur",
                    sValue2 = "",
                    sMessage = "Entered Sales Office is wrong";
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);
                // aFilters.push(oFilterDomname2);
                this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
            },
            onSuggest: function (oEvent) {
                var sTerm = oEvent.getParameter("suggestValue"),
                    aFilters = [],
                    sPath = "/ET_VALUE_HELPSSet",
                    oFilterDomname,
                    oFilterDomname1,
                    oFilterDomname2;

                oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
                oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname2);
                aFilters.push(oFilterDomname1);

                if (sTerm) {
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        filters: aFilters,
                        success: function (Data) {
                            debugger;
                            if (Data.results.length > 0) {
                                var JSONModelForSuggest = new JSONModel(Data.results);
                                this.getView().setModel(JSONModelForSuggest, "JSONModelForSuggest");
                                this.getView().getModel("JSONModelForSuggest").refresh(true);
                            }
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (sError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });

                }
            },

            onSearch: function () {
                debugger;
                var vSalesOffice = this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.SalesOffice.Input")).getValue(),
                    vPAFNo = this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.PafNo.Input")).getValue(),
                    vMessage = "Enter 'Sales Office' to proceed";
                if (!vSalesOffice) {
                    this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.SalesOffice.Input")).setValueState("Error");
                    this.getView().setModel(new JSONModel({}), "ModelForTable");
                    this.getView().setModel(new JSONModel({}), "count");
                    this.getView().getModel("ModelForTable").refresh(true)
                    this.getView().getModel("count").refresh(true)
                    MessageBox.error(vMessage);
                } else {
                    this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.SalesOffice.Input")).setValueState("None");

                    var oEditFlag = {
                        "Editable": false
                    }
                    var oModelEditFlag = new JSONModel(oEditFlag);
                    this.getView().setModel(oModelEditFlag, "modelEditFlag");
                    if (this.sID === "null" || this.sID === undefined) {
                        this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.main.IconTabBar")).setSelectedKey("All");
                        var dataCount = this.getOwnerComponent().getModel("payload").getData().count;
                        this.getView().setModel(new JSONModel(dataCount), "count");
                        var oFilterSalOffice = new sap.ui.model.Filter([new sap.ui.model.Filter("Vkbur", sap.ui.model.FilterOperator.EQ, vSalesOffice)], false);
                        this._getRequestData("", "count", oFilterSalOffice);
                        this._getRequestData("P", "count", oFilterSalOffice);
                        this._getRequestData("A", "count", oFilterSalOffice);
                        this._getRequestData("R", "count", oFilterSalOffice);
                        // this._getRequestData("D", "count");
                        this._getRequestData("", "tableData", oFilterSalOffice);
                    }
                }
            },

            _submitCall: function (sTerm, aFilters, sValue1, sValue2, sMessage) {

                if (sTerm) {
                    var sPath = "/ET_VALUE_HELPSSet";
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        filters: aFilters,
                        // urlParameters: {
                        //     "$expand": ""
                        // },
                        success: function (Data) {

                            if (Data.results.length === 1) {
                                this.getView().byId("id.SalesOffice.Input").setValue(Data.results[0].DomvalueL);
                            } else {
                                this.getView().byId("id.SalesOffice.Input").setValue("");
                                MessageBox.error(sMessage)
                            }
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (sError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });

                }

            },
            _onRouteMatched: function (oEvent) {
                this.sID = oEvent.getParameter("arguments").ID;
                // var oEditFlag = {
                //     "Editable": false
                // }
                // var oModelEditFlag = new JSONModel(oEditFlag);
                // this.getView().setModel(oModelEditFlag, "modelEditFlag");
                // if (this.sID === "null" || this.sID === undefined) {
                //     this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.main.IconTabBar")).setSelectedKey("All");
                //     var dataCount = this.getOwnerComponent().getModel("payload").getData().count;
                //     this.getView().setModel(new JSONModel(dataCount), "count");

                //     this._getRequestData("", "count");
                //     this._getRequestData("P", "count");
                //     this._getRequestData("A", "count");
                //     this._getRequestData("R", "count");
                //     // this._getRequestData("D", "count");
                //     this._getRequestData("", "tableData");


                // }
            },
            _getRequestData: function (sStatusText, sForWhat, oFilterSalOffice) {

                var aFilter = [];
                var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sStatusText)], false);
                aFilter.push(oFilter);
                aFilter.push(oFilterSalOffice);
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
                                        if (obj['Erdat']) {
                                            if (key === 'Status') {
                                                if (obj['Status'] === 'P') {
                                                    var today = new Date();
                                                    if (Math.floor((today - obj['Erdat']) / (1000 * 3600 * 24)) > 10) {
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
                    error: function (sError) {
                        that.getView().setBusy(false);
                        MessageBox.error(JSON.parse(sError.responseText).error.message.value, {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                window.location.reload()
                            }
                        });
                    }
                });

            },

            onOrderNumber: function (oEvent) {
                var vValue = oEvent.getParameter('value');
                var filter = new sap.ui.model.Filter({
                    path: 'Pafno',
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: vValue
                });
                var oTable = this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.main.Products.Table"));

                oTable.getBinding("items").filter(filter);
                oTable.setShowOverlay(false);

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
                this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.orderNumber.Input")).setValue("");
                var sKey = oEvent.getParameter("key");
                var vSalesOffice = this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.SalesOffice.Input")).getValue();
                var oFilterSalOffice = new sap.ui.model.Filter([new sap.ui.model.Filter("Vkbur", sap.ui.model.FilterOperator.EQ, vSalesOffice)], false);
                if (sKey === "All") {
                    this._getRequestData("", "tableData", oFilterSalOffice);
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                }
                else if (sKey === "Delay") {
                    this._getRequestData("D", "tableData", oFilterSalOffice);
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", true);
                } else if (sKey === "OnGoing") {
                    this._getRequestData("P", "tableData", oFilterSalOffice);
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", true);
                } else if (sKey === "Approved") {
                    this._getRequestData("A", "tableData", oFilterSalOffice);
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", false);
                } else if (sKey === "Rejected") {
                    this._getRequestData("R", "tableData", oFilterSalOffice);
                    this.getView().getModel("modelEditFlag").setProperty("/Editable", false);
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
                                        MessageBox.error(JSON.parse(sError.responseText).error.message.value, {
                                            actions: [sap.m.MessageBox.Action.OK],
                                            onClose: function (oAction) {
                                                window.location.reload()
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
