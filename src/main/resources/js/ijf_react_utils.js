'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//manual imports
var MuiTextField = window['material-ui']["TextField"];
var MuiThemeProvider = window['material-ui']["MuiThemeProvider"];
var MuiButton = window['material-ui']["Button"];

var Icon = window['material-ui']['Icon'];
var IconButton = window['material-ui']['IconButton'];
var Card = window['material-ui']['Card'];
var CardActions = window['material-ui']['CardActions'];
var CardContent = window['material-ui']['CardContent'];
var CardHeader = window['material-ui']['CardHeader'];

var Typography = window['material-ui']['Typography'];
var withStyles = window['material-ui']['withStyles'];
var withTheme = window['material-ui']['withTheme'];
var Menu = window['material-ui']['Menu'];
var MenuItem = window['material-ui']['MenuItem'];
var Drawer = window['material-ui']['Drawer'];
var Divider = window['material-ui']['Divider'];
var List = window['material-ui']['List'];
var ListItem = window['material-ui']['ListItem'];
var ListItemIcon = window['material-ui']['ListItemIcon'];
var ListItemText = window['material-ui']['ListItemText'];

var MuiSelect = window['material-ui']['Select'];
var MuiInputLabel = window['material-ui']['InputLabel'];
var MuiFormControl = window['material-ui']['FormControl'];
var MuiFormHelperText = window['material-ui']['FormHelperText'];
var MuiInput = window['material-ui']['Input'];

var MuiRadio = window['material-ui']['Radio'];
var MuiRadioGroup = window['material-ui']['RadioGroup'];
var MuiFormControlLabel = window['material-ui']['FormControlLabel'];

var MuiPaper = window['material-ui']['Paper'];
var MuiTable = window['material-ui']['Table'];
var MuiTableBody = window['material-ui']['TableBody'];
var MuiTableCell = window['material-ui']['TableCell'];
var MuiTableHead = window['material-ui']['TableHead'];
var MuiTableRow = window['material-ui']['TableRow'];

