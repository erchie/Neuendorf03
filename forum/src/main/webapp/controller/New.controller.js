sap.ui.define([
	"dhbw/mosbach/neuendorf03/forum/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/ValueState"
], function (BaseController, MessageBox, ValueState) {
	"use strict";

	/**
	 * Detail page Controller (2nd column).
	 * Collective of functions beeing triggered by Events of the Detail page and its Dialogs.
	 * @author Eric Schuster WI16C
	 * @class dhbw.mosbach.neuendorf03.forum.controller.New
	 * @augments dhbw.mosbach.neuendorf03.forum.controller.BaseController
	 */
	return BaseController.extend("dhbw.mosbach.neuendorf03.forum.controller.New", {

		 /**
		 * Initialize master page.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onInit
		 * @override
		 */
		onInit: function () {
			//init variables
			BaseController.prototype.onInit.apply(this, arguments);

			//init Dialogs
			var pathHelper = "dhbw.mosbach.neuendorf03.forum.fragment.";
			if (!this._oAddChoiceDialog) {
				this._oAddChoiceDialog = sap.ui.xmlfragment(this.getView().getId(), pathHelper + "AddChoice", this);
				this.getView().addDependent(this._oAddChoiceDialog);
			}

		},


/* ############################ -Headerbar functions- ################################## */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when column 2 fullscreen button is pressed.
		 * Extends 2nd column to fullscreen.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onFullScreenButton
		 */
		onFullScreenButton: function () {
			var sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getOwnerComponent().getRouter().navTo("new", {
				layout: sNextLayout
			});
		},
		 /**
		 * Listner. Triggered when close 2nd column button is pressed.
		 * Extends 1st column to fullscreen.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof wui.fre.ui5.bedarfsschein-cockpit.controller.New
		 * @function onColumnCloseButton
		 */
		onColumnCloseButton: function () {
			sap.ui.getCore().getEventBus().publish("dhbw.mosbach.neuendorf03.forum.Detail", "removeSelections");
			var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.getOwnerComponent().getRouter().navTo("master", {
				layout: sNextLayout
			});
			this._reset();
		},
		 /**
		 * Listner. Triggered when column 2 exit fullscreen button is pressed.
		 * Exits 2nd column fullscreen mode.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onExitFullScreenButton
		 */
		onExitFullScreenButton: function () {
			var sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.getOwnerComponent().getRouter().navTo("new", {
				layout: sNextLayout
			});
		},

/* ############################ -Add choice functions- ################################# */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when add chpice button is pressed.
		 * Opens dialog.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onAddChoice
		 */
		onAddChoice: function() {
			this._oAddChoiceDialog.open();
		},

		 /**
		 * Listner. Triggered when cancel add choice dialog button is pressed.
		 * Closes dialog.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onCancelButton
		 */
		onCancelButton: function() {
			this._oAddChoiceDialog.close();
			this.getModel("baseModel").setProperty("/newChoice", "");
			this.getModel("vsModel").setProperty("/newChoice", ValueState.None);
		},

		 /**
		 * Listner. Triggered when ok add choice dialog button is pressed.
		 * Closes dialog.
		 * Adds line to table.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onOkButton
		 */
		onOkButton: function() {

			if (this.getModel("baseModel").getProperty("/newChoice") === "") {
				this.getModel("vsModel").setProperty("/newChoice", ValueState.Error);
			} else {
				var oData = this.getModel("choicesListModel").getData();
				oData.Choices[oData.Choices.length] = {"Name":this.getModel("baseModel").getProperty("/newChoice")};
				this.getModel("choicesListModel").setData(oData);
				this._oAddChoiceDialog.close();
				this.getModel("baseModel").setProperty("/newChoice", "");
				this.getModel("vsModel").setProperty("/newChoice", ValueState.None);

			}

		},


/* ############################ -Footerbar functions- ################################## */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when save survey button is pressed.
		 * Checks inputs
		 * If ok:
		 * Sends create to backend.
		 * Closes mid column.
		 * Resets form and table.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onOkButton
		 */
		onSaveNewSurvey: function() {

			var bOk = true;
			if ( this.getModel("baseModel").getProperty("/titleInput") === "" ) {
				this.getModel("vsModel").setProperty("/surveyTitle", ValueState.Error);
				bOk = false;
			}
			if ( this.getModel("baseModel").getProperty("/descInput") === "" ) {
				this.getModel("vsModel").setProperty("/surveyDesc", ValueState.Error);
				bOk = false;
			}
			if ( this.getModel("baseModel").getProperty("/endDatePicker") === undefined ) {
				this.getModel("vsModel").setProperty("/surveyEndDate", ValueState.Error);
				bOk = false;
			}
			if ( this.getModel("choicesListModel").getData().Choices.length < 2 ) {
				MessageBox.error(
					this.getModel("i18n").getProperty("errorBoxChoicesList")
				);
				bOk = false;
			}

			if (bOk){

				this._createSurvey();

			}


		},



/* ############################ -Helper functions- ##################################### */
/* ##################################################################################### */


		 /**
		 * Helper function.
		 * Resets form.
		 * Resets table.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function _resetForm
		 */
		_reset: function() {

			this.getModel("baseModel").setProperty("/titleInput", "");
			this.getModel("baseModel").setProperty("/descInput", "");
			this.getModel("baseModel").setProperty("/endDatePicker", undefined);
			this.getModel("baseModel").setProperty("/multichoice", false);
			this.getModel("vsModel").setProperty("/surveyEndDate", ValueState.None);
			this.getModel("vsModel").setProperty("/surveyDesc", ValueState.None);
			this.getModel("vsModel").setProperty("/surveyTitle", ValueState.None);
			var oData = this.getModel("choicesListModel").getData();
			oData.Choices = [];
			this.getModel("choicesListModel").setData(oData);

		},


		 /**
		 * Helper function for creating surveys.
		 * Attempts to write surveys into backend.
		 * Displays error/success message.
		 * @todo change to deep insert, associtations in backend, to be tested.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function _createSurvey
		 */
		_createSurvey: function() {
			var oEntry = {}, oItems, mParameters, aDeferredGroup;

			this.getModel("remote").read("/SurveySet/$count", {
				success: function (sCount) {

					//set batch id to group all creates of one survey
					aDeferredGroup = this.getModel("remote").getDeferredGroups();
					aDeferredGroup.push("batchCreate");
					this.getModel("remote").setDeferredGroups(aDeferredGroup);
					mParameters = { groupId:"batchCreate" };
					oEntry.Id = (parseInt( sCount, 10 )  + 1).toString();
					oEntry.Name = this.getModel("baseModel").getProperty("/titleInput");
					oEntry.Description = this.getModel("baseModel").getProperty("/descInput");
					oEntry.Multichoice = this.getModel("baseModel").getProperty("/multichoice");
					oEntry.Enddat = "/Date(" + Date.parse(this.getView().byId("idEndDatePicker").getDateValue()) + ")/";

					this.getModel("remote").create("/SurveySet", oEntry, mParameters);

					oItems = this.getView().byId("idChoicesList").getItems();

					for (var i = 0; i < oItems.length; i++) {

						oEntry = {};

						oEntry.Choiceid = (i + 1).toString();
						oEntry.Surveyid = (parseInt( sCount, 10 )  + 1).toString();
						oEntry.Votes = 0;
						oEntry.Choicetxt = oItems[i].getTitle();
						this.getModel("remote").create("/ChoiceSet", oEntry, mParameters);
					}

					//fire batch
					this.getModel("remote").submitChanges({
						groupId: "batchCreate",
						success: function() {
							MessageBox.success(
								this.getModel("i18n").getProperty("sentCreateSurvey")
							);
						}.bind(this),
						error: function() {
							MessageBox.error(
								this.getModel("i18n").getProperty("errorCreateSurvey")
							);
						}.bind(this)
					});



				}.bind(this),
				error: function() {
					MessageBox.error(
						this.getModel("i18n").getProperty("errorCountSurvey")
					);
				}.bind(this)
			});

		}


	});
}, true);