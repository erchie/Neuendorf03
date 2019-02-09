sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
	"sap/ui/core/ValueState"
], function (JSONModel, UIComponent, Device, FlexibleColumnLayoutSemanticHelper, ValueState) {
	"use strict";

	/**
	 * Service Controller.
	 * Collective of functions used for navigation.
	 * Initializes all local data models.
	 * @class dhbw.mosbach.neuendorf03.forum.Component
	 * @augments sap.ui.core.UIComponent
	 */
	var Component =  UIComponent.extend("dhbw.mosbach.neuendorf03.forum.Component", {

		metadata : {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.forum.Component
		 * @override
		 */
		init : function () {
			var oBaseModel = new JSONModel({
				newPostCat		: undefined,
				surveyPath		: "",
				titleInput 		: "",
				descInput		: "",
				endDatePicker	: undefined,
				multichoice		: false,
				newChoice		: ""
			});
			this.setModel(oBaseModel, "baseModel");

			var oVsModel = new JSONModel({
				postCat 		: ValueState.None,
				postDesc		: ValueState.None,
				postTitle		: ValueState.None
			});
			this.setModel(oVsModel, "vsModel");

			var oChoicesListModel = new JSONModel({

				"Choices" : []

			});
			this.setModel(oChoicesListModel, "choicesListModel");



			//needed for routing and navigation DONT TOUCH
			var oRouterModel = new JSONModel();
			this.setModel(oRouterModel);

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @memberof dhbw.mosbach.neuendorf03.forum.Component
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		createContent: function () {
			return sap.ui.view({
				viewName: "dhbw.mosbach.neuendorf03.forum.view.FlexColLayout",
				type: "XML"
			});
		},

		/**
		 * Returns an instance of the semantic helper
		 * @memberof dhbw.mosbach.neuendorf03.forum.Component
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = jQuery.sap.getUriParameters(),
				oSettings = {
					defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsEndExpanded,
					mode: oParams.get("mode"),
					initialColumnsCount: oParams.get("initial"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}

	});
	return Component;
}, true);
