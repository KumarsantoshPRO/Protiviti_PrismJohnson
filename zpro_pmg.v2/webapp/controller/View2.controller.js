sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Core",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/library",
    "sap/m/TextArea",
    "pj/zpmg/model/formatter",
    "sap/m/MessageBox",
    "sap/m/PDFViewer",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, Core, Dialog, Button, Label, mobileLibrary, TextArea, formatter, MessageBox, PDFViewer, Fragment, MessageToast) {
    "use strict";
    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;

    return Controller.extend("pj.zpmg.controller.View2", {
      formatter: formatter,
      onInit: function () {
        var oProductModel = new JSONModel();
        this.getView().setModel(oProductModel, "ProductModel");

        var oSouceModel = new JSONModel();
        this.getView().setModel(oSouceModel, "SouceModel");

        this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
        // this.getData();
        this.pafNoTemp;
        this._Posnr;
        this._rowIndex;

        //Start: Upload, View and Download Attachment
        var dataModelForAttachments = this.getOwnerComponent().getModel("attachments").getData();
        this.getView().setModel(new JSONModel(dataModelForAttachments), "LocalJSONModelForAttachment");

        this.opdfViewer = new PDFViewer();
        this.getView().addDependent(this.opdfViewer);
        //End: Upload, View and Download Attachment
      },

      // Attach route matched method
      onRouteMatched: function (oEvent) {
        this.getView().byId("idV2OPSAttach").setVisible(false);
        var pafID = oEvent.getParameter("arguments").pafID;
        if (pafID !== "Page1" || pafID !== undefined) {
          if (pafID) {
            // this.getView().byId("idObjectHeader").setObjectTitle("PAF NO : " + pafID.replace(/^0+/, ''));
            this.getView()
              .byId("idPage")
              .setTitle("Details of PAF No: " + pafID.replace(/^0+/, ""));
            this.getRequestDetails(pafID);
            this.pafID = pafID;
            // Attachments
            var sPathUpload = "/ETFILE_UPLOAD_HSet('" + pafID + "')";
            this.getView().setBusy(true);
            this.getView()
              .getModel("ZFILE_UPLOAD_SRV_01")
              .read(sPathUpload, {
                urlParameters: {
                  $expand: "Nav_File_Upload",
                },
                async: false,
                success: function (Data) {
                  this.getView().setBusy(false);
                  if (Data.Nav_File_Upload.results.length > 0) {
                    this.getView().byId("idV2OPSAttach").setVisible(true);
                    var attachments = Data;
                    this.getView().getModel("LocalJSONModelForAttachment").setData({ attachments: attachments });
                    this.getView().getModel("LocalJSONModelForAttachment").refresh(true);
                  }
                }.bind(this),
                error: function (oError) {
                  this.getView().setBusy(false);
                  MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {},
                  });
                }.bind(this),
              });
          }
        }
      },

      getRequestDetails: function (pafID) {
        this.getView().setBusy(true);
        var sPath = "/ET_PMG_REQUEST_ITEMSet('" + pafID + "')";

        this.getOwnerComponent()
          .getModel()
          .read(sPath, {
            urlParameters: {
              $expand: "NAV_PMG_ITEM_PRODUCT",
            },
            success: function (oData) {
              var oModel = new JSONModel();
              // Grossmargper
              // oData.NAV_PMG_ITEM_PRODUCT.results
              var len = oData.NAV_PMG_ITEM_PRODUCT.results.length;
              // oData.Wgmper = 0;
              // oData.Wbuyingprice = 0;
              for (let index = 0; index < len; index++) {
                var nGrossMargin = Number(oData.NAV_PMG_ITEM_PRODUCT.results[index].Grossmargper);
                var nBuyingpricesqft = Number(oData.NAV_PMG_ITEM_PRODUCT.results[index].Buyingpricesqft);
                // oData.Wgmper = Number(oData.Wgmper) + nGrossMargin;
                // oData.Wbuyingprice = Number(oData.Wbuyingprice) + nBuyingpricesqft;
              }
              // oData.Wgmper = (oData.Wgmper / len).toFixed(2);
              // oData.Wbuyingprice = (oData.Wbuyingprice / len).toFixed(2);

              oData.Discb = ((oData.Wexfacsqft / 100) * oData.Disc).toFixed(2);
              if (oData.Worcper !== "0.00") {
                oData.Worc = ((oData.Wexfacsqft / 100) * oData.Worcper).toFixed(2);
              }
              // oData.Discb = oData.Discb;
              oModel.setData(oData);
              this.getView().setModel(oModel, "oRequestModel");

              var oPrdModel = this.getView().getModel("ProductModel");

              oPrdModel.setData(oData.NAV_PMG_ITEM_PRODUCT.results);
              if (oData.Vtweg === "19") {
                this.getView().byId("id.discount.column.Label").setText("Discount(%)");
              } else {
                this.getView().byId("id.discount.column.Label").setText("Discount(Box)");
              }

              this.getView().setModel(oPrdModel, "ProductModel");
              this.getView().setBusy(false);
            }.bind(this),
            error: function (oError) {
              this.getView().setBusy(false);
              MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (oAction) {},
              });
            }.bind(this),
          });
      },

      getSourceDetails: function (pafNo) {
        this.getView().setBusy(true);
        var newFilArray = new Array();
        var oDomfilter1 = new sap.ui.model.Filter({
          path: "Domname",
          operator: "EQ",
          value1: "SOURCE", //pafID
        });
        newFilArray.push(oDomfilter1);

        var oDomfilter2 = new sap.ui.model.Filter({
          path: "Domname1",
          operator: "EQ",
          value1: "", //pafID
        });
        newFilArray.push(oDomfilter2);

        var oDomfilter3 = new sap.ui.model.Filter({
          path: "Domname2",
          operator: "EQ",
          value1: pafNo, //pafID
        });
        newFilArray.push(oDomfilter3);

        //var oNewModel = ZCUSTOMER_AUTOMATIONDISCOUNT_SRV
        var newValHelpModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSTOMER_AUTOMATIONDISCOUNT_SRV/", true);
        newValHelpModel.read("/ET_VALUE_HELPSSet", {
          filters: newFilArray,
          success: function (oData) {
            var oModel = this.getView().getModel("SouceModel");
            oModel.setData(oData.results);
            this.getView().setModel(oModel, "SouceModel");

            this.getView().setBusy(false);
          }.bind(this),
          error: function (oError) {
            this.getView().setBusy(false);
            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
              actions: [sap.m.MessageBox.Action.OK],
              onClose: function (oAction) {},
            });
          }.bind(this),
        });
      },

      onSourceHelp: function (oEvent) {
        this.deActivateActionButtons();
        var pathIndex = Number(oEvent.getSource().getParent().getBindingContextPath().split("/")[1]);
        this._rowIndex = pathIndex;

        var path = oEvent.getSource().getParent().getBindingContextPath() + "/Posnr";

        this._Posnr = this.getView().getModel("ProductModel").getProperty(path);

        if (!this._sourceFrag) {
          this._sourceFrag = sap.ui.xmlfragment("pj.zpmg.view.fragments.source", this);
          this.getView().addDependent(this._sourceFrag);
          this._CustomerCodeTemp = sap.ui.getCore().byId("idSLSourceValueHelp").clone();
          this._oTemp = sap.ui.getCore().byId("idSLSourceValueHelp").clone();
        }
        var aFilter = [],
          oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SOURCE")], false),
          oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false),
          oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, this.pafID)], false),
          oFilterDomname3 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname3", sap.ui.model.FilterOperator.EQ, this._Posnr)], false);
        aFilter.push(oFilterDomname);
        aFilter.push(oFilterDomname1);
        aFilter.push(oFilterDomname2);
        aFilter.push(oFilterDomname3);
        // sap.ui.getCore().byId("idSDSourceF4").setModel("ZCUSTOMER_AUTOMATIONDISCOUNT_SRV");
        sap.ui.getCore().byId("idSDSourceF4").bindAggregation("items", {
          path: "ZCUSTOMER_AUTOMATIONDISCOUNT_SRV>/ET_VALUE_HELPSSet",
          filters: aFilter,
          template: this._CustomerCodeTemp,
        });

        this._sourceFrag.open();
      },
      onSourceValueHelpConfirm: function (oEvent) {
        this.deActivateActionButtons();
        var oSelectedItem = oEvent.getParameter("selectedItem"),
          sSelectedName = oSelectedItem.getProperty("description"),
          sSelectedValue = oSelectedItem.getProperty("title");

        var payload = {
          Pafno: this.pafID,
          Posnr: this._Posnr,
          Action: "VENDOR",
          NAV_PMG_ITEM_PRODUCT: [
            {
              Pafno: this.pafID,
              Posnr: this._Posnr,
              Source: sSelectedValue,
              Sname: sSelectedName,
            },
          ],
        };

        this.getOwnerComponent()
          .getModel()
          .create("/ET_PMG_REQUEST_ITEMSet", payload, {
            success: function (oData, response) {
              var vSVC_BP = oData.NAV_PMG_ITEM_PRODUCT.results[0].Buyingpricesqft,
                vGross_Margin = oData.NAV_PMG_ITEM_PRODUCT.results[0].Grossmargper,
                vSource = oData.NAV_PMG_ITEM_PRODUCT.results[0].Source,
                sName = oData.NAV_PMG_ITEM_PRODUCT.results[0].Sname;

              this.getView().getModel("ProductModel").getData()[this._rowIndex].Buyingpricesqft = vSVC_BP;
              this.getView().getModel("ProductModel").getData()[this._rowIndex].Grossmargper = vGross_Margin;
              this.getView().getModel("ProductModel").getData()[this._rowIndex].Source = vSource;
              this.getView().getModel("ProductModel").getData()[this._rowIndex].Sname = sName;
              // var len = this.getView().getModel("ProductModel").getData().length;
              // this.getView().getModel("oRequestModel").getData().Wgmper = 0;
              // for (let index = 0; index < len; index++) {
              //     var nGrossMargin = Number(this.getView().getModel("ProductModel").getData()[index].Grossmargper);

              //     this.getView().getModel("oRequestModel").getData().Wgmper = this.getView().getModel("oRequestModel").getData().Wgmper + nGrossMargin;

              // }
              // this.getView().getModel("oRequestModel").getData().Wgmper = this.getView().getModel("oRequestModel").getData().Wgmper / len;
              this.getView().getModel("oRequestModel").refresh(true);
              this.getView().getModel("ProductModel").refresh(true);
              this.getView().setBusy(false);
            }.bind(this),
            error: function (oError) {
              this.getView().setBusy(false);
              MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (oAction) {},
              });
            }.bind(this),
          });
      },

      onChangeSource: function (oEvent) {
        var oModeldata = this.getView().getModel("ProductModel").getData();
        this.getView().getModel("ProductModel").refresh(true);
        var newEntry = {
          Pafno: this.pafID,
          NAV_PMG_ITEM_PRODUCT: newProductArr,
        };

        this.getOwnerComponent()
          .getModel()
          .create("/ET_PMG_REQUEST_ITEMSet", newEntry, {
            success: function (oData, response) {
              var oPrdModel = this.getView().getModel("ProductModel");
              oPrdModel.setData(oData.NAV_PMG_ITEM_PRODUCT.results);
              this.getView().setModel(oPrdModel, "ProductModel");
              this.getView().getModel("ProductModel").refresh(true);
              this.getView().setBusy(false);
            }.bind(this),
            error: function (oError) {
              this.getView().setBusy(false);
              MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (oAction) {},
              });
            }.bind(this),
          });
      },

      getData: function () {
        var oGetDataModel = new JSONModel();
        this.getView().setModel(oGetDataModel, "oRequestModel");
        // {
        //     "customer": "Bharath Marble",
        //     "vol":"23000",
        //     "val":"9.2",
        //     "grmpe":"17%",
        //     "grmps":"17.1",
        //     "reg":"NI-CHANDIGAR",
        //     "vol1":"23000",
        //     "val1":"8.7",
        //     "grmpe1":"14%",
        //     "grmps1":"7.2",
        //     "custId":"TN0S0117",
        //     "siz":"300X150",
        //     "des":"TINTONDK",
        //     "sour":"Coral",
        //     "vol2":"20000",
        //     "vali":"20",
        //     "mfg":"WDGIDOL",
        //     "dis":"10%",
        //     "nefsf":"202.5",
        //     "neff":"18.81",
        //     "fsf":"no",
        //     "sts":"pending",
        //     "rem":"Long Term Dealer",
        //     "grmg":"9%",
        //     "bmgm":"24%",
        //     "dis1":"25%",
        //     "red":"20%",
        //     "egmpsf":"15",
        //     "tegps":"25",
        //     "cegps":"20",
        //     "effect":"-1",
        //     "vgm":"15",
        //     "recomnd":"Reject the Transaction",
        //     "hrlp":"202.5",
        //     "efp":"280",
        //     "oiv":"70", "oiv2":"25%",
        //     "sd":"-",
        //     "sd2":"-",
        //     "ptd":"10",
        //     "ptd2":"4%",
        //     "svc":"184",
        //     "fc":"-",
        //     "orc":"-",
        //     "orc2":"-",
        //     "snd":"25","snd2":"12.5%",
        //     "comn":"-",
        //     "comlp":"-",
        //     "mfg":"WDGIDOL",
        //     "nef":"202.5",
        //     "gm":"8%",
        //     "val2":"9.2",
        //     "gm2":"9%"
        // });
      },

      onBack: function () {
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.navTo("", {});
      },

      onForward: function () {
        var nGM = Number(this.getView().getModel("oRequestModel").getProperty("/Wgmper"));
        var bEditable, sState;

        var pafNo = this.getView().getModel("oRequestModel").getProperty("/Pafno"),
          remarks = this.byId(sap.ui.core.Fragment.createId("idFragment", "id.remarks.Input")).getValue();

        var payload = {
          Pafno: pafNo,
          Action: "FOR",
          PmgRemark: remarks,
        };
        var sDivision = this.getView().getModel("oRequestModel").getProperty("/Spart");
        debugger;
        var sPath = "ES_GM_RANGESet('" + sDivision + "')";
        var newValHelpModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPMG_AUTOMATION_DISCOUNT_SRV/", true);
        newValHelpModel.read(sPath, {
          success: function (oData) {
            if (nGM < Number(oData.EdGmLow)) {
              var sHeaderMessage = "Gross Margin is less than " + oData.EdGmHigh + "%";
              var sInfoMessage = "Request will be forwarded to the Executive Director";
              bEditable = true;
              sState = "None";
            } else if (nGM >= Number(oData.NshGmLow) && nGM <= Number(oData.NshGmHigh)) {
              var sHeaderMessage = "Gross Margin is in between " + oData.NshGmLow + "%-" + oData.NshGmHigh + "%";
              var sInfoMessage = "Request will be forwarded to the National Sales Head";
              bEditable = true;
              sState = "None";
            } else if (nGM >= Number(oData.VhGmLow) && nGM <= Number(oData.VhGmHigh)) {
              var sHeaderMessage = "Gross Margin is in between " + oData.VhGmLow + "%-" + oData.VhGmHigh + "%";
              var sInfoMessage = "Request will be forwarded to the Vertical Head";
              bEditable = true;
              sState = "None";
            } else if (nGM >= Number(oData.PmgGmLow) && nGM <= Number(oData.PmgGmHigh)) {
              var sHeaderMessage = "Gross Margin is in between " + oData.PmgGmLow + "%-" + oData.PmgGmHigh + "%";
              var sInfoMessage = "Request will be forwarded to the PMG";
              bEditable = true;
              sState = "None";
            } else {
              var sHeaderMessage = "Gross Margin is wrong";
              var sInfoMessage = "GM % range is not validated ";
              bEditable = false;
              sState = "Error";
            }
            MessageBox.information(sInfoMessage, {
              title: sHeaderMessage,
              actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
              onClose: function (oAction) {
                if (oAction === "OK") {
                  this._sendPayload(payload);
                }
              }.bind(this),
            });
            this.getView().setBusy(false);
          }.bind(this),
          error: function (oError) {
            this.getView().setBusy(false);
            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
              actions: [sap.m.MessageBox.Action.OK],
              onClose: function (oAction) {},
            });
          }.bind(this),
        });
      },
      bpRenegotiation: function () {
        var pafNo = this.getView().getModel("oRequestModel").getProperty("/Pafno"),
          remarks = this.byId(sap.ui.core.Fragment.createId("idFragment", "id.remarks.Input")).getValue();

        var payload = {
          Pafno: pafNo,
          Action: "BPRENG",
          PmgRemark: remarks,
        };

        this._sendPayload(payload);
      },
      freightRenegotiation: function () {
        var pafNo = this.getView().getModel("oRequestModel").getProperty("/Pafno"),
          remarks = this.byId(sap.ui.core.Fragment.createId("idFragment", "id.remarks.Input")).getValue();

        var payload = {
          Pafno: pafNo,
          Action: "FRIGHTRENG",
          PmgRemark: remarks,
        };

        this._sendPayload(payload);
      },
      reject: function () {
        var pafNo = this.getView().getModel("oRequestModel").getProperty("/Pafno"),
          remarks = this.byId(sap.ui.core.Fragment.createId("idFragment", "id.remarks.Input")).getValue();

        var payload = {
          Pafno: pafNo,
          Action: "REJECT",
          PmgRemark: remarks,
        };

        this._sendPayload(payload);
      },
      Approved: function () {
        var pafNo = this.getView().getModel("oRequestModel").getProperty("/Pafno"),
          remarks = this.byId(sap.ui.core.Fragment.createId("idFragment", "id.remarks.Input")).getValue();

        var payload = {
          Pafno: pafNo,
          Action: "ACCEPT",
          PmgRemark: remarks,
        };

        this._sendPayload(payload);
      },
      onGenerate: function () {
        var items = this.getView().getModel("ProductModel").getData(),
          validity = this.byId(sap.ui.core.Fragment.createId("idFragment", "id.validity.Input")).getValue(),
          pafNo = this.getView().getModel("oRequestModel").getProperty("/Pafno"),
          headerRemark = this.byId(sap.ui.core.Fragment.createId("idFragment", "id.remarks.Input")).getValue(),
          proj = this.getView().getModel("oRequestModel").getProperty("/Proj");

        var payload = {
          Pafno: pafNo,
          Validity: validity,
          Action: "GENERATE",
          PmgRemark: headerRemark,
          Proj: proj,
          NAV_PMG_ITEM_PRODUCT: items,
        };

        this._sendPayload(payload);
      },
      _sendPayload: function (payload) {
        var sMessage;
        switch (payload.Action) {
          case "ACCEPT":
            sMessage = "PAF is released";
            break;
          case "REJECT":
            sMessage = "PAF is rejected";
            break;
          case "FOR":
            sMessage = "PAF forwarded";
            break;
          case "FRIGHTRENG":
            sMessage = "PAF sent for Freight Renegotiation";
            break;
          case "BPRENG":
            sMessage = "PAF sent for BP Renegotiation";
            break;
          default:
            sMessage = "Unexpected Error";
            break;
        }

        var aTablePayload = this.getView().getModel("ProductModel").getData(),
          len = aTablePayload.length,
          vValidation = 0;

        for (let index = 0; index < len; index++) {
          for (const key in aTablePayload[index]) {
            if (Object.hasOwnProperty.call(aTablePayload[index], key)) {
              if (key === "Source") {
                const element = aTablePayload[index]["Source"];
                if (element === "") {
                  vValidation = 0;
                  this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3].setValueState("Error");
                  // this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3]
                } else {
                  vValidation = 1;
                  this.getView().byId("idTblProductDetails").getItems()[index].getAggregation("cells")[3].setValueState("None");
                }
              }
            }
          }
        }
        if (vValidation === 1) {
          this.getView().setBusy(true);
          this.getOwnerComponent()
            .getModel()
            .create("/ET_PMG_REQUEST_ITEMSet", payload, {
              success: function (oData, response) {
                this.getView().getModel("ProductModel").setData(oData.NAV_PMG_ITEM_PRODUCT.results);
                this.getView().getModel("ProductModel").refresh();
                this.getView().getModel("oRequestModel").getData().Validity = oData.Validity;
                this.getView().getModel("oRequestModel").getData().Pafvto = oData.Pafvto;
                this.getView().getModel("oRequestModel").getData().PmgRemark = oData.PmgRemark;
                this.getView().getModel("oRequestModel").getData().Wsd = oData.Wsd;
                this.getView().getModel("oRequestModel").getData().Wgmper = oData.Wgmper;
                // this.getView().getModel("oRequestModel").getData().Grossmargper = oData.Grossmargper;
                this.getView().getModel("oRequestModel").refresh(true);
                if (payload.Action === "GENERATE") {
                  MessageBox.success("Values generated");
                } else {
                  MessageBox.success(sMessage, {
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {
                      this.oRouter = this.getOwnerComponent().getRouter();
                      this.oRouter.navTo("page1", {});
                      window.location.reload();
                    }.bind(this),
                  });
                }
                this.calculateHeader();
                this.activateActionButtons();
                this.getView().setBusy(false);
              }.bind(this),
              error: function (oError) {
                this.getView().setBusy(false);
                MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function (oAction) {},
                });
              }.bind(this),
            });
        } else {
          MessageBox.error("Please select Source(vendor)");
          this.oRejectDialog.close();
        }
      },
      //Start: View and Download Attachment
      onViewAttachmentObjectStatusPress: function (oEvent) {
        var sFile = oEvent.getSource().getParent().getProperty("thumbnailUrl"),
          sFileName = oEvent.getSource().getParent().getProperty("fileName"),
          oButton = oEvent.getSource();

        var _imageSrc = { ZRFILE: sFile, ZRFNAME: sFileName };
        var oModelForImage = new sap.ui.model.json.JSONModel(_imageSrc);
        this.getView().setModel(oModelForImage, "oModelForImage");

        if (sFile.includes("PDF") || sFile.includes("pdf")) {
          var fileName = sFileName;

          var decodedPdfContent = atob(sFile.split("data:application/pdf;base64,")[1]);
          var byteArray = new Uint8Array(decodedPdfContent.length);
          for (var i = 0; i < decodedPdfContent.length; i++) {
            byteArray[i] = decodedPdfContent.charCodeAt(i);
          }
          var blob = new Blob([byteArray.buffer], {
            type: "application/pdf",
          });
          var _pdfurl = URL.createObjectURL(blob);
          jQuery.sap.addUrlWhitelist("blob");
          this.opdfViewer.setSource(_pdfurl);
          this.opdfViewer.setTitle(fileName);
          this.opdfViewer.open();
        } else {
          if (this.oPopover) {
            this.oPopover.destroy();
            delete this._pPopover;
          }

          // create popover for image
          if (!this._pPopover) {
            this._pPopover = Fragment.load({
              id: this.getView().getId(),
              name: "pj.zpmg.view.fragments.imagePopover",
              controller: this,
            }).then(function (oPopover) {
              return oPopover;
              oPopover.setModel(oModelForImage);
            });
          }
          this._pPopover.then(
            function (oPopover) {
              oPopover.openBy(oButton);

              oPopover.getAggregation("content")[0].setSrc(_imageSrc.ZRFILE);
              this.oPopover = oPopover;
            }.bind(this)
          );
        }
      },
      handleClose: function (oEvent) {
        oEvent.getSource().getParent().getParent().destroy();
      },
      imageDownload: function (oEvent) {
        const sURL = this.getView().getModel("oModelForImage").getData().ZRFILE;
        const imageName = this.getView().getModel("oModelForImage").getData().ZRFNAME;
        fetch(sURL)
          .then((oResponse) => oResponse.blob())
          .then((oBlob) => {
            const sBlobURL = URL.createObjectURL(oBlob);
            const oLink = document.createElement("a");
            oLink.href = sBlobURL;
            oLink.download = imageName;
            oLink.target = "_blank";
            document.body.appendChild(oLink);
            oLink.click();
            document.body.removeChild(oLink);
          });
        oEvent.getSource().getParent().getParent().destroy();
      },
      //End: View and Download Attachment

      onValidityInputLiveChange: function (oEvent) {
        this.deActivateActionButtons();
        var sValue = oEvent.getSource().getValue();
        if (sValue.includes(".")) {
          MessageToast.show("Decimal not allowed");
          sValue = sValue.substring(0, sValue.length - 1);
          oEvent.getSource().setValue(sValue);
        }
        if (isNaN(sValue)) {
          MessageBox.error("Only numeric values allowed");
          oEvent.getSource().setValue("");
        }
      },
      onPmgRemarkInputLiveChange: function (oEvent) {
        this.deActivateActionButtons();
      },
      onSourceInputLiveChange: function (oEvent) {
        var sValue = oEvent.getSource().getValue();
        this.deActivateActionButtons();
        if (sValue.includes(".")) {
          if (sValue.split(".")[1].length > 2) {
            MessageToast.show("Only 2 Decimal allowed");
            sValue = sValue.substring(0, sValue.length - 1);
            oEvent.getSource().setValue(sValue);
          }
        }
        if (isNaN(sValue)) {
          MessageBox.error("Only numeric values allowed");
          oEvent.getSource().setValue("");
        }
      },
      onDiscountInputLiveChange: function (oEvent) {
        var sValue = oEvent.getSource().getValue();
        this.deActivateActionButtons();
        if (sValue.includes(".")) {
          if (sValue.split(".")[1].length > 2) {
            MessageToast.show("Only 2 Decimal allowed");
            sValue = sValue.substring(0, sValue.length - 1);
            oEvent.getSource().setValue(sValue);
          }
        }
        if (isNaN(sValue)) {
          MessageBox.error("Only numeric values allowed");
          oEvent.getSource().setValue("");
        }
      },
      onBuyingpricesqftInputLiveChange: function (oEvent) {
        var sValue = oEvent.getSource().getValue();
        this.deActivateActionButtons();
        if (sValue.includes(".")) {
          if (sValue.split(".")[1].length > 2) {
            MessageToast.show("Only 2 Decimal allowed");
            sValue = sValue.substring(0, sValue.length - 1);
            oEvent.getSource().setValue(sValue);
          }
        }
        if (isNaN(sValue)) {
          MessageBox.error("Only numeric values allowed");
          oEvent.getSource().setValue("");
        }
      },
      onCommboxInputLiveChange: function (oEvent) {
        var sValue = oEvent.getSource().getValue();
        this.deActivateActionButtons();
        if (sValue.includes(".")) {
          if (sValue.split(".")[1].length > 2) {
            MessageToast.show("Only 2 Decimal allowed");
            sValue = sValue.substring(0, sValue.length - 1);
            oEvent.getSource().setValue(sValue);
          }
        }
        if (isNaN(sValue)) {
          MessageBox.error("Only numeric values allowed");
          oEvent.getSource().setValue("");
        }
      },
      onCommboxpInputLiveChange: function (oEvent) {
        this.deActivateActionButtons();
      },

      calculateHeader: function () {
        var tableData = this.getView().getModel("ProductModel").getData(),
          noItems = tableData.length,
          wDiscount = 0,
          wDiscountb = 0,
          wNEF = 0,
          wFreight = 0,
          wORC = 0,
          wORCP = 0,
          wBuyingpricesqft = 0,
          vTotalValume = 0;
        // var wGrossMargin = 0;

        for (let index = 0; index < noItems; index++) {
          if (this.getView().getModel("oRequestModel").getProperty("/Vtweg") === "19") {
            wDiscount = wDiscount + (Number(tableData[index].Discount) / 100) * Number(tableData[index].Totalvolume);
            wORCP = wORCP + (Number(tableData[index].Commboxp) / 100) * Number(tableData[index].Totalvolume);
          } else {
            wDiscountb = wDiscountb + Number(tableData[index].Discountb) * Number(tableData[index].Totalvolume);
            wORC = wORC + Number(tableData[index].Commbox) * Number(tableData[index].Totalvolume);
          }
          wBuyingpricesqft = wBuyingpricesqft + Number(tableData[index].Buyingpricesqft) * Number(tableData[index].Totalvolume);
          wNEF = wNEF + Number(tableData[index].Netexsqft) * Number(tableData[index].Totalvolume);
          wFreight = wFreight + Number(tableData[index].Frghtsqft) * Number(tableData[index].Totalvolume);
          vTotalValume = vTotalValume + Number(tableData[index].Totalvolume);
          // wGrossMargin = wGrossMargin + Number(tableData[index].Grossmargper);
        }

        this.getView()
          .getModel("oRequestModel")
          .setProperty("/Wdisc", ((wDiscount / vTotalValume) * 100).toFixed(2).toString());
        this.getView()
          .getModel("oRequestModel")
          .setProperty("/Wdiscb", (wDiscountb / vTotalValume).toFixed(2).toString());
        this.getView()
          .getModel("oRequestModel")
          .setProperty("/Wnefsqft", (wNEF / vTotalValume).toFixed(2).toString());
        this.getView()
          .getModel("oRequestModel")
          .setProperty("/Wfrgtsqft", (wFreight / vTotalValume).toFixed(2).toString());

        this.getView()
          .getModel("oRequestModel")
          .setProperty("/Worc", (wORC / vTotalValume).toFixed(2).toString());
        this.getView()
          .getModel("oRequestModel")
          .setProperty("/Worcper", ((wORCP / vTotalValume) * 100).toFixed(2).toString());
        // this.getView().getModel("oRequestModel").setProperty("/Wgmper", (wGrossMargin / noItems).toFixed(2).toString());
        this.getView()
          .getModel("oRequestModel")
          .setProperty("/Wbuyingprice", (wBuyingpricesqft / vTotalValume).toFixed(2).toString());
        this.getView().getModel("oRequestModel").refresh(true);
      },

      activateActionButtons: function () {
        this.getView().byId("id.actionButtons.Bar").setVisible(true);
      },
      deActivateActionButtons: function () {
        this.getView().byId("id.actionButtons.Bar").setVisible(false);
      },
    });
  }
);
