sap.ui.define(
  ["sap/m/MessageBox", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
  function (MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";
    return {
      // on Value Help(F4)
      onManufacturingAmtHelp: function (oEvent, that) {
        that.bindingContextPathManufacturingPlant = oEvent.getSource().getParent().getBindingContextPath() + "/Prodh1";
        that.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
        var oResourceModel = that.getView().getModel("i18nV2").getResourceBundle();
        if (!that.oFragmentMan) {
          that.oFragmentMan = sap.ui.xmlfragment("zpj.pro.sk.sd.salescoordinator.zprosalesco.view.fragments.View2.F4s.manufacturingAmountF4", that);
          that.oFragmentMan.setTitle(oResourceModel.getText("view2.F4.title.manufacturingAmount"));
          that.getView().addDependent(that.SalesOfficerag);
          that._SalesOfficeTemp = sap.ui.getCore().byId("idSLManufacturingAmountValueHelp").clone();
          that._oTempManufacturingPlant = sap.ui.getCore().byId("idSLManufacturingAmountValueHelp").clone();
        }
        var aFilter = [];
        var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T179")], false);
        var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false);
        var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
        aFilter.push(oFilterDomname);
        aFilter.push(oFilterDomname1);
        aFilter.push(oFilterDomname2);
        that.oFragmentMan.setModel(that.getView().getModel());
        sap.ui.getCore().byId("idSDManufacturingAmountF4").bindAggregation("items", {
          path: "/ET_VALUE_HELPSSet",
          filters: aFilter,
          template: that._SalesOfficeTemp,
        });
        that.oFragmentMan.open();
      },

      // on F4 search/liveChange
      onManufacturingPlantValueHelpSearch: function (oEvent, that) {
        debugger;
        var aFilter = [];
        var sValue = oEvent.getParameter("value");
        var sPath = "/ET_VALUE_HELPSSet";
        var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));

        var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T179")], false);
        var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sValue)], false);

        aFilter.push(oFilterDomname1);
        aFilter.push(oFilterDomname);

        oSelectDialog.bindAggregation("items", {
          path: sPath,
          filters: aFilter,
          template: that._oTempManufacturingPlant,
        });
      },

      // on F4 confirm
      onManufacturingAmtHelpConfirm: function (oEvent, that) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sManufacturingPlant = oSelectedItem.getProperty("title");
        var aModelData = that.getView().getModel("JSONModelPayload").getProperty("/ET_SALES_COORD_ISET/results");
        var bindingContextPathMFG = that.bindingContextPath + "/Mfrgr";
        var bindingContextPathSize = that.bindingContextPath + "/Szmm";
        var bindingContextPathPart = that.bindingContextPath + "/Mvgr5";
        var bindingContextPathQuality = that.bindingContextPath + "/Zzprodh4";
        

        var sPart = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathPart),
          sSelectedValue = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFG),
          sSelectedValueQuality = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathQuality);
        for (var i = 0; i < aModelData.length; i++) {
          if (
            sSelectedValue === aModelData[i].Mfrgr &&
            sPart === aModelData[i].Mvgr5 &&
            sManufacturingPlant === aModelData[i].Prodh1 &&
            sSelectedValueQuality === aModelData[i].Zzprodh4 &&
            i != Number(that.bindingContextPath.split("/")[3])
          ) {
            MessageBox.error(
              "Material Freigth Group:- '" +
                sSelectedValue +
                "' and Manufacturing Plant:-'" +
                sManufacturingPlant +
                "' and Part:-'" +
                sPart +
                "' and Quality:-'" +
                sSelectedValueQuality +
                "' combination already selected"
            );

            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathPart, "");
            that.getView().getModel("JSONModelPayload").setProperty(that.bindingContextPathManufacturingPlant, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathQuality, "");

            i = aModelData.length;
          } else {
            that.getView().getModel("JSONModelPayload").setProperty(that.bindingContextPathManufacturingPlant, sManufacturingPlant);
          }
        }
      },
      // On Suggest
      onSuggest_ManufacturingPlant: function (oEvent, that) {
        var sTerm = oEvent.getParameter("suggestValue"),
          aFilters = [],
          sPath = "/ET_VALUE_HELPSSet",
          oFilterDomname,
          oFilterDomname1,
          oFilterDomname2,
          nLen = 1;

        oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T179")], false);
        oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
        oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
        aFilters.push(oFilterDomname2);

        aFilters.push(oFilterDomname);
        aFilters.push(oFilterDomname1);

        if (sTerm && nLen === 1) {
          that.getView().setBusy(true);
          that
            .getView()
            .getModel()
            .read(sPath, {
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
                  onClose: function (oAction) {},
                });
              }.bind(that),
            });
        }
      },

      // Submit action
      onManufacturingPlantInputSubmit: function (oEvent, that) {
        var sTerm = oEvent.getParameter("value"),
          aFilters = [],
          sContextPath = oEvent.getSource().getParent().getBindingContextPath(),
          oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T179")], false),
          oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
          sValue1 = sContextPath + "/Prodh1",
          sManufacturingPlant = sTerm,
          sValue2 = "",
          sMessage = "Entered Manufacturing Plant is wrong";
          that.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
        aFilters.push(oFilterDomname);
        aFilters.push(oFilterDomname1);
        var aModelData = that.getView().getModel("JSONModelPayload").getProperty("/ET_SALES_COORD_ISET/results");
        var bindingContextPathMFG = that.bindingContextPath + "/Mfrgr";
        var bindingContextPathSize = that.bindingContextPath + "/Szmm";
        var bindingContextPathPart = that.bindingContextPath + "/Mvgr5";
        var bindingContextPathQuality = that.bindingContextPath + "/Zzprodh4";
        var bindingContextPathMFP = that.bindingContextPath + "/Prodh1";

        var sPart = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathPart),
          sSelectedValue = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFG),
          sSelectedValueQuality = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathQuality);
        for (var i = 0; i < aModelData.length; i++) {
          if (
            sSelectedValue === aModelData[i].Mfrgr &&
            sPart === aModelData[i].Mvgr5 &&
            sManufacturingPlant === aModelData[i].Prodh1 &&
            sSelectedValueQuality === aModelData[i].Zzprodh4 &&
            i != Number(that.bindingContextPath.split("/")[3])
          ) {
            MessageBox.error(
              "Material Freight Group:- '" +
                sSelectedValue +
                "' and Manufacturing Plant:-'" +
                sManufacturingPlant +
                "' and Part:-'" +
                sPart +
                "' and Quality:-'" +
                sSelectedValueQuality +
                "' combination already selected"
            );

            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathPart, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFP, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathQuality, "");

            i = aModelData.length;
            return;
          } else {
            that.getView().getModel("JSONModelPayload").setProperty(that.bindingContextPathManufacturingPlant, sManufacturingPlant);
          }
        }
        if (sTerm) {
          var sPath = "/ET_VALUE_HELPSSet";
          that.getView().setBusy(true);
          that
            .getView()
            .getModel()
            .read(sPath, {
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
                  MessageBox.error(sMessage);
                }
                that.getView().setBusy(false);
              }.bind(that),
              error: function (sError) {
                that.getView().setBusy(false);
                MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function (oAction) {},
                });
              }.bind(that),
            });
        }
      },
      // On live change
      onManufacturingPlantLiveChange: function (oEvent) {
        oEvent.getSource().setValueState("None");
      },
    };
  }
);
