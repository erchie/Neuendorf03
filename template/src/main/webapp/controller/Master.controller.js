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
		},


		 /**
		 * Listner. Triggered when test button is pressed.
		 * Opens detail column.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.Master
		 * @function onTest
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		onTest: function (oEvent) {
			var	oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);

			//Nav to next page/opens 2nd column
			this.getOwnerComponent().getRouter().navTo("detail", {
				layout: oNextUIState.layout
			});
		}


	});
}, true);
