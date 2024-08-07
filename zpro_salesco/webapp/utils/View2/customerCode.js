sap.ui.define(['sap/m/MessageBox', "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (
    MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";
    return {
        // on Value Help(F4)
        onCustomerCodeHelp: function (that) {

            if (!that.CustomerCodeFrag) {
                that.CustomerCodeFrag = sap.ui.xmlfragment("zpj.pro.sk.sd.salescoordinator.zprosalesco.view.fragments.View2.F4s.customerCodF4", that);
                that.getView().addDependent(that.CustomerCodeFrag);
                that._CustomerCodeTemp = sap.ui.getCore().byId("idSLCustomerCodeValueHelp").clone();
                that._oTempCustCode = sap.ui.getCore().byId("idSLCustomerCodeValueHelp").clone();
            }
            var aFilter = [];
            var oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "KNA1")], false);
            var oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, "LARS")], false);
            aFilter.push(oFilterDomname);
            aFilter.push(oFilterDomname1);
            sap.ui.getCore().byId("idSDCustomerCodeF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPSSet",
                filters: aFilter,
                template: that._CustomerCodeTemp
            });

            that.CustomerCodeFrag.open();




        },

        // on Value Help - Search/liveChange
        onValueHelpSearch_custCode: function (oEvent, that) {

            var aFilter = [];
            var sValue = oEvent.getParameter("value");
            var sPath = "/ET_VALUE_HELPSSet";
            var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter('id'));
            var oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "KNA1")], false);
            var oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, sValue)], false);
            aFilter.push(oFilterDomname1);
            aFilter.push(oFilterDomname);
            oSelectDialog.bindAggregation("items", {
                path: sPath,
                filters: aFilter,
                template: that._oTempCustCode
            });
        },

        // on Value Help - Confirm
        onValueHelpConfirm_custCode: function (oEvent, that) {
          
            var JSONModelPayload = that.getView().getModel("JSONModelPayload")
            
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                sSelectedValue = oSelectedItem.getProperty("title");
            JSONModelPayload.setProperty("/Kunnr", sSelectedValue);
            that.getView().getModel("JSONModelPayload").setProperty("/Name", oSelectedItem.getProperty("description"));
        },

        // on Submit
        onCustomerCodeInputSubmit: function (oEvent, that) {

            var sTerm = oEvent.getParameter("value"),
                aFilters = [],
                oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "KNA1")], false),
                oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, sTerm)], false),
                sValue1 = "/Kunnr",
                sValue2 = "/Name",
                sMessage = "Entered Customer code is wrong";
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
                    error: function (oError) {
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
        onSuggest_custCode: function (oEvent, that) {

            var sTerm = oEvent.getParameter("suggestValue"),
                aFilters = [],
                sPath = "/ET_VALUE_HELPSSet",
                oFilterDomname,
                oFilterDomname1,
                nLen = 1;

            if (sTerm.length > 3) {
                nLen = 1;
            } else {
                nLen = 0;
            }

            oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "KNA1")], false);
            oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, sTerm)], false);

            aFilters.push(oFilterDomname);
            aFilters.push(oFilterDomname1);

            if (sTerm && nLen === 1) {
                that.getView().setBusy(true);
                that.getView().getModel().read(sPath, {
                    filters: aFilters,
                    success: function (Data) {
                        if (Data.results.length > 0) {
                            var JSONModelForSuggest_custCode = new JSONModel(Data.results);
                            that.getView().setModel(JSONModelForSuggest_custCode, "JSONModelForSuggest_custCode");
                            that.getView().getModel("JSONModelForSuggest_custCode").refresh(true);
                        }
                        that.getView().setBusy(false);
                    }.bind(that),
                    error: function (oError) {
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

        // On change
        onCustomerCodeInputChange: function (that) {
            if(that.getView().getModel("JSONModelPayload")){
                that.getView().getModel("JSONModelPayload").setProperty("/Name", "");
            } 
           
        },
        // on Suggestion select
        onCustomerCodeInputSuggestionSelect: function (oEvent, that) {
           
            var sSelectedCode = oEvent.getParameter("selectedRow").getAggregation("cells")[0].getProperty("text");
            var sTerm = sSelectedCode,
                aFilters = [],
                oFilterDomname = new Filter([new Filter("Domname", FilterOperator.EQ, "KNA1")], false),
                oFilterDomname1 = new Filter([new Filter("Domname1", FilterOperator.EQ, sTerm)], false),
                sValue1 = "/Kunnr",
                sValue2 = "/Name",
                sMessage = "Entered Customer code is wrong";
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
                                debugger;
                                that.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].Ddtext);
                            } else {
                                if(that.getView().getModel("JSONModelPayload")){

                                
                                that.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].DomvalueL);
                                }else{
                                    that.getView().byId("idV2InpCustCode").setValue(Data.results[0].DomvalueL);
                                }
                            }
                            if (sValue2) {
                                if( that.getView().getModel("JSONModelPayload")){
                                    that.getView().getModel("JSONModelPayload").setProperty(sValue2, Data.results[0].Ddtext);
                                }
                               
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
                    error: function (oError) {
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
        onCustomerCodeLiveChange: function (oEvent) {
            oEvent.getSource().setValueState("None");
        },

    }
});