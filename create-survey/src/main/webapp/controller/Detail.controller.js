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

		surveyId : "",

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
				},
				interaction: {
					selectability: {
						mode: "EXCLUSIVE"
					}
				}
			});

			sap.viz.ui5.api.env.Format.numericFormatter(sap.viz.ui5.format.ChartFormatter.getInstance());
			var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(sap.viz.ui5.format.ChartFormatter.DefaultPattern.STANDARDFLOAT);

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
			var oHashChanger = new sap.ui.core.routing.HashChanger(),
				sHash = oHashChanger.getHash(),
				sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/fullScreen"),
				oQuery =  {
					Path		: sHash.slice(sHash.search(/Path=/) + 5,sHash.search(/\&MultiSelect/)),
					MultiSelect	: sHash.slice(sHash.search(/MultiSelect=/) + 12)
				};

			this.getOwnerComponent().getRouter().navTo("detail", {
				layout: sNextLayout,
				query: oQuery
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
			var oHashChanger = new sap.ui.core.routing.HashChanger(),
				sHash = oHashChanger.getHash(),
				sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/exitFullScreen"),
				oQuery =  {
					Path		: sHash.slice(sHash.search(/Path=/) + 5,sHash.search(/\&MultiSelect/)),
					MultiSelect	: sHash.slice(sHash.search(/MultiSelect=/) + 12)
				};
			this.getOwnerComponent().getRouter().navTo("detail", {
				layout: sNextLayout,
				query: oQuery
			});
		},

/* ############################ -voting functions- ##################################### */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when a item of the coices list is pressed.
		 * Triggers selection.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function onCoicesList
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		onCoicesList: function (oEvent) {
			this.getView().byId("idChooseChoicesList").setSelectedItem(oEvent.getSource(), !oEvent.getSource().getSelected());
		},

		 /**
		 * Listner. Triggered when Close button is pressed.
		 * Closes survey.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function onCloseSurvey
		 */
		onCloseSurvey: function () {
			var oEntry = {},
				oHashChanger = new sap.ui.core.routing.HashChanger(),
				sHash = oHashChanger.getHash(),
				sSurveyId = sHash.slice(sHash.search(/\('/) + 2,sHash.search(/'\)/));

			this.getModel("remote").read( "/SurveySet('" + sSurveyId + "')", {
				success: function(oRetrievedResult) {
					oEntry.Id = oRetrievedResult.Id;
					oEntry.Name = oRetrievedResult.Name;
					oEntry.Description = oRetrievedResult.Description;
					oEntry.Multichoice = oRetrievedResult.Multichoice;
					oEntry.Enddat = "/Date(" + Date.parse( new Date() ) + ")/";
					this.getModel("remote").update("/SurveySet(Id='" +
						oEntry.Id + "')", oEntry, {
						success: function() {
							MessageBox.success(
								this.getModel("i18n").getProperty("successClose")
							);
							this.onColumnCloseButton();
							this.getModel("remote").refresh();
						}.bind(this),
						error: function() {
							MessageBox.error(
								this.getModel("i18n").getProperty("errorClose")
							);
						}.bind(this)
					});
				}.bind(this),
				error: function(oError) {
					MessageBox.error(
						this.getModel("i18n").getProperty("errorClose")
					);
				}.bind(this)
			});
		},

		 /**
		 * Listner. Triggered when save button is pressed.
		 * Checks for selection.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function onSaveChoices
		 */
		onSaveChoices: function () {
			if ( this.getView().byId("idChooseChoicesList").getSelectedItems().length < 1 ) {
				MessageBox.error(
					this.getModel("i18n").getProperty("atLeastOne")
				);
				return;
			}
			var mParameters, aDeferredGroup, oEntry = {}, aItems;
			//set batch id to group all creates of one survey
			aDeferredGroup = this.getModel("remote").getDeferredGroups();
			aDeferredGroup.push("batchCreate");
			this.getModel("remote").setDeferredGroups(aDeferredGroup);
			mParameters = { groupId:"batchCreate" };




			aItems = this.getView().byId("idChooseChoicesList").getSelectedItems();
			for ( var i = 0; i < aItems.length; i++ ) {
				oEntry = {};
				oEntry = aItems[i].getBindingContext("remote").getObject();
				this.getModel("remote").update("/ChoiceSet(Choiceid='" +
				oEntry.Choiceid + "',Surveyid='" +
				oEntry.Surveyid + "')", oEntry, mParameters);
			}

			oEntry = {};
			oEntry.Userid	= "dummy";
			oEntry.Surveyid	= this.surveyId;
			this.getModel("remote").create("/VotedSet", oEntry, mParameters);

			//fire batch
			this.getModel("remote").submitChanges({
				groupId: "batchCreate",
				success: function() {
					MessageBox.success(
						this.getModel("i18n").getProperty("successVote")
					);
					this._manageVis(true);
					this.getModel("remote").refresh();
				}.bind(this),
				error: function() {
					MessageBox.error(
						this.getModel("i18n").getProperty("errorVote")
					);
				}.bind(this)
			});

		},


/* ############################ -helper functions- ##################################### */
/* ##################################################################################### */

		 /**
		 * Event.
		 * Triggered via even bus.
		 * Sets description.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof wui.fre.ui5.bedarfsschein-cockpit.controller.Detail
		 * @function _setDesc
		 * @param {String} sChannel - channel name.
		 * @param {String} sEvent - event name.
		 * @param {String} sDesc - Description to be set.
		 */
		_setDesc: function(sChannel, sEvent, sDesc) {
			this.getView().byId("idTextDesc").setText(sDesc);
		},

		 /**
		 * Listner. Triggered when the route is matched with the detail view pattern specified in the manifest.
		 * Manages visibility.
		 * Manages bindings.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function _onRouteMatched
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		_onRouteMatched: function (oEvent) {

			var bHasVoted, oCustDataSet,
				sPath = oEvent.getParameter("arguments")["?query"].Path,
				oList = this.getView().byId("idChooseChoicesList"),
				template = new sap.m.StandardListItem({
					press	: [this.onCoicesList, this],
					title	: '{remote>Choicetxt}',
					type	: "Active"
				});

			this.surveyId = sPath.replace("')", "").replace("SurveySet('", "");
			//close detail column if called via bookmark @todo bookmarkable
			if (this.getView().byId("idTextDesc").getText() == "" || this.surveyId == "") {
				this.onColumnCloseButton();
			}

			//bind List from association
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
					this._manageVis(bHasVoted);
				}.bind(this),
				error: function(oError) {
					oList.setVisible(false);
					this.getView().byId("idSaveButton").setVisible(false);
					this.getView().byId("idCloseButton").setVisible(false);
					this.getView().byId("idVizFrame").setVisible(false);
					MessageBox.error(
						this.getModel("i18n").getProperty("errorCheckVoted")
					);
				}.bind(this)
			});

		},

		 /**
		 * Helper funktion.
		 * Manages visibility.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Detail
		 * @function _manageVis
		 * @param {Boolean} bHasVoted - Event Object of the press action, provided by the framework.
		 */
		_manageVis: function (bHasVoted) {

			if ( this.getModel("roleModel").getProperty("/bIsAdm") ) {
				this.getView().byId("idChooseChoicesList").setVisible(false);
				this.getView().byId("idSaveButton").setVisible(false);
				this.getView().byId("idCloseButton").setVisible(true);
				this.getView().byId("idVizFrame").setVisible(true);
			} else {
				this.getView().byId("idChooseChoicesList").setVisible(!bHasVoted);
				this.getView().byId("idSaveButton").setVisible(!bHasVoted);
				this.getView().byId("idCloseButton").setVisible(false);
				this.getView().byId("idVizFrame").setVisible(bHasVoted);
			}

		}


	});
}, true);