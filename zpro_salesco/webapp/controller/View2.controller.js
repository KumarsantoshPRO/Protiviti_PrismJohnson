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
                    //Start: Santosh changes
                    // payload for OData service

                    this.getView().getModel("GlobalModel").setProperty("/Editable", true);
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
                    var that = this;
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        // filters: aFilter,
                        urlParameters: {
                            "$expand": "ET_SALES_COORD_ISET"
                        },
                        success: function (Data) {

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
                        error: function (sError) {

                            that.getView().setBusy(false);

                        }
                    });

                    // this.getView().getModel("oCusModel").setProperty("/Editable", false);
                    this.getView().byId("ObjectPageLayout").getHeaderTitle().setObjectTitle("Display Request Details");

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
                } else if (value > 99) {
                    MessageBox.error("Please enter value less than 100");
                    oEvent.getSource().setValue("");
                }

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

                JSONData.items.splice(index, 1);
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
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
                valueHelps.onMaterialFreightGroupsHelp(this);
            },
            // Sizes
            onSizesHelp: function (oEvent) {
                valueHelps.onSizesHelp(this);
            },
            // Designs 
            onDesignsHelp: function (oEvent) {
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Mvgr2";
                valueHelps.onDesignsHelp(this);
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
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
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
                var bindingContextPathMFG = this.bindingContextPath + "/Mfrgr";
                var bindingContextPathSize = this.bindingContextPath + "/Szmm";
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
                    error: function (sError) {
                        that.getView().setBusy(false);
                    }
                });
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
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "";
                } else {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "X";

                }
                this.getView().getModel("JSONModelPayload").getData().refresh(true);
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
                                for(var i=0;i<that._allAttachment.length;i++){
                                    that._allAttachment[i].Pafno = oData.Pafno
                                }
                                that._attachmentPayload = {
                                    Pafno: oData.Pafno,
                                    Nav_File_Upload:that._allAttachment
                                };
                                debugger;
                                var sPathUpload = "/ETFILE_UPLOAD_HSet"
                                that.getView().getModel("ZFILE_UPLOAD_SRV").create(sPathUpload, that._attachmentPayload, {
                                    async: false,
                                    success: function (oData) {
                                        MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno + "", {
                                            actions: [sap.m.MessageBox.Action.OK],
                                            onClose: function (oAction) {
                                                window.location.reload();
                                            }
                                        });
                                    },
                                    error: function (sError) {
                                        MessageBox.error("Request creation failed", {
                                            actions: [sap.m.MessageBox.Action.OK],
                                            onClose: function (oAction) {
                                                // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                                // navigator.toExternal({
                                                //     target: {
                                                //         semanticObject: "#"
                                                //     }
                                                // });

                                                window.location.reload()
                                            }
                                        });
                                    }
                                });

                            },
                            error: function (sError) {
                                MessageBox.error("Request creation failed", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                        // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                        // navigator.toExternal({
                                        //     target: {
                                        //         semanticObject: "#"
                                        //     }
                                        // });

                                        window.location.reload()
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
                this.getView().byId("idV2OPSAttach").setVisible(true);
                this.getView().getModel("JSONModelPayload").getData().Action = "GENERATE";
                var that = this;
                var sPath = "/ET_SALES_COORD_HEADERSet";
                this.getView().setBusy(true);
                this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                    async: false,
                    success: function (oData) {

                        debugger;
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
                    error: function (sError) {
                        that.getView().setBusy(false);
                        that.getView().byId("idV2BtnSave").setVisible(false);
                    }
                });

                this._displaySummaryDetails();
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


                this._fileDetail = {
                    Filename: fileName,
                    Attachment: vContent,
                    Pafno: this.Pafno
                }
                this._allAttachment.push(this._fileDetail);


                



            }
            //End: Santosh Changes

        });
    });
