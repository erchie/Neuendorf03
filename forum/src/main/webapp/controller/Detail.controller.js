sap.ui.define([
	"dhbw/mosbach/neuendorf03/forum/controller/BaseController",
	"sap/m/ListMode",
	"sap/m/MessageBox",
	"sap/ui/core/ValueState"
], function (BaseController, ListMode, MessageBox, ValueState) {
	"use strict";

	/**
	 * Detail page Controller (2nd column).
	 * Collective of functions beeing triggered by Events of the Detail page and its Dialogs.
	 * @author Eric Schuster WI16C
	 * @class dhbw.mosbach.neuendorf03.forum.controller.Detail
	 * @augments dhbw.mosbach.neuendorf03.forum.controller.BaseController
	 */
	return BaseController.extend("dhbw.mosbach.neuendorf03.forum.controller.Detail", {

		postId : "",

		 /**
		 * Initialize master page.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onInit
		 * @override
		 */
		onInit: function () {
			//init variables
			BaseController.prototype.onInit.apply(this, arguments);

			this.getOwnerComponent().getRouter().getRoute("detail").attachMatched(this._onRouteMatched, this);

			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("dhbw.mosbach.neuendorf03.forum.Master" , "setDescTitle", this._setDescTitle, this);

			var pathHelper = "dhbw.mosbach.neuendorf03.forum.fragment.";
			if (!this._editPostDialog) {
				this._editPostDialog = sap.ui.xmlfragment(this.getView().getId(), pathHelper + "EditDialog", this);
				this.getView().addDependent(this._editPostDialog);
			}

		},

		 /**
		 * Handels cleanup:
		 * Unubscripes to event bus.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onInit
		 * @override
		 */
		onExit: function () {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("dhbw.mosbach.neuendorf03.forum.Master" , "setDescTitle", this._setDescTitle, this);
		},



/* ############################ -headerbar functions- ################################## */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when column 2 fullscreen button is pressed.
		 * Extends 2nd column to fullscreen.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onFullScreenButton
		 */
		onFullScreenButton: function () {
			var oHashChanger = new sap.ui.core.routing.HashChanger(),
				sHash = oHashChanger.getHash(),
				sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/fullScreen"),
				oQuery =  {
					Path		: sHash.slice(sHash.search(/Path=/) + 5)
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
			sap.ui.getCore().getEventBus().publish("dhbw.mosbach.neuendorf03.forum.Detail", "removeSelections");
			var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.getOwnerComponent().getRouter().navTo("master", {
				layout: sNextLayout
			});
		},
		 /**
		 * Listner. Triggered when column 2 exit fullscreen button is pressed.
		 * Exits 2nd column fullscreen mode.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onExitFullScreenButton
		 */
		onExitFullScreenButton: function () {
			var oHashChanger = new sap.ui.core.routing.HashChanger(),
				sHash = oHashChanger.getHash(),
				sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/exitFullScreen"),
				oQuery =  {
					Path		: sHash.slice(sHash.search(/Path=/) + 5)
				};
			this.getOwnerComponent().getRouter().navTo("detail", {
				layout: sNextLayout,
				query: oQuery
			});
		},

		 /**
		 * Listner. Triggered when like button is pressed.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onLikeButton
		 */
		onLikeButton: function() {
			var oEntry = {};
				oEntry.Postid	= this.postId;
				oEntry.Likes 	= parseInt(this.getView().byId("idTextLikes").getText(), 10) + 1;

				this.getModel("remote").update("/PostSet(Postid='" + this.postId + "')", oEntry, {
					success: function() {
						MessageBox.success(
							this.getModel("i18n").getProperty("successLike")
						);
						this.getModel("remote").refresh();
						this.getView().byId("idTextLikes").setText(oEntry.Likes);
						this.getView().byId("idLikeButton").setVisible(false);
					}.bind(this),
					error: function() {
						MessageBox.error(
							this.getModel("i18n").getProperty("errorLike")
						);
					}.bind(this)
				});
		},


/* ############################ -Edit choice functions- ################################# */
/* ##################################################################################### */

		 /**
		 * Listner. Triggered when edit button is pressed.
		 * Opens dialog.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onEditButton
		 */
		onEditButton: function() {
			this._editPostDialog.open();
			this.getModel("baseModel").setProperty("/titleInput", this.getView().byId("detailViewPage").getTitle());
			this.getModel("baseModel").setProperty("/descInput", this.getView().byId("idTextDesc").getText());
		},

		 /**
		 * Listner. Triggered when cancel edit dialog button is pressed.
		 * Closes dialog.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onCancelButton
		 */
		onCancelButton: function() {
			this._editPostDialog.close();
			this.getModel("baseModel").setProperty("/titleInput", "");
			this.getModel("vsModel").setProperty("/postTitle", ValueState.None);
			this.getModel("baseModel").setProperty("/descInput", "");
			this.getModel("vsModel").setProperty("/postDesc", ValueState.None);
		},

		 /**
		 * Listner. Triggered when ok edit dialog button is pressed.
		 * Closes dialog.
		 * Writes to backend.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onOkButton
		 */
		onOkButton: function() {

			if (this.getModel("baseModel").getProperty("/titleInput") === "") {
				this.getModel("vsModel").setProperty("/postTitle", ValueState.Error);
			} else if (this.getModel("baseModel").getProperty("/descInput") === "") {
				this.getModel("vsModel").setProperty("/postDesc", ValueState.Error);
			} else {

				var oEntry = {};
				oEntry.Postid	= this.postId;
				oEntry.Ptitel	= this.getModel("baseModel").getProperty("/titleInput");
				oEntry.Ptext	= this.getModel("baseModel").getProperty("/descInput");
				oEntry.Pdat		= "/Date(" + Date.parse( new Date() ) + ")/";
				oEntry.Plcdat   = oEntry.Pdat;
				oEntry.Likes 	= 0;

				this.getModel("remote").update("/PostSet(Postid='" + this.postId + "')", oEntry, {
					success: function() {
						MessageBox.success(
							this.getModel("i18n").getProperty("successEdit")
						);
						this.getModel("remote").refresh();
						this.getModel("baseModel").setProperty("/titleInput", oEntry.Ptitel);
						this.getModel("baseModel").setProperty("/descInput", oEntry.Ptext);
					}.bind(this),
					error: function() {
						MessageBox.error(
							this.getModel("i18n").getProperty("errorEdit")
						);
					}.bind(this)
				});

			}

		},

/* ############################ -post functions- ##################################### */
/* ##################################################################################### */


		 /**
		 * Listner. Triggered when ok edit dialog button is pressed.
		 * Closes dialog.
		 * Writes to backend.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function onPost
		 */
		onPost: function(oEvent) {

			var oEntry = {};
			oEntry.Comid = 1; //dummy gets generated in backend
			oEntry.Postid = this.postId;
			oEntry.Userid = 1; //dummy gets generated in backend
			oEntry.Comdat = "/Date(" + Date.parse( new Date() ) + ")/";
			oEntry.Comtxt = oEvent.getSource().getProperty("value");

			this.getModel("remote").create("/PostSet", oEntry, {
				success: function() {
					MessageBox.success(
						this.getModel("i18n").getProperty("successCreateComment")
					);
					this.getModel("remote").refresh();
				}.bind(this),
				error: function() {
					MessageBox.error(
						this.getModel("i18n").getProperty("errorCreateComment")
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
		 * @function _setDescTitle
		 * @param {String} sChannel - channel name.
		 * @param {String} sEvent - event name.
		 * @param {Array} aString - Array with description and title to be set.
		 */
		_setDescTitle: function(sChannel, sEvent, aString) {
			this.getView().byId("idTextDesc").setText(aString[0]);
			this.getView().byId("detailViewPage").setTitle(aString[1]);
			this.getView().byId("idTextLikes").setText(parseInt(aString[2], 10));
		},

		 /**
		 * Listner. Triggered when the route is matched with the detail view pattern specified in the manifest.
		 * Manages visibility.
		 * Manages bindings.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
		 * @function _onRouteMatched
		 * @param {sap.ui.base.Event} oEvent - Event Object of the press action, provided by the framework.
		 */
		_onRouteMatched: function (oEvent) {

			var sPath = oEvent.getParameter("arguments")["?query"].Path,
				oList = this.getView().byId("idCommentsList"),
				template = new sap.m.FeedListItem({
					sender		: '{remote>Userid}',
					timestamp	: '{= ${remote>Comdat}.toDateString() }',
					text		: '{remote>Comtxt}'
				});


			this.surveyId = sPath.replace("')", "").replace("PostSet('", "");
			//close detail column if called via bookmark @todo bookmarkable
			if (this.getView().byId("idTextDesc").getText() == "" || this.surveyId == "") {
				this.onColumnCloseButton();
			}

			//bind List from association
			oList.bindItems( "remote>/" + sPath  + "/COMMENTSSet" , template);


			//manage visibity
			this.getModel("remote").read( "/" + sPath + "/LIKESet", {
				success: function(oRetrievedResult) {
					if ( oRetrievedResult.results.length > 0 ) {
						this.getView().byId("idLikeButton").setVisible(false);
					} else {
						this.getView().byId("idLikeButton").setVisible(true);
					}
				}.bind(this),
				error: function(oError) {
					this.getView().byId("idLikeButton").setVisible(false);
					MessageBox.error(
						this.getModel("i18n").getProperty("errorCheckLike")
					);
				}.bind(this)
			});


		},

		 /**
		 * Helper funktion.
		 * Manages visibility.
		 * @author Eric Schuster WI16C
		 * @memberof dhbw.mosbach.neuendorf03.forum.controller.Detail
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