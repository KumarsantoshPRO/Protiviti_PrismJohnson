sap.ui.define(['sap/m/MessageBox', "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (
    MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";
    return {
        // on Value Help(F4)
        onDesignsHelp: function (oEvent, that) {
            var sPath = oEvent.getSource().getParent().getBindingContextPath();
            var Mfrgr = that.getView().getModel("JSONModelPayload").getContext(sPath).getProperty("Mfrgr");
            that.Mfrgr = oEvent.getSource().getParent().getBindingContextPath() + "/Mfrgr";
            that.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Mvgr2";
            if (Mfrgr) {

                var oResourceModel = that.getView().getModel("i18nV2").getResourceBundle();
                if (!that.oFragmentDesign) {
                    that.oFragmentDesign = sap.ui.xmlfragment("zpj.pro.sk.sd.salescoordinator.zprosalesco.view.fragments.View2.F4s.designsF4", that);
                    that.oFragmentDesign.setTitle(oResourceModel.getText("view2.F4.title.designs"));
                    that.getView().addDependent(that.SalesOfficerag);
                    that._DesignsTemp = sap.ui.getCore().byId("idSLDesignsValueHelp").clone();
                    that._oTempDesign = sap.ui.getCore().byId("idSLDesignsValueHelp").clone();
                }
                var aFilter = [];


                var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false);
                var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false);
                var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Mfrgr)], false);
                aFilter.push(oFilterDomname);
                aFilter.push(oFilterDomname1);
                aFilter.push(oFilterDomname2);
                that.oFragmentDesign.setModel(that.getView().getModel());
                sap.ui.getCore().byId("idSDDesignsF4").bindAggregation("items", {
                    path: "/ET_VALUE_HELPSSet",
                    filters: aFilter,
                    template: that._DesignsTemp
                });
                that.oFragmentDesign.open();

            } else {
                MessageBox.error("Please select 'Material Freight Group' first");
            }
        },
        // on F4 search/liveChange
        onValueHelpSearchDesing: function (oEvent, that) {

            var aFilter = [];
            var sValue = oEvent.getParameter("value");
            var sPath = "/ET_VALUE_HELPSSet";
            var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter('id'));
            var Mfrgr = that.getView().getModel("JSONModelPayload").getProperty(that.Mfrgr);
            var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false);
            var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sValue)], false);
            var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Mfrgr)], false)


            aFilter.push(oFilterDomname);
            aFilter.push(oFilterDomname1);
            aFilter.push(oFilterDomname2);

            oSelectDialog.bindAggregation("items", {
                path: sPath,
                filters: aFilter,
                template: that._oTempDesign
            });

        },
        // on F4 confirm
        onDesignsHelpConfirm: function (oEvent, that) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sSelectedValue = oSelectedItem.getProperty("title");
            that.getView().getModel("JSONModelPayload").setProperty(that.bindingContextPath, sSelectedValue);
        },
        // On Suggest
        onSuggest_Designs: function (oEvent, that) {
            var sTerm = oEvent.getParameter("suggestValue"),
                aFilters = [],
                sPath = "/ET_VALUE_HELPSSet",
                oFilterDomname,
                oFilterDomname1,
                oFilterDomname2,
                nLen = 1;

            var sContextPath = oEvent.getSource().getParent().getBindingContextPath();
            var Mfrgr = that.getView().getModel("JSONModelPayload").getContext(sContextPath).getProperty("Mfrgr");
            var Division = that.getView().getModel("JSONModelPayload").getProperty("/Spart");
            oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false);
            oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
            oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Mfrgr)], false);


            aFilters.push(oFilterDomname);
            aFilters.push(oFilterDomname1);
            aFilters.push(oFilterDomname2);

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
        // Submit action
        onDesignsInputSubmit: function (oEvent, that) {
            var sTerm = oEvent.getParameter("value"),
                aFilters = [],
                sContextPath = oEvent.getSource().getParent().getBindingContextPath(),
                Mfrgr = that.getView().getModel("JSONModelPayload").getContext(sContextPath).getProperty("Mfrgr"),
                oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false),
                oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Mfrgr)], false),
                sValue1 = sContextPath + "/Mvgr2",
                sValue2 = "",
                sMessage = "Entered Design is wrong";
            aFilters.push(oFilterDomname);
            aFilters.push(oFilterDomname1);
            aFilters.push(oFilterDomname2);
            if (Mfrgr) {
                if (sTerm) {
                    var sPath = "/ET_VALUE_HELPSSet";
                    that.getView().setBusy(true);
                    that.getView().getModel().read(sPath, {
                        filters: aFilters,
                        // urlParameters: {
                        //     "$expand": ""
                        // },
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
            } else {
                MessageBox.error("Please select Material Frieght Group first");
                that.getView().getModel("JSONModelPayload").setProperty(sValue1, "");
            }
        },
        // On live change
        onDesignsLiveChange: function (oEvent) {
            oEvent.getSource().setValueState("None");
        }

    }
});