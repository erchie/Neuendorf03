sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	/**
	 * Service Controller.
	 * Collective of functions used for navigation.
	 * @class dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout
	 * @augments sap.ui.core.mvc.Controller
	 */
	return Controller.extend("dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout", {

		 /**
		 * Initialize layout page.
		 * Sets all needed routing configuration.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout
		 * @function onInit
		 * @override
		 */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		},

		 /**
		 * Listner. Triggered before a route is matched.
		 * Defines next layout state.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout
		 * @function onBeforeRouteMatched
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		onBeforeRouteMatched: function(oEvent) {

			var oModel = this.getOwnerComponent().getModel();

			var sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			// Update the layout of the FlexibleColumnLayout
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
			}
		},

		 /**
		 * Listner. Triggered when a route is matched.
		 * Triggers UI elements update.
		 * Stores route name globaly.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout
		 * @function onRouteMatched
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");

			this._updateUIElements();

			// Save the current route name
			this.currentRouteName = sRouteName;
		},
		 /**
		 * ! Query needs to be added to standard to sustain bookmarkable navigation.
		 * Listner. Triggered when state changes.
		 * Triggers UI elements update.
		 * Triggers navigation.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout
		 * @function onStateChanged
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout"),
				oQuery = this.getOwnerComponent().getModel("baseModel").getProperty("/oQuery");

			this._updateUIElements();

			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				if ( oQuery !== undefined ) {
					this.oRouter.navTo(this.currentRouteName, {layout: sLayout, query: oQuery}, true);
				} else {
					this.oRouter.navTo(this.currentRouteName, {layout: sLayout}, true);
				}
			}
		},

		 /**
		 * Helper function.
		 * Updates the close/fullscreen buttons visibility.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout
		 * @function _updateUIElements
		 */
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState);
		},

		/**
		 * Listner.
		 * Detaches routes.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.FlexColLayout
		 * @function onExit
		 */
		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
}, true);
