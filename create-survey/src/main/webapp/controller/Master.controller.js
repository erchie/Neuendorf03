sap.ui.define([
	"dhbw/mosbach/neuendorf03/create-survey/controller/BaseController"
], function (BaseController) {
	"use strict";

	 /**
	 * Master page Controller (1st column).
	 * Collective of functions beeing triggered by Events of the Master page and its Dialogs.
	 * @author Eric Schuster WI16C
	 * @class dhbw.mosbach.neuendorf03.create-survey.controller.Master
	 * @augments dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
	 */
	return BaseController.extend("dhbw.mosbach.neuendorf03.create-survey.controller.Master", {

		 /**
		 * Initialize master page.
		 * Sets all needed Dialogs, Filters, Sorter and other frequently used variables.
		 * Subscripes to event bus.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Master
		 * @function onInit
		 * @override
		 */
		onInit: function () {
			BaseController.prototype.onInit.apply(this, arguments);

			//register functions on event bus
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("dhbw.mosbach.neuendorf03.create-survey.Detail" , "removeSelections", this._removeSelections, this);

		},

		 /**
		 * Handels cleanup:
		 * Unubscripes to event bus.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Master
		 * @function onInit
		 * @override
		 */
		onExit: function () {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("dhbw.mosbach.neuendorf03.create-survey.Detail" , "removeSelections", this._removeSelections, this);
		},


		 /**
		 * Listner. Triggered when a item of the master list is pressed.
		 * Opens detail page in mid column.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Master
		 * @function onMasterList
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		onMasterList: function (oEvent) {
			var	oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				oQuery =  {
				Path		: oEvent.getSource().getBindingContextPath().substring(1),
				MultiSelect	: oEvent.getSource().getBindingContext("remote").getObject().Multichoice
			};

			//Nav to next page/opens 2nd column
			this.getOwnerComponent().getRouter().navTo("detail", {
				layout: oNextUIState.layout,
				query: oQuery
			});

			sap.ui.getCore().getEventBus().publish(
				"dhbw.mosbach.neuendorf03.create-survey.Master",
				"setDesc",
				oEvent.getSource().getBindingContext("remote").getObject().Description
			);
		},

		 /**
		 * Listner. Triggered when new survey button is pressed.
		 * Opens form for new survey in mid column column.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Master
		 * @function onNewSurveyButton
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		onNewSurveyButton: function (oEvent) {
			var	oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);

			//Nav to next page/opens 2nd column
			this.getOwnerComponent().getRouter().navTo("new", {
				layout: oNextUIState.layout
			});
		},

/* ########################### helper funtions ##################################################### */
/* ################################################################################################# */

		 /**
		 * Resets selection of master list.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Master
		 * @function _removeSelections
		 */
		_removeSelections: function() {
			this.getView().byId("idMasterList").removeSelections(true);
		}

	});
}, true);
