sap.ui.define(['sap/m/MessageBox'], function (MessageBox) {
    "use strict";
    return {

        itemsPayloadValidation: function (aData, oControl, sAction) {

            for (var i = 0; i < aData.length; i++) {

                var vLine = i + 1;
                var oRow = oControl.getView().byId("idTblProducts").getAggregation("items")[i];
                if (aData[i].MFRGR === '') {

                    oRow.getAggregation("cells")[0].getAggregation("items")[0].setValueState("Error");
                    MessageBox.error('Please enter Material Freight Groups at line number:' + vLine + ' ,before ' + sAction + '');
                    return 0;

                } else if (aData[i].CURRENTV === '') {

                    MessageBox.error('Please enter all the values before ' + sAction + '')
                    oRow.getAggregation("cells")[0].getAggregation("items")[0].setValueState("None");
                    return 0;
                }
                else if (aData[i].CURVOLFT === '') {

                    MessageBox.error('Please enter all the values before ' + sAction + ''); return 0;
                }
                else if (aData[i].KUNNR === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].LANDEDP === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].NEF === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].SZCM === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].WERKS === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ZZPRODH4 === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].PRODH1 === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].VKBUR === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].PAFVFRM === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].PAFVTO === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ERNAM === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ERDAT === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ERZET === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].LOEKZ === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ZDISP === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ISEXDEP === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ISMEGAL === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].ZTERM === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].VSART === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].MVGR2 === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].MVGR5 === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].COVERAGE === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].BOXES === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].NOSQ === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].EXFAC === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].EXDEP === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].MRP === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].DISC === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].DISCB === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].GST === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].FRGTBX === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].TI === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].GSTI === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].LDDBOX === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].LDDSFT === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].AGENT === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].COMPTRSFT === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].DLCOMSFT === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].NETEXB === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].NETEXSQ === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].COMMBO === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].SBPRICE === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; }
                else if (aData[i].SPART === '') { MessageBox.error('Please enter all the values before ' + sAction + ''); return 0; } else {
                    return 1;
                }
            }


        },
        headerPayloadValidation: function (oControl) {

            var headerValidation = 1;
            if (!oControl.getView().getModel("JSONModelPayload").getData().KUNNR) {
                MessageBox.error("Please enter Customer Code");
                oControl.getView().byId("idV2InpCustCode").setValueState("Error");
                headerValidation = 0;
            }
            // else if(!oControl.getView().getModel("JSONModelPayload").getData().TI){
            //     MessageBox.error(" ");
            // }else if(!oControl.getView().getModel("JSONModelPayload").getData().GST){
            //     MessageBox.error(" ");
            // }
            // else if(!oControl.getView().getModel("JSONModelPayload").getData().NAME){
            //     MessageBox.error("Please enter Customer Name");
            // }
            // else if(!oControl.getView().getModel("JSONModelPayload").getData().ACTION){
            //     MessageBox.error(" ");
            // }
            else if (!oControl.getView().getModel("JSONModelPayload").getData().ZTERM) {
                MessageBox.error("Please select Payment Term");
                oControl.getView().byId("idV2SLPaymentTerm").setValueState("Error");
                oControl.getView().byId("idV2InpCustCode").setValueState("None");
                headerValidation = 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VALIDITY) {
                MessageBox.error("Please enter Validity");
                oControl.getView().byId("idV2InpValidity").setValueState("Error");
                oControl.getView().byId("idV2SLPaymentTerm").setValueState("None");
                headerValidation = 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().AUFNR) {
                MessageBox.error("Please enter Order No");
                oControl.getView().byId("idV2InpOrderNo").setValueState("Error");
                oControl.getView().byId("idV2InpValidity").setValueState("None");
                headerValidation = 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VTWEG) {
                MessageBox.error("Please select Distribution Channel");
                oControl.getView().byId("idV2SLDistChannel").setValueState("Error");
                oControl.getView().byId("idV2InpOrderNo").setValueState("None");
                headerValidation = 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VKBUR) {
                MessageBox.error("Please enter Sales Office");
                oControl.getView().byId("idV2InpSalesOffice").setValueState("Error");
                oControl.getView().byId("idV2SLDistChannel").setValueState("None");
                headerValidation = 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().SPART) {
                MessageBox.error("Please select Vertical");
                oControl.getView().byId("idV2SLVertical").setValueState("Error");
                oControl.getView().byId("idV2InpSalesOffice").setValueState("None");
                headerValidation = 0;
            } else {
                oControl.getView().byId("idV2InpCustCode").setValueState("None");
                oControl.getView().byId("idV2SLPaymentTerm").setValueState("None");
                oControl.getView().byId("idV2InpValidity").setValueState("None");
                oControl.getView().byId("idV2InpOrderNo").setValueState("None");
                oControl.getView().byId("idV2SLDistChannel").setValueState("None");
                oControl.getView().byId("idV2InpSalesOffice").setValueState("None");
                oControl.getView().byId("idV2SLVertical").setValueState("None");
                headerValidation = 1;
            }

            return headerValidation;

        },

    }
});