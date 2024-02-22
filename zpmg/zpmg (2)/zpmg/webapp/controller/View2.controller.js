sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Core",
    "sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/library",
	"sap/m/TextArea"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Core,Dialog,Button,Label,mobileLibrary,TextArea) {
        "use strict";
    	var ButtonType = mobileLibrary.ButtonType;
	    var DialogType = mobileLibrary.DialogType;

        return Controller.extend("pj.zpmg.controller.View2", {
            onInit: function () {
                this.getData();
            },
            getData: function() {

                var oGetDataModel = new JSONModel(
                    {
                        "customer": "Bharath Marble",
                        "vol":"23000",
                        "val":"9.2",
                        "grmpe":"17%",
                        "grmps":"17.1",
                        "reg":"NI-CHANDIGAR",
                        "vol1":"23000",
                        "val1":"8.7",
                        "grmpe1":"14%",
                        "grmps1":"7.2",
                        "custId":"TN0S0117",
                        "siz":"300X150",
                        "des":"TINTONDK",
                        "sour":"Coral",
                        "vol2":"20000",
                        "vali":"20",
                        "mfg":"WDGIDOL",
                        "dis":"10%",
                        "nefsf":"202.5",
                        "neff":"18.81",
                        "fsf":"no",
                        "sts":"pending",
                        "rem":"Long Term Dealer",
                        "grmg":"9%",
                        "bmgm":"24%",
                        "dis1":"25%",
                        "red":"20%",
                        "egmpsf":"15",
                        "tegps":"25",
                        "cegps":"20",
                        "effect":"-1",
                        "vgm":"15",
                        "recomnd":"Reject the Transaction",
                        "hrlp":"202.5",
                        "efp":"280",
                        "oiv":"70", "oiv2":"25%",
                        "sd":"-",
                        "sd2":"-",
                        "ptd":"10",
                        "ptd2":"4%",
                        "svc":"184",
                        "fc":"-",
                        "orc":"-",
                        "orc2":"-",
                        "snd":"25","snd2":"12.5%",
                        "comn":"-",
                        "comlp":"-",
                        "mfg":"WDGIDOL",
                        "nef":"202.5",
                        "gm":"8%",
                        "val2":"9.2",
                        "gm2":"9%"  
                    });
                    this.getView().setModel(oGetDataModel, "oRequestModel");
            },

            onBack: function() {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1",{});
            },
            
            onForward:function()
            {
                if (!this.oRejectDialog) {
                    this.oRejectDialog = new Dialog({
                        title: "Gross Margin is less than 15%",
                        type: DialogType.Message,

                        content: [
                            new Label({
                                text: "Request will be forwarded to the National Head",
                            }),
                            new TextArea({
                                width: "100%",
                                placeholder: "Type the reason for acceptance"
                            })
                        ],
                        beginButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oRejectDialog.close();
                                
                                
                                this.oRejectDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Submit",
                            press: function () {
                                var sText = Core.byId("rejectionNote").getValue();
                            }.bind(this)
                        })
                    });
                }
                this.oRejectDialog.open();
            }
        });
    });
