sap.ui.define([
	"dhbw/mosbach/neuendorf03/create-survey/controller/BaseController",
	"sap/m/ListMode",
	"sap/m/MessageBox",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/data/DimensionDefinition",
	"sap/viz/ui5/data/MeasureDefinition"
], function (BaseController, ListMode, MessageBox, FlattenedDataset) {
	"use strict";

	/**
	 * Detail page Controller (2nd column).
	 * Collective of functions beeing triggered by Events of the Detail page and its Dialogs.
	 * @author Eric Schuster WI16C
	 * @class dhbw.mosbach.neuendorf03.create-survey.controller.Detail
	 * @augments dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
	 */
	return BaseController.extend("dhbw.mosbach.neuendorf03.create-survey.controller.Detail", {

		 /**
		 * Initialize master page.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function onInit
		 * @override
		 */
		onInit: function () {
			//init variables
			BaseController.prototype.onInit.apply(this, arguments);

			this.getOwnerComponent().getRouter().getRoute("detail").attachMatched(this._onRouteMatched, this);

			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("dhbw.mosbach.neuendorf03.create-survey.Master" , "setDesc", this._setDesc, this);


			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: this.getModel("i18n").getProperty("pieChartTitle")
				},
				plotArea: {
					dataLabel: {
						visible: true
					}
				}
            });

		},

		 /**
		 * Handels cleanup:
		 * Unubscripes to event bus.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function onInit
		 * @override
		 */
		onExit: function () {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("dhbw.mosbach.neuendorf03.create-survey.Master" , "setDesc", this._setDesc, this);
		},



/* ############################ -headerbar functions- ################################## */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when column 2 fullscreen button is pressed.
		 * Extends 2nd column to fullscreen.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function onFullScreenButton
		 */
		onFullScreenButton: function () {
			var sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getOwnerComponent().getRouter().navTo("detail", {
				layout: sNextLayout
			});
		},
		 /**
		 * Listner. Triggered when close 2nd column button is pressed.
		 * Extends 1st column to fullscreen.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof wui.fre.ui5.bedarfsschein-cockpit.controller.Detail
		 * @function onColumnCloseButton
		 */
		onColumnCloseButton: function () {
			sap.ui.getCore().getEventBus().publish("dhbw.mosbach.neuendorf03.create-survey.Detail", "removeSelections");
			var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.getOwnerComponent().getRouter().navTo("master", {
				layout: sNextLayout
			});
		},
		 /**
		 * Listner. Triggered when column 2 exit fullscreen button is pressed.
		 * Exits 2nd column fullscreen mode.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function onExitFullScreenButton
		 */
		onExitFullScreenButton: function () {
			var sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.getOwnerComponent().getRouter().navTo("detail", {
				layout: sNextLayout
			});
		},


/* ############################ -helper functions- ##################################### */
/* ##################################################################################### */

		_setDesc: function(sChannel, sEvent, sDesc) {
			this.getView().byId("idTextDesc").setText(sDesc);
		},


		_onRouteMatched: function (oEvent) {

			//close detail column if called via bookmark @todo bookmarkable
			if (this.getView().byId("idTextDesc").getText() == "") {
				this.onColumnCloseButton();
			}

			//bind List from association
			var bHasVoted, oCustDataSet,
				sPath = oEvent.getParameter("arguments")["?query"].Path,
				oList = this.getView().byId("idChooseChoicesList"),
				template = new sap.m.StandardListItem({
					title	: '{remote>Choicetxt}',
					info 	: '{remote>Votes}',
					type	: "Active"
				});
			oList.bindItems( "remote>/" + sPath  + "/ChoiceSet" , template);
			//set list select mode
			if ( oEvent.getParameter("arguments")["?query"].MultiSelect === "true" ) {
				oList.setMode(ListMode.MultiSelect);
			} else {
				oList.setMode(ListMode.SingleSelect);
			}

			//bind Pie chart from association
			oCustDataSet = new FlattenedDataset( {

				dimensions: [{
					name: "Choice",
					value: "{remote>Choicetxt}"
				}],

				measures: [{

					name: "Votes",
					value: "{remote>Votes}"
				}],

				data: {

					path: "/" + sPath + "/ChoiceSet"

				}

			});

			this.getView().byId("idVizFrame").setDataset(oCustDataSet);
			this.getView().byId("idVizFrame").setModel(this.getModel("remote"));

			//manage visibity
			this.getModel("remote").read( "/" + sPath + "/VotedSet", {
				success: function(oRetrievedResult) {
					if ( oRetrievedResult.results.length > 0 ) {
						bHasVoted = true;
					} else {
						bHasVoted = false;
					}
					if ( this.getModel("roleModel").getProperty("/isAdm") ) {
						oList.setVisible(false);
						this.getView().byId("idVizFrame").setVisible(true);
					} else {
						oList.setVisible(!bHasVoted);
						this.getView().byId("idVizFrame").setVisible(bHasVoted);
					}
					}.bind(this),
				error: function(oError) {
					oList.setVisible(false);
					this.getView().byId("idVizFrame").setVisible(false);
					MessageBox.error(
						this.getModel("i18n").getProperty("errorCheckVoted")
					);
				 }
			});






		}

	});
}, true);