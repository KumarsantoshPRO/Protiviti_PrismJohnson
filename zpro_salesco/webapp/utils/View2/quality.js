sap.ui.define(['sap/m/MessageBox', "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (
    MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";
    return {

        // Selection change
        onQualitySelectChange: function (oEvent, that) {
            debugger
            var bindingContextPath = oEvent.getSource().getParent().getBindingContextPath(),
                bindingContextPathMFG = bindingContextPath + "/Mfrgr",
                bindingContextPathSize = bindingContextPath + "/Szmm",
                bindingContextPathPart = bindingContextPath + "/Mvgr5",
                bindingContextPathMFP = bindingContextPath + "/Prodh1",
                sSelectedValue = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFG),
                sSelectedValuePart = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathPart),
                sManufacturingPlant = that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFP),
                bindingContextPathQuality = bindingContextPath + "/Zzprodh4",
                sSelectedValueQuality = oEvent.getParameter("selectedItem").getProperty("key");
            var aModelData = that.getView().getModel("JSONModelPayload").getProperty("/ET_SALES_COORD_ISET/results");

            // var vMFGStatus = 0;
            for (var i = 0; i < aModelData.length; i++) {
                if (sSelectedValue === aModelData[i].Mfrgr && sSelectedValueQuality === aModelData[i].Zzprodh4 && sManufacturingPlant === aModelData[i].Prodh1 && sSelectedValuePart === aModelData[i].Mvgr5 && i != Number(bindingContextPath.split("/")[3])) {

                    if (that.getView().getModel("JSONModelPayload").getProperty(bindingContextPathMFG) !== '') {
                        MessageBox.error("Material Freigth Group:- '" + sSelectedValue + "' and Manufacturing Plant:-'" + sManufacturingPlant + "' and Part:-'" + sSelectedValueQuality + "' and Quality:-'" + sSelectedValuePart + "' combination already selected");
                        // vMFGStatus = 1;
                        that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, "");
                        that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, "");
                        that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathPart, "");
                        that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathQuality, "");
                        that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFP, "");
                        that.getView().getModel("JSONModelPayload").refresh(true);
                        i = aModelData.length;
                    }
                }
            }


            // if (vMFGStatus === 0) {
            //     if (Division) {

            //         that.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None")
            //         if (sTerm) {
            //             var sPath = "/ET_VALUE_HELPSSet";
            //             that.getView().setBusy(true);
            //             that.getView().getModel().read(sPath, {
            //                 filters: aFilters,
            //                 // urlParameters: {
            //                 //     "$expand": ""
            //                 // },
            //                 success: function (Data) {

            //                     if (Data.results.length === 1) {
            //                         if (sValue1.includes("Mvgr2")) {
            //                             that.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].Ddtext);
            //                         } else {
            //                             that.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].DomvalueL);
            //                         }
            //                         if (sValue2) {
            //                             that.getView().getModel("JSONModelPayload").setProperty(sValue2, Data.results[0].Ddtext);
            //                         }
            //                     } else {
            //                         that.getView().getModel("JSONModelPayload").setProperty(sValue1, "");
            //                         if (sValue2) {
            //                             that.getView().getModel("JSONModelPayload").setProperty(sValue2, "");
            //                         }
            //                         MessageBox.error(sMessage)
            //                     }
            //                     that.getView().setBusy(false);
            //                 }.bind(that),
            //                 error: function (sError) {
            //                     that.getView().setBusy(false);
            //                     MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
            //                         actions: [sap.m.MessageBox.Action.OK],
            //                         onClose: function (oAction) {

            //                         }
            //                     });
            //                 }.bind(that)
            //             });

            //         }
            //     } else {
            //         MessageBox.error("Please select vertical first");
            //         that.getView().getModel("JSONModelPayload").setProperty(sValue1, "");
            //         that.getView().getModel("JSONModelPayload").setProperty(sValue2, "");
            //         that.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("Error")
            //     }
            // }

            // that.getView().getModel("JSONModelPayload").refresh(true);

        }
    }
});