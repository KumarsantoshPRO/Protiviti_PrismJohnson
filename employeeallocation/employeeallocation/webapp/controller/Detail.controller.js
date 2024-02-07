sap.ui.define([
  "sap/ui/core/mvc/Controller", 
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("in.protiviti.employeeallocation.controller.Detail", {
      onInit: function () {
        var oViewModel = new JSONModel({
          tableData: [{}],
          resourseName: false,
          create: true,
          showAvailablebtn: false,
          addRowbtn: true,
          deleteRowbtn: true,
          duplicateRowBtn : true
      });
      this.getView().setModel(oViewModel, "oViewModel");
        this.oRouter = this.getOwnerComponent().getRouter();
        // this.oRouter.getRoute("Detail").attachPatternMatched(this.onObjectMatched, this);
        // var oInitModel = new JSONModel({
        //   enabled: false,
        // });
        // this.getView().setModel(oInitModel, "oInitModel");
        this.data = [];
      },
      // onObjectMatched: function (oEvent) {
      //   if (oEvent.getParameter("name") === "Create") {
      //       var oViewModel = new JSONModel();
      //       this.getView().setModel(oViewModel, "oViewModel");
      //       this.getView().getModel("oInitModel").setProperty("/enabled", true);
      //   } else {
      //       this.getView().getModel("oInitModel").setProperty("/enabled", false);
      //   }
      // },
      onBack: function () {
        this.oRouter.navTo("RouteView1");
      },
      onSubmitPress: function () {
        // this.data.push(this.getView().getModel("oViewModel").getData());
        // this.getOwnerComponent().getModel("oValuesModel").setData(this.data);
        // MessageToast.show("Record Created Successfully");
        this.oRouter.navTo("RouteView1");
      },
    });
  }
);
