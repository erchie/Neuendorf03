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



/* ############################ -Footerbar functions- ################################## */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when save post button is pressed.
		 * Checks inputs
		 * If ok:
		 * Sends create to backend.
		 * Closes mid column.
		 * Resets form.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function onSaveNewPost
		 */
		onSaveNewPost: function() {

			var bOk = true;
			if ( this.getModel("baseModel").getProperty("/titleInput") === "" ) {
				this.getModel("vsModel").setProperty("/postTitle", ValueState.Error);
				bOk = false;
			}
			if ( this.getModel("baseModel").getProperty("/descInput") === "" ) {
				this.getModel("vsModel").setProperty("/postDesc", ValueState.Error);
				bOk = false;
			}

			if (bOk){

				this._createPost();

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
			this.getModel("baseModel").setProperty("/newPostCat", undefined);
			this.getModel("vsModel").setProperty("/newPostCat", ValueState.None);
			this.getModel("vsModel").setProperty("/postDesc", ValueState.None);
			this.getModel("vsModel").setProperty("/postTitle", ValueState.None);

		},


		 /**
		 * Helper function for creating posts.
		 * Attempts to write posts into backend.
		 * Displays error/success message.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.New
		 * @function _createPost
		 */
		_createPost: function() {
			var oEntry = {};



			oEntry.Postid	= "0"; //dummy value id is calculated in backend
			oEntry.Ptitel	= this.getModel("baseModel").getProperty("/titleInput");
			oEntry.Ptext	= this.getModel("baseModel").getProperty("/descInput");
			oEntry.Catid	= this.getView().byId("idSelect").getSelectedItem().getKey();
			oEntry.Pdat		= "/Date(" + Date.parse( new Date() ) + ")/";
			oEntry.Plcdat   = oEntry.Pdat;
			oEntry.Likes 	= "0";

			this.getModel("remote").create("/PostSet", oEntry, {
				success: function() {
					MessageBox.success(
						this.getModel("i18n").getProperty("sentCreatePost")
					);
				}.bind(this),
				error: function() {
					MessageBox.error(
						this.getModel("i18n").getProperty("errorCreatePost")
					);
				}.bind(this)
			});


		}


	});
}, true);