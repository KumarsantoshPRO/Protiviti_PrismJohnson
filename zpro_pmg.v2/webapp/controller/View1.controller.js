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
                if (sID === "Page1" || sID === undefined || sID === "") {
                    // this.getView().byId("idIconTabBar").setSelectedKey("All");
                    // this.getView().byId("id.orderNumber.Input").setValue("");
                    // this.getView().byId("idIconTabBar").focus()
                    // this._getRequestData("", "count");
                    // this._getRequestData("P", "count");
                    // this._getRequestData("D", "count");
                    // this._getRequestData("A", "count");
                    // this._getRequestData("R", "count");
                    // this._getRequestData("DL", "count");
                    // this._getRequestData("", "tableData"); 

                }
            },
            _getRequestData: function (sStatusText, sForWhat) {

                var aFilter = [];
                var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sStatusText)], false);
                aFilter.push(oFilter);
                var sPath = "/ET_ZDI_TP_BILLSet"




                if (this.sPafNo || this.sVkbur || this.sSpart) {
                    var oFilterPafno = new sap.ui.model.Filter([new sap.ui.model.Filter("Pafno", sap.ui.model.FilterOperator.EQ, this.sPafNo)], false);
                    var oFilterVkbur = new sap.ui.model.Filter([new sap.ui.model.Filter("Vkbur", sap.ui.model.FilterOperator.EQ, this.sVkbur)], false);
                    var oFilterSpart = new sap.ui.model.Filter([new sap.ui.model.Filter("Spart", sap.ui.model.FilterOperator.EQ, this.sSpart)], false);
                    aFilter.push(oFilterPafno);
                    aFilter.push(oFilterVkbur);
                    aFilter.push(oFilterSpart);
                }



                this.getView().setBusy(true);
                this.getView().getModel().read(sPath, {
                    filters: aFilter,
                    success: function (Data) {
                        if (this.sDate) {
                            var aItems = [];
                            var nTemp = 0;

                            var sDateFromFE = new Date(this.sDate).getDate().toString() + new Date(this.sDate).getMonth().toString() + new Date(this.sDate).getFullYear().toString();
                            for (let index = 0; index < Data.results.length; index++) {
                                var sDateFromBE = new Date(Data.results[index].Erdat).getDate().toString() + new Date(Data.results[index].Erdat).getMonth().toString() + new Date(Data.results[index].Erdat).getFullYear().toString();
                                if (sDateFromBE === sDateFromFE) {
                                    aItems.push(Data.results[index]);
                                    nTemp = 1
                                }
                            } 

                            if (nTemp === 1) {
                                Data.results = aItems;
                            } else {
                                Data.results = [];
                            }
                        }
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

            onSearch: function () {
                this.sDate = this.getView().byId("id.Date.DatePicker").getValue();
                this.sPafNo = this.getView().byId("id.PafNo.Input").getValue();
                this.sVkbur = this.getView().byId("id.SalesOffice.Input").getValue();
                this.sSpart = this.getView().byId("id.Division.ComboBox").getSelectedKey();
                // var sStatus = this.getView().byId("id.Status.ComboBox").getSelectedKey();

                this.getView().byId("idIconTabBar").setSelectedKey("All");
                this.getView().byId("id.orderNumber.Input").setValue("");
                // this.getView().byId("idIconTabBar").focus()
                // this._getRequestData("", "count");

                // if (!this.sVkbur) {
                //     MessageBox.error("Please enter Sales Office first");
                // }
                // else if (!sStatus) {
                //     MessageBox.error("Please select Status first");
                // }
                // else {

                // if (sStatus === 'P') {

                this._getRequestData("P", "count");
                // }
                // this._getRequestData("D", "count");
                // if (sStatus === 'A') {
                this._getRequestData("A", "count");
                // }
                // if (sStatus === 'R') {
                this._getRequestData("R", "count");
                // }
                // if (sStatus === 'DL') {
                this._getRequestData("DL", "count");
                // }
                this._getRequestData("", "count");
                this._getRequestData("", "tableData");
                // }
            },

            onFilterBarClear: function () {
                this.getView().byId("id.Date.DatePicker").setValue("");
                this.getView().byId("id.PafNo.Input").setValue("");
                this.getView().byId("id.SalesOffice.Input").setValue("");
                this.getView().byId("id.Division.ComboBox").setSelectedKey("");
            },

            _onFilterSelect: function (oEvent) {

                var sKey = oEvent.getParameter("key");
                if (sKey === "All") {
                    this._getRequestData("", "tableData");
                    this.getView().byId("id.FilterBar").setVisible(true);
                } else if (sKey === "Pending") {
                    this._getRequestData("P", "tableData");
                    this.getView().byId("id.FilterBar").setVisible(true);
                }
                else if (sKey === "Approved") {
                    this._getRequestData("A", "tableData");
                    this.getView().byId("id.FilterBar").setVisible(true);
                }
                else if (sKey === "Delayed") {
                    this._getRequestData("D", "tableData");
                    this.getView().byId("id.FilterBar").setVisible(true);
                } else if (sKey === "Rejected") {
                    this._getRequestData("R", "tableData");
                    this.getView().byId("id.FilterBar").setVisible(true);
                } else if (sKey === "Deleted") {
                    this._getRequestData("DL", "tableData");
                    this.getView().byId("id.FilterBar").setVisible(true);
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

            onSalesOfficeHelp: function () {
                if (!this.SalesOfficerag) {
                    this.SalesOfficerag = sap.ui.xmlfragment("pj.zpmg.view.fragments.main.salesOfficeF4", this);
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
            onValueHelpSearch: function (oEvent) {

                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ET_VALUE_HELPSSet";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter('id'));
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
            onValueHelpConfirm: function (oEvent) {
                debugger;
                var oSelectedItem = oEvent.getParameter("selectedItem");
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
                // this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
            },
            onSuggest: function (oEvent) {
                var sTerm = oEvent.getParameter("suggestValue"),
                    aFilters = [],
                    sPath = "/ET_VALUE_HELPSSet",
                    oFilterDomname,
                    oFilterDomname1,
                    oFilterDomname2;
                if (sTerm.includes(",")) {
                    var nItems = sTerm.split(",").length;
                    sTerm = sTerm.split(",")[sTerm.split(",").length - 1];
                }
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

                            if (Data.results.length > 0) {
                                var JSONModelForSuggest = new JSONModel(Data.results);
                                this.getView().setModel(JSONModelForSuggest, "JSONModelForSuggest");
                                this.getView().getModel("JSONModelForSuggest").refresh(true);
                            }
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

                }
            },

            // Start: Sales Office
            onSalesOfficeHelp: function () {
                if (!this.SalesOfficerag) {
                    this.SalesOfficerag = sap.ui.xmlfragment("pj.zpmg.view.fragments.View1.salesOfficeF4", this);
                    this.getView().addDependent(this.SalesOfficerag);
                    this._SalesOfficeTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();
                    this._oTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();

                    var sServicelUrl = "/sap/opu/odata/sap/ZCUSTOMER_AUTOMATIONDISCOUNT_SRV/";
                    var oODataModel = new sap.ui.model.odata.v2.ODataModel(sServicelUrl);
                    this.SalesOfficerag.setModel(oODataModel);
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
            onValueHelpSearch: function (oEvent) {

                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ET_VALUE_HELPSSet";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter('id'));
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
            onValueHelpConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().byId("id.SalesOffice.Input").setValue(sSelectedValue); 
            },
            onSuggest: function (oEvent) {
                var sTerm = oEvent.getParameter("suggestValue"),
                    aFilters = [],
                    sPath = "/ET_VALUE_HELPSSet",
                    oFilterDomname,
                    oFilterDomname1,
                    oFilterDomname2;
                if (sTerm.includes(",")) {
                    var nItems = sTerm.split(",").length;
                    sTerm = sTerm.split(",")[sTerm.split(",").length - 1];
                }
                oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
                oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname2);
                aFilters.push(oFilterDomname1);

                if (sTerm) {
                    this.getView().setBusy(true);
                    var sServicelUrl = "/sap/opu/odata/sap/ZCUSTOMER_AUTOMATIONDISCOUNT_SRV/";
                    var oODataModel = new sap.ui.model.odata.v2.ODataModel(sServicelUrl);
                    oODataModel.read(sPath, {
                        filters: aFilters,
                        success: function (Data) {
                          
                            if (Data.results.length > 0) {
                                var JSONModelForSuggest = new JSONModel(Data.results);
                                this.getView().setModel(JSONModelForSuggest, "JSONModelForSuggest");
                                this.getView().getModel("JSONModelForSuggest").refresh(true);
                            }
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

                }
            },
            // End: Sales Office

        });
    });