var ijf = ijf || {};
ijf.reactUtils = {
	renderTextbox: function renderTextbox(inFormKey, item, inField, inContainer) {

		inContainer.title = inField.toolTip;
		var lAllowBlank = true;
		//adding concept of session vars.
		if (inField.dataSource == "session") {
			var data = ijf.session[inFormKey + '_fld_' + inField.formCell];
			if (!data && inField.style.indexOf('query:true') < 0) data = inField.dataReference2;
		} else {
			var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
			var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
			var jf = item.fields[jfFieldDef.id];

			if (inField.dataReference == "html") {
				var data = ijfUtils.handleJiraFieldType(jfFieldDef, jf, false, true);
			} else {
				var data = ijfUtils.handleJiraFieldType(jfFieldDef, jf);
			}

			if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = jfFieldMeta.required ? false : true;
		}

		if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle, 'required') == "true") lAllowBlank = false;

		var lMaxsize = Number.MAX_VALUE;

		var hideField = ijfUtils.renderIfShowField(data, inField);
		var hideLabel = false;
		if (inField.caption == "") var lCaption = inField.dataSource;else if (inField.caption == "none") {
			var lCaption = "";
			hideLabel = true;
		} else var lCaption = inField.caption;
		if (inField.style.indexOf('hidden:true') > -1) {
			hideLabel = true;
			hideField = true;
		}
		var rOnly = false;
		if (inField.fieldStyle.indexOf('readonly:true') > -1) {
			rOnly = true;
		}
		if (inField.style.indexOf('enteronce:true') > -1) {
			if (!!data) rOnly = true;
		}

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}
		//console.log(JSON.stringify(perms));
		if (!rOnly && !perms.canEdit) rOnly = true;
		if (!hideField && !perms.canSee) hideField = true;
		//end permissions


		var ocf = ijfUtils.getEvent(inField);

		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var panelStyle = JSON.parse(inField.panelStyle);
		} catch (e) {
			var panelStyle = {};
		}
		try {
			var fieldStyle = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldStyle = {};
		}
		if (!lAllowBlank) fieldStyle.required = true;

		var lValidator = function lValidator(v) {
			if (fieldStyle.required && (v == null || v == "")) return false;
			return true;
		};
		var lRegex = inField.regEx;
		if (lRegex != null && lRegex != "") {
			lValidator = function lValidator(v) {
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				if (fieldStyle.required && (v == null || v == "")) return false;
				return true;
			};
		}

		var LocalMuiTextField = function (_React$Component) {
			_inherits(LocalMuiTextField, _React$Component);

			function LocalMuiTextField(props) {
				_classCallCheck(this, LocalMuiTextField);

				var _this = _possibleConstructorReturn(this, (LocalMuiTextField.__proto__ || Object.getPrototypeOf(LocalMuiTextField)).call(this, props));

				_this.handleChange = function (event) {
					//add OCF call here..
					if (inField.dataSource == "session") {
						ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
					} else {
						ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
					}
					if (lValidator(event.target.value)) {
						_this.state.errored = false;
						ocf(event);
					} else _this.state.errored = true;
					_this.setState({
						value: event.target.value
					});
				};

				_this.state = {
					value: data,
					errored: false
				};
				return _this;
			}

			_createClass(LocalMuiTextField, [{
				key: 'getTip',
				value: function getTip() {
					if (inField.toolTip) return React.createElement(
						MuiFormHelperText,
						null,
						inField.toolTip
					);
					return;
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						{ style: style },
						React.createElement(
							MuiThemeProvider,
							{ style: panelStyle },
							React.createElement(MuiTextField, {
								error: this.state.errored,
								style: fieldStyle,
								fullWidth: true,
								label: lCaption,
								disabled: rOnly,
								required: fieldStyle.required,
								multiline: false,
								id: inFormKey + '_ctr_' + inField.formCell.replace(",", "_"),
								value: this.state.value,
								onChange: this.handleChange
							})
						),
						this.getTip()
					);
				}
			}]);

			return LocalMuiTextField;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiTextField, inFormKey, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiTextField, null), inContainer);

		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);

		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},
	renderTextarea: function renderTextarea(inFormKey, item, inField, inContainer) {

		inContainer.title = inField.toolTip;
		var lAllowBlank = true;
		//adding concept of session vars.
		if (inField.dataSource == "session") {
			var data = ijf.session[inFormKey + '_fld_' + inField.formCell];
			if (!data && inField.style.indexOf('query:true') < 0) data = inField.dataReference2;
		} else {
			var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
			var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
			var jf = item.fields[jfFieldDef.id];

			if (inField.dataReference == "html") {
				var data = ijfUtils.handleJiraFieldType(jfFieldDef, jf, false, true);
			} else {
				var data = ijfUtils.handleJiraFieldType(jfFieldDef, jf);
			}

			if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = jfFieldMeta.required ? false : true;
		}

		if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle, 'required') == "true") lAllowBlank = false;

		var lMaxsize = Number.MAX_VALUE;

		var hideField = ijfUtils.renderIfShowField(data, inField);
		var hideLabel = false;
		if (inField.caption == "") var lCaption = inField.dataSource;else if (inField.caption == "none") {
			var lCaption = "";
			hideLabel = true;
		} else var lCaption = inField.caption;
		if (inField.style.indexOf('hidden:true') > -1) {
			hideLabel = true;
			hideField = true;
		}
		var rOnly = false;
		if (inField.fieldStyle.indexOf('readonly:true') > -1) {
			rOnly = true;
		}
		if (inField.style.indexOf('enteronce:true') > -1) {
			if (!!data) rOnly = true;
		}

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}
		//console.log(JSON.stringify(perms));
		if (!rOnly && !perms.canEdit) rOnly = true;
		if (!hideField && !perms.canSee) hideField = true;
		//end permissions


		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var panelStyle = JSON.parse(inField.panelStyle);
		} catch (e) {
			var panelStyle = {};
		}
		try {
			var fieldStyle = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldStyle = {};
		}
		if (!lAllowBlank) fieldStyle.required = true;

		var lValidator = function lValidator(v) {
			if (fieldStyle.required && (v == null || v == "")) return false;
			return true;
		};
		var lRegex = inField.regEx;
		if (lRegex != null && lRegex != "") {
			lValidator = function lValidator(v) {
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				if (fieldStyle.required && (v == null || v == "")) return false;
				return true;
			};
		}

		var LocalMuiTextField = function (_React$Component2) {
			_inherits(LocalMuiTextField, _React$Component2);

			function LocalMuiTextField(props) {
				_classCallCheck(this, LocalMuiTextField);

				var _this2 = _possibleConstructorReturn(this, (LocalMuiTextField.__proto__ || Object.getPrototypeOf(LocalMuiTextField)).call(this, props));

				_this2.handleChange = function (event) {
					//add OCF call here..
					if (inField.dataSource == "session") {
						ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
					} else {
						ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
					}
					var ocf = ijfUtils.getEvent(inField);
					if (lValidator(event.target.value)) {
						_this2.state.errored = false;
						ocf(event);
					} else _this2.state.errored = true;
					_this2.setState({
						value: event.target.value
					});
				};

				_this2.state = {
					value: data,
					errored: false
				};
				return _this2;
			}

			_createClass(LocalMuiTextField, [{
				key: 'getTip',
				value: function getTip() {
					if (inField.toolTip) return React.createElement(
						MuiFormHelperText,
						null,
						inField.toolTip
					);
					return;
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						{ style: style },
						React.createElement(MuiTextField, { style: fieldStyle,
							error: this.state.errored,
							fullWidth: true,
							label: lCaption,
							disabled: rOnly,
							required: fieldStyle.required,
							multiline: true,
							id: inFormKey + '_ctr_' + inField.formCell.replace(",", "_"),
							value: this.state.value,
							onChange: this.handleChange
						}),
						this.getTip()
					);
				}
			}]);

			return LocalMuiTextField;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiTextField, inFormKey, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiTextField, null), inContainer);

		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);

		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},


	renderButton: function renderButton(inFormKey, item, inField, inContainer) {
		inContainer.title = inField.toolTip;

		var hideField = ijfUtils.renderIfShowField(null, inField);
		var readOnly = false;
		var lCaption = inField.caption;

		var ocf = ijfUtils.getEvent(inField);

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}
		if (!hideField && !perms.canSee) hideField = true;
		//end permissions
		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var fieldSettings = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldSettings = {};
		}

		var disabled = false;
		if (hideField) style.visibility = "hidden";
		if (fieldSettings.readonly) disabled = true;
		if (!fieldSettings.size) fieldSettings.size = "medium";

		var getIcon = function getIcon() {
			if (fieldSettings.icon) return React.createElement(
				Icon,
				null,
				fieldSettings.icon
			);else return;
		};

		var LocalMuiButton = function LocalMuiButton() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					MuiButton,
					{ onClick: ocf, disabled: disabled, size: fieldSettings.size, color: fieldSettings.color, variant: fieldSettings.variant, style: style },
					getIcon(),
					lCaption
				)
			);
		};

		//before render....
		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiButton, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiButton, null), inContainer);
		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},

	renderIcon: function renderIcon(inFormKey, item, inField, inContainer) {

		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var panelStyle = JSON.parse(inField.panelStyle);
		} catch (e) {
			var panelStyle = {};
		}
		try {
			var fieldStyle = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldStyle = {};
		}
		var getIcon = function getIcon() {
			if (inField.dataSource) return React.createElement(
				Icon,
				{ style: panelStyle },
				inField.dataSource
			);else return;
		};
		var LocalMuiIcon = function LocalMuiIcon() {
			return React.createElement(
				'div',
				{ style: style },
				getIcon()
			);
		};

		//before render....
		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiIcon, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiIcon, null), inContainer);
		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},
	renderCardList: function renderCardList(inFormKey, item, inField, inContainer) {
		inContainer.title = inField.toolTip;

		var hideField = ijfUtils.renderIfShowField(null, inField);
		var readOnly = false;
		var lCaption = inField.caption;

		var ocf = ijfUtils.getEvent(inField);

		var translateFields = ijfUtils.translateJiraFieldsToIds(inField.dataReference);

		var lds = inField.dataSource;

		var tSearch = "jql=" + lds + "&fields=" + translateFields;
		tSearch = ijfUtils.replaceKeyValues(tSearch, item);
		var aUrl = '/rest/api/2/search?' + tSearch;

		if (inField.form.formProxy == "true") {
			aUrl = aUrl.replace(/ /g, "%20");
			var rawList = ijfUtils.getProxyApiCallSync(aUrl, inField.form.formSet.id);
		} else {
			var rawList = ijfUtils.jiraApiSync('GET', aUrl, null);
		}
		var dataItems = rawList.issues.map(function (i) {
			var retObj = {};
			translateFields.split(",").forEach(function (f) {
				var thisField = f.trim();
				var dVal = "";
				var jField = ijfUtils.getJiraFieldById(thisField);
				if (i.fields.hasOwnProperty(jField.id)) {
					dVal = ijfUtils.handleJiraFieldType(jField, i.fields[jField.id], true);
				}
				if (!dVal) dVal = "";
				if (jField.name) retObj[jField.name] = dVal;else retObj[thisField] = dVal;
			});
			//retObj.iid=i.id;
			retObj.iid = i.key;
			retObj.key = i.key;
			return retObj;
		});

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}
		if (!hideField && !perms.canSee) hideField = true;
		//end permissions
		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var panelStyle = JSON.parse(inField.panelStyle);
		} catch (e) {
			var panelStyle = {};
		}
		try {
			var fieldStyle = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldStyle = {};
		}

		var disabled = false;
		if (hideField) style.visibility = "hidden";

		//REACT section

		var DynamicMenuRow = function (_React$Component3) {
			_inherits(DynamicMenuRow, _React$Component3);

			function DynamicMenuRow(props) {
				_classCallCheck(this, DynamicMenuRow);

				var _this3 = _possibleConstructorReturn(this, (DynamicMenuRow.__proto__ || Object.getPrototypeOf(DynamicMenuRow)).call(this, props));

				_this3.state = {
					menuRow: props.menuRow,
					owningClass: props.owningClass
				};
				return _this3;
			}

			_createClass(DynamicMenuRow, [{
				key: 'handleClick',
				value: function handleClick(inOwner) {
					this.state.owningClass.handleClose();
					ijf.snippets[this.state.menuRow.snippet](inOwner);
				}
			}, {
				key: 'render',
				value: function render() {
					var _this4 = this;

					return React.createElement(
						MenuItem,
						{ onClick: function onClick() {
								return _this4.handleClick(_this4.state.owningClass);
							} },
						this.state.menuRow.label
					);
				}
			}]);

			return DynamicMenuRow;
		}(React.Component);

		var DynamicHtml = function (_React$Component4) {
			_inherits(DynamicHtml, _React$Component4);

			function DynamicHtml(props) {
				_classCallCheck(this, DynamicHtml);

				//need to do replaces here...

				var _this5 = _possibleConstructorReturn(this, (DynamicHtml.__proto__ || Object.getPrototypeOf(DynamicHtml)).call(this, props));

				var tempHtml = ijfUtils.switchAttsGeneric(props.htmlContent, props.dataRow);
				_this5.state = {
					template: { __html: tempHtml },
					dataRow: props.dataRow
				};
				return _this5;
			}

			_createClass(DynamicHtml, [{
				key: 'render',
				value: function render() {
					return React.createElement('div', { dangerouslySetInnerHTML: this.state.template });
				}
			}]);

			return DynamicHtml;
		}(React.Component);

		var MuiCard = function (_React$Component5) {
			_inherits(MuiCard, _React$Component5);

			function MuiCard(props) {
				_classCallCheck(this, MuiCard);

				var _this6 = _possibleConstructorReturn(this, (MuiCard.__proto__ || Object.getPrototypeOf(MuiCard)).call(this, props));

				_this6.handleClick = function (event) {
					_this6.setState({ anchorEl: event.currentTarget });
				};

				_this6.handleClose = function () {
					_this6.setState({ anchorEl: null });
				};

				_this6.handleDblClick = function (event) {
					console.log(event.type);
					debugger;
					ocf(event, _this6);
				};

				_this6.state = {
					row: props.dataRow,
					owningClass: props.owningClass,
					title: props.title,
					subHeader: props.subHeader,
					contentOut: props.contentOut,
					cardMenu: props.cardMenu,
					actionMenu: props.actionMenu,
					anchorEl: null
				};
				return _this6;
			}

			_createClass(MuiCard, [{
				key: 'getMenuRow',
				value: function getMenuRow(r, owningClass) {
					return React.createElement(DynamicMenuRow, { menuRow: r, owningClass: owningClass });
				}
			}, {
				key: 'getMenu',
				value: function getMenu(menuRows, owningClass) {
					if (!menuRows) return;
					return React.createElement(
						Menu,
						{
							id: "card_menu_id_" + owningClass.state.row.key,
							anchorEl: owningClass.state.anchorEl,
							open: Boolean(owningClass.state.anchorEl),
							onClose: owningClass.handleClose
						},
						menuRows.map(function (r) {
							return owningClass.getMenuRow(r, owningClass);
						})
					);
				}
			}, {
				key: 'getIcon',
				value: function getIcon(r) {
					if (r.icon) return React.createElement(
						Icon,
						null,
						r.icon
					);else return;
				}
			}, {
				key: 'getCardActions',
				value: function getCardActions() {
					if (this.state.actionMenu) {
						var lThis = this;
						return React.createElement(
							CardActions,
							{ disableActionSpacing: true },
							this.state.actionMenu.map(function (r) {
								if (!r.style) r.style = {};
								if (!r.style.size) r.style.size = "medium";
								return React.createElement(
									MuiButton,
									{ onClick: function onClick() {
											return ijf.snippets[r.snippet](lThis);
										}, color: r.color, variant: r.variant, disabled: r.disabled, size: r.size, style: r.style },
									lThis.getIcon(r),
									r.label
								);
							}),
							'  '
						);
					}
					return;
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						null,
						React.createElement(
							Card,
							{ style: style, onDblClick: this.handleDblClick },
							React.createElement(CardHeader, { style: panelStyle,
								avatar: React.createElement(
									Icon,
									{ color: 'primary' },
									fieldStyle.avatar
								),
								action: React.createElement(
									IconButton,
									{ onClick: this.handleClick,
										'aria-owns': this.state.anchorEl ? 'simple-menu' : null,
										'aria-haspopup': 'true' },
									React.createElement(
										Icon,
										null,
										fieldStyle.actionIcon
									)
								),
								title: React.createElement(
									Typography,
									{ variant: 'headline', component: 'h2' },
									React.createElement(DynamicHtml, { htmlContent: this.state.title, dataRow: this.state.row })
								),
								subheader: React.createElement(DynamicHtml, { htmlContent: this.state.subHeader, dataRow: this.state.row })
							}),
							React.createElement(
								CardContent,
								null,
								React.createElement(
									Typography,
									{ component: 'p' },
									React.createElement(DynamicHtml, { htmlContent: this.state.contentOut, dataRow: this.state.row })
								)
							),
							this.getCardActions()
						),
						this.getMenu(this.state.cardMenu, this)
					);
				}
			}]);

			return MuiCard;
		}(React.Component);

		var CardList = function (_React$Component6) {
			_inherits(CardList, _React$Component6);

			function CardList(props) {
				_classCallCheck(this, CardList);

				var _this7 = _possibleConstructorReturn(this, (CardList.__proto__ || Object.getPrototypeOf(CardList)).call(this, props));

				_this7.state = {
					value: dataItems
				};
				return _this7;
			}

			_createClass(CardList, [{
				key: 'getCard',
				value: function getCard(row, owningClass) {
					//must transform content using field Style
					//row has the fields...must translate content into values using replaceKeyValues
					var title = fieldStyle.title;
					var subHeader = fieldStyle.subHeader;
					var contentOut = fieldStyle.content;
					var cardMenu = fieldStyle.menu;
					var actionMenu = fieldStyle.actionMenu;
					var lRow = row;

					return React.createElement(
						'div',
						null,
						React.createElement(MuiCard, { dataRow: row,
							owningClass: owningClass,
							title: title,
							subHeader: subHeader,
							contentOut: contentOut,
							cardMenu: cardMenu,
							actionMenu: actionMenu })
					);
				}
			}, {
				key: 'getCards',
				value: function getCards(inData, owningClass) {
					return inData.map(function (r) {
						return owningClass.getCard(r, owningClass);
					});
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						{ style: style },
						this.getCards(this.state.value, this)
					);
				}
			}]);

			return CardList;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](CardList, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(CardList, null), inContainer);
		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},

	renderDrawer: function renderDrawer(inFormKey, item, inField, inContainer) {
		inContainer.title = inField.toolTip;

		var hideField = ijfUtils.renderIfShowField(null, inField);
		var readOnly = false;
		var lCaption = inField.caption;

		var ocf = ijfUtils.getEvent(inField);

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}
		if (!hideField && !perms.canSee) hideField = true;
		//end permissions
		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var fieldSettings = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldSettings = {};
		}

		var buttonStyle = {};
		if (hideField) buttonStyle.visibility = "hidden";

		var MuiDrawer = function (_React$Component7) {
			_inherits(MuiDrawer, _React$Component7);

			function MuiDrawer() {
				var _ref;

				var _temp, _this8, _ret;

				_classCallCheck(this, MuiDrawer);

				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				return _ret = (_temp = (_this8 = _possibleConstructorReturn(this, (_ref = MuiDrawer.__proto__ || Object.getPrototypeOf(MuiDrawer)).call.apply(_ref, [this].concat(args))), _this8), _this8.state = {
					top: false,
					left: false,
					bottom: false,
					right: false
				}, _this8.toggleDrawer = function (side, open) {
					return function () {
						_this8.setState(_defineProperty({}, side, open));
					};
				}, _temp), _possibleConstructorReturn(_this8, _ret);
			}

			_createClass(MuiDrawer, [{
				key: 'getMenu',
				value: function getMenu(menuRows, owningClass) {
					if (!menuRows) return;

					return menuRows.map(function (m) {
						if (m.type == "button") {
							var snip = function snip() {};
							if (ijf.snippets.hasOwnProperty(m.snippet)) snip = function snip() {
								ijf.snippets[m.snippet](m);
							};
							return React.createElement(
								List,
								{ component: 'nav' },
								React.createElement(
									ListItem,
									{ button: true, onClick: snip },
									React.createElement(
										Icon,
										null,
										m.icon
									),
									React.createElement(ListItemText, { primary: m.text })
								)
							);
						} else {
							//assume divider
							return React.createElement(Divider, null);
						}
					});
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						null,
						React.createElement(
							Icon,
							{ style: buttonStyle, onClick: this.toggleDrawer(fieldSettings.direction, true) },
							fieldSettings.icon
						),
						React.createElement(
							Drawer,
							{ anchor: fieldSettings.direction, open: this.state[fieldSettings.direction], onClose: this.toggleDrawer(fieldSettings.direction, false) },
							React.createElement(
								'div',
								{
									tabIndex: 0,
									role: 'button',
									onClick: this.toggleDrawer(fieldSettings.direction, false),
									onKeyDown: this.toggleDrawer(fieldSettings.direction, false)
								},
								React.createElement(
									'div',
									{ style: style },
									this.getMenu(fieldSettings.menu, this)
								)
							)
						)
					);
				}
			}]);

			return MuiDrawer;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](MuiDrawer, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(MuiDrawer, null), inContainer);
		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},

	renderSelect: function renderSelect(inFormKey, item, inField, inContainer) {

		if (inField.dataSource == "session") {
			var jfFieldMeta = {};
			if (inField.dataReference != "ijfReference") jfFieldMeta.allowedValues = JSON.parse(inField.dataReference);
			var jfFieldDef = {};
			jfFieldDef.id = inField.formCell;
			jfFieldDef.schema = {};
			jfFieldDef.schema.type = "option";
			var data = ijf.session[inFormKey + '_fld_' + inField.formCell];
			if (!data) data = inField.dataReference2;
		} else {
			var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
			var jf = item.fields[jfFieldDef.id];
			var data = ijfUtils.handleJiraFieldType(jfFieldDef, jf);

			//if status, the transitions are the field meta...
			if (jfFieldDef.schema.type == 'status') {
				//cache this?
				if (!item.transitions) {
					item.transitions = ijfUtils.jiraApiSync('GET', '/rest/api/2/issue/' + item.key + '/transitions', null);
				}
				var jfFieldMeta = item.transitions;
			} else {
				var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
			}
		}

		var lAllowBlank = true;
		if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = jfFieldMeta.required ? false : true;
		if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle, 'required') == "true") lAllowBlank = false;

		//get lookuips

		//two forms:  JIRA references or IJF references
		var combo = {};
		var lookup = [];
		var rawLookup = [];
		var selectParents = null;
		var selectChildren = null;
		var myRefIndex = null;
		switch (inField.dataReference) {
			case "ijfReference":

				//The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells

				var refCheck = ijf.fw.CustomTypes.reduce(function (inObj, t) {
					if (t.name == inField.referenceFilter) inObj = t;return inObj;
				}, null);

				if (refCheck) {
					rawLookup = ijfUtils.getReferenceDataByName(inField.referenceFilter, "0", true);
					myRefIndex = 0;
					lookup = rawLookup.map(function (r) {
						return [r[cLookupDef.index], r[cLookupDef.index]];
					});
				} else {
					//complex cascade...
					try {
						var cLookupDef = JSON.parse(inField.referenceFilter);
						myRefIndex = cLookupDef.index;
						rawLookup = ijfUtils.getReferenceDataByName(cLookupDef.name, cLookupDef.index, true);
						lookup = rawLookup.map(function (r) {
							return [r[cLookupDef.index], r[cLookupDef.index]];
						});
						//establish a listener for this combo if necessary
						if (cLookupDef.parents) {
							var parentIds = cLookupDef.parents;
							selectParents = parentIds.reduce(function (inFilter, p) {
								inFilter.push({ "property": p.dataIndex.toString(), "value": "tbd", "fieldName": p.fieldName });
								return inFilter;
							}, []);
						}
						//for each child, you need to clear it's value
						if (cLookupDef.children) {
							selectChildren = cLookupDef.children;
						}
					} catch (le) {
						ijfUtils.footLog("failed to handle complex lookup: " + le.message);
						lookups[col.columnName] = [];
					}
				}

				break;
			default:

				switch (jfFieldDef.schema.type) {
					case "securitylevel":
					case "priority":
						var lookup = jfFieldMeta.allowedValues.map(function (e) {
							return [e.id, e.name];
						});
						break;
					case "status":
						var lookup = jfFieldMeta.transitions.map(function (e) {
							return [e.id, e.name];
						});
						lookup.push([data, item.fields.status.name]);
						break;
					case "option":
						var lookup = jfFieldMeta.allowedValues.map(function (e) {
							return [e.id, e.value];
						});
						break;
					default:
						var lookup = [];
						ijfUtils.footLog("No options found for schema: " + jfFieldDef.schema.type);
				}

				break;
		}

		var lMaxsize = Number.MAX_VALUE;

		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var panelStyle = JSON.parse(inField.panelStyle);
		} catch (e) {
			var panelStyle = {};
		}
		try {
			var fieldStyle = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldStyle = {};
		}

		var hideField = ijfUtils.renderIfShowField(data, inField);
		var hideLabel = false;
		if (inField.caption == "") var lCaption = inField.dataSource;else if (inField.caption == "none") {
			var lCaption = "";
			hideLabel = true;
		} else var lCaption = inField.caption;

		if (style.hidden) {
			hideLabel = true;
			hideField = true;
		}
		var rOnly = false;
		if (fieldStyle.readonly) {
			rOnly = true;
		}

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}
		//console.log(JSON.stringify(perms));
		if (!rOnly && !perms.canEdit) rOnly = true;
		if (!hideField && !perms.canSee) hideField = true;
		//end permissions

		if (hideField) style.visibility = "hidden";
		if (!lAllowBlank) fieldStyle.required = true;
		var ocf = ijfUtils.getEvent(inField);

		var lValidator = function lValidator(v) {
			if (fieldStyle.required && (v == null || v == "")) return false;
			return true;
		};
		var lRegex = inField.regEx;
		if (lRegex != null && lRegex != "") {
			lValidator = function lValidator(v) {
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				if (fieldStyle.required && (v == null || v == "")) return false;
				return true;
			};
		}

		var LocalMuiMenuItem = function (_React$Component8) {
			_inherits(LocalMuiMenuItem, _React$Component8);

			function LocalMuiMenuItem(props) {
				_classCallCheck(this, LocalMuiMenuItem);

				var _this9 = _possibleConstructorReturn(this, (LocalMuiMenuItem.__proto__ || Object.getPrototypeOf(LocalMuiMenuItem)).call(this, props));

				_this9.handleVisibility = function () {
					_this9.setState({ style: _this9.props.style });
				};

				_this9.state = {
					style: props.style
				};
				return _this9;
			}

			_createClass(LocalMuiMenuItem, [{
				key: 'render',
				value: function render() {
					return React.createElement(
						MenuItem,
						{ style: this.state.style, value: this.props.value },
						this.props.display
					);
				}
			}]);

			return LocalMuiMenuItem;
		}(React.Component);

		var LocalMuiSelectField = function (_React$Component9) {
			_inherits(LocalMuiSelectField, _React$Component9);

			function LocalMuiSelectField(props) {
				_classCallCheck(this, LocalMuiSelectField);

				var _this10 = _possibleConstructorReturn(this, (LocalMuiSelectField.__proto__ || Object.getPrototypeOf(LocalMuiSelectField)).call(this, props));

				_this10.handleOpen = function (event) {
					//if parents, then the getMenu has to change to filter the values...
					_this10.setState({ open: true });
				};

				_this10.handleChange = function (event) {
					//add OCF call here..
					if (inField.dataSource == "session") {
						ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
					} else {
						ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
					}
					if (lValidator(event.target.value)) {
						_this10.state.errored = false;
						ocf(event);
					} else _this10.state.errored = true;

					//now look for children...for each one you need to set the value to null....
					if (_this10.props.selectChildren) {
						_this10.props.selectChildren.forEach(function (c) {
							var ctl = ijfUtils.getControlByDataSource(c);
							if (!ctl) ctl = ijfUtils.getControlByKey(c);
							if (ctl) {
								ctl.control.clearValue();
							}
						});
					}

					_this10.setState(_defineProperty({}, event.target.name, event.target.value));
				};

				_this10.handleClose = function () {
					_this10.setState({ open: false });
				};

				_this10.clearValue = function () {
					_this10.setState({ value: null });
				};

				_this10.state = {
					value: data,
					lookup: lookup,
					rawlookup: rawLookup,
					parents: selectParents,
					errored: false,
					open: false
				};
				return _this10;
			}

			_createClass(LocalMuiSelectField, [{
				key: 'getMenu',
				value: function getMenu() {
					if (!this.state.lookup) return;
					//var menuItems = this.state.lookup.map(function(r){return (<MenuItem style={{"visibility":"visible"}} value={r[0]}>{r[1]}</MenuItem>)});
					if (this.state.parents) {
						var parent = this.state.parents.reduce(function (inObj, f) {
							inObj = f;return inObj;
						}, null);

						var cValue = 'novaluetofilterwith';
						var ctl = ijfUtils.getControlByDataSource(parent.fieldName);
						if (!ctl) ctl = ijfUtils.getControlByKey(parent.fieldName);
						if (ctl) {
							cValue = ctl.control.state.value;
							console.log(cValue);
							var lState = this.state;
							var menuItems = this.state.lookup.map(function (m) {

								var showIt = lState.rawlookup.reduce(function (inChk, r) {
									if (r[parent.property] == cValue && r[myRefIndex] == m[1]) inChk = true;
									return inChk;
								}, false);
								if (showIt) return React.createElement(
									MenuItem,
									{ value: m[0] },
									m[1]
								);else return;
							});

							return menuItems;
						} else return;
					} else {
						return this.state.lookup.map(function (r) {
							return React.createElement(
								MenuItem,
								{ value: r[0] },
								r[1]
							);
						});
					}
				}
			}, {
				key: 'getTip',
				value: function getTip() {
					if (inField.toolTip) return React.createElement(
						MuiFormHelperText,
						null,
						inField.toolTip
					);
					return;
				}
			}, {
				key: 'getCaption',
				value: function getCaption() {
					//<MuiInputLabel htmlFor={"value-helper"+inField.formCell}>{lCaption}</MuiInputLabel>
					if (lCaption) return React.createElement(
						MuiInputLabel,
						null,
						lCaption
					);
					return;
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						{ style: style },
						React.createElement(
							MuiFormControl,
							{ style: panelStyle, error: this.state.errored, required: fieldStyle.required, disabled: rOnly },
							this.getCaption(),
							React.createElement(
								MuiSelect,
								{
									value: this.state.value,
									open: this.state.open,
									onClose: this.handleClose,
									onOpen: this.handleOpen,
									onChange: this.handleChange,
									input: React.createElement(MuiInput, { style: fieldStyle, name: 'value', id: "value-helper" + inField.formCell, readOnly: rOnly })
								},
								this.getMenu()
							),
							this.getTip()
						)
					);
				}
			}]);

			return LocalMuiSelectField;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiSelectField, inFormKey, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiSelectField, { selectChildren: selectChildren }), inContainer);

		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);

		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},
	renderRadio: function renderRadio(inFormKey, item, inField, inContainer) {

		if (inField.dataSource == "session") {
			var jfFieldMeta = {};
			if (inField.dataReference != "ijfReference") jfFieldMeta.allowedValues = JSON.parse(inField.dataReference);
			var jfFieldDef = {};
			jfFieldDef.id = inField.formCell;
			jfFieldDef.schema = {};
			jfFieldDef.schema.type = "option";
			var data = ijf.session[inFormKey + '_fld_' + inField.formCell];
			if (!data) data = inField.dataReference2;
		} else {
			var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
			var jf = item.fields[jfFieldDef.id];
			var data = ijfUtils.handleJiraFieldType(jfFieldDef, jf);

			//if status, the transitions are the field meta...
			if (jfFieldDef.schema.type == 'status') {
				//cache this?
				if (!item.transitions) {
					item.transitions = ijfUtils.jiraApiSync('GET', '/rest/api/2/issue/' + item.key + '/transitions', null);
				}
				var jfFieldMeta = item.transitions;
			} else {
				var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
			}
		}

		var lAllowBlank = true;
		if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = jfFieldMeta.required ? false : true;
		if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle, 'required') == "true") lAllowBlank = false;

		//get lookuips

		//two forms:  JIRA references or IJF references
		var combo = {};
		var lookup = [];
		var rawLookup = [];
		var selectParents = null;
		var selectChildren = null;
		var myRefIndex = null;
		switch (inField.dataReference) {
			case "ijfReference":

				//The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells

				var refCheck = ijf.fw.CustomTypes.reduce(function (inObj, t) {
					if (t.name == inField.referenceFilter) inObj = t;return inObj;
				}, null);

				if (refCheck) {
					rawLookup = ijfUtils.getReferenceDataByName(inField.referenceFilter, "0", true);
					myRefIndex = 0;
					lookup = rawLookup.map(function (r) {
						return [r[cLookupDef.index], r[cLookupDef.index]];
					});
				} else {
					//complex cascade...
					try {
						var cLookupDef = JSON.parse(inField.referenceFilter);
						myRefIndex = cLookupDef.index;
						rawLookup = ijfUtils.getReferenceDataByName(cLookupDef.name, cLookupDef.index, true);
						lookup = rawLookup.map(function (r) {
							return [r[cLookupDef.index], r[cLookupDef.index]];
						});
						//establish a listener for this combo if necessary
					} catch (le) {
						ijfUtils.footLog("failed to handle complex lookup: " + le.message);
						lookups[col.columnName] = [];
					}
				}

				break;
			default:

				switch (jfFieldDef.schema.type) {
					case "securitylevel":
					case "priority":
						var lookup = jfFieldMeta.allowedValues.map(function (e) {
							return [e.id, e.name];
						});
						break;
					case "status":
						var lookup = jfFieldMeta.transitions.map(function (e) {
							return [e.id, e.name];
						});
						lookup.push([data, item.fields.status.name]);
						break;
					case "option":
						var lookup = jfFieldMeta.allowedValues.map(function (e) {
							return [e.id, e.value];
						});
						break;
					default:
						var lookup = [];
						ijfUtils.footLog("No options found for schema: " + jfFieldDef.schema.type);
				}

				break;
		}

		var lMaxsize = Number.MAX_VALUE;

		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var panelStyle = JSON.parse(inField.panelStyle);
		} catch (e) {
			var panelStyle = {};
		}
		try {
			var fieldStyle = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldStyle = {};
		}

		var hideField = ijfUtils.renderIfShowField(data, inField);
		var hideLabel = false;
		if (inField.caption == "") var lCaption = inField.dataSource;else if (inField.caption == "none") {
			var lCaption = "";
			hideLabel = true;
		} else var lCaption = inField.caption;

		if (style.hidden) {
			hideLabel = true;
			hideField = true;
		}
		var rOnly = false;
		if (fieldStyle.readonly) {
			rOnly = true;
		}

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}
		//console.log(JSON.stringify(perms));
		if (!rOnly && !perms.canEdit) rOnly = true;
		if (!hideField && !perms.canSee) hideField = true;
		//end permissions

		if (hideField) style.visibility = "hidden";
		if (!lAllowBlank) fieldStyle.required = true;
		var ocf = ijfUtils.getEvent(inField);

		var lValidator = function lValidator(v) {
			if (fieldStyle.required && (v == null || v == "")) return false;
			return true;
		};
		var lRegex = inField.regEx;
		if (lRegex != null && lRegex != "") {
			lValidator = function lValidator(v) {
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				if (fieldStyle.required && (v == null || v == "")) return false;
				return true;
			};
		}

		var LocalMuiRadioField = function (_React$Component10) {
			_inherits(LocalMuiRadioField, _React$Component10);

			function LocalMuiRadioField(props) {
				_classCallCheck(this, LocalMuiRadioField);

				var _this11 = _possibleConstructorReturn(this, (LocalMuiRadioField.__proto__ || Object.getPrototypeOf(LocalMuiRadioField)).call(this, props));

				_this11.handleChange = function (event) {
					//add OCF call here..
					if (inField.dataSource == "session") {
						ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
					} else {
						ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
					}
					if (lValidator(event.target.value)) {
						_this11.state.errored = false;
						ocf(event);
					} else _this11.state.errored = true;

					_this11.setState({ value: event.target.value });
				};

				_this11.clearValue = function () {
					_this11.setState({ value: null });
				};

				_this11.state = {
					value: data,
					lookup: lookup,
					errored: false
				};
				return _this11;
			}

			_createClass(LocalMuiRadioField, [{
				key: 'getMenu',
				value: function getMenu() {
					if (!this.state.lookup) return;
					return this.state.lookup.map(function (r) {
						return React.createElement(MuiFormControlLabel, { value: r[0], control: React.createElement(MuiRadio, { color: 'primary' }), label: r[1] });
					});
				}
			}, {
				key: 'getTip',
				value: function getTip() {
					if (inField.toolTip) return React.createElement(
						MuiFormHelperText,
						null,
						inField.toolTip
					);
					return;
				}
			}, {
				key: 'getCaption',
				value: function getCaption() {
					//if(lCaption) return (<MuiInputLabel component="legend">{lCaption}</MuiInputLabel>)
					if (lCaption) return React.createElement(
						MuiInputLabel,
						null,
						lCaption
					);
					return;
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						{ style: style },
						React.createElement(
							MuiFormControl,
							{ style: panelStyle, component: 'fieldset', required: fieldStyle.required },
							this.getCaption(),
							React.createElement(
								MuiRadioGroup,
								{ style: fieldStyle,
									name: "radioGroup_name_" + inField.formCell,
									value: this.state.value,
									onChange: this.handleChange
								},
								this.getMenu()
							),
							this.getTip()
						)
					);
				}
			}]);

			return LocalMuiRadioField;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiRadioField, inFormKey, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiRadioField, null), inContainer);

		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);

		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	},

	renderGrid: function renderGrid(inFormKey, item, inField, inContainer) {
		//get type definition
		var thisT = {};
		for (var tF in ijf.fw.CustomTypes) {
			if (!ijf.fw.CustomTypes.hasOwnProperty(tF)) return;
			if (ijf.fw.CustomTypes[tF].name == inField.dataSource) thisT = ijf.fw.CustomTypes[tF];
		}

		if (!thisT) throw "Invalid type name: " + inField.dataSource;

		inContainer.title = inField.toolTip;

		var jfFieldMeta = ijf.jiraMetaKeyed[thisT.fieldName];
		var jfFieldDef = ijf.jiraFieldsKeyed[thisT.fieldName];
		var jf = item.fields[jfFieldDef.id];

		var data = ijfUtils.handleJiraFieldType(jfFieldDef, jf);

		if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle, 'required') == "true") lAllowBlank = false;

		var lMaxsize = Number.MAX_VALUE;

		var lValidator = function lValidator(v) {
			return true;
		};
		var lRegex = inField.regEx;
		if (lRegex != null && lRegex != "") {
			lValidator = function lValidator(v) {
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				return true;
			};
		}
		var hideField = ijfUtils.renderIfShowField(data, inField);
		var hideLabel = false;
		if (inField.caption == "") var lCaption = inField.dataSource;else if (inField.caption == "none") {
			var lCaption = "";
			hideLabel = true;
		} else var lCaption = inField.caption;
		if (inField.style.indexOf('hidden:true') > -1) {
			hideLabel = true;
			hideField = true;
		}

		var rOnly = false;
		if (inField.fieldStyle.indexOf('readonly:true') > -1) {
			rOnly = true;
		}
		if (inField.style.indexOf('enteronce:true') > -1) {
			if (!!data) rOnly = true;
		}

		var l_labelStyle = inField.labelStyle;
		var l_panelStyle = inField.panelStyle;
		var l_Style = inField.style;
		var l_fieldStyle = inField.fieldStyle;

		try {
			var style = JSON.parse(inField.style);
		} catch (e) {
			var style = {};
		}
		try {
			var panelStyle = JSON.parse(inField.panelStyle);
		} catch (e) {
			var panelStyle = {};
		}
		try {
			var fieldStyle = JSON.parse(inField.fieldStyle);
		} catch (e) {
			var fieldStyle = {};
		}

		var ocf = ijfUtils.getEvent(inField);

		//permissions check....has to exist...
		if (inField.permissions.enabled) {
			var perms = ijfUtils.getPermissionObj(inField.permissions, ijf.currentItem, ijf.main.currentUser);
		} else {
			var perms = ijfUtils.getPermissionObj(inField.form.permissions, ijf.currentItem, ijf.main.currentUser);
		}

		if (!hideField && !perms.canSee) hideField = true;
		if (!perms.canEdit) rOnly = true;
		//end permissions

		var collapsible = true;
		if (l_fieldStyle.indexOf('collapsible:false') > -1) {
			collapsible = false;
		}
		var collapsed = false;
		if (l_fieldStyle.indexOf('collapsed:true') > -1) {
			collapsed = true;
		}

		var features = null;
		if (l_fieldStyle.indexOf('sums:true') > -1) {
			features = [{
				ftype: 'summary'
			}];
		}

		var l_Height = 300;
		var l_Height = ijfUtils.getNameValueFromStyleString(l_fieldStyle, "height");
		if (l_Height == "") {
			l_Height = 300;
		} else {
			l_Height = l_Height.replace("px", "") / 1;
		}

		var l_Width = 600;
		var l_Width = ijfUtils.getNameValueFromStyleString(l_fieldStyle, "width");
		if (l_Width == "") {
			l_Width = 600;
		} else {
			l_Width = l_Width.replace("px", "") / 1;
		}

		var colWidths = [];
		var colHeaders = [];
		if (inField.tableWidths) colWidths = inField.tableWidths.split(",");
		if (inField.tableHeaders) colHeaders = inField.tableHeaders.split(",");

		//The grid setup....
		var listColumns = [];
		var tFields = [];
		var lookups = [];

		var gCols = JSON.parse(thisT.settings);
		//order by order
		gCols = gCols.sort(function (a, b) {
			return a.order - b.order;
		});
		var cIndex = 0;
		var lookups = [];
		var colObj = {};
		gCols.forEach(function (col) {

			var lValidator = function lValidator(v) {
				return true;
			};
			if (col.regEx != null && col.regEx != "") {
				lValidator = function lValidator(v) {
					var rgx = new RegExp(col.regEx);
					if (!rgx.exec(v)) {
						return col.regExMess;
					}
					return true;
				};
			}

			var validRenderer = function validRenderer(val, meta, rec, rowIndex, colIndex, store) {
				//at this poing you have the column def, if required or regex fails, make pink

				if (col.required == "Yes" && !val) {
					meta.style = "background-color:pink;";
				}
				if (col.regEx != null && col.regEx != "") {
					var rgxRenderCheck = new RegExp(col.regEx);
					if (!rgxRenderCheck.exec(val)) {
						meta.style = "background-color:pink;";
					}
				}

				//now manage the value formatting....
				switch (col.controlType) {
					case "datefield":
						if (col.format == null) col.format = 'm/d/Y';
						if (col.format == "") col.format = 'm/d/Y';
						return Ext.util.Format.dateRenderer(col.format)(val); //moment(val).format(col.format);
						break;
					case "combobox":
						//if value lookup is two dimensional, lookup value of val...
						var retVal = val;
						if (lookups[col.columnName]) {
							var lLookup = lookups[col.columnName];
							if (lLookup) {
								if (_typeof(lLookup[0]) == "object") lLookup.forEach(function (r) {
									if (r[0] == val) retVal = r[1];
								});
							}
						}
						return retVal;
						break;
					case "numberfield":
						if (col.format) return Ext.util.Format.numberRenderer(col.format)(val); //moment(val).format(col.format);
						return val;
						break;
					default:
						return val;
				}
			};

			var thisColWidth = 120;
			if (colWidths[cIndex]) thisColWidth = colWidths[cIndex] / 1;
			var thisColHeader = col.columnName;
			if (colHeaders[cIndex]) thisColHeader = colHeaders[cIndex];

			switch (col.controlType) {
				case "datefield":
					tFields.push({ name: col.columnName, type: 'date' });
					if (col.format == null) col.format = 'm/d/Y';
					if (col.format == "") col.format = 'm/d/Y';
					colObj = {
						header: thisColHeader,
						sortable: true,
						hidden: false,
						xtype: 'datecolumn',
						renderer: validRenderer,
						ijfColumn: col,
						width: thisColWidth,
						dataIndex: col.columnName,
						filter: {
							type: 'date'
						},
						editor: {
							completeOnEnter: true,
							field: {
								xtype: col.controlType,
								allowBlank: col.required != "Yes",
								validator: lValidator,
								format: col.format,
								listeners: {
									change: function change(n, o, f) {
										ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
									}
								}
							}
						}
					};
					break;
				case "numberfield":
					tFields.push({ name: col.columnName, type: 'number' });
					colObj = {
						header: thisColHeader,
						sortable: true,
						hidden: false,
						xtype: 'numbercolumn',
						renderer: validRenderer,
						align: 'end',
						width: thisColWidth,
						dataIndex: col.columnName,
						filter: {
							type: 'number'
						},
						editor: {
							completeOnEnter: true,
							field: {
								xtype: col.controlType,
								allowBlank: col.required != "Yes",
								validator: lValidator,
								format: col.format,
								listeners: {
									change: function change(n, o, f) {
										ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
									}
								}
							}
						}
					};
					break;
				case "checkbox":
					tFields.push({ name: col.columnName, type: 'boolean' });
					colObj = {
						header: thisColHeader,
						sortable: true,
						hidden: false,
						xtype: 'checkcolumn',
						centered: true,
						//renderer: validRenderer,
						width: thisColWidth,
						dataIndex: col.columnName,
						listeners: {
							checkchange: function checkchange(n, o, f) {
								ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
							}
						}
					};
					break;
				case "combobox":
					tFields.push({ name: col.columnName, type: 'string' });
					//The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells
					var cLookupDef = { "index": "0" };
					var cListener = {
						change: function change(n, o, f) {
							ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
						},
						focus: function focus() {
							this.validate();
						}
					};
					if (ijf.fw.CustomTypes.reduce(function (inObj, t) {
						if (t.name == col.reference) inObj = t;return inObj;
					}, null)) {
						lookups[col.columnName] = ijfUtils.getReferenceDataByName(col.reference, "0");
					} else {
						//complex cascade...
						try {
							cLookupDef = JSON.parse(col.reference);
							lookups[col.columnName] = ijfUtils.getReferenceDataByName(cLookupDef.name, cLookupDef.index);

							//establish a listener for this combo if necessary
							if (cLookupDef.parents) {
								var parentIds = cLookupDef.parents;
								var cFilters = parentIds.reduce(function (inFilter, p) {
									inFilter.push({ "property": p.dataIndex.toString(), "value": "tbd", "columnName": p.columnName });
									return inFilter;
								}, []);
								cListener["beforeQuery"] = function (query) {
									var cContainer = this.up();
									//cFilters["value"]= cValue;
									cFilters.forEach(function (f) {
										//for each filter param, we need to get the correct value...
										var cValue = cContainer.grid.getSelectionModel().getSelected().items[0].data[f.columnName];
										if (!cValue) cValue = 'novaluetofilterwith';
										f.value = cValue;
									});
									this.store.clearFilter();
									this.store.filter(cFilters);
								};
							}

							//for each child, you need to clear it's value
							if (cLookupDef.children) {
								var childFields = cLookupDef.children;
								cListener["change"] = function (n, o, f) {
									var cContainer = this.up();
									childFields.forEach(function (f) {
										cContainer.grid.getSelectionModel().getSelected().items[0].set(f, null);
									});
									ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
								};
							}
						} catch (le) {
							ijfUtils.footLog("failed to handle complex lookup: " + le.message);
							lookups[col.columnName] = [];
						}
					}
					colObj = {
						header: thisColHeader,
						sortable: true,
						hidden: false,
						width: thisColWidth,
						dataIndex: col.columnName,
						renderer: validRenderer,
						filter: {
							type: 'list'
						},
						editor: {
							completeOnEnter: true,
							field: {
								xtype: col.controlType,
								allowBlank: col.required != "Yes",
								validator: lValidator,
								forceSelection: true,
								store: lookups[col.columnName],
								lookupDef: cLookupDef,
								displayField: cLookupDef.index,
								valueField: cLookupDef.index,
								//triggerAction: 'all',
								//mode: 'local',
								//lastQuery: '',
								listeners: cListener
							}
						}
					};
					break;
				default:
					tFields.push({ name: col.columnName, type: 'string' });

					colObj = {
						header: thisColHeader,
						sortable: true,
						hidden: false,
						width: thisColWidth,
						dataIndex: col.columnName,
						renderer: validRenderer,
						filter: {
							type: 'string'
						},
						editor: {
							completeOnEnter: true,
							field: {
								xtype: col.controlType,
								allowBlank: col.required != "Yes",
								validator: lValidator,
								listeners: {
									change: function change(n, o, f) {
										ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
									},
									focus: function focus() {
										this.validate();
									}
								}
							}
						}
					};
			}
			ijfUtils.setColWidth(colObj, cIndex, colWidths, 120);
			listColumns.push(colObj);
			cIndex++;
		});

		//thisT.settings...
		if (data) {
			try {
				var cts = JSON.parse(data);
				//cts = cts.map(function(r){ delete r.id; return r;});
				data = cts;
			} catch (e) {
				throw 'Failed to parse the grid json';
			}
		}

		/*	    var gridPanel = new Ext.grid.GridPanel({
  			 title: lCaption,
  			 style: l_Style,
  			 hidden: hideField,
  			 bodyStyle: l_panelStyle,
  			 height: l_Height,
  			 header:{
  					titlePosition: 0,
  					items: headerButtons
  			},
  	        store: gridStore,
  	        width:l_Width,
  	        id: inFormKey+'_ctr_'+inField.formCell.replace(/,/g,"_"),
  	        //reserveScrollOffset: true,
  	        columns: listColumns,
  	        frame: true,
  	        collapsible: collapsible,
  	        collapsed: collapsed,
  	        selModel: 'cellmodel',
  	        disabled: rOnly,
  	        features: features,
  			plugins: ['gridfilters',{
  				ptype: 'cellediting',
  				clicksToEdit: 1
  	        }]
  	    });*/

		var LocalMuiTable = function (_React$Component11) {
			_inherits(LocalMuiTable, _React$Component11);

			function LocalMuiTable(props) {
				_classCallCheck(this, LocalMuiTable);

				return _possibleConstructorReturn(this, (LocalMuiTable.__proto__ || Object.getPrototypeOf(LocalMuiTable)).call(this, props));
			}

			_createClass(LocalMuiTable, [{
				key: 'getHeaders',
				value: function getHeaders() {
					return listColumns.map(function (h) {
						return React.createElement(
							MuiTableCell,
							null,
							h["header"]
						);
					});
				}
			}, {
				key: 'getDataRows',
				value: function getDataRows() {
					return data.map(function (n) {
						return React.createElement(
							MuiTableRow,
							{ key: n.id },
							listColumns.map(function (c) {
								return React.createElement(
									MuiTableCell,
									{ numeric: true },
									n[c["dataIndex"]]
								);
							})
						);
					});
				}
			}, {
				key: 'render',
				value: function render() {
					return React.createElement(
						MuiPaper,
						{ style: style },
						React.createElement(
							MuiTable,
							{ style: panelStyle },
							React.createElement(
								MuiTableHead,
								null,
								React.createElement(
									MuiTableRow,
									null,
									this.getHeaders()
								)
							),
							React.createElement(
								MuiTableBody,
								null,
								this.getDataRows()
							)
						)
					);
				}
			}]);

			return LocalMuiTable;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiTable, inFormKey, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiTable, null), inContainer);

		var thisControl = new itemControl(inFormKey + '_fld_' + inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id] = thisControl;
		//after render....
		if (ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey, item, inField, inContainer);
	}

};
