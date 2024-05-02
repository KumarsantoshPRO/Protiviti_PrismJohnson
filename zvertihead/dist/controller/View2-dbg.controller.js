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
    "zpj/pro/sd/sk/zprovertihead/model/formatter",
    "sap/m/MessageBox",
  ],
  function (e, t, s, r, o, i, a, n, u, l) {
    "use strict";
    var g = a.ButtonType;
    var d = a.DialogType;
    return e.extend("zpj.pro.sd.sk.zprovertihead.controller.View2", {
      formatter: u,
      onInit: function () {
        var e = new t();
        this.getView().setModel(e, "ProductModel");
        var s = new t();
        this.getView().setModel(s, "SouceModel");
        this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
        this.getData();
        this.pafNoTemp;
        this._Posnr;
        this._rowIndex;
      },
      onRouteMatched: function (e) {
        var t = e.getParameter("arguments").pafID;
        if (t !== "Page1" || t !== undefined) {
          if (t) {
            this.getView()
              .byId("idPage")
              .setTitle("Details of PAF No: " + t.replace(/^0+/, ""));
            this.getRequestDetails(t);
            this.pafID = t;
          }
        }
      },
      getRequestDetails: function (e) {
        this.getView().setBusy(true);
        var t = "/ZPAF_VH_HEADERSet('" + e + "')";
        this.getOwnerComponent()
          .getModel()
          .read(t, {
            urlParameters: { $expand: "NAV_VH_ITEM_PRODUCT" },
            success: function (e) {
              var t = this.getView().getModel("oRequestModel");
              debugger;
              if (e.Status === "A" || e.Status === "R") {
                this.getView().byId("id.Approve.Button").setVisible(false);
                this.getView().byId("id.Reject.Button").setVisible(false);
              } else {
                this.getView().byId("id.Approve.Button").setVisible(true);
                this.getView().byId("id.Reject.Button").setVisible(true);
              }
              var s = e.NAV_VH_ITEM_PRODUCT.results.length;
              e.Wgrossmargper = 0;
              e.Wbuyingprice = 0;
              for (let t = 0; t < s; t++) {
                var r = Number(e.NAV_VH_ITEM_PRODUCT.results[t].Grossmargper);
                var o = Number(e.NAV_VH_ITEM_PRODUCT.results[t].Buyingpricesqft);
                e.Wgrossmargper = Number(e.Wgrossmargper) + r;
                e.Wbuyingprice = Number(e.Wbuyingprice) + o;
              }
              e.Wgrossmargper = (e.Wgrossmargper / s).toFixed(2);
              e.Wbuyingprice = (e.Wbuyingprice / s).toFixed(2);
              e.Discb = ((e.Wexfacsqft / 100) * e.Disc).toFixed(2);
              e.Worc = ((e.Wexfacsqft / 100) * e.Worcper).toFixed(2);
              t.setData(e);
              this.getView().setModel(t, "oRequestModel");
              var i = this.getView().getModel("ProductModel");
              i.setData(e.NAV_VH_ITEM_PRODUCT.results);
              this.getView().setModel(i, "ProductModel");
              this.getView().setBusy(false);
            }.bind(this),
            error: function (e) {
              this.getView().setBusy(false);
              l.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (e) {},
              });
            }.bind(this),
          });
      },
      getSourceDetails: function (e) {
        this.getView().setBusy(true);
        var t = new Array();
        var s = new sap.ui.model.Filter({ path: "Domname", operator: "EQ", value1: "SOURCE" });
        t.push(s);
        var r = new sap.ui.model.Filter({ path: "Domname1", operator: "EQ", value1: "" });
        t.push(r);
        var o = new sap.ui.model.Filter({ path: "Domname2", operator: "EQ", value1: e });
        t.push(o);
        var i = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSTOMER_AUTOMATIONDISCOUNT_SRV/", true);
        i.read("/ET_VALUE_HELPSSet", {
          filters: t,
          success: function (e) {
            var t = this.getView().getModel("SouceModel");
            t.setData(e.results);
            this.getView().setModel(t, "SouceModel");
            this.getView().setBusy(false);
          }.bind(this),
          error: function (e) {
            this.getView().setBusy(false);
            l.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message, {
              actions: [sap.m.MessageBox.Action.OK],
              onClose: function (e) {},
            });
          }.bind(this),
        });
      },
      onSourceHelp: function (e) {
        var t = Number(e.getSource().getParent().getBindingContextPath().split("/")[1]);
        this._rowIndex = t;
        this._Posnr = t + 1;
        if (!this._sourceFrag) {
          this._sourceFrag = sap.ui.xmlfragment("zpj.pro.sd.sk.zprovertihead.view.fragments.source", this);
          this.getView().addDependent(this._sourceFrag);
          this._CustomerCodeTemp = sap.ui.getCore().byId("idSLSourceValueHelp").clone();
          this._oTemp = sap.ui.getCore().byId("idSLSourceValueHelp").clone();
        }
        var s = [],
          r = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SOURCE")], false),
          o = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false),
          i = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, this.pafID)], false),
          a = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname3", sap.ui.model.FilterOperator.EQ, this._Posnr)], false);
        s.push(r);
        s.push(o);
        s.push(i);
        s.push(a);
        sap.ui
          .getCore()
          .byId("idSDSourceF4")
          .bindAggregation("items", { path: "ZCUSTOMER_AUTOMATIONDISCOUNT_SRV>/ET_VALUE_HELPSSet", filters: s, template: this._CustomerCodeTemp });
        this._sourceFrag.open();
      },
      onSourceValueHelpConfirm: function (e) {
        var t = e.getParameter("selectedItem"),
          s = t.getProperty("title");
        var r = {
          Pafno: this.pafID,
          Posnr: this._Posnr.toString(),
          NAV_VH_ITEM_PRODUCT: [{ Pafno: this.pafID, Posnr: this._Posnr.toString(), Source: s }],
        };
        this.getOwnerComponent()
          .getModel()
          .create("/ZPAF_VH_HEADERSet", r, {
            success: function (e, t) {
              var s = e.NAV_VH_ITEM_PRODUCT.results[0].Buyingpricesqft,
                r = e.NAV_VH_ITEM_PRODUCT.results[0].Grossmargper,
                o = e.NAV_VH_ITEM_PRODUCT.results[0].Source;
              this.getView().getModel("ProductModel").getData()[this._rowIndex].Buyingpricesqft = s;
              this.getView().getModel("ProductModel").getData()[this._rowIndex].Grossmargper = r;
              this.getView().getModel("ProductModel").getData()[this._rowIndex].Source = o;
              var i = this.getView().getModel("ProductModel").getData().length;
              this.getView().getModel("oRequestModel").getData().Wgrossmargper = 0;
              for (let e = 0; e < i; e++) {
                var a = Number(this.getView().getModel("ProductModel").getData()[e].Grossmargper);
                this.getView().getModel("oRequestModel").getData().Wgrossmargper =
                  this.getView().getModel("oRequestModel").getData().Wgrossmargper + a;
              }
              this.getView().getModel("oRequestModel").getData().Wgrossmargper = this.getView().getModel("oRequestModel").getData().Wgrossmargper / i;
              this.getView().getModel("oRequestModel").refresh(true);
              this.getView().getModel("ProductModel").refresh(true);
              this.getView().setBusy(false);
            }.bind(this),
            error: function (e) {
              this.getView().setBusy(false);
              l.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (e) {},
              });
            }.bind(this),
          });
      },
      onChangeSource: function (e) {
        var t = this.getView().getModel("ProductModel").getData();
        this.getView().getModel("ProductModel").refresh(true);
        var s = { Pafno: this.pafID, NAV_VH_ITEM_PRODUCT: newProductArr };
        this.getOwnerComponent()
          .getModel()
          .create("/ZPAF_VH_HEADERSet", s, {
            success: function (e, t) {
              var s = this.getView().getModel("ProductModel");
              s.setData(e.NAV_VH_ITEM_PRODUCT.results);
              this.getView().setModel(s, "ProductModel");
              this.getView().getModel("ProductModel").refresh(true);
              this.getView().setBusy(false);
            }.bind(this),
            error: function (e) {
              this.getView().setBusy(false);
              l.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (e) {},
              });
            }.bind(this),
          });
      },
      getData: function () {
        var e = new t();
        this.getView().setModel(e, "oRequestModel");
      },
      onBack: function () {
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.navTo("", {});
      },
      reject: function () {
        var e = { Pafno: "", Action: "REJECT" };
        this._sendPayload(e, "Rejected");
      },
      Approved: function () {
        var e = { Pafno: "", Action: "ACCEPT" };
        this._sendPayload(e, "Approved");
      },
      _sendPayload: function (e, t) {
        e.Pafno = this.getView().getModel("oRequestModel").getData().Pafno;
        this.getView().setBusy(true);
        this.getOwnerComponent()
          .getModel()
          .create("/ZPAF_VH_HEADERSet", e, {
            success: function (e, s) {
              l.success("PAF " + t + " Successfully", {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (e) {
                  this.oRouter = this.getOwnerComponent().getRouter();
                  this.oRouter.navTo("page1", {});
                }.bind(this),
              });
              this.getView().setBusy(false);
            }.bind(this),
            error: function (e) {
              this.getView().setBusy(false);
              l.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (e) {},
              });
            }.bind(this),
          });
      },
    });
  }
);
//# sourceMappingURL=View2-dbg.controller.js.map
