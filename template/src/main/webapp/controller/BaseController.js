sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"dhbw/mosbach/neuendorf03/create-survey/model/formatter"
], function (Controller, formatter) {
	"use strict";

	 /**
	 * Service Controller.
	 * Collective of functions used in multiple controllers.
	 * @class dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
	 * @augments sap.ui.core.mvc.Controller
	 */
	return Controller.extend("dhbw.mosbach.neuendorf03.create-survey.controller.BaseController", {

		/**
		 * Make the (static) formatters available in all sub-controllers
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
		 */
		formatter: formatter,

		 /**
		 * Initialize all pages page.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
		 * @function onInit
		 * @override
		 */
		onInit: function () {
		},



		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		// getRouter : function () {
		// 	return sap.ui.core.UIComponent.getRouterFor(this);
		// },

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		}

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		// setModel : function (oModel, sName) {
		// 	return this.getView().setModel(oModel, sName);
		// },

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		// getResourceBundle : function () {
		// 	return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		// },

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.create-survey.controller.BaseController
		 */
		// onNavBack : function() {
		// 	var sPreviousHash = History.getInstance().getPreviousHash(),
		// 		oCrossAppNavigator = sap.ushell ? sap.ushell.Container.getService("CrossApplicationNavigation") : null;

		// 	if (sPreviousHash !== undefined || (oCrossAppNavigator && !oCrossAppNavigator.isInitialNavigation()) ) {
		// 		history.go(-1);
		// 	} else if (oCrossAppNavigator) {
		// 		oCrossAppNavigator.toExternal({
		// 			target: {shellHash: "#Shell-home"}
		// 		});
		// 	} else {
		// 		this.getRouter().navTo("home");
		// 	}
		// }
	});

});
