'use strict';

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
						)
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
		switch (inField.dataReference) {
			case "ijfReference":

				//The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells
				var cLookupDef = { "index": "0" };
				var cListener = {
					afterrender: function afterrender(f) {
						this.validate();
					},
					select: function select(f, n, o) {

						if (inField.dataSource == "session") {
							ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
						} else {
							ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
						}
						ocf(f, n, o);
					}
				};

				var refCheck = ijf.fw.CustomTypes.reduce(function (inObj, t) {
					if (t.name == inField.referenceFilter) inObj = t;return inObj;
				}, null);

				if (refCheck) {
					lookup = ijfUtils.getReferenceDataByName(inField.referenceFilter, "0");
				} else {
					//complex cascade...
					try {
						cLookupDef = JSON.parse(inField.referenceFilter);
						lookup = ijfUtils.getReferenceDataByName(cLookupDef.name, cLookupDef.index);

						//establish a listener for this combo if necessary
						if (cLookupDef.parents) {
							var parentIds = cLookupDef.parents;
							var cFilters = parentIds.reduce(function (inFilter, p) {
								inFilter.push({ "property": p.dataIndex.toString(), "value": "tbd", "fieldName": p.fieldName });
								return inFilter;
							}, []);
							cListener["beforeQuery"] = function (query) {
								cFilters.forEach(function (f) {
									//for each filter param, we need to get the correct value...
									var cValue = 'novaluetofilterwith';

									var ctl = ijfUtils.getControlByDataSource(f.fieldName);
									if (!ctl) ctl = ijfUtils.getControlByKey(f.fieldName);

									if (ctl) cValue = ctl.control.items.items[0].getValue();
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
								childFields.forEach(function (f) {
									var ctl = ijfUtils.getControlByDataSource(f);
									if (!ctl) ctl = ijfUtils.getControlByKey(f);

									if (ctl) cValue = ctl.control.items.items[0].setValue(null);
								});

								if (inField.dataSource == "session") {
									ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
								} else {
									ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
								}
								ocf(f, n, o);
							};
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

		var LocalMuiSelectField = function (_React$Component2) {
			_inherits(LocalMuiSelectField, _React$Component2);

			function LocalMuiSelectField(props) {
				_classCallCheck(this, LocalMuiSelectField);

				var _this2 = _possibleConstructorReturn(this, (LocalMuiSelectField.__proto__ || Object.getPrototypeOf(LocalMuiSelectField)).call(this, props));

				_this2.handleChange = function (event) {
					//add OCF call here..
					if (inField.dataSource == "session") {
						ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
					} else {
						ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
					}
					if (lValidator(event.target.value)) {
						_this2.state.errored = false;
						ocf(event);
					} else _this2.state.errored = true;
					_this2.setState(_defineProperty({}, event.target.name, event.target.value));
				};

				_this2.state = {
					svalue: data,
					lookup: lookup,
					errored: false
				};
				return _this2;
			}

			_createClass(LocalMuiSelectField, [{
				key: 'getMenu',
				value: function getMenu() {
					if (!this.state.lookup) return;
					return this.state.lookup.map(function (r) {
						return React.createElement(
							MenuItem,
							{ value: r[0] },
							r[1]
						);
					});
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
							React.createElement(
								MuiInputLabel,
								{ htmlFor: 'svalue-helper' },
								lCaption
							),
							React.createElement(
								MuiSelect,
								{
									value: this.state.svalue,
									onChange: this.handleChange,
									input: React.createElement(MuiInput, { style: fieldStyle, name: 'svalue', id: 'svalue-helper', readOnly: rOnly })
								},
								this.getMenu()
							),
							React.createElement(
								MuiFormHelperText,
								null,
								inField.toolTip
							)
						)
					);
				}
			}]);

			return LocalMuiSelectField;
		}(React.Component);

		//before render....


		if (ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiSelectField, inFormKey, item, inField, inContainer);

		var controlReference = ReactDOM.render(React.createElement(LocalMuiSelectField, null), inContainer);

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

		var LocalMuiTextField = function (_React$Component3) {
			_inherits(LocalMuiTextField, _React$Component3);

			function LocalMuiTextField(props) {
				_classCallCheck(this, LocalMuiTextField);

				var _this3 = _possibleConstructorReturn(this, (LocalMuiTextField.__proto__ || Object.getPrototypeOf(LocalMuiTextField)).call(this, props));

				_this3.handleChange = function (event) {
					//add OCF call here..
					if (inField.dataSource == "session") {
						ijf.session[inFormKey + '_fld_' + inField.formCell] = n;
					} else {
						ijf.main.controlChanged(inFormKey + '_fld_' + inField.formCell);
					}
					var ocf = ijfUtils.getEvent(inField);
					if (lValidator(event.target.value)) {
						_this3.state.errored = false;
						ocf(event);
					} else _this3.state.errored = true;
					_this3.setState({
						value: event.target.value
					});
				};

				_this3.state = {
					value: data,
					errored: false
				};
				return _this3;
			}

			_createClass(LocalMuiTextField, [{
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
						})
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

		var DynamicMenuRow = function (_React$Component4) {
			_inherits(DynamicMenuRow, _React$Component4);

			function DynamicMenuRow(props) {
				_classCallCheck(this, DynamicMenuRow);

				var _this4 = _possibleConstructorReturn(this, (DynamicMenuRow.__proto__ || Object.getPrototypeOf(DynamicMenuRow)).call(this, props));

				_this4.state = {
					menuRow: props.menuRow,
					owningClass: props.owningClass
				};
				return _this4;
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
					var _this5 = this;

					return React.createElement(
						MenuItem,
						{ onClick: function onClick() {
								return _this5.handleClick(_this5.state.owningClass);
							} },
						this.state.menuRow.label
					);
				}
			}]);

			return DynamicMenuRow;
		}(React.Component);

		var DynamicHtml = function (_React$Component5) {
			_inherits(DynamicHtml, _React$Component5);

			function DynamicHtml(props) {
				_classCallCheck(this, DynamicHtml);

				//need to do replaces here...

				var _this6 = _possibleConstructorReturn(this, (DynamicHtml.__proto__ || Object.getPrototypeOf(DynamicHtml)).call(this, props));

				var tempHtml = ijfUtils.switchAttsGeneric(props.htmlContent, props.dataRow);
				_this6.state = {
					template: { __html: tempHtml },
					dataRow: props.dataRow
				};
				return _this6;
			}

			_createClass(DynamicHtml, [{
				key: 'render',
				value: function render() {
					return React.createElement('div', { dangerouslySetInnerHTML: this.state.template });
				}
			}]);

			return DynamicHtml;
		}(React.Component);

		var MuiCard = function (_React$Component6) {
			_inherits(MuiCard, _React$Component6);

			function MuiCard(props) {
				_classCallCheck(this, MuiCard);

				var _this7 = _possibleConstructorReturn(this, (MuiCard.__proto__ || Object.getPrototypeOf(MuiCard)).call(this, props));

				_this7.handleClick = function (event) {
					_this7.setState({ anchorEl: event.currentTarget });
				};

				_this7.handleClose = function () {
					_this7.setState({ anchorEl: null });
				};

				_this7.handleDblClick = function (event) {
					console.log(event.type);
					debugger;
					ocf(event, _this7);
				};

				_this7.state = {
					row: props.dataRow,
					owningClass: props.owningClass,
					title: props.title,
					subHeader: props.subHeader,
					contentOut: props.contentOut,
					cardMenu: props.cardMenu,
					anchorEl: null
				};
				return _this7;
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
				key: 'render',
				value: function render() {
					return React.createElement(
						'div',
						null,
						React.createElement(
							Card,
							{ style: style, onClick: this.handleDblClick },
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
							)
						),
						this.getMenu(this.state.cardMenu, this)
					);
				}
			}]);

			return MuiCard;
		}(React.Component);

		var CardList = function (_React$Component7) {
			_inherits(CardList, _React$Component7);

			function CardList(props) {
				_classCallCheck(this, CardList);

				var _this8 = _possibleConstructorReturn(this, (CardList.__proto__ || Object.getPrototypeOf(CardList)).call(this, props));

				_this8.state = {
					value: dataItems
				};
				return _this8;
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
					var lRow = row;

					return React.createElement(
						'div',
						null,
						React.createElement(MuiCard, { dataRow: row,
							owningClass: owningClass,
							title: title,
							subHeader: subHeader,
							contentOut: contentOut,
							cardMenu: cardMenu })
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

		var MuiDrawer = function (_React$Component8) {
			_inherits(MuiDrawer, _React$Component8);

			function MuiDrawer() {
				var _ref;

				var _temp, _this9, _ret;

				_classCallCheck(this, MuiDrawer);

				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				return _ret = (_temp = (_this9 = _possibleConstructorReturn(this, (_ref = MuiDrawer.__proto__ || Object.getPrototypeOf(MuiDrawer)).call.apply(_ref, [this].concat(args))), _this9), _this9.state = {
					top: false,
					left: false,
					bottom: false,
					right: false
				}, _this9.toggleDrawer = function (side, open) {
					return function () {
						_this9.setState(_defineProperty({}, side, open));
					};
				}, _temp), _possibleConstructorReturn(_this9, _ret);
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
	}

};
