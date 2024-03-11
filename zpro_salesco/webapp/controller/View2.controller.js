sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/IconPool',
    'sap/ui/core/Icon',
    'sap/m/Link',
    'sap/m/MessageItem',
    'sap/m/MessageView',
    'sap/m/Button',
    'sap/m/Bar',
    'sap/m/Title',
    'sap/m/Popover',
    'sap/m/MessageBox',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/valueHelps',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/validation'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, IconPool, Icon, Link, MessageItem, MessageView, Button, Bar, Title, Popover, MessageBox, valueHelps, validation) {
        "use strict";

        return Controller.extend("zpj.pro.sk.sd.salescoordinator.zprosalesco.controller.View2", {

            onInit: function () {

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);




                //Start: Santosh changes
                // local JSON models
                this._fileDetail;
                this.Pafno;
                this._allAttachment = [];
                this._attachmentPayload;
                var dataModelValueHelp = this.getOwnerComponent().getModel("valueHelp").getData();
                this.getView().setModel(new JSONModel(dataModelValueHelp), "LocalJSONModels");
                this.bindingContextPath;

                //Start: Attachment
                var dataModelForAttachments = this.getOwnerComponent().getModel("attachments").getData();
                this.getView().setModel(new JSONModel(dataModelForAttachments), "LocalJSONModelForAttachment");
                var oUploadSet = this.byId(sap.ui.core.Fragment.createId("idV2FragAttach", "idV2UploadSet"))
                // this.getView().byId("idV2UploadSet");



                // Modify "add file" button
                oUploadSet.getDefaultFileUploader().setButtonOnly(false);
                oUploadSet.getDefaultFileUploader().setTooltip("");
                oUploadSet.getDefaultFileUploader().setIconOnly(true);
                oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
                // oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));
                //End: Attachment
                // End: Santosh Changes

            },

            onRouteMatched: function (oEvent) {
                var oGlobalModel = {
                    "Editable": false
                }
                var oModelGlobalModel = new JSONModel(oGlobalModel);
                this.getView().setModel(oModelGlobalModel, "GlobalModel");

                var sID = oEvent.getParameter("arguments").ID;

                if (sID === "null" || sID === undefined) {

                    this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                    this.getView().byId("idV2OPSubAttach").setVisible(true);
                    //Start: Santosh changes
                    // payload for OData service

                    var dataModelPayload = this.getOwnerComponent().getModel("payload").getData();
                    dataModelPayload.header.ET_SALES_COORD_ISET.results = [];
                    dataModelPayload.header.ET_SALES_COORD_ISET.results.push(dataModelPayload.item);
                    this.getView().setModel(new JSONModel(dataModelPayload.header), "JSONModelPayload");
                    //End: Santosh changes
                    this.getView().byId("ObjectPageLayout").getHeaderTitle().setObjectTitle("Generate New Request");
                } else {
                    this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                    var aFilter = [];
                    var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Pafno", sap.ui.model.FilterOperator.EQ, sID)], false);
                    aFilter.push(oFilter);
                    var sPath = "/ET_SALES_COORD_HEADERSet('" + sID + "')";
                    this.getView().byId("ObjectPageLayout").getHeaderTitle().setObjectTitle("Display Request Details:" + sID.replace(/^0+/, ''));

                    var that = this;
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        // filters: aFilter,
                        urlParameters: {
                            "$expand": "ET_SALES_COORD_ISET"
                        },
                        success: function (Data) {

                            that.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValue(Data.Validity.replace(/^0+/, ''));
                            if (Data.Status === 'P' || Data.Status === 'D') {
                                that.getView().byId("idV2BtnEdit").setVisible(true);
                            } else {
                                that.getView().byId("idV2BtnEdit").setVisible(false);
                            }


                            that.getView().setModel(new JSONModel(Data), "JSONModelPayload");

                            //Start: logic working 
                            // var dataForTable = {
                            //     "ET_SALES_COORD_ISET": {
                            //         "results": Data.ET_SALES_COORD_ISET.results
                            //     }
                            // }
                            // that.getView().setModel(new JSONModel(Data), "JSONModelPayload");
                            // that.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts")).setModel(new JSONModel(dataForTable),"JSONModelPayload");
                            // that.getView().getModel("JSONModelPayload").refresh(true);
                            that.getView().setBusy(false);
                            //End: logic working 

                            // delete Data.results[0]['__metadata'];
                            // delete Data.results[0]['Pafvfrm'];
                            // delete Data.results[0]['Pafvto'];
                            // for (var i = 0; i < Data.results[0].ET_SALES_COORD_ISET.results.length; i++) {
                            //     delete Data.results[0].ET_SALES_COORD_ISET.results[i]['__metadata'];
                            //     delete Data.results[0].ET_SALES_COORD_ISET.results[i]['Erdat'];
                            //     delete Data.results[0].ET_SALES_COORD_ISET.results[i]['Erzet'];
                            // }

                            // delete Data.results[0]['ET_SALES_COORD_ISET'];



                            // that.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts")).setModel(new JSONModel(Data.results[0].ET_SALES_COORD_ISET.results),"JSONModelPayload")
                            // that.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts")).getModel("JSONModelPayload").setData(Data.results[0].ET_SALES_COORD_ISET.results);
                            // that.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts")).getModel("JSONModelPayload").refresh(true);




                        },
                        error: function (oError) {

                            that.getView().setBusy(false);
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                    // navigator.toExternal({
                                    //     target: {
                                    //         semanticObject: "#"
                                    //     }
                                    // });

                                    // window.location.reload()
                                }
                            });

                        }
                    });
                    var sPathUpload = "/ETFILE_UPLOAD_HSet('" + sID + "')";
                    that.getView().getModel("ZFILE_UPLOAD_SRV_01").read(sPathUpload, {
                        urlParameters: {
                            "$expand": "Nav_File_Upload"
                        },
                        async: false,
                        success: function (Data) {
                            // that.byId(sap.ui.core.Fragment.createId("idV2FragAttach", "idV2UploadSet")).getModel("LocalJSONModelForAttachment").setData(Data);
                            that.getView().byId("idV2OPSAttach").setVisible(true);
                            var attachments = Data;
                            that.getView().getModel("LocalJSONModelForAttachment").setData({ "attachments": attachments });
                            that.getView().getModel("LocalJSONModelForAttachment").refresh(true);
                            debugger;
                            // that.byId(sap.ui.core.Fragment.createId("idV2FragAttach", "idV2UploadSet")).getModel("LocalJSONModelForAttachment")
                        },
                        error: function (oError) {

                        }
                    });
                    // this.getView().getModel("oCusModel").setProperty("/Editable", false);


                }
            },





            // if(ID === orderNo)

            onEdit: function () {
                this.getView().getModel("GlobalModel").setProperty("/Editable", true);
            },

            onCancel: function () {

                var that = this;
                // this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                MessageBox.confirm("Are you sure you want to cancel?", {
                    actions: ["Yes", "No"],
                    onClose: function (oAction) {
                        if (oAction === "Yes") {
                            // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                            // navigator.toExternal({
                            //     target: {
                            //         semanticObject: "#"
                            //     }
                            // });
                            var oRouter = that.getOwnerComponent().getRouter();
                            oRouter.navTo("page1", {});
                        } else {

                        }
                    }
                });
            },

            onBack: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1", {});
            },



            handleMessages: function (oEvent) {
                this.oMessageView.navigateBack();
                this._oPopover.openBy(oEvent.getSource());
            },

            //Start: Santosh Changes

            _getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18nV2").getResourceBundle();
            },

            onNumberValidation: function (oEvent) {
                var value = Number(oEvent.getSource().getValue());
                if (isNaN(value)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue("");
                }
                // else if (value > 99) {
                //     MessageBox.error("Please enter value less than 100");
                //     oEvent.getSource().setValue("");
                // }

            },
            onOrcEntityChange: function (oEvent) {

                // var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
                // this.getView().getModel("JSONModelPayload").getContext(sPath).getObject();
                oEvent.getSource().getParent().getParent().getAggregation("cells")[12].getAggregation("items")[0].setValue("");
                oEvent.getSource().getParent().getParent().getAggregation("cells")[12].getAggregation("items")[0].setEditable(false);
            },
            onOrcPercentageChange: function (oEvent) {

                // var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
                // this.getView().getModel("JSONModelPayload").getContext(sPath).getObject();
                oEvent.getSource().getParent().getParent().getAggregation("cells")[11].getAggregation("items")[0].setValue("");
                oEvent.getSource().getParent().getParent().getAggregation("cells")[11].getAggregation("items")[0].setEditable(false);
            },
            onAddRow: function () {

                var headerValidationStatus = validation.headerPayloadValidation(this);
                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Adding new line");
                    if (itemValidationStatus === 1) {
                        var JSONData = this.getView().getModel("JSONModelPayload").getData();

                        // JSONData.items.push(this.oLocalJSONPayload.item);
                        JSONData.ET_SALES_COORD_ISET.results.push({
                            "Mfrgr": "",
                            "Szmm": "",
                            "Mvgr2": "",
                            "Werks": "",
                            "Prodh1": "",
                            "CurrentVol": "",
                            "TotalVol": "",
                            "Disc": "",
                            "Schemedisc": "",
                            "Commbox": "",
                            "Exfacsqft": null,
                            "Exdepsqft": null,
                            "Commboxp": "",
                            "Frgtbx": "",
                            "Compname": "",
                            "Complanprice": "",
                            "Zzprodh4": "",
                            "Mvgr5": ""
                        });
                        this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));
                    }
                }
                // this.getView().getModel("JSONModelPayload").refresh(true);


                // var oTable = this.getView().byId("idTblProducts");
                // var cell = oTable.getAggregation("items")[0].getAggregation("cells");


                // 
                // var oItem = new sap.m.ColumnListItem({
                //     cells:  cell 
                // });

                // oTable.addItem(oItem);

            },
            onDelete: function (oEvent) {

                // var oTable = oEvent.getSource().getParent().getParent();
                // oTable.removeItem(oEvent.getSource().getParent());
                var index = Number(oEvent.getSource().getId().split("-")[8]);
                var JSONData = this.getView().getModel("JSONModelPayload").getData();
                if (JSONData.items) {
                    if (JSONData.items.length > 1) {
                        JSONData.items.splice(index, 1);
                    } else {
                        MessageBox.error("Atlease one entry is required");
                    }

                } else {
                    if (JSONData.ET_SALES_COORD_ISET.results.length > 1) {
                        JSONData.ET_SALES_COORD_ISET.results.splice(index, 1);
                    } else {
                        MessageBox.error("Atlease one entry is required");
                    }
                }
                this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));

                // this.getView().getModel("oRequestModel").getData().splice(index, 1);;
                // this.getView().getModel("oRequestModel").refresh(true);
            },
            // Customer Code Plant
            onCustomerCodeHelp: function () {
                valueHelps.onCustomerCodeHelp(this);
            },
            // Sales Office
            onSalesOfficeHelp: function () {
                valueHelps.onSalesOfficeHelp(this);
            },
            // Material Freight Group
            onMaterialFreightGroupsHelp: function (oEvent) {
                var Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart");
                if (Division) {
                    this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
                    valueHelps.onMaterialFreightGroupsHelp(this, Division);
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None")
                } else {
                    MessageBox.error("Please select vertical first");
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("Error")
                }
            },
            // Sizes
            onSizesHelp: function (oEvent) {
                valueHelps.onSizesHelp(this);
            },
            // Designs 
            onDesignsHelp: function (oEvent) {

                var sPath = oEvent.getSource().getParent().getBindingContextPath();
                var Mfrgr = this.getView().getModel("JSONModelPayload").getContext(sPath).getProperty("Mfrgr");
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Mvgr2";
                if (Mfrgr) {
                    valueHelps.onDesignsHelp(this, Mfrgr);
                } else {
                    MessageBox.error("Please select 'Material Freight Group' first");
                }
            },
            // Supply Plant
            onSupplyPlantHelp: function (oEvent) {
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Werks";
                valueHelps.onSupplyPlantHelp(this);
            },
            // Manufacturing Amount
            onManufacturingAmtHelp: function (oEvent) {
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Prodh1";
                valueHelps.onManufacturingAmtHelp(this);
            },

            onValueHelpSearch: function (evt) {
                var aFilter = [];
                var oFilter;

                var sValue = evt.getParameter("value");
                var sPath = "/ET_VALUE_HELPSSet";
                var oSelectDialog = sap.ui.getCore().byId(evt.getParameter('id'));

                if (evt.getParameter('id') === 'idSDCustomerCodeF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "KNA1")], false);
                } else if (evt.getParameter('id') === 'idSDSalesOfficeF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
                }
                else if (evt.getParameter('id') === 'idSDMaterialFreightGroupsF4') {
                    debugger;
                    var Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart");
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
                    var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false);
                    aFilter.push(oFilterDomname2);
                }
                else if (evt.getParameter('id') === 'idSDDesignsF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false);
                } else if (evt.getParameter('id') === 'idSDSupplyingPlantF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T001W")], false);
                } else if (evt.getParameter('id') === 'idSDManufacturingAmountF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T001W")], false);
                }


                var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sValue)], false);
                aFilter.push(oFilterDomname1);
                aFilter.push(oFilterDomname);
                valueHelps.onCustomerCodeHelpSearch(oSelectDialog, aFilter, sPath, this);
            },

            onValueHelpConfirm: function (evt) {

                var oSelectedItem = evt.getParameter("selectedItem");
                valueHelps.valueHelpConfirm(oSelectedItem, this, this.bindingContextPath);
            },

            onMaterialFreightGroupsHelpConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                debugger;
                var aModelData = this.getView().getModel("JSONModelPayload").getProperty("/ET_SALES_COORD_ISET/results");
                var bindingContextPathMFG = this.bindingContextPath + "/Mfrgr";
                var bindingContextPathSize = this.bindingContextPath + "/Szmm";
                for (var i = 0; i < aModelData.length; i++) {

                    var obj = aModelData[i];
                    for (var key in obj) {
                        var value = obj[key];
                        if (sSelectedValue === value) {
                            if(value){
                            MessageBox.error(sSelectedValue + " this 'Material Freigth Group' already selected");
                            this.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, "");
                            }
                        } else {


                            this.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, sSelectedValue);
                            var aFilter = [];
                            var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SIZE")], false);
                            var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, sSelectedValue)], false);
                            aFilter.push(oFilterDomname);
                            aFilter.push(oFilterDomname2);
                            var sPath = "/ET_VALUE_HELPSSet"
                            var that = this;
                            this.getView().setBusy(true);
                            this.getView().getModel().read(sPath, {
                                filters: aFilter,
                                // urlParameters: {
                                //     "$expand": ""
                                // },
                                success: function (Data) {
                                    that.getView().setBusy(false);
                                    that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, Data.results[0].Ddtext);
                                },
                                error: function (oError) {
                                    that.getView().setBusy(false);
                                    MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {
                                            // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                            // navigator.toExternal({
                                            //     target: {
                                            //         semanticObject: "#"
                                            //     }
                                            // });

                                            // window.location.reload()
                                        }
                                    });
                                }
                            });
                        }
                    }
                }




            },

            onDesignsHelpConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("JSONModelPayload").setProperty(this.bindingContextPath, sSelectedValue);
            },

            onSupplyPlantHelpConfirm(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("JSONModelPayload").setProperty(this.bindingContextPath, sSelectedValue);
            },
            onManufacturingAmtHelpConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("JSONModelPayload").setProperty(this.bindingContextPath, sSelectedValue);
            },



            onRadioButtonGroupSelect: function (oEvent) {
                // selectedIndex


                if (oEvent.getSource().getSelectedIndex() === 0) {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "F";
                } else {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "D";

                }
            },
            onSave: function () {


                var headerValidationStatus = validation.headerPayloadValidation(this);

                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Save");
                    if (itemValidationStatus === 1) {

                        this.getView().getModel("JSONModelPayload").getData().Action = "SAVE";

                        var sPath = "/ET_SALES_COORD_HEADERSet";
                        var that = this;
                        this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                            async: false,
                            success: function (oData) {



                                // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                // navigator.toExternal({
                                //     target: {
                                //         semanticObject: "#"
                                //     }
                                // });

                                // var payloadAttachment = that.getOwnerComponent().getModel("payload").getData().attachments;
                                // for (let index = 0; index < payloadAttachment.length; index++) {
                                //     payloadAttachment[index].Pafno = oData.Pafno;
                                // }


                                var aAttachmentsItems = that.getView().getModel("LocalJSONModelForAttachment").getData().attachments.Nav_File_Upload.results;
                                if (aAttachmentsItems.length > 0) {
                                    that.getView().getModel("LocalJSONModelForAttachment").getData().attachments.Pafno = oData.Pafno;
                                    for (var i = 0; i < aAttachmentsItems.length; i++) {
                                        aAttachmentsItems[i].Pafno = oData.Pafno
                                    }
                                    var _attachmentPayload = that.getView().getModel("LocalJSONModelForAttachment").getData().attachments

                                    var sPathUpload = "/ETFILE_UPLOAD_HSet"
                                    that.getView().getModel("ZFILE_UPLOAD_SRV_01").create(sPathUpload, _attachmentPayload, {
                                        async: false,
                                        success: function (Data) {
                                            MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno + "", {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function (oAction) {
                                                    window.location.reload();
                                                }
                                            });
                                        },
                                        error: function (oError) {
                                            MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function (oAction) {
                                                    // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                                    // navigator.toExternal({
                                                    //     target: {
                                                    //         semanticObject: "#"
                                                    //     }
                                                    // });

                                                    // window.location.reload()
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno + "", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {
                                            window.location.reload();
                                        }
                                    });
                                }

                            },
                            error: function (oError) {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                        // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                        // navigator.toExternal({
                                        //     target: {
                                        //         semanticObject: "#"
                                        //     }
                                        // });

                                        // window.location.reload()
                                    }
                                });
                            }
                        });
                    }
                }
                // this.getView().getModel("JSONModelForItems").getData();
            },
            onGenerate: function () {
                var headerValidationStatus = validation.headerPayloadValidation(this);

                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Generate");
                    if (itemValidationStatus === 1) {
                        this.getView().byId("idV2OPSAttach").setVisible(true);
                        this.getView().getModel("JSONModelPayload").getData().Action = "GENERATE";
                        var that = this;
                        var sPath = "/ET_SALES_COORD_HEADERSet";
                        this.getView().setBusy(true);
                        this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                            async: false,
                            success: function (oData) {


                                // that._getResourceBundle().aPropertyFiles[0].setProperty('view2.table.column.text.exFac', 'Ex Depot(SqFt)');

                                that.getView().getModel("JSONModelPayload").setData(oData)
                                that.getView().getModel("JSONModelPayload").refresh(true);
                                // that.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET = [];
                                // that.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET = oData.ET_SALES_COORD_ISET.results;



                                that.getView().getModel("GlobalModel").setProperty("/Editable", false);
                                that.getView().getModel("GlobalModel").refresh(true);

                                that.getView().byId("idV2Bar").setVisible(true);
                                that.getView().byId("idV2BtnSave").setVisible(true);


                                that.getView().setBusy(false);
                            },
                            error: function (oError) {
                                that.getView().setBusy(false);
                                that.getView().byId("idV2BtnSave").setVisible(false);
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                        // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                        // navigator.toExternal({
                                        //     target: {
                                        //         semanticObject: "#"
                                        //     }
                                        // });

                                        // window.location.reload()
                                    }
                                });
                            }
                        });

                        this._displaySummaryDetails();
                    }
                }

            },

            _displaySummaryDetails: function () {
                var vInvoiceDiscount = 0;
                var vSchemeDiscount = 0;
                var vFreightDiscount = 0;
                var vPayTermDiscount = this.getView().getModel("JSONModelPayload").getData().Zterm;
                var aItemsData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                for (let index = 0; index < aItemsData.length; index++) {
                    vInvoiceDiscount = vInvoiceDiscount + Number(aItemsData[index].Disc);
                    vSchemeDiscount = vSchemeDiscount + Number(aItemsData[index].Schemedisc);
                    vFreightDiscount = vFreightDiscount + Number(aItemsData[index].Frgtbx)
                }
                vInvoiceDiscount = vInvoiceDiscount / aItemsData.length;
                vSchemeDiscount = vSchemeDiscount / aItemsData.length;
                vFreightDiscount = vFreightDiscount / aItemsData.length;;
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpInvcDis")).setValue(vInvoiceDiscount.toString());
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpSchDis")).setValue(vSchemeDiscount.toString());
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpfraightCost")).setValue(vFreightDiscount.toString());
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpPayTermDis")).setValue(vPayTermDiscount.toString());
                // this.getView().byId("idV2InpInvcDis").setValue(vInvoiceDiscount.toString());
                // this.getView().byId("idV2InpSchDis").setValue(vSchemeDiscount.toString());
                // this.getView().byId("idV2InpfraightCost").setValue(vFreightDiscount.toString());
                // this.getView().byId("idV2InpPayTermDis").setValue(vPayTermDiscount.toString());
            },
            onBeforeUploadStarts: function (oEvent) {

                var that = this;
                this.fileName = oEvent.getParameters().item.getFileName()
                this.fileType = oEvent.getParameters().item.getMediaType()
                var file = oEvent.getParameters().item.getFileObject()

                var reader = new FileReader();
                reader.onload = function (e) {
                    var vContent = e.currentTarget.result

                    that.updateFile(that.fileName, that.fileType, vContent);
                }
                reader.readAsDataURL(file);
            },
            updateFile: function (fileName, fileType, vContent) {

                var decodedPdfContent
                var blob
                if (fileType === 'image/jpeg') {
                    decodedPdfContent = atob(vContent.split('data:image/jpeg;base64,')[1]);
                }

                else if (fileType === 'image/png') {
                    decodedPdfContent = atob(vContent.split('data:image/png;base64,')[1]);
                }
                else if (fileType === 'application/pdf') {
                    decodedPdfContent = atob(vContent.split('data:application/pdf;base64,')[1]);
                }


                var byteArray = new Uint8Array(decodedPdfContent.length)
                for (var i = 0; i < decodedPdfContent.length; i++) {
                    byteArray[i] = decodedPdfContent.charCodeAt(i);
                }
                if (fileType === 'image/jpeg') {
                    blob = new Blob([byteArray.buffer], {
                        type: 'image/jpeg'
                    });
                }

                else if (fileType === 'image/png') {
                    blob = new Blob([byteArray.buffer], {
                        type: 'image/png'
                    });
                }
                else if (fileType === 'application/pdf') {
                    blob = new Blob([byteArray.buffer], {
                        type: 'application/pdf'
                    });
                }

                var _url = URL.createObjectURL(blob);
                jQuery.sap.addUrlWhitelist("blob");

                // var lAttachment = URL.createObjectURL(new Blob([vContent] , {type:'text/plain'}));
                // this.byId(sap.ui.core.Fragment.createId("idV2FragAttach", "idV2USI")).setUrl(encodeURI(_url));
                this._fileDetail = {
                    Filename: fileName,
                    Attachment: vContent,
                    Pafno: ""
                }

                // this._allAttachment.push(this._fileDetail);

                this.getView().getModel("LocalJSONModelForAttachment").getData().attachments.Nav_File_Upload.results.push(this._fileDetail)

            },
            onViewAttachmentObjectStatusPress: function (oEvent) {
                debugger;
            }
            //End: Santosh Changes

        });
    });
