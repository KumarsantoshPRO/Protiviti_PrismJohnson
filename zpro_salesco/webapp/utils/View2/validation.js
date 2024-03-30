sap.ui.define(['sap/m/MessageBox'], function (MessageBox) {
    "use strict";
    var oItemFieldsNColumnHeaders = {
        "Mfrgr": "Material Freight Groups",
        "Szmm": "Sizes",
        "Mvgr2": "Designs",
        "Werks": "Supplying Plant",
        "Prodh1": "Manufacturing Plant",
        "CurVolFt": "Current Volume (Sqft)",
        "TotalVol": "Total Volume (Sqft)",
        "Exfac": "Ex Factory (SqFt)",
        "Disc": "On-Invoice discount",
        "Schemedisc": "Schemes discount per SqFt(If Applicable)",
        "SchemediscPer": "Schemes %",
        "Commbox": "ORC Entity",
        "Commboxp": "ORC %",
        "Frgtsqft": "Freight SqFt",
        "Compname": "Competitor Name",
        "Complanprice": "Competitor landed price",
        // "": "Competitor receipt",
        "Zzprodh4": "Quality",
        "Mvgr5": "Part A/B",
        "LandedPriceSqft": "Landed",
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
            // else if (!oControl.getView().getModel("JSONModelPayload").getData().Zterm) {
            //     MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.payTerm"));
            //     this.headerPayloadState(oControl, "Zterm");
            //     return 0;
            // } 
            else if (!oControl.getView().getModel("JSONModelPayload").getData().Validity) {
              
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.validity"));
                this.headerPayloadState(oControl, "Validity");
                return 0;
            }
            // else if (!oControl.getView().getModel("JSONModelPayload").getData().Aufnr) {
            //     MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.ordNo"));
            //     this.headerPayloadState(oControl, "Aufnr");
            //     return 0;
            // }
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
           
            for (const key in oHeadeFieldsNIds) {
                if (oHeadeFieldsNIds.hasOwnProperty.call(oHeadeFieldsNIds, key)) {
                    const element = oHeadeFieldsNIds[key];
                    if (key !== sOdataProperty) {
                        oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", oHeadeFieldsNIds[key])).setValueState("None");
                    } else {
                        oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", oHeadeFieldsNIds[key])).setValueState("Error");
                        oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", oHeadeFieldsNIds[key])).setValueStateText("Enter value");
                    }

                }
            }
        },
        // Items, Additional Product Details(Table) - Validation
        itemsPayloadValidation: function (aData, oControl, sAction) {
            
            var vColumnNo = 0;
            var oTable = oControl.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts"))
            var vTemp = 0;

            for (var j = 0; j < oTable.getAggregation("items").length; j++) {
                for (let k = 0; k < oTable.getAggregation("items")[j].getAggregation("cells").length; k++) {


                    if (k === 20 || k === 12 || k === 13 || k === 14 || k === 15 || k === 16) {
                        // Non mandatory items
                    } else if (k === 7 || k === 17) {
                        // Select
                        if (oTable.getAggregation("items")[j].getAggregation("cells")[k].getSelectedKey() === '') {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("Error")
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueStateText("Enter value");
                        } else {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("None")
                        }

                    }
                    else {
                        if (oTable.getAggregation("items")[j].getAggregation("cells")[k].getValue() === '') {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("Error")
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueStateText("Enter value");
                        } else {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("None")
                        }
                    }

                }
            }

            for (var i = 0; i < aData.length; i++) {

                var vLine = i + 1;

                if (aData[i].Mfrgr === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Mfrgr', vLine, sAction);
                }
                else if (aData[i].Szmm === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Szmm', vLine, sAction);
                }
                else if (aData[i].Mvgr2 === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Mvgr2', vLine, sAction);
                }
                else if (aData[i].Werks === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Werks', vLine, sAction);
                }
                else if (aData[i].Prodh1 === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Prodh1', vLine, sAction);
                }
                else if (aData[i].CurVolFt === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('CurVolFt', vLine, sAction);
                }
                else if (aData[i].TotalVol === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('TotalVol', vLine, sAction);
                }
                else if (aData[i].Exfac === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Exfac', vLine, sAction);
                }
                else if (aData[i].Disc === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Disc', vLine, sAction);
                }
                else if (aData[i].Schemedisc === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Schemedisc', vLine, sAction);
                }
                else if (aData[i].SchemediscPer === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('SchemediscPer', vLine, sAction);
                }

                // else if (aData[i].Frgtsqft === '') { this.itemsErrorMessage('Frgtsqft', vLine, sAction); }
                // else if (aData[i].Commbox === '') { this.itemsErrorMessage('Commbox', vLine, sAction); }
                // else if (aData[i].Commboxp === '') { this.itemsErrorMessage('Commboxp', vLine, sAction); }
                // else if (aData[i].Compname === '') { this.itemsErrorMessage('Compname', vLine, sAction); }
                // else if (aData[i].Complanprice === '') { this.itemsErrorMessage('Complanprice', vLine, sAction); }

                else if (aData[i].Zzprodh4 === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Zzprodh4', vLine, sAction);
                }
                else if (aData[i].Mvgr5 === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Mvgr5', vLine, sAction);
                }
                else if (aData[i].LandedPriceSqft === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('LandedPriceSqft', vLine, sAction);
                }
                else if (aData[i].Nef === '') {
                    vTemp = 0;
                    this.itemsErrorMessage('Nef', vLine, sAction);
                }
                else {
                    vTemp = 1;
                }
            }
            if (vTemp === 1) {
                return 1;
            }


        },
        itemsErrorMessage: function (vColumnKey, vLine, sAction) {

            MessageBox.error('Please enter "' + oItemFieldsNColumnHeaders[vColumnKey] + '" at line number:' + vLine + ' ,before ' + sAction + '');
            return 0;
        },


    }
});