sap.ui.define(
  ["sap/m/MessageBox", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
  function (MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";
    return {
      // on Value Help(F4)
      onMaterialFreightGroupsHelp: function (oEvent, that) {
        var Division = that.getView().getModel("JSONModelPayload").getProperty("/Spart");
        if (Division) {
          that.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");

          that.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
          var oResourceModel = that.getView().getModel("i18nV2").getResourceBundle();

          if (!that.oFragment) {
            that.oFragment = sap.ui.xmlfragment("zpj.pro.sk.sd.salescoordinator.zprosalesco.view.fragments.View2.F4s.materialFreightGroupsF4", that);
            that.oFragment.setTitle(oResourceModel.getText("view2.F4.title.materialFreightGroups"));
            that.getView().addDependent(that.SalesOfficerag);
            that._SalesOfficeTemp = sap.ui.getCore().byId("idSLMaterialFreightGroupsValueHelp").clone();
            that._oTempMaterialFreightGroups = sap.ui.getCore().byId("idSLMaterialFreightGroupsValueHelp").clone();
          }
          var aFilter = [];
          var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
          var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false);
          var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false);

          aFilter.push(oFilterDomname);
          aFilter.push(oFilterDomname1);
          aFilter.push(oFilterDomname2);

          that.oFragment.setModel(that.getView().getModel());
          sap.ui.getCore().byId("idSDMaterialFreightGroupsF4").bindAggregation("items", {
            path: "/ET_VALUE_HELPSSet",
            filters: aFilter,
            template: that._SalesOfficeTemp,
          });
          that.oFragment.open();
        } else {
          MessageBox.error("Please select vertical first");
          that.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("Error");
        }
      },
      // on F4 search/liveChange
      onMaterialFreightGroupsValueHelpSearch: function (oEvent, that) {
        var aFilter = [];
        var sValue = oEvent.getParameter("value");
        var sPath = "/ET_VALUE_HELPSSet";
        var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
        var Division = that.getView().getModel("JSONModelPayload").getProperty("/Spart");
        var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
        var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false);
        var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sValue)], false);

        aFilter.push(oFilterDomname1);
        aFilter.push(oFilterDomname2);
        aFilter.push(oFilterDomname);
        oSelectDialog.bindAggregation("items", {
          path: sPath,
          filters: aFilter,
          template: that._oTempMaterialFreightGroups,
        });
      },
      // on F4 confirm
      onMaterialFreightGroupsHelpConfirm: function (oEvent, that) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sSelectedValue = oSelectedItem.getProperty("title");
        var aModelData = that.getView().getModel("JSONModelPayload").getProperty("/ET_SALES_COORD_ISET/results");
        var bindingContextPathMFG = that.bindingContextPath + "/Mfrgr";
        var bindingContextPathSize = that.bindingContextPath + "/Szmm";
        var bindingContextPathMFP = that.bindingContextPath + "/Prodh1";
        var bindingContextPathPart = that.bindingContextPath + "/Mvgr5";
        var bindingContextPathQuality = that.bindingContextPath + "/Zzprodh4";
        var sPart = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathPart);
        var sManufacturingPlant = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFP);
        var sSelectedValueQuality = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathQuality);

        for (var i = 0; i < aModelData.length; i++) {
          if (
            sSelectedValue === aModelData[i].Mfrgr &&
            sPart === aModelData[i].Mvgr5 &&
            sManufacturingPlant === aModelData[i].Prodh1 &&
            sSelectedValueQuality === aModelData[i].Zzprodh4 &&
            i != Number(that.bindingContextPath.split("/")[3])
          ) {
            // MessageBox.error("Material Freigth Group:- '" + sSelectedValue + "'Manufacturing Plant:-'"+ sManufacturingPlant +  "' and Part:-'" + sPart + "' combination already selected");
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
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFP, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathPart, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathQuality, "");
            i = aModelData.length;
          } else {
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, sSelectedValue);
            var aFilter = [];
            var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SIZE")], false);
            var oFilterDomname2 = new sap.ui.model.Filter(
              [new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, sSelectedValue)],
              false
            );
            aFilter.push(oFilterDomname);
            aFilter.push(oFilterDomname2);
            var sPath = "/ET_VALUE_HELPSSet";
            var that = that;
            that.getView().setBusy(true);
            that
              .getView()
              .getModel()
              .read(sPath, {
                filters: aFilter,
                // urlParameters: {
                //     "$expand": ""
                // },
                success: function (Data) {
                  that.getView().setBusy(false);
                  that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, Data.results[0].Ddtext);
                }.bind(that),
                error: function (oError) {
                  that.getView().setBusy(false);
                  MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {},
                  });
                }.bind(that),
              });
          }
          // }
        }
      },
      // On Suggest
      onSuggest_MaterialFreightGroups: function (oEvent, that) {
        var sTerm = oEvent.getParameter("suggestValue"),
          aFilters = [],
          sPath = "/ET_VALUE_HELPSSet",
          oFilterDomname,
          oFilterDomname1,
          oFilterDomname2,
          nLen = 1;

        var Division = that.getView().getModel("JSONModelPayload").getProperty("/Spart");
        oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
        oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
        oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false);

        aFilters.push(oFilterDomname);
        aFilters.push(oFilterDomname1);
        aFilters.push(oFilterDomname2);

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
      onMaterialFreightGroupInputSubmit: function (oEvent, that) {
        var sTerm = oEvent.getParameter("value"),
          sSelectedValue = sTerm,
          aFilters = [],
          Division = that.getView().getModel("JSONModelPayload").getProperty("/Spart"),
          oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false),
          oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
          oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false),
          bindingContextPath = oEvent.getSource().getParent().getBindingContextPath(),
          sValue1 = bindingContextPath + "/Mfrgr",
          sValue2 = bindingContextPath + "/Szmm",
          sMessage = "Entered Material Freight Group is wrong",
          bindingContextPathPart = bindingContextPath + "/Mvgr5",
          sPart = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathPart);

        aFilters.push(oFilterDomname);
        aFilters.push(oFilterDomname1);
        aFilters.push(oFilterDomname2);

        var aModelData = that.getView().getModel("JSONModelPayload").getProperty("/ET_SALES_COORD_ISET/results");
        var bindingContextPathMFG = sValue1;
        var bindingContextPathSize = sValue2;
        var bindingContextPathMFP = bindingContextPath + "/Prodh1";
        var bindingContextPathQuality = bindingContextPath + "/Zzprodh4";
        var sManufacturingPlant = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFP);
        var sSelectedValueQuality = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathQuality);
        var vMFGStatus = 0;
        for (var i = 0; i < aModelData.length; i++) {
          if (
            sSelectedValue === aModelData[i].Mfrgr &&
            sPart === aModelData[i].Mvgr5 &&
            sManufacturingPlant === aModelData[i].Prodh1 &&
            sSelectedValueQuality === aModelData[i].Zzprodh4 &&
            i != Number(bindingContextPath.split("/")[3])
          ) {
            if (that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFG) !== "") {
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
              vMFGStatus = 1;
              that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, "");
              that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, "");
              that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFP, "");          
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathPart, "");
            that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathQuality, "");
              // that.getView().getModel("JSONModelPayload").refresh(true);
              i = aModelData.length;
            }
          } else {
            var aFilter = [];
            var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SIZE")], false);
            var oFilterDomname2 = new sap.ui.model.Filter(
              [new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, sSelectedValue)],
              false
            );
            aFilter.push(oFilterDomname);
            aFilter.push(oFilterDomname2);
            var sPath = "/ET_VALUE_HELPSSet";
            var that = that;
            that.getView().setBusy(true);
            that
              .getView()
              .getModel()
              .read(sPath, {
                filters: aFilter,
                // urlParameters: {
                //     "$expand": ""
                // },
                success: function (Data) {
                  that.getView().setBusy(false);
                  that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, Data.results[0].Ddtext);
                }.bind(that),
                error: function (oError) {
                  that.getView().setBusy(false);
                  MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {},
                  });
                }.bind(that),
              });
            // }
          }
        }

        if (vMFGStatus === 0) {
          if (Division) {
            that.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
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
          } else {
            MessageBox.error("Please select vertical first");
            that.getView().getModel("JSONModelPayload").setProperty(sValue1, "");
            that.getView().getModel("JSONModelPayload").setProperty(sValue2, "");
            that.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("Error");
          }
        }

        // that.getView().getModel("JSONModelPayload").refresh(true);
      },
      // On live change
      onMaterialFreightGroupsLiveChange: function (oEvent) {
        oEvent.getSource().setValueState("None");
      },
    };
  }
);
