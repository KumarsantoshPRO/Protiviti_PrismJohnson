sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "zpj/pro/sd/sk/zprovertihead/model/formatter", "sap/m/MessageBox"],
  function (e, t, a, s) {
    "use strict";
    return e.extend("zpj.pro.sd.sk.zprovertihead.controller.View1", {
      formatter: a,
      onInit: function () {
        this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
        
        // var oJSONModelForTable = new sap.ui.model.json.JSONModel();
        // this.getView().setModel( oJSONModelForTable,"JSONModelForTable");
        // this.getView().getModel("JSONModelForTable").refresh(true);
      },
      _onRouteMatched: function (e) {
        var t = e.getParameter("arguments").ID;
        if (t === "Page1" || t === undefined || t === "") {
            this.onFilterBarClear();
            this.onSearch();
            // this.getView().byId("id.FilterBar").fireSearch();
      }
       
      },
      _getRequestData: function (e, a) { // DR change for filter
        var i = [];
        var r = new sap.ui.model.Filter([new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, e)], false);
        i.push(r);
        var o = "/ET_ZDI_TP_BILLSet";
        if ( this.sVkbur ) {
            // var o = new sap.ui.model.Filter([new sap.ui.model.Filter("Pafno", sap.ui.model.FilterOperator.EQ, this.sPafNo)], false);
            var n = new sap.ui.model.Filter([new sap.ui.model.Filter("Vkbur", sap.ui.model.FilterOperator.EQ, this.sVkbur)], false);
            // var u = new sap.ui.model.Filter([new sap.ui.model.Filter("Spart", sap.ui.model.FilterOperator.EQ, this.sSpart)], false);
            // a.push(o);
            i.push(n);
            // a.push(u);
          }
        this.getView().setBusy(true);
        this.getView()
          .getModel()
          .read(o, {
            filters: i,
            success: function (s) {
                var i =[];
              this.getView().setBusy(false);
              if (a === "count") {
                switch (e) {
                  case "":
                    this.getView().getModel("count").getData().Total = s.results.length;
                    break;
                  case "P":
                    this.getView().getModel("count").getData().Pending = s.results.length;
                    break;
                  case "D":
                    this.getView().getModel("count").getData().Delayed = s.results.length;
                    break;
                  case "A":
                    this.getView().getModel("count").getData().Approved = s.results.length;
                    break;
                  case "R":
                    this.getView().getModel("count").getData().Rejected = s.results.length;
                    break;
                  case "DL":
                    this.getView().getModel("count").getData().Deleted = s.results.length;
                    break;
                  default:
                    break;
                }
              } else {
                // i.push(s.results);
                var n = s.results;
                
                this.getView().setModel(new t(n), "JSONModelForTable");
                
              }
              this.getView().getModel("count").refresh(true);
            }.bind(this),
            error: function (e) {
              this.getView().setBusy(false);
              s.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (e) {},
              });
            }.bind(this),
          });
      },
     
 
      onSearch: function () {
        
        this.sVkbur = this.getView().byId("id.SalesOffice.Input").getValue();
        this.getView().byId("idIconTabBar").setSelectedKey("All");
        this.getView().byId("id.orderNumber.Input").setValue("");
        this._getRequestData("P", "count");
        this._getRequestData("A", "count");
        this._getRequestData("R", "count");
        this._getRequestData("DL", "count");
        this._getRequestData("", "count");
        this._getRequestData("", "tableData");
      },

      onFilterBarClear: function () {
        this.getView().byId("id.SalesOffice.Input").setValue("");
           
        // var oJSONModelForTable = new sap.ui.model.json.JSONModel();
        // this.getView().setModel( oJSONModelForTable,"JSONModelForTable");
        // this.getView().getModel("JSONModelForTable").refresh(true);
       
      },
      _onFilterSelect: function (e) {
        var t = e.getParameter("key");
        if (t === "All") {
          this._getRequestData("", "tableData");
          this.getView().byId("id.FilterBar").setVisible(true);
        } else if (t === "Pending") {
          this._getRequestData("P", "tableData");
          this.getView().byId("id.FilterBar").setVisible(false);
        } else if (t === "Approved") {
          this._getRequestData("A", "tableData");
          this.getView().byId("id.FilterBar").setVisible(false);
        } else if (t === "Delayed") {
          this._getRequestData("D", "tableData");
          this.getView().byId("id.FilterBar").setVisible(false);
        } else if (t === "Rejected") {
          this._getRequestData("R", "tableData");
          this.getView().byId("id.FilterBar").setVisible(false);
        } else if (t === "Deleted") {
          this._getRequestData("DL", "tableData");
          this.getView().byId("id.FilterBar").setVisible(false);
        }
      },
      onOrderNumber: function (e) {
        var t = e.getParameter("value");
        var a = new sap.ui.model.Filter({ path: "Pafno", operator: sap.ui.model.FilterOperator.Contains, value1: t });
        var s = this.getView().byId("productsTable");
        s.getBinding("items").filter(a);
        s.setShowOverlay(false);
      },
      onClickofItem: function (e) {
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.navTo("page2", { pafID: e.getSource().getCells()[0].getText() });
        // this.onInit();
        // this.onFilterBarClear();
        // this._onRouteMatched();
        
      },
      onSalesOfficeHelp: function () {
        
        if (!this.SalesOfficerag) {
          this.SalesOfficerag = sap.ui.xmlfragment("zpj.pro.sd.sk.zprovertihead.view.fragments.View1.salesOfficeF4", this);
          this.getView().addDependent(this.SalesOfficerag);
          this._SalesOfficeTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();
          this._oTemp = sap.ui.getCore().byId("idSLSalesOfficeValueHelp").clone();

          var sServicelUrl = "/sap/opu/odata/sap/ZCUSTOMER_AUTOMATIONDISCOUNT_SRV/";
          var oODataModel = new sap.ui.model.odata.v2.ODataModel(sServicelUrl);
          this.SalesOfficerag.setModel(oODataModel);
        }
        var e = [];
        var t = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
        var a = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "")], false);
        var i = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
        e.push(t);
        e.push(a);
        e.push(i);
        sap.ui
          .getCore()
          .byId("idSDSalesOfficeF4")
          .bindAggregation("items", { path: "/ET_VALUE_HELPSSet", filters: e, template: this._SalesOfficeTemp });
        this.SalesOfficerag.open();
      },
      onValueHelpSearch: function (e) {
        var t = [];
        var a = e.getParameter("value");
        var i = "/ET_VALUE_HELPSSet";
        var s = sap.ui.getCore().byId(e.getParameter("id"));
        var r = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
        var l = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, a)], false);
        t.push(r);
        t.push(l);
        s.bindAggregation("items", { path: i, filters: t, template: this._oTemp });
      },
      onValueHelpConfirm: function (e) {
        
        var t = e.getParameter("selectedItem");
        var a = t.getProperty("title");
        this.getView().byId("id.SalesOffice.Input").setValue(a); 
        // this.byId(sap.ui.core.Fragment.createId("id.tableProductDetails.Fragment", "id.SalesOffice.Input")).setValue(a);
      },
      onSalesOfficeInputSubmit: function (e) {
        var t = e.getParameter("value"),
          a = [],
          i = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false),
          s = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, t)], false),
          r = "/Vkbur",
          l = "",
          o = "Entered Sales Office is wrong";
        a.push(i);
        a.push(s);
      },
      onSuggest: function (e) {
        var a = e.getParameter("suggestValue"),
          s = [],
          r = "/ET_VALUE_HELPSSet",
          l,
          o,
          n;
        if (a.includes(",")) {
          var u = a.split(",").length;
          a = a.split(",")[a.split(",").length - 1];
        }
        l = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
        o = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, a)], false);
        n = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
        s.push(l);
        s.push(n);
        s.push(o);
        if (a) {
          this.getView().setBusy(true);
          this.getView()
            .getModel()
            .read(r, {
              filters: s,
              success: function (e) {
                if (e.results.length > 0) {
                  var a = new t(e.results);
                  this.getView().setModel(a, "JSONModelForSuggest");
                  this.getView().getModel("JSONModelForSuggest").refresh(true);
                }
                this.getView().setBusy(false);
              }.bind(this),
              error: function (e) {
                this.getView().setBusy(false);
                i.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message, {
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function (e) {},
                });
              }.bind(this),
            });
        }
      },
 
    });
  }
);
//# sourceMappingURL=View1.controller.js.map
