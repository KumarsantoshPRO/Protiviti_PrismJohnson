
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
                oControl.CustomerCodeFrag = sap.ui.xmlfragment("prj.salescoordinator.fragments.customerCodF4", oControl);
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
                oControl.SalesOfficerag = sap.ui.xmlfragment("prj.salescoordinator.fragments.salesOfficeF4", oControl);
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


    }
});