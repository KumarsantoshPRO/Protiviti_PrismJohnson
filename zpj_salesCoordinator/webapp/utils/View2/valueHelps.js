
sap.ui.define([], function () {
    "use strict";
    return {

        onCustomerCodeHelpSearch: function (oSelectDialog, aFilter, sPath, oControl) {

            aFilter.push(oFilterCustomerCode);
            oSelectDialog.bindAggregation("items", {
                path: sPath,
                filters: aFilter,
                template: oControl._CustomerCodeTemp
            });
        },

        valueHelpConfirm: function (oSelectedItem, oControl) {


        },
        // Customer Code Plant
        onCustomerCodeHelp: function (oControl) {

            if (!oControl.CustomerCodeFrag) {
                oControl.CustomerCodeFrag = sap.ui.xmlfragment("prj.salescoordinator.fragments.View2.F4s.customerCodF4", oControl);
                oControl.getView().addDependent(oControl.CustomerCodeFrag);
                oControl._CustomerCodeTemp = sap.ui.getCore().byId("idSLCustomerCodeValueHelp").clone();
            }
            var aFilter = [];
            var oFilterCustomerCode = new sap.ui.model.Filter([new sap.ui.model.Filter("DOM", sap.ui.model.FilterOperator.EQ, "KNA1")], false);
            aFilter.push(oFilterCustomerCode);
            sap.ui.getCore().byId("idSDCustomerCodeF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPS",
                filters: aFilter,
                template: oControl._CustomerCodeTemp
            });
            oControl.CustomerCodeFrag.open();
        },

        // Sales Office
        onSalesOfficeHelp: function (oControl) {

            if (!oControl.SalesOfficerag) {
                oControl.SalesOfficerag = sap.ui.xmlfragment("prj.salescoordinator.fragments.View2.F4s.salesOfficeF4", oControl);
                oControl.getView().addDependent(oControl.SalesOfficerag);
                oControl._SalesOfficeTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();
            }
            var aFilter = [];
            var oFilterCustomerCode = new sap.ui.model.Filter([new sap.ui.model.Filter("DOM", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
            aFilter.push(oFilterCustomerCode);
            sap.ui.getCore().byId("idSDSalesOfficeF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPS",
                filters: aFilter,
                template: oControl._SalesOfficeTemp
            });
            oControl.SalesOfficerag.open();
        },

        // Material Freight Group
        onMaterialFreightGroupsHelp: function(oControl){
            var oResourceModel = oControl.getView().getModel("i18nV2").getResourceBundle();
            if (!oControl.oFragment) {
                oControl.oFragment = sap.ui.xmlfragment("prj.salescoordinator.fragments.View2.F4s.materialFreightGroupsF4", oControl);
                oControl.oFragment.setTitle(oResourceModel.getText("view2.F4.title.materialFreightGroups"));
                oControl.getView().addDependent(oControl.SalesOfficerag);
                oControl._SalesOfficeTemp = sap.ui.getCore().byId("idSLMaterialFreightGroupsValueHelp").clone();
            }
            var aFilter = [];
            var oFilterCustomerCode = new sap.ui.model.Filter([new sap.ui.model.Filter("DOM", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
            aFilter.push(oFilterCustomerCode);
            sap.ui.getCore().byId("idSDMaterialFreightGroupsF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPS",
                filters: aFilter,
                template: oControl._SalesOfficeTemp
            });
            oControl.oFragment.open();
        },
        // Sizes
        onSizesHelp: function(oControl){
            var oResourceModel = oControl.getView().getModel("i18nV2").getResourceBundle();
            if (!oControl.oFragmentSizes) {
                oControl.oFragmentSizes = sap.ui.xmlfragment("prj.salescoordinator.fragments.View2.F4s.sizesF4", oControl);
                oControl.oFragmentSizes.setTitle(oResourceModel.getText("view2.F4.title.sizes"));
                oControl.getView().addDependent(oControl.SalesOfficerag);
                oControl._SalesOfficeTemp = sap.ui.getCore().byId("idSLSizesValueHelp").clone();
            }
            var aFilter = [];
            var oFilterCustomerCode = new sap.ui.model.Filter([new sap.ui.model.Filter("DOM", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
            aFilter.push(oFilterCustomerCode);
            sap.ui.getCore().byId("idSDSizesF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPS",
                filters: aFilter,
                template: oControl._SalesOfficeTemp
            });
            oControl.oFragmentSizes.open();
        },
// Designs 
        onDesignsHelp: function(oControl){
            var oResourceModel = oControl.getView().getModel("i18nV2").getResourceBundle();
            if (!oControl.oFragmentDesign) {
                oControl.oFragmentDesign = sap.ui.xmlfragment("prj.salescoordinator.fragments.View2.F4s.designsF4", oControl);
                oControl.oFragmentDesign.setTitle(oResourceModel.getText("view2.F4.title.designs"));
                oControl.getView().addDependent(oControl.SalesOfficerag);
                oControl._SalesOfficeTemp = sap.ui.getCore().byId("idSLDesignsValueHelp").clone();
            }
            var aFilter = [];
            var oFilterCustomerCode = new sap.ui.model.Filter([new sap.ui.model.Filter("DOM", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
            aFilter.push(oFilterCustomerCode);
            sap.ui.getCore().byId("idSDDesignsF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPS",
                filters: aFilter,
                template: oControl._SalesOfficeTemp
            });
            oControl.oFragmentDesign.open();
        },
        // Supply Plant
        onSupplyPlantHelp: function(oControl){
            var oResourceModel = oControl.getView().getModel("i18nV2").getResourceBundle();
            if (!oControl.oFragmentSupply) {
                oControl.oFragmentSupply = sap.ui.xmlfragment("prj.salescoordinator.fragments.View2.F4s.supplyingPlantF4", oControl);
                oControl.oFragmentSupply.setTitle(oResourceModel.getText("view2.F4.title.supplyingPlant"));
                oControl.getView().addDependent(oControl.SalesOfficerag);
                oControl._SalesOfficeTemp = sap.ui.getCore().byId("idSLSupplyingPlantValueHelp").clone();
            }
            var aFilter = [];
            var oFilterCustomerCode = new sap.ui.model.Filter([new sap.ui.model.Filter("DOM", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
            aFilter.push(oFilterCustomerCode);
            sap.ui.getCore().byId("idSDSupplyingPlantF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPS",
                filters: aFilter,
                template: oControl._SalesOfficeTemp
            });
            oControl.oFragmentSupply.open();
        },

        // Manufacturing Amount
        onManufacturingAmtHelp: function (oControl) {
            var oResourceModel = oControl.getView().getModel("i18nV2").getResourceBundle();
            if (!oControl.oFragmentMan) {
                oControl.oFragmentMan = sap.ui.xmlfragment("prj.salescoordinator.fragments.View2.F4s.manufacturingAmountF4", oControl);
                oControl.oFragmentMan.setTitle(oResourceModel.getText("view2.F4.title.manufacturingAmount"));
                oControl.getView().addDependent(oControl.SalesOfficerag);
                oControl._SalesOfficeTemp = sap.ui.getCore().byId("idSLManufacturingAmountValueHelp").clone();
            }
            var aFilter = [];
            var oFilterCustomerCode = new sap.ui.model.Filter([new sap.ui.model.Filter("DOM", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
            aFilter.push(oFilterCustomerCode);
            sap.ui.getCore().byId("idSDManufacturingAmountF4").bindAggregation("items", {
                path: "/ET_VALUE_HELPS",
                filters: aFilter,
                template: oControl._SalesOfficeTemp
            });
            oControl.oFragmentMan.open();
        }


    }
});