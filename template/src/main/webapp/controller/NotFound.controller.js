sap.ui.define([
	"dhbw/mosbach/neuendorf03/create-survey/controller/BaseController"
], function (BaseController) {
	"use strict";

	 /**
	 * Not found page Controller.
	 * @author Eric Schuster WI16C
	 * @class dhbw.mosbach.neuendorf03.create-survey.controller.NotFound
	 * @augments dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
	 */
	return BaseController.extend("dhbw.mosbach.neuendorf03.create-survey.controller.NotFound", {

		 /**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.NotFound
		 */
		onLinkPressed : function () {
			this.getOwnerComponent().getRouter().navTo("home");
		}

	});

});
