sap.ui.define(['sap/m/MessageBox', "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (
    MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";
    return {
        // on Value Help(F4)
        onSalesOfficeHelp: function (that) {

            if (!that.SalesOfficerag) {
                that.SalesOfficerag = sap.ui.xmlfragment("zpj.pro.sk.sd.salescoordinator.zprosalesco.view.fragments.View2.F4s.salesOfficeF4", that);
                that.getView().addDependent(that.SalesOfficerag);
                that._SalesOfficeTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();
                that._oTempSalesOffice = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();
            }
            var aFilter = [];

            var oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "TVKBZ")], false);
            var oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, "")], false);
            var oFilterDomname2 = new Filter([new Filter("Domname2", FilterOperator.EQ, "")], false);
            aFilter.push(oFilterDomname);
            aFilter.push(oFilterDomname1);
            aFilter.push(oFilterDomname2);

            sap.ui.getCore().byId("idSDSalesOfficeF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPSSet",
                filters: aFilter,
                template: that._SalesOfficeTemp
            });
            that.SalesOfficerag.open();
        },
        // on Value Help - Search/liveChange
        onSalesOfficeHelpSearch: function (oEvent, that) {
            var aFilter = [], sValue = oEvent.getParameter("value"),
                sPath = "/ET_VALUE_HELPSSet",
                oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter('id')),
                oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "TVKBZ")], false),
                oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, sValue)], false);
            aFilter.push(oFilterDomname1);
            aFilter.push(oFilterDomname);

            oSelectDialog.bindAggregation("items", {
                path: sPath,
                filters: aFilter,
                template: that._oTempSalesOffice
            });
        },
        // on Value Help - Confirm
        onSalesOfficeValueHelpConfirm: function (oEvent, that) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                sSelectedValue = oSelectedItem.getProperty("title");
            that.getView().getModel("JSONModelPayload").setProperty("/Vkbur", sSelectedValue);
        },
        // on Submit
        salesOffice_submitCall: function (oEvent, that) {
            var sTerm = oEvent.getParameter("value"),
                aFilters = [],
                oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "TVKBZ")], false),
                oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, sTerm)], false),
                sValue1 = "/Vkbur",
                sValue2 = "",
                sMessage = "Entered Sales Office is wrong";
            aFilters.push(oFilterDomname);
            aFilters.push(oFilterDomname1);
            if (sTerm) {
                var sPath = "/ET_VALUE_HELPSSet";
                that.getView().setBusy(true);
                that.getView().getModel().read(sPath, {
                    filters: aFilters,
                    success: function (Data) {

                        if (Data.results.length === 1) {
                            if (sValue1.includes("Mvgr2")) {
                                that.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].Ddtext);
                            } else {
                                that.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].DomvalueL);
                            }
                            if (sValue2) {
                                that.getView().getModel("JSONModelPayload").setProperty(sValue2, Data.results[0].Ddtext);
                            }
                        } else {
                            that.getView().getModel("JSONModelPayload").setProperty(sValue1, "");
                            if (sValue2) {
                                that.getView().getModel("JSONModelPayload").setProperty(sValue2, "");
                            }
                            MessageBox.error(sMessage)
                        }
                        that.getView().setBusy(false);
                    }.bind(that),
                    error: function (sError) {
                        that.getView().setBusy(false);
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {

                            }
                        });
                    }.bind(that)
                });

            }

        },
        // on Suggest
        onSuggest_salesOffice: function (oEvent, that) {

            var sTerm = oEvent.getParameter("suggestValue"),
                aFilters = [],
                sPath = "/ET_VALUE_HELPSSet",
                oFilterDomname,
                oFilterDomname1,
                oFilterDomname2,
                nLen = 1;

            oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "TVKBZ")], false);
            oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, sTerm)], false);
            oFilterDomname2 = new Filter([new Filter("Domname2", FilterOperator.EQ, "")], false);
            aFilters.push(oFilterDomname2);

            aFilters.push(oFilterDomname);
            aFilters.push(oFilterDomname1);

            if (sTerm && nLen === 1) {
                that.getView().setBusy(true);
                that.getView().getModel().read(sPath, {
                    filters: aFilters,
                    success: function (Data) {

                        if (Data.results.length > 0) {
                            var JSONModelForSuggest = new JSONModel(Data.results);
                            that.getView().setModel(JSONModelForSuggest, "JSONModelForSuggest");
                            that.getView().getModel("JSONModelForSuggest").refresh(true);
                        }
                        that.getView().setBusy(false);
                    }.bind(that),
                    error: function (sError) {
                        that.getView().setBusy(false);
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {

                            }
                        });
                    }.bind(that)
                });

            }
        },
        // On live change
        onSalesOfficeLiveChange: function (oEvent) {
            oEvent.getSource().setValueState("None");
        }
    }
});