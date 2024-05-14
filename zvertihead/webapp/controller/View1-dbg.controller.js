sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "zpj/pro/sd/sk/zprovertihead/model/formatter", "sap/m/MessageBox"],
  function (e, t, a, s) {
    "use strict";
    return e.extend("zpj.pro.sd.sk.zprovertihead.controller.View1", {
      formatter: a,
      onInit: function () {
        this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (e) {
        var t = e.getParameter("arguments").ID;
        if (t === "Page1" || t === undefined || t === "") {
         
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
                debugger;
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
        // this.getView().byId("idIconTabBar").setSelectedKey("All");//DR change
        // this.getView().byId("id.orderNumber.Input").setValue("");
        // if (!this.sVkbur) {
        //   s.error("Please enter Sales Office ");
        // } else
         {
          this._getRequestData("P", "count");
          this._getRequestData("A", "count");
          this._getRequestData("R", "count");
          this._getRequestData("DL", "count");
          this._getRequestData("", "count");
          this._getRequestData("", "tableData");
        }
      },
      onFilterBarClear: function () {
        this.getView().byId("id.SalesOffice.Input").setValue("");
       
      },
      _onFilterSelect: function (e) {
        var t = e.getParameter("key");
        if (t === "All") {
          this._getRequestData("", "tableData");
        } else if (t === "Pending") {
          this._getRequestData("P", "tableData");
        } else if (t === "Approved") {
          this._getRequestData("A", "tableData");
        } else if (t === "Delayed") {
          this._getRequestData("D", "tableData");
        } else if (t === "Rejected") {
          this._getRequestData("R", "tableData");
        } else if (t === "Deleted") {
          this._getRequestData("DL", "tableData");
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
      },
    });
  }
);
//# sourceMappingURL=View1.controller.js.map
