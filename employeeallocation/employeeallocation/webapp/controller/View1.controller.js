sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "in/protiviti/employeeallocation/model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter) {
        "use strict";

        return Controller.extend("in.protiviti.employeeallocation.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteView1").attachPatternMatched(this.onObjectMatched, this);
                var oFormModel = new JSONModel();
                this.getView().setModel(oFormModel, "oFormModel");

                this.oModel = this.getOwnerComponent().getModel("ZPRO_RMG_PROJECT_MASTER_SRV");

                this.oModel.read("/es_customer_master", {
                    success: function (oData) {
                        oFormModel.setData(oData.results);
                        console.log(oFormModel);
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error reading es_customer_master:", oError);
                    },
                });

                var oDataModel = new JSONModel();
                this.getView().setModel(oDataModel, "oDataModel");

                this.oModel.read("/es_project_new",  {
                    success: function (oData) {
                        oDataModel.setData(oData.results);
                        console.log(oDataModel);
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error in raeding entry", oError);
                    },
                });

                this.oModel = this.getOwnerComponent().getModel("ZPRO_RMG_PROJECT_MASTER_SRV");

                var oProjectAllocModel = new JSONModel();
                this.getView().setModel(oProjectAllocModel, "oProjectAllocModel");
            
                var filter2 = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "ZPROJECT_LOCATION"
                });
            
                this.oModel.read("/es_value_helps", {
                    filters: [filter2],
                    success: function (oData) {
                        oProjectAllocModel.setData(oData.results);
                        this.handleProjectLocationFormatting();
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                    }
                });

                var oProjectTypeModel = new JSONModel();
                this.getView().setModel(oProjectTypeModel, "oProjectTypeModel");
            
                var filter2 = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "ZPROJECT_TYPE"
                });
            
                this.oModel.read("/es_value_helps", {
                    filters: [filter2],
                    success: function (oData) {
                        oProjectTypeModel.setData(oData.results);
                        this.handleProjectTypeFormatting();
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                    }
                });


                var oEmployeeModel = new JSONModel([]);
                this.getView().setModel(oEmployeeModel, "oEmployeeModel");
            },

            _onObjectMatched: function(oEvent) {
                var sId = oEvent.getParameter("arguments").Id;
                var sSelectedData = oEvent.getParameter("arguments").SelectedData;
                var oSelectedData = JSON.parse(sSelectedData);
                console.log("Selected Data:", oSelectedData);
            },

              getDOADetails: function() {
                this.getOwnerComponent().getModel("ZPRO_RMG_PROJECT_MASTER_SRV").read("/es_customer_master", {
                  //filters: arrFilter,
                  success: function (oData, response) {
                      this.getView().getModel("oEmployeeModel").setData(oData.results);
                      console.log(this.getView().getModel("oEmployeeModel").getData());
                     // this.getView().setModel(oCusDataModel, "CUSMasterData");
                      this.getView().setBusy(false);
                  }.bind(this),
                  error: function (response) {
                      this.getView().setBusy(false);
                  }.bind(this)
              });
              },

              handleProjectLocationFormatting: function () {
                var oProjectAllocModel = this.getView().getModel("oProjectAllocModel");
                var aProjectLocations = oProjectAllocModel ? oProjectAllocModel.getData() : [];
                var oTable = this.getView().byId("idEmployeeAllocation");
                var oItems = oTable.getItems();
            
                oItems.forEach(function (oItem) {
                    var oBindingContext = oItem.getBindingContext("oDataModel");
                    var sProjectLocationCode = oBindingContext.getProperty("ProjectLocation");
                    var oProjectLocation = aProjectLocations.find(function (item) {
                        return item.DomvalueL === sProjectLocationCode;
                    });
                    var sFormattedText = oProjectLocation ? oProjectLocation.Ddtext : sProjectLocationCode;
                    oItem.getCells()[4].setText(sFormattedText); 
                });
            },

            handleProjectTypeFormatting: function () {
                var oProjectTypeModel = this.getView().getModel("oProjectTypeModel");
                var aProjectTypes = oProjectTypeModel ? oProjectTypeModel.getData() : [];
                var oTable = this.getView().byId("idEmployeeAllocation");
                var oItems = oTable.getItems();
            
                oItems.forEach(function (oItem) {
                    var oBindingContext = oItem.getBindingContext("oDataModel");
                    var sProjectTypeCode = oBindingContext.getProperty("ProjectType");
                    var oProjectType = aProjectTypes.find(function (item) {
                        return item.DomvalueL === sProjectTypeCode;
                    });
                    var sFormattedText = oProjectType ? oProjectType.Ddtext : sProjectTypeCode;
                    oItem.getCells()[5].setText(sFormattedText); 
                });
            },
    
              onClickofItem: function(oEvent) {
                this.oRouter.navTo("Detail",
                {
                    "Id": oEvent.getSource().getCells()[0].getText()
                });
              },
        });
    });
