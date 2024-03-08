sap.ui.define(['sap/m/MessageBox'], function (MessageBox) {
    "use strict";
    var oItemFieldsNColumnHeaders = {
        "Mfrgr": "Material Freight Groups",
        "Szmm": "Sizes",
        "Mvgr2": "Designs",
        "Werks": "Supplying Plant",
        "Prodh1": "Manufacturing Plant",
        "CurrentVol": "Current Volume (Sqft)",
        "TotalVol": "Total Volume (Sqft)",
        "Exfac": "Ex Factory (SqFt)",
        "Disc": "On-Invoice discount per SqFt",
        "Schemedisc": "Schemes discount per SqFt(If Applicable)",
        "SchemediscPer": "Schemes %",
        "Commbox": "ORC Entity",
        "Commboxp": "ORC %",
        "Frgtbx": "Freight SqFt",
        "Compname": "Competitor Name",
        "Complanprice": "Competitor landed price",
        // "": "Competitor receipt",
        "Zzprodh4": "Quality",
        "Mvgr5": "Part A/B",
        "LandedPrice": "Landed",
        "Nef": "Net Ex factory(NEF)"
    };
    var oHeadeFieldsNIds = {
        "Kunnr": "idV2InpCustCode",
        "Zterm": "idV2SLPaymentTerm",
        "Validity": "idV2InpValidity",
        "Aufnr": "idV2InpOrderNo",
        // "VALIDITY_DAYS": "idV2InpValidDays",
        "Vtweg": "idV2SLDistChannel",
        "Vkbur": "idV2InpSalesOffice",
        "Spart": "idV2SLVertical",
        "Isexdep": "idV2RBExFactory"
    };

    return {

        // Header, General Information(Simple form)- Validation
        headerPayloadValidation: function (oControl) {

            var oResourceModel = oControl.getView().getModel("i18nV2").getResourceBundle();
          
            if (!oControl.getView().getModel("JSONModelPayload").getData().Kunnr) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.custCode"));
                this.headerPayloadState(oControl, "Kunnr");
                return 0;
            }
            //else if(!oControl.getView().getModel("JSONModelPayload").getData().TI){
            //     MessageBox.error(" ");
            // }else if(!oControl.getView().getModel("JSONModelPayload").getData().GST){
            //     MessageBox.error(" ");
            // }else
            //  if(!oControl.getView().getModel("JSONModelPayload").getData().NAME){
            //     MessageBox.error("Please enter Customer Name");
            // }else
            //  if(!oControl.getView().getModel("JSONModelPayload").getData().ACTION){
            //     MessageBox.error(" ");
            // }
            else if (!oControl.getView().getModel("JSONModelPayload").getData().Zterm) {
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.payTerm"));
                this.headerPayloadState(oControl, "Zterm");
                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().Validity) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.validity"));
                this.headerPayloadState(oControl, "Validity");
                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().Aufnr) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.ordNo"));
                this.headerPayloadState(oControl, "Aufnr");
                return 0;
            }
            // else if (!oControl.getView().getModel("JSONModelPayload").getData().VALIDITY_DAYS) {
            //     MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.validDays"));
            //     this.headerPayloadState(oControl, "VALIDITY_DAYS");
            //     return 0;
            // }
            else if (!oControl.getView().getModel("JSONModelPayload").getData().Vtweg) {
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.distChnl"));
                this.headerPayloadState(oControl, "Vtweg");

                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().Vkbur) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.salOffice"));
                this.headerPayloadState(oControl, "Vkbur");
                return 0;
            }
            else if (!oControl.getView().getModel("JSONModelPayload").getData().Spart) {
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.vertical"));
                this.headerPayloadState(oControl, "Spart");
                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().Isexdep) {
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.ex"));
                this.headerPayloadState(oControl, "Isexdep");
                return 0;
            }
            else {

                return 1;
            }

        },
        headerPayloadState: function (oControl, sOdataProperty) {
            debugger;
            for (const key in oHeadeFieldsNIds) {
                if (oHeadeFieldsNIds.hasOwnProperty.call(oHeadeFieldsNIds, key)) {
                    const element = oHeadeFieldsNIds[key];
                    if (key !== sOdataProperty) {
                        oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", oHeadeFieldsNIds[key])).setValueState("None");
                    } else {
                        oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", oHeadeFieldsNIds[key])).setValueState("Error");
                    }

                }
            }
        },
        // Items, Additional Product Details(Table) - Validation
        itemsPayloadValidation: function (aData, oControl, sAction) {

            var vColumnNo = 0;
            var oTable = oControl.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts"))

            for (var j = 0; j < oTable.getAggregation("items").length; j++) {
                for (let k = 0; k < oTable.getAggregation("items")[0].getAggregation("cells").length; k++) {

                    if (k === 16 || k === 17) {
                        if (oTable.getAggregation("items")[j].getAggregation("cells")[k].getSelectedKey() === '') {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("Error")
                        }else {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("None")
                        }

                    } else if (k === 20) {

                    }
                    else {
                        if (oTable.getAggregation("items")[j].getAggregation("cells")[k].getValue() === '') {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("Error")
                        } else {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("None")
                        }
                    }

                }
            }

            for (var i = 0; i < aData.length; i++) {

                var vLine = i + 1;

                if (aData[i].Mfrgr === '') { this.itemsErrorMessage('Mfrgr', vLine, sAction); }
                else if (aData[i].Szmm === '') {
                     
                    this.itemsErrorMessage('Szmm', vLine, sAction); }
                else if (aData[i].Mvgr2 === '') { 
                    
                    this.itemsErrorMessage('Mvgr2', vLine, sAction); }
                else if (aData[i].Werks === '') { this.itemsErrorMessage('Werks', vLine, sAction); }
                else if (aData[i].Prodh1 === '') { this.itemsErrorMessage('Prodh1', vLine, sAction); }
                else if (aData[i].CurrentVol === '') { this.itemsErrorMessage('CurrentVol', vLine, sAction); }
                else if (aData[i].TotalVol === '') { this.itemsErrorMessage('TotalVol', vLine, sAction); }
                else if (aData[i].Exfac === '') { this.itemsErrorMessage('Exfac', vLine, sAction); }
                else if (aData[i].Disc === '') { this.itemsErrorMessage('Disc', vLine, sAction); }
                else if (aData[i].Schemedisc === '') { this.itemsErrorMessage('Schemedisc', vLine, sAction); }
                else if (aData[i].SchemediscPer === '') { this.itemsErrorMessage('SchemediscPer', vLine, sAction); }
                else if (aData[i].Commbox === '') { this.itemsErrorMessage('Commbox', vLine, sAction); }
                else if (aData[i].Commboxp === '') { this.itemsErrorMessage('Commboxp', vLine, sAction); }
                else if (aData[i].Frgtbx === '') { this.itemsErrorMessage('Frgtbx', vLine, sAction); }
                else if (aData[i].Compname === '') { this.itemsErrorMessage('Compname', vLine, sAction); }
                else if (aData[i].Complanprice === '') { this.itemsErrorMessage('Complanprice', vLine, sAction); }
                else if (aData[i].Zzprodh4 === '') { this.itemsErrorMessage('Zzprodh4', vLine, sAction); }
                else if (aData[i].Mvgr5 === '') { this.itemsErrorMessage('Mvgr5', vLine, sAction); }
                else if (aData[i].LandedPrice === '') { this.itemsErrorMessage('LandedPrice', vLine, sAction); }
                else if (aData[i].Nef === '') { this.itemsErrorMessage('Nef', vLine, sAction); }
                else { return 1; }
            }


        },
        itemsErrorMessage: function (vColumnKey, vLine, sAction) {
            
            MessageBox.error('Please enter "' + oItemFieldsNColumnHeaders[vColumnKey] + '" at line number:' + vLine + ' ,before ' + sAction + '');
            return 0;
        },


    }
});