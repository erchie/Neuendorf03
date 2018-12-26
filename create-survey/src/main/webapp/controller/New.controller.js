sap.ui.define([
	"dhbw/mosbach/neuendorf03/create-survey/controller/BaseController"
], function (BaseController) {
	"use strict";

	/**
	 * Detail page Controller (2nd column).
	 * Collective of functions beeing triggered by Events of the Detail page and its Dialogs.
	 * @author Eric Schuster WI16C
	 * @class dhbw.mosbach.neuendorf03.create-survey.controller.New
	 * @augments dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
	 */
	return BaseController.extend("dhbw.mosbach.neuendorf03.create-survey.controller.New", {

		 /**
		 * Initialize master page.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.New
		 * @function onInit
		 * @override
		 */
		onInit: function () {
			//init variables
			BaseController.prototype.onInit.apply(this, arguments);

		},


/* ############################ -headerbar functions- ################################## */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when column 2 fullscreen button is pressed.
		 * Extends 2nd column to fullscreen.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.New
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
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.New
		 * @function onExitFullScreenButton
		 */
		onExitFullScreenButton: function () {
			var sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.getOwnerComponent().getRouter().navTo("new", {
				layout: sNextLayout
			});
		}

	});
}, true);