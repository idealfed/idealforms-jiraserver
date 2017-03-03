var ijf = ijf || {};

ijf.admin = {

	cwfAdmin_thisField:"",
	cwfAdmin_fieldId:"",
	cwfAdmin_thisTable:"",
	cwfAdmin_form:null,


    readConfigFormFile:function(inFile)
	{
		var input = event.target;

		var reader = new FileReader();
		reader.onload = function(){
		   try
 		   {
			  //need to parse this out, //clear extjs and render Form Admin.
			  var tForm = JSON.parse(reader.result);

			  var thisF = {};

			  thisF.name = ijf.admin.cwfAdmin_form.name;
			  thisF.formType = ijf.admin.cwfAdmin_form.formType;
			  thisF.formSet = ijf.admin.cwfAdmin_form.formSet;
			  thisF.testIssue = ijf.admin.cwfAdmin_form.testIssue;
			  thisF.id = ijf.admin.cwfAdmin_form.id;

				if(tForm.hasOwnProperty("formSettings")) thisF.rawSettings = JSON.parse(JSON.parse(tForm.formSettings));
				if(tForm.hasOwnProperty("fields")) thisF.rawFields = JSON.parse(JSON.parse(tForm.fields));
                thisF.settings=[];
				if(!thisF.rawSettings) thisF.rawSettings=[];
				if(!thisF.rawFields) thisF.rawFields=[];
				thisF.rawSettings.forEach(function(s){
					if(!s.name) return;
					thisF.settings[s.name]=s.value;
				});
  			    thisF.fields=[];
				thisF.rawFields.forEach(function(s){
					if(!s.formCell) return;
					thisF.fields[s.formCell]=s;
				});

			  ijfUtils.clearExt();
			  Ext.destroy(ijf.admin.cwfAdmin_settingsPanel);
			  ijf.admin.renderFormAdmin(thisF);
			  ijfUtils.modalDialogMessage("WARNING","You have loaded a form configuration file.  To store these settings you must Save the settings; doing so will overwirte the settings and fields of this form on the server.  Refresh browser to undo.");
			}
			catch(e)
			{
				ijfUtils.modalDialogMessage("Error","Problem loading the form file: " + e.message);
			}

		};
  		reader.readAsText(input.files[0]);
	},

	renderFormAdmin:function(inForm)
	{
		var outStr = "Editing form: " + g_formId + "<br>";
		outStr = outStr + "Item for data binding: " + ijf.currentItem.key + "<br>";

		if((g_formId=="") || (!ijf.currentItem))
		{
			//look for defaultForm in settings
			ijfUtils.footLog("No form");
			$('#ijfContent').html("<div style='text-align: center; color: royalblue'>" +
				"Sorry but no form or no issue is constructed.<br>" +
				"Please make sure to include these in your URL</div>");
			return;
		}
		else
		{

			var thisForm = inForm; //ijf.fw.forms[g_formId];
			//cwfAdmin_form = thisForm;
			ijf.admin.cwfAdmin_form = thisForm;
			//based on the form, it should get edit or add meta...

		    if(!ijf.jiraEditMeta.hasOwnProperty(ijf.main.itemId))
		    {
				ijf.jiraEditMeta[ijf.currentItem.key] = ijfUtils.getJiraIssueMetaSync(ijf.currentItem.key);
				ijf.jiraEditMetaKeyed[ijf.currentItem.key] = [];
				Object.keys(ijf.jiraEditMeta[ijf.currentItem.key].fields).forEach(function(f)
				{
					ijf.jiraEditMetaKeyed[ijf.currentItem.key][ijf.jiraEditMeta[ijf.currentItem.key].fields[f].name]=ijf.jiraEditMeta[ijf.currentItem.key].fields[f];
				});
		    }

		}

		//get form or die
		var formTypeLookup = ["Edit","Add"];
		var formType = "Edit";

	     var fileLoad = "<form enctype='multipart/form-data' id='adminattachmentUploadFormId'><input id='adminattachmentUploadFileId' type='file' name='file' onChange='ijf.admin.readConfigFormFile(event)';></form>";

		if(ijf.admin.cwfAdmin_form.formType) formType =ijf.admin.cwfAdmin_form.formType;
		var cntPanel = new Ext.FormPanel({
			labelAlign: 'left',
			title: "IdealFed.com JIRA Form Designer: " + ijf.admin.cwfAdmin_form.name,
			border :false,
			layout: 'vbox',
			frame:false,
			collapsible: true,
			collapsed: true, //set to true when done
			width: 900,
			buttonAlign: 'left',
			//hidden: hideField,
			margin: '5 0 0 0',
			bodyStyle: "border-top:none",
			items: [
			{
				xtype: 'textfield',
				labelAlign: 'left',
				labelWidth: 100,
				margin: '4 0 0 10',
				fieldLabel: "Form Name",
				fieldStyle: "background:lightgray",
				readOnly: true,
				labelSeparator: ijfUtils.helpLink("formName"),
				labelStyle: "color:darkblue",
				width: 400,
				value: thisForm.name,
				id: "adminFormSettings_formNameId",
				listeners: {
					change: function(f, n, o){
						ijf.admin.cwfAdmin_form.name = n;
						f.addCls("cwf-dirty");
					}
				}},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					margin: '4 0 0 10',
					readOnly: true,
					fieldLabel: "Test Issue",
					fieldStyle: "background:lightgray",
					labelSeparator: ijfUtils.helpLink("testIssue"),
  				    labelStyle: "color:darkblue",
					width: 200,
					value: ijf.main.itemId,
					id: "adminFormSettings_testIssueId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.testIssue = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'combobox',
					labelAlign: 'left',
					forceSelection: true,
					store: formTypeLookup,
					labelWidth: 100,
					margin: '4 0 0 10',
					readOnly: true,
					fieldLabel: "Form Type",
					fieldStyle: "background:lightgray",
					labelSeparator: ijfUtils.helpLink("formType"),
					labelStyle: "color:darkblue",
					triggerAction: 'all',
					width: 200,
					value: formType,
					id: "adminFormSettings_formTypeId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.formType = n;
							f.addCls("cwf-dirty");
										}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Form Group",
					labelSeparator: ijfUtils.helpLink("formGroup"),
					fieldStyle: "background:lightgray",
  				    labelStyle: "color:darkblue",
					width: 400,
					margin: '4 0 0 10',
					readOnly: true,
					value: ijf.admin.cwfAdmin_form.formSet.projectName,
					id: "adminFormSettings_formGroupId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.formSet.projectName = n;
							f.addCls("cwf-dirty");
						}}
				},{
					html: fileLoad,
					frame: false,
					hidden: true,
					border: false,
					xtype: "panel"}],
				buttons: [
				{
				            xtype: 'button',
				            fieldLabel: 'ccc',
				            text: 'Upload Form',
				            id: 'ijfAdminUploadButtonId',
				            listeners: {
				                click: function(f,n,o){
									$('#adminattachmentUploadFileId').trigger('click');
				                }
				            }
        			},
				{
				            xtype: 'button',
				            fieldLabel: 'ccc',
				            text: 'Download Form',
				            id: 'ijfAdminDownloadButtonId',
				            listeners: {
				                click: function(f,n,o){

									var settingsOut = new Array();
									var fieldsOut = new Array();
									for(var j in ijf.admin.cwfAdmin_form.settings)
									{
										if(!ijf.admin.cwfAdmin_form.settings.hasOwnProperty(j)) continue;
										settingsOut.push({name:j,value:thisForm.settings[j],comment:""});
									};
									for(var j in ijf.admin.cwfAdmin_form.fields)
									{
										if(!ijf.admin.cwfAdmin_form.fields.hasOwnProperty(j)) continue;
										fieldsOut.push(thisForm.fields[j]);
									};
									var jOut = {
										id: ijf.admin.cwfAdmin_form.id,
										testIssue: ijf.admin.cwfAdmin_form.testIssue,
										formType: ijf.admin.cwfAdmin_form.formType,
										name: ijf.admin.cwfAdmin_form.name,
										fields: JSON.stringify(JSON.stringify(fieldsOut)),
										formSettings: JSON.stringify(JSON.stringify(settingsOut))
										};
									//output....ijf.admin.cwfAdmin_form
										var outStr = JSON.stringify(jOut);
										var blob = new Blob([outStr], {type: "text/plain;charset=utf-8"});
										saveAs(blob,ijf.admin.cwfAdmin_form.name + ".txt")
				                }
				            }
        			}
				],
				header:{
				                titlePosition: 0,
				                items:[{
									xtype:'button',
									text:"Preview Form",
									handler: function(){
									   // render a local version
										ijfUtils.clearAll();
										ijf.admin.renderForm("ijfContent",false);
									}
								},
								{xtype:'button',
								 text: "Preview Layout",
									handler: function(){
										ijfUtils.clearAll();
										ijf.admin.renderForm("ijfContent",true);
									}},
								{xtype:'button',
								  text: "Open Form",
									handler: function(){
										if(ijf.admin.cwfAdmin_form.testIssue)
										{
											var tUrl = g_root + '/plugins/servlet/jforms?itemId='+ijf.admin.cwfAdmin_form.testIssue+'&formId='+ijf.admin.cwfAdmin_form.name;
										}
										else
										{
											var tUrl = g_root + '/plugins/servlet/jforms?formId='+ijf.admin.cwfAdmin_form.name;
										}
										window.open(tUrl);
									}},
								{xtype:'button',
								text:"Save Settings",
									handler: function(){

										//ijfUtils.showProgress();
										ijf.admin.saveSettings();

									}
								}]
                 }
			});

	   // showProgress();
	   // mwf_reloadFramework(fw,inContainerId, false);
		//mwf_reloadFramework(setup, "mwfContent", true);

		var pnl = new Ext.FormPanel({
			labelAlign: 'left',
			border:true,
			collapsible: true,
			collapsed: true, //set to true when done
			title: "Form Layout",
			margin: '5 0 0 0',
			width: 900,
			//hidden: hideField,
			//bodyStyle: l_Style,
			items: [{
				xtype: 'textfield',
				labelAlign: 'left',
				labelWidth: 100,
				fieldLabel: "Row Count",
				labelSeparator: ijfUtils.helpLink("rowCount"),
				width: 150,
				value: thisForm.settings["rows"],
				id: "adminFormSettings_rowsId",
				listeners: {
					change: function(f, n, o){
						ijf.admin.cwfAdmin_form.settings["rows"] = n;
						f.addCls("cwf-dirty");
					}
				}},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Column Count",
					width: 150,
					value: thisForm.settings["columns"],
					id: "adminFormSettings_colsId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["columns"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Column Spans",
					width: 900,
					value: thisForm.settings["columnSpans"],
					id: "adminFormSettings_colSpanId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["columnSpans"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Column Widths",
					width: 900,
					value: thisForm.settings["columnWidths"],
					id: "adminFormSettings_colWidthId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["columnWidths"] = n;
							f.addCls("cwf-dirty");
						}}
				},

				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Header Left",
					width: 900,
					value: thisForm.settings["headerLeft"],
					id: "adminFormSettings_headerLeftId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["headerLeft"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Header Center",
					width: 900,
					value: thisForm.settings["headerCenter"],
					id: "adminFormSettings_headerCenterId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["headerCenter"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Header Right",
					width: 900,
					value: thisForm.settings["headerRight"],
					id: "adminFormSettings_headerRightId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["headerRight"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Outer Style",
					width: 900,
					value: thisForm.settings["outerContainerStyle"],
					id: "adminFormSettings_outerStyleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["outerContainerStyle"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Inner Style",
					width: 900,
					value: thisForm.settings["outerTableStyle"],
					id: "adminFormSettings_innerStyleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["outerTableStyle"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Header Style",
					width: 900,
					value: thisForm.settings["title_style"],
					id: "adminFormSettings_titleStyleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["title_style"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Tab Title",
					width: 900,
					value: thisForm.settings["tabTitle"],
					id: "adminFormSettings_tabTitleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["tabTitle"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "On Load",
					width: 900,
					value: thisForm.settings["onLoad"],
					id: "adminFormSettings_onLoadId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["onLoad"] = n;
							f.addCls("cwf-dirty");
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Batch Save",
					width: 900,
					value: thisForm.settings["batchSave"],
					id: "adminFormSettings_batchSaveId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_form.settings["batchSave"] = n;
							f.addCls("cwf-dirty");
						}}
				}]
		});



		//now render the fields....
		//do a side by side panel with grid selector on left and fields on right.
		if(!Ext.ClassManager.isCreated('gridFieldFieldsArray'))
		{
			Ext.define('gridFieldFieldsArray', {
				extend: 'Ext.data.Model',
				fields: [
					{name: 'cell',  type: 'string'},
					{name: 'type', type: 'string'},
					{name: 'source', type: 'string'}
				]
			});
		}
		if(!Ext.ClassManager.isCreated('fieldFieldsArray'))
		{
			Ext.define('fieldFieldsArray', {
				extend: 'Ext.data.Model',
				fields: [
					{name: 'caption',  type: 'string'},
					{name: 'controlType', type: 'string'},
					{name: 'formCell', type: 'string'},
					{name: 'dataSource', type: 'string'},
					{name: 'dataReference', type: 'string'},
					{name: 'style', type: 'string'},
					{name: 'panelStyle', type: 'string'},
					{name: 'labelStyle', type: 'string'},
					{name: 'referenceFilter', type: 'string'},
					{name: 'tableHeaders', type: 'string'},
					{name: 'tableColumns', type: 'string'},
					{name: 'tableWidths', type: 'string'},
					{name: 'tableHeaders', type: 'string'},
					{name: 'tableDblClick', type: 'string'},
					{name: 'event', type: 'string'},
					{name: 'renderIf', type: 'string'},
					{name: 'toolTip', type: 'string'},
					{name: 'dataReference2', type: 'string'},
					{name: 'persistInItem', type: 'string'}
				]
			});
		}

		ijf.admin.cwfAdmin_thisField = {};

		var fieldStore = new Ext.data.Store({
			model: 'gridFieldFieldsArray'
		});
		var fArray = new Array();

		for(var f in thisForm.fields)
		{
			if(thisForm.fields.hasOwnProperty(f))
			{
				fArray.push({"cell":f,"type":thisForm.fields[f].controlType,"source":thisForm.fields[f].dataSource});
				cwfAdmin_fieldId = f;
				ijf.admin.cwfAdmin_thisField = thisForm.fields[f];
			}
		}
		fieldStore.loadData(fArray);

		   var l_tbar=[];

			l_tbar.push({
				iconCls: 'icon-user-add',
				text: 'Add',
				align: 'center',
				handler: function(){

					var rec = Ext.create('gridFieldFieldsArray');
					var ts =new Date().getTime();
					rec.data.cell=ts;
					listView.getStore().insert(0, rec);
					listView.getView().refresh();
					rec = Ext.create('fieldFieldsArray');
					rec.data.formCell=ts;
					ijf.admin.cwfAdmin_form.fields[ts]=rec.data;

				}
			});
			l_tbar.push({
				ref: '../removeBtn',
				iconCls: 'icon-user-delete',
				text: 'Remove',
				handler: function(){
					//editor.stopEditing();
					var s = listView.getSelectionModel().getSelection();
					for(var i = 0, r; r = s[i]; i++){
						listView.getStore().remove(r);
						delete ijf.admin.cwfAdmin_form.fields[r.data.cell];
					}
					listView.getView().refresh();
				}
			});
		l_tbar.push({
			text: 'Refresh List',
			handler: function(){
				fArray = new Array();
				for(var f in thisForm.fields)
				{
					if(thisForm.fields.hasOwnProperty(f))
					{
						fArray.push({"cell":f,"type":thisForm.fields[f].controlType,"source":thisForm.fields[f].dataSource});
						cwfAdmin_fieldId = f;
						ijf.admin.cwfAdmin_thisField = thisForm.fields[f];
					}
				}
				fieldStore.loadData(fArray);
			}
		});



		var listView = new Ext.grid.GridPanel({
			store: fieldStore,
			height:800,
			width:350,
			id: "fieldsListViewId",
			//reserveScrollOffset: true,
			columns: [{
				header: 'Cell',
				width:50,
				hidden: false,
				dataIndex: 'cell'
			},
				{
					header: 'Type',
					width:100,
					sortable: true,
					dataIndex: 'type'
				},
				{
					header: 'Source',
					width:200,
					sortable: true,
					dataIndex: 'source'
				}],
			tbar: l_tbar,
			listeners: {
				selectionchange:function(view, record, eops) {
					if(record.length==0) return;
					cwfAdmin_fieldId =record[0].data.cell;
					if(!cwfAdmin_fieldId)
					{
						Ext.getCmp("adminFormFields_captionId").setValue("");
						Ext.getCmp("adminFormFields_controlTypeId").setValue("");
						Ext.getCmp("adminFormFields_formCellId").setValue("");
						Ext.getCmp("adminFormFields_dataSourceId").setValue("");
						Ext.getCmp("adminFormFields_dataReferenceId").setValue("");
						Ext.getCmp("adminFormFields_styleId").setValue("");
						Ext.getCmp("adminFormFields_panelStyleId").setValue("");
						Ext.getCmp("adminFormFields_labelStyleId").setValue("");
						Ext.getCmp("adminFormFields_referenceFilterId").setValue("");
						Ext.getCmp("adminFormFields_regExId").setValue("");
						Ext.getCmp("adminFormFields_regExMessageId").setValue("");
						Ext.getCmp("adminFormFields_tableWidthsId").setValue("");
						Ext.getCmp("adminFormFields_tableHeadersId").setValue("");
						Ext.getCmp("adminFormFields_tableDblClickId").setValue("");
						Ext.getCmp("adminFormFields_eventId").setValue("");
						Ext.getCmp("adminFormFields_renderIfId").setValue("");
						Ext.getCmp("adminFormFields_fieldStyleId").setValue("");
						Ext.getCmp("adminFormFields_toolTipId").setValue("");
						Ext.getCmp("adminFormFields_dataReference2Id").setValue("");



					}
					else
					{
					ijf.admin.cwfAdmin_thisField = ijf.admin.cwfAdmin_form.fields[cwfAdmin_fieldId];
					Ext.getCmp("adminFormFields_captionId").setValue(ijf.admin.cwfAdmin_thisField["caption"]);
					Ext.getCmp("adminFormFields_controlTypeId").setValue(ijf.admin.cwfAdmin_thisField["controlType"]);
					Ext.getCmp("adminFormFields_formCellId").setValue(ijf.admin.cwfAdmin_thisField["formCell"]);
					Ext.getCmp("adminFormFields_dataSourceId").setValue(ijf.admin.cwfAdmin_thisField["dataSource"]);
					Ext.getCmp("adminFormFields_dataReferenceId").setValue(ijf.admin.cwfAdmin_thisField["dataReference"]);
					Ext.getCmp("adminFormFields_styleId").setValue(ijf.admin.cwfAdmin_thisField["style"]);
					Ext.getCmp("adminFormFields_panelStyleId").setValue(ijf.admin.cwfAdmin_thisField["panelStyle"]);
					Ext.getCmp("adminFormFields_labelStyleId").setValue(ijf.admin.cwfAdmin_thisField["labelStyle"]);
					Ext.getCmp("adminFormFields_referenceFilterId").setValue(ijf.admin.cwfAdmin_thisField["referenceFilter"]);
					Ext.getCmp("adminFormFields_regExId").setValue(ijf.admin.cwfAdmin_thisField["regEx"]);
					Ext.getCmp("adminFormFields_regExMessageId").setValue(ijf.admin.cwfAdmin_thisField["regExMessage"]);
					Ext.getCmp("adminFormFields_tableWidthsId").setValue(ijf.admin.cwfAdmin_thisField["tableWidths"]);
					Ext.getCmp("adminFormFields_tableHeadersId").setValue(ijf.admin.cwfAdmin_thisField["tableHeaders"]);
					Ext.getCmp("adminFormFields_tableDblClickId").setValue(ijf.admin.cwfAdmin_thisField["tableDblClick"]);
					Ext.getCmp("adminFormFields_eventId").setValue(ijf.admin.cwfAdmin_thisField["event"]);
					Ext.getCmp("adminFormFields_toolTipId").setValue(ijf.admin.cwfAdmin_thisField["toolTip"]);
					Ext.getCmp("adminFormFields_dataReference2Id").setValue(ijf.admin.cwfAdmin_thisField["dataReference2"]);
					Ext.getCmp("adminFormFields_renderIfId").setValue(ijf.admin.cwfAdmin_thisField["renderIf"]);
					Ext.getCmp("adminFormFields_fieldStyleId").setValue(ijf.admin.cwfAdmin_thisField["fieldStyle"]);
					}
				}
			}
		});


		var lookup = ["attachmentlist","attachmentupload","button","checkbox","commentlist","datebox","dropdown","html","itemlist","formbuttons","multiselect","navigatetoform","subform","popform","radio","tabmenu","textarea","textbox","userpicker"];

	    var  sectionLookup = [];


		if(ijf.currentItem)
			if(ijf.jiraEditMetaKeyed[ijf.currentItem.key]) sectionLookup = Object.keys(ijf.jiraEditMetaKeyed[ijf.currentItem.key]);

		sectionLookup.push("Status");
	 	sectionLookup=sectionLookup.sort();

		var fieldPanel = new Ext.FormPanel({
			border:true,
			width: 850,
			//hidden: hideField,
			//bodyStyle: l_Style,
			items: [{
				xtype: 'textfield',
				labelAlign: 'left',
				labelWidth: 100,
				fieldLabel: "Caption",
				width: 500,
				value: ijf.admin.cwfAdmin_thisField["caption"],
				id: "adminFormFields_captionId",
				listeners: {
					change: function(f, n, o){
						ijf.admin.cwfAdmin_thisField["caption"] = n;
					}}
			},
				{
					xtype: 'combobox',
					labelAlign: 'left',
					forceSelection: true,
					store: lookup,
					labelWidth: 100,
					fieldLabel: "Control Type",
					triggerAction: 'all',
					width: 400,
					value: ijf.admin.cwfAdmin_thisField["controlType"],
					id: "adminFormFields_controlTypeId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["controlType"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Cell",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["formCell"],
					id: "adminFormFields_formCellId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["formCell"] = n;
						}}
				},
				{
					xtype: 'combobox',
					triggerAction: 'all',
					labelAlign: 'left',
					labelWidth: 100,
					forceSelection: false,
					store: sectionLookup,
					fieldLabel: "Data Source",
					width: 400,
					value: ijf.admin.cwfAdmin_thisField["dataSource"],
					id: "adminFormFields_dataSourceId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["dataSource"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Data Reference",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["dataReference"],
					id: "adminFormFields_dataReferenceId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["dataReference"] = n;
						}}
				},


				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Outer Style",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["style"],
					id: "adminFormFields_styleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["style"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Inner Style",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["panelStyle"],
					id: "adminFormFields_panelStyleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["panelStyle"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Field Style",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["fieldStyle"],
					id: "adminFormFields_fieldStyleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["fieldStyle"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Label Style",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["labelStyle"],
					id: "adminFormFields_labelStyleId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["labelStyle"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Reference Filter",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["referenceFilter"],
					id: "adminFormFields_referenceFilterId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["referenceFilter"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "RegEx Valid.",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["regEx"],
					id: "adminFormFields_regExId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["regEx"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "RegEx Mess.",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["regExMessage"],
					id: "adminFormFields_regExMessageId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["regExMessage"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Tb. Col. Widths",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["tableWidths"],
					id: "adminFormFields_tableWidthsId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["tableWidths"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Tb. Col. Heads",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["tableHeaders"],
					id: "adminFormFields_tableHeadersId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["tableHeaders"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Tb. Dbl Clk",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["tableDblClick"],
					id: "adminFormFields_tableDblClickId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["tableDblClick"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Event",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["event"],
					id: "adminFormFields_eventId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["event"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Tool Tip",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["toolTip"],
					id: "adminFormFields_toolTipId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["toolTip"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Data Ref2",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["dataReference2"],
					id: "adminFormFields_dataReference2Id",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["dataReference2"] = n;
						}}
				},
				{
					xtype: 'textfield',
					labelAlign: 'left',
					labelWidth: 100,
					fieldLabel: "Render If",
					width: 500,
					value: ijf.admin.cwfAdmin_thisField["renderIf"],
					id: "adminFormFields_renderIfId",
					listeners: {
						change: function(f, n, o){
							ijf.admin.cwfAdmin_thisField["renderIf"] = n;
						}}
				}

			]
		});


		var cwfAdmin_fieldsPanel = new Ext.FormPanel({
			border:true,
			frame:true,
			width: 900,
			layout:'hbox',
			margin: '5 0 0 0',
			collapsible: true,
			collapsed: true,
			title: "Form Fields",
			id: "cwfAdmin_fieldsPanel_id",
			//hidden: hideField,
			//bodyStyle: l_Style,
			items: [listView, fieldPanel]
		});



		//cwfAdmin_fieldsPanel.render(document.getElementById("ijfCraft2"));

		//controlSet[cwfAdmin_fieldsPanel.id] = new itemControl(cwfAdmin_fieldsPanel.id, null, null, cwfAdmin_fieldsPanel, null);

		//add snippet manager at bottom...

		if(!Ext.ClassManager.isCreated('snippetArray'))
		{
			Ext.define('snippetArray', {
				extend: 'Ext.data.Model',
				fields: [
					{name: 'id',  type: 'string'},
					{name: 'name', type: 'string'},
					{name: 'snippet', type: 'string'}
				]
			});
		}
		var snippetStore = new Ext.data.Store({
			model: 'snippetArray'
		});


		var snips = [];
		ijf.admin.cwfAdmin_form.formSet.snippets.forEach(function(s)
		{
			if(s.name)
			snips.push({
				id: s.id,
				name: s.name,
				snippet: s.snippet
			});
		});

		snippetStore.loadData(snips);

		var s_tbar=[];

		s_tbar.push({
			iconCls: 'icon-user-add',
			text: 'Add',
			align: 'center',
			handler: function(){
				var rec = Ext.create('snippetArray');
				snippetPanel.getStore().insert(0, rec);
			}
		});

		//controls
		var delOption = {
			icon: g_imagesRoot + 'dd/drop-no.png',
			tooltip: 'Delete snippet',
			handler: function(grid, rowIndex, colIndex) {
				var rec = grid.store.getAt(rowIndex);
				//alert("Delete " + rec.get('id'));

				var sId = rec.get('id');


				if (rec.get('author')=="")
				{
					//this guy has not been added yet
					grid.getStore().removeAt(rowIndex);
				}
				else
				{
					if (sId.indexOf("Added")>-1)
					{
						ijfUtils.modalDialogMessage("Information Message","Sorry, you must reload the exercise before deleting this snippet.");
						return;
					}
					var fun = function(){
						//save the snippet
						var i = 's';
					};

					ijfUtils.modalDialog("Snippet Deletion","Are you sure you want to delete this snippet?<br>  This action is permanent and immediate.",fun);

				}
			}
		};




		var ce  = new Ext.grid.plugin.CellEditing({
			clicksToEdit: 1
		});
		var snippetPanel = new Ext.grid.GridPanel({
			store: snippetStore,
			height:600,
			width:900,
			id: "snippetPanelId",
			//reserveScrollOffset: true,
			columns: [
				{
					header: 'ID',
					width:50,
					sortable: true,
					dataIndex: 'id'
				},
				{
					header: 'Name',
					width:150,
					sortable: true,
					dataIndex: 'name',
					editor: {
						allowBlank: true,
						xtype: 'textfield',
						width: 'auto'
					}
				},
				{
					header: 'Snippet',
					width:500,
					sortable: true,
					dataIndex: 'snippet',
					editor: {
						xtype: 'textarea',
						allowBlank: true,
						width: 'auto'
					}
				},
				{
					header: 'Status',
					width:100,
					sortable: true,
					dataIndex: 'status'
				},
				{
					header: 'Actions',
					xtype: 'actioncolumn',
					width: 65,
					items: [{icon: g_imagesRoot + 'dd/drop-yes.png',
						handler: function(grid, rowIndex, colIndex) {
							var rec = grid.store.getAt(rowIndex);
							//alert("Delete " + rec.get('id'));

							var sId = rec.get('id');

							if (sId.indexOf("snippetArray")>-1)
							{
								sId = 0;
							}
								 //this guy has not been added yet

							rec.set('status','saving');
							var sendData = {
								snippetId: sId,
								formSetId: ijf.admin.cwfAdmin_form.formSet.id,
								name: rec.get('name'),
								snippet: JSON.stringify(rec.get('snippet'))
							};
							var sJson = JSON.stringify(sendData);
							var sRes = ijfUtils.saveJiraFormSync(sJson,"saveSnippet");
							if(sRes=="OK")
							{
								rec.set('status','Saved');
								rec.commit();
							}
							else
							{
								rec.data.status = "Error";
								ijfUtils.modalDialogMessage("Error","Unable to save the snippet: " + sRes);
							}
						}
					},delOption]
				}],
			plugins: [ce],
			tbar: s_tbar
		});


		var cwfAdmin_snippetPanel = new Ext.FormPanel({
			border: true,
			frame: true,
			title: "Javascript Business Rules",
			width: 900,
			layout:'vbox',
			margin: '5 0 0 0',
			collapsible: true,
			collapsed: true,
			id: "cwfAdmin_snippetPanel_id",
			items: [snippetPanel]
		});

		ijf.admin.cwfAdmin_settingsPanel = new Ext.FormPanel({
			frame: false,
			border: false,
			width: 910,
			layout:'vbox',
			collapsible: false,
			collapsed: false,
			bodyStyle: "margin-left:10px",
			id: "cwfAdmin_settingsPanel_id",
			//hidden: hideField,
			//bodyStyle: l_Style,
			items: [cntPanel, pnl, cwfAdmin_fieldsPanel, cwfAdmin_snippetPanel]
		});

		ijf.admin.cwfAdmin_settingsPanel.render(document.getElementById("ijfCraft1"));

/*

		//now render the reference data....
		//do a side by side panel with grid selector on left and table on right.
		if(!Ext.ClassManager.isCreated('gridTableArray'))
		{
			Ext.define('gridTableArray', {
				extend: 'Ext.data.Model',
				fields: [
					{name: 'Table',  type: 'string'},
					{name: 'Rows', type: 'string'}
				]
			});
		}
		if(!Ext.ClassManager.isCreated('gridTableRawArray'))
		{
			Ext.define('fieldFieldsArray', {
				extend: 'Ext.data.Model',
				fields: [
					{name: 'table',  type: 'string'},
					{name: 'field', type: 'string'},
					{name: 'type', type: 'string'},
					{name: 'colNumber', type: 'string'},
					{name: 'colValue', type: 'string'},
					{name: 'rowNumber', type: 'string'},
					{name: 'fkTable', type: 'string'},
					{name: 'fkField', type: 'string'}
				]
			});
		}

		cwfAdmin_thisTable = {};

		var tablesStore = new Ext.data.Store({
			model: 'gridTableArray'
		});
		var fTArray = new Array();

		for(var ety in fw.reference)
		{
			if(fw.reference.hasOwnProperty(ety))
			{
				var thisEnt = fw.reference[ety];
				fTArray.push({"Table":ety,"Rows":thisEnt.rows.length});
				cwfAdmin_thisTable = thisEnt;
			}
		}
		tablesStore.loadData(fTArray);

		var tableDataStore = new Ext.data.Store({
			model: 'gridTableArray'
		});
		var fRowsArray = new Array();

		tableDataStore.loadData(fRowsArray);


		var addEditTableFunction = function(){

					// model
					if(Ext.ClassManager.isCreated('addEditTableArray'))
					{
						var tempObj = Ext.getCmp('addEditTableArray');
						Ext.destroy(tempObj);
					}

					if(!Ext.ClassManager.isCreated('addEditTableArray'))
					{
						Ext.define('addEditTableArray', {
							extend: 'Ext.data.Model',
							fields: [
								{name: 'table',  type: 'string'},
								{name: 'field', type: 'string', unique:'true'},
								{name: 'type', type: 'string'},
								{name: 'colNumber', type: 'string'},
								{name: 'fkTable', type: 'string'},
								{name: 'fkField', type: 'string'}
							]
						});
					}


					//load data
					var tableAddEditStore = new Ext.data.Store({
						model: 'addEditTableArray'
					});

					if(cwfAdmin_thisTable)
					{
						//load the table specs...
						var tFieldList =cwfAdmin_thisTable.getTableSpecsAsObjArray();
						tableAddEditStore.loadData(tFieldList);
					}


					var tEditingBar=[];
					tEditingBar.push({
						iconCls: 'icon-user-add',
						text: 'Add',
						align: 'center',
						handler: function(){

							var rec = Ext.create('addEditTableArray');

							addEditTablePanel.getStore().insert(0, rec);
							addEditTablePanel.getView().refresh();

						}
					});
					tEditingBar.push({
						ref: '../removeBtn',
						iconCls: 'icon-user-delete',
						text: 'Remove',
						handler: function(){
							//editor.stopEditing();
							var s = addEditTablePanel.getSelectionModel().getSelection();
							for(var i = 0, r; r = s[i]; i++){
								addEditTablePanel.getStore().remove(r);
							}
							addEditTablePanel.getView().refresh();
						}
					});

					tEditingBar.push({
						text: 'Save',
						handler: function(){
							//create entity with one row of null data...

							//need validations:  same Table name.  if exist, don't save.
							var tRows = tableAddEditStore.getRange();
							var eName = "";
							var lastEname = "";
							var eRow = "";
							var refData = [];
							for(var tr in tRows)
							{
								if(!tRows.hasOwnProperty) continue;
								tRows[tr].commit();
								eName = tRows[tr].data.table;
								if(lastEname)
								{
									if(lastEname != eName)
									{
										//stop
										modalDialogMessage("ERROR", "Sorry, the table name must be the same for all columns.  The col numbers should be unique.");
										return;
									}
								}
								lastEname=eName;
								eRow = tRows[tr].data.table + "~~~" + tRows[tr].data.field + "~~~" +tRows[tr].data.type + "~~~" + tRows[tr].data.colNumber + "~~~~~~1~~~" + tRows[tr].data.fkTable + "~~~" + tRows[tr].data.fkField;
								refData.push(eRow.split("~~~"));
							}

							//Add the table name to the root table list....
							fw.reference[eName] = new Mwf_Entity(eName,refData,fw.reference);
							if(!cwfAdmin_thisTable)
							{
								var thisEnt = fw.reference[eName];
								var rec = Ext.create('gridTableArray');
								rec.data.Table = eName;
								rec.data.Rows = thisEnt.rows.length;
								cwfAdmin_thisTable = thisEnt;
								tWin.close();
								tablesStore.insert(0, rec);
								listAllTables.getView().refresh();
							}
						}
					});


					//create grid panel
					var tce  = new Ext.grid.plugin.CellEditing({
						clicksToEdit: 1
					});
					var addEditTablePanel = new Ext.grid.GridPanel({
						xtype: "cell-editing",
						store: tableAddEditStore,
						height:500,
						width:800,
						id: "addEditTableEditorId",
						columns:   [{
							header: 'Table Name',
							width:150,
							hidden: false,
							dataIndex: 'table',
							editor: {
								xtype: 'textfield',
								width: 'auto'
							}
						},
							{
								header: 'Field Name',
								width:150,
								hidden: false,
								dataIndex: 'field',
								editor: {
									xtype: 'textfield',
									width: 'auto'
								}
							},{
								header: 'Type',
								width:100,
								hidden: false,
								dataIndex: 'type',
								editor: {
									xtype: 'textfield',
									width: 'auto'
								}
							},{
								header: 'Col Index',
								width:100,
								hidden: false,
								dataIndex: 'colNumber',
								editor: {
									xtype: 'textfield',
									width: 'auto'
								}
							},{
								header: 'Ref Table',
								width:100,
								hidden: false,
								dataIndex: 'fkTable',
								editor: {
									xtype: 'textfield',
									width: 'auto'
								}
							},{
								header: 'Ref Field',
								width:100,
								hidden: false,
								dataIndex: 'fkField',
								editor: {
									xtype: 'textfield',
									width: 'auto'
								}
							}],
						tbar: tEditingBar,
						plugins: [tce],
						selModel: {selType: 'rowmodel', mode: 'MULTI'},
						listeners: {
							selectionchange:function(view, record, eops) {
								if(record.length==0) return;
							}
						}
					});
					addEditTablePanel.cellEditing=tce;
					var tName = "New";
					if(cwfAdmin_thisTable) tName = cwfAdmin_thisTable.name;
					var tWin = new Ext.Window({
						layout: 'fit',
						title: tName,
						width: 820,
						height: 500,
						closable: true,
						items:addEditTablePanel,
						modal: true
					});
					tWin.show();
			  };

		var l_etBar = [];

		l_etBar.push({
			text: 'Add',
			align: 'center',
			handler: function() {
				cwfAdmin_thisTable = null;
				addEditTableFunction();
			}
		});
		l_etBar.push({
			text: 'Edit',
			align: 'center',
			handler: function() {
				if(!cwfAdmin_thisTable) return;
				modalDialog("Warning","Editing a table definition will delete all data, are you sure you want to continue?",addEditTableFunction);
			}
		});
		l_etBar.push({
			ref: '../removeBtn',
			text: 'Delete',
			handler: function(){
				//editor.stopEditing();
				if(!cwfAdmin_thisTable) return;

				var dFunct = function(){
					delete fw.reference[cwfAdmin_thisTable.name];
					var s = listAllTables.getSelectionModel().getSelection();
					for(var i = 0, r; r = s[i]; i++){
						listAllTables.getStore().remove(r);
					}
					listAllTables.getView().refresh();
				};

				modalDialog("Warning","This will delete the table definition and all data, are you sure you want to continue?",dFunct);
			}
		});
		l_etBar.push({
			text: 'Save',
			align: 'center',
			handler: function() {
				showProgress();
				fw.saveReferenceData();
			}
		});

		var table_tbar=[];
		//Editor for table data
		table_tbar.push({
			text: 'Edit Values',
			align: 'center',
			handler: function(){
				//dynamic table of data....

				if(!cwfAdmin_thisTable) return;
				var firstRow;
				for(var rw in cwfAdmin_thisTable.rows)
				{
					if(cwfAdmin_thisTable.rows.hasOwnProperty(rw))
					{
						firstRow = cwfAdmin_thisTable.rows[rw];
						break;
					}
				}
				if(!firstRow) return;

				//dynamic model
				if(Ext.ClassManager.isCreated('dynamicTableArray'))
				{
					var tempObj = Ext.getCmp('dynamicTableArray');
					Ext.destroy(tempObj);
				}

				//each field, create paring...
				var tFieldDefs = [];
				var tPanelCols = [];
				var winWidth = 110;
				tFieldDefs.push({name:"rowkey",type:"string"});
				tPanelCols.push( {
						header: "ID",
						width: 75,
						hidden: false,
						readOnly: true,
						dataIndex: "rowkey"
					}
				);
				for(var rf in firstRow.fields)
				{
					if(firstRow.fields.hasOwnProperty(rf))
					{
						var thisField = firstRow.fields[rf];
						tFieldDefs.push({name:thisField.colName,type:"string"});
						tPanelCols.push( {
								header: thisField.colName,
								width:150,
								hidden: false,
								dataIndex: thisField.colName,
								readOnly: false,
								editor: {
									xtype: 'textfield',
									width: 'auto'
								}
							}
						);
						winWidth+=150;
					}
				}

				Ext.define('dynamicTableArray', {
					extend: 'Ext.data.Model',
					fields: tFieldDefs
				   });

				//load data
				var tableEditorStore = new Ext.data.Store({
					model: 'dynamicTableArray'
				});

				tableEditorStore.loadData(cwfAdmin_thisTable.getTableAsObjArray());



				var tEditingBar=[];
				tEditingBar.push({
					iconCls: 'icon-user-add',
					text: 'Add',
					align: 'center',
					handler: function(){

						var rec = Ext.create('dynamicTableArray');

						rec.data.rowkey = cwfAdmin_thisTable.getNextKey();

						listTables.getStore().insert(0, rec);
						listTables.getView().refresh();

					}
				});
				tEditingBar.push({
					ref: '../removeBtn',
					iconCls: 'icon-user-delete',
					text: 'Remove',
					handler: function(){
						//editor.stopEditing();
						var s = listTables.getSelectionModel().getSelection();
						for(var i = 0, r; r = s[i]; i++){
							cwfAdmin_thisTable.removeRow(r);
							listTables.getStore().remove(r);
						}
						listTables.getView().refresh();
					}
				});

				tEditingBar.push({
					text: 'Save',
					handler: function(){
						//editor.stopEditing();
						//for each row that has changed.  update it in the Entity...
					   var tRows = tableEditorStore.getRange();
					   for(var tr in tRows)
					   {
						  tRows[tr].commit();
						  if(tRows.hasOwnProperty(tr)) cwfAdmin_thisTable.updateRow(tRows[tr]);
					   }
					}
				});


				//create grid panel
				var tce  = new Ext.grid.plugin.CellEditing({
					clicksToEdit: 1
				});
				var listTables = new Ext.grid.GridPanel({
					xtype: "cell-editing",
					store: tableEditorStore,
					height:500,
					width:winWidth,
					id: "dynamicTableEditorId",
					columns: tPanelCols,
					tbar: tEditingBar,
					plugins: [tce],
					selModel: {selType: 'rowmodel', mode: 'MULTI'},
					listeners: {
						selectionchange:function(view, record, eops) {
							if(record.length==0) return;
						}
					}
				});
				listTables.cellEditing=tce;

				var tWin = new Ext.Window({
					layout: 'fit',
					title: cwfAdmin_thisTable.name,
					width: winWidth+20,
					height: 500,
					closable: true,
					items:listTables,
					modal: true
				});
				tWin.show();
			}
		});



		var listAllTables = new Ext.grid.GridPanel({
			store: tablesStore,
			height:600,
			width:200,
			id: "fieldsListViewId",
			//reserveScrollOffset: true,
			columns: [{
				header: 'Table',
				width:150,
				hidden: false,
				dataIndex: 'Table'
			},
				{
					header: 'Rows',
					width:50,
					sortable: true,
					dataIndex: 'Rows'
				}],
			tbar: l_etBar,
			listeners: {
				selectionchange:function(view, record, eops) {
					if(record.length==0) return;

					cwfAdmin_thisTable =fw.reference[record[0].data.Table];

					if(!cwfAdmin_thisTable) return;
					//tableRawPanel.removeAll();
					tableDataStore.removeAll();
					fRowsArray = new Array();
					for(var rw in cwfAdmin_thisTable.rows)
					{
						if(cwfAdmin_thisTable.rows.hasOwnProperty(rw))
						{
							var thisRow = cwfAdmin_thisTable.rows[rw];
							for(var rf in thisRow.fields)
							{
								if(thisRow.fields.hasOwnProperty(rf))
								{
									var thisField = thisRow.fields[rf];
									fRowsArray.push({"table":thisField.entity.name,"field":thisField.colName,"type":thisField.colType,"colNumber":thisField.colNumber,"colValue":thisField.colValue,"rowNumber":thisField.rowkey,"fkTable":thisField.fkEntity,"fkField":thisField.fkField,});
								}
							}
						}
					}
					tableDataStore.loadData(fRowsArray);
				}
			}
		});



		var tableRawPanel = new Ext.grid.GridPanel({
			store: tableDataStore,
			height:600,
			width:800,
			id: "tableDataRawViewId",
			//reserveScrollOffset: true,
			columns: [{
						header: 'Table',
						width:100,
						hidden: false,
						dataIndex: 'table'
					},
				{
					header: 'Field',
					width:100,
					hidden: false,
					dataIndex: 'field'
				},{
					header: 'Type',
					width:50,
					hidden: false,
					dataIndex: 'type'
				},{
					header: 'Col',
					width:50,
					hidden: false,
					dataIndex: 'colNumber'
				},{
					header: 'Value',
					width:100,
					hidden: false,
					dataIndex: 'colValue'
				},{
					header: 'Row',
					width:75,
					hidden: false,
					dataIndex: 'rowNumber'
				},{
					header: 'Ref Table',
					width:100,
					hidden: false,
					dataIndex: 'fkTable'
				},{
					header: 'Ref Field',
					width:100,
					hidden: false,
					dataIndex: 'fkField'
				}],
			tbar: table_tbar,
			listeners: {
				selectionchange:function(view, record, eops) {
					if(record.length==0) return;
				}
			}
		});




		var cwfAdmin_referencePanel = new Ext.FormPanel({
			border:true,
			width: 900,
			layout:'hbox',
			collapsible: true,
			collapsed: true,
			title: "Reference Data",
			id: "cwfAdmin_referencePanel_id",
			//hidden: hideField,
			//bodyStyle: l_Style,
			items: [listAllTables, tableRawPanel]
		});

*/
		//alert(document.getElementById("mwfAdmin1"));
		//if(document.getElementById("mwfAdmin1") && document.getElementById("mwfAdmin2") && document.getElementById("mwfAdmin3"))
		//{
		//	cwfAdmin_snippetPanel.render(document.getElementById("ijfAdmin1"));
		//}
		//cwfAdmin_referencePanel.render(document.getElementById("mwfAdmin4"));

	},

	setFieldsPanelDirty:function()
	{
		//better to change the background of the listbox class
	},

	//save form
	saveSettings:function()
	{


		var settingsOut = new Array();
		var fieldsOut = new Array();
		//each data row of thing...
		//we need to define what newData actually is
		var adminErrorMessage= "OK";

		for(var j in ijf.admin.cwfAdmin_form.settings)
		{
			if(!ijf.admin.cwfAdmin_form.settings.hasOwnProperty(j)) continue;
			settingsOut.push({name:j,value:ijf.admin.cwfAdmin_form.settings[j],comment:""});
		};
		//add the businessRules to retain....
		/*
		for (var i in ijf.admin.cwfAdmin_form.businessRules)
		{
			if(!ijf.admin.cwfAdmin_form.businessRules.hasOwnProperty(i)) continue;
			jOut.push({name:"businessRule",value:ijf.admin.cwfAdmin_form.businessRules[i].rule,comment:ijf.admin.cwfAdmin_form.businessRules[i].message});
		}
		*/

		//each data row of thing...
		//we need to define what newData actually is
		for(var j in ijf.admin.cwfAdmin_form.fields)
		{
			if(!ijf.admin.cwfAdmin_form.fields.hasOwnProperty(j)) continue;

			var fRow = {};

			fRow["formCell"] = ijf.admin.cwfAdmin_form.fields[j]["formCell"];
			fRow["caption"] = ijf.admin.cwfAdmin_form.fields[j]["caption"];
			fRow["controlType"] = ijf.admin.cwfAdmin_form.fields[j]["controlType"];
			fRow["dataSource"] = ijf.admin.cwfAdmin_form.fields[j]["dataSource"];
			fRow["dataReference"] = ijf.admin.cwfAdmin_form.fields[j]["dataReference"];
			fRow["style"] = ijf.admin.cwfAdmin_form.fields[j]["style"];
			fRow["labelStyle"] = ijf.admin.cwfAdmin_form.fields[j]["labelStyle"];
			fRow["panelStyle"] = ijf.admin.cwfAdmin_form.fields[j]["panelStyle"];
			fRow["referenceFilter"] = ijf.admin.cwfAdmin_form.fields[j]["referenceFilter"];
			fRow["tableHeaders"] = ijf.admin.cwfAdmin_form.fields[j]["tableHeaders"];
			fRow["tableColumns"] = ijf.admin.cwfAdmin_form.fields[j]["tableColumns"];
			fRow["tableWidths"] = ijf.admin.cwfAdmin_form.fields[j]["tableWidths"];
			fRow["tableHeaders"] = ijf.admin.cwfAdmin_form.fields[j]["tableHeaders"];
			fRow["tableDblClick"] = ijf.admin.cwfAdmin_form.fields[j]["tableDblClick"];
			fRow["event"] = ijf.admin.cwfAdmin_form.fields[j]["event"];
			fRow["toolTip"] = ijf.admin.cwfAdmin_form.fields[j]["toolTip"];
			fRow["dataReference2"] = ijf.admin.cwfAdmin_form.fields[j]["dataReference2"];
			fRow["renderIf"] = ijf.admin.cwfAdmin_form.fields[j]["renderIf"];
			fRow["persistInItem"] = ijf.admin.cwfAdmin_form.fields[j]["persistInItem"];
			fRow["tableColumnsStyles"] = ijf.admin.cwfAdmin_form.fields[j]["tableColumnsStyles"];
			fRow["fieldStyle"] = ijf.admin.cwfAdmin_form.fields[j]["fieldStyle"];
			fRow["regEx"] = ijf.admin.cwfAdmin_form.fields[j]["regEx"];
			fRow["regExMessage"] = ijf.admin.cwfAdmin_form.fields[j]["regExMessage"];

			fieldsOut.push(fRow);
		}


		var thisForm = ijf.admin.cwfAdmin_form; //ijf.fw.forms[g_formId];

		//fieldsJson = fieldsJson.replace(/\"/g,"\\\"");
		//settingsJson = settingsJson.replace(/\"/g,"\\\"");


        var jOut = {
			formId: thisForm.id,
			testIssue: thisForm.testIssue,
			formType: thisForm.formType,
			formName: thisForm.name,
			fields: JSON.stringify(JSON.stringify(fieldsOut)),
			formSettings: JSON.stringify(JSON.stringify(settingsOut))
		};

        //attempt to save....
		var jdata = JSON.stringify(jOut);
//debugger;
		var initResp = "";

		var sStat = ijfUtils.saveJiraFormSync(jdata,"saveFormConfig");
		if(sStat="OK")
		{
			ijfUtils.modalDialogMessage("Information Message","Settings saved. You must refresh other pages to see changes.");
		}
		else
		{
			ijfUtils.modalDialogMessage("Save Error","Sorry, something went wrong with the save: " + sStat);
		}

	},

	renderForm:function(inContainerId, cellsOnly)
	{
		ijfUtils.clearExt();

		//outer style

		ijfUtils.setElementWithStyleString("ijfOuterContainer",ijf.admin.cwfAdmin_form.settings["outerContainerStyle"]);

		ijfUtils.renderHeader(inContainerId,ijf.admin.cwfAdmin_form);

        ijfUtils.setElementWithStyleString("ijfHead",ijf.admin.cwfAdmin_form.settings["title_style"]);

	   var colSpans = {};
	   var rowsWithSpans = {};

		try
		{
			if (ijf.admin.cwfAdmin_form.settings["columnSpans"]!=null)
			{
				var cSpans = ijf.admin.cwfAdmin_form.settings["columnSpans"].split(";");
				if(cSpans[0]!="")
				{
					for(var k in cSpans)
					{
						if(!cSpans.hasOwnProperty(k)) continue;
						var svals = cSpans[k].split(",");
						colSpans[svals[0].trim()+"_"+svals[1].trim()]= svals[2].trim();
						rowsWithSpans[svals[0].trim() + "spannedRow"] = "spanned row";
					}
				}
			}
		}
		catch(e)
		{
			ijfUtils.footLog("Error in columnspans settings")
			colSpans={};
		}

		ijfUtils.setContent(inContainerId,ijf.admin.cwfAdmin_form.settings["rows"],ijf.admin.cwfAdmin_form.settings["columns"],colSpans,cellsOnly);


		if (ijf.admin.cwfAdmin_form.settings["columnWidths"]!=null)
		{

			var colwidths = ijf.admin.cwfAdmin_form.settings["columnWidths"].split(";");

			for(var i in colwidths)
			{

				if(!colwidths.hasOwnProperty(i)) continue;
				var wPair = colwidths[i].split(":");

				var rows = ijf.admin.cwfAdmin_form.settings["rows"]/1+1;

				for (var i = 1; i<rows;i++)
				{
					if(rowsWithSpans.hasOwnProperty(i+"spannedRow")) continue;
					var tContainer = inContainerId + "_" + i + "_" + wPair[0].trim();
					var e = document.getElementById(tContainer);
					if(e!=null) e.style.width=wPair[1];
				}
			}
		}


        ijfUtils.setElementWithStyleString(inContainerId + "_ijfContentTableId", ijf.admin.cwfAdmin_form.settings["outerTableStyle"]);


		//for each field.. apply the field.

		for (var f in ijf.admin.cwfAdmin_form.fields)
		{

			if(!ijf.admin.cwfAdmin_form.fields.hasOwnProperty(f)) continue;
			var thisField = ijf.admin.cwfAdmin_form.fields[f];

			var frmCell = thisField.formCell.split(",");
			var targetCell =  inContainerId+"_"+frmCell[0]+"_"+frmCell[1];
			var container = document.getElementById(targetCell);
			try
			{

				if(cellsOnly)
				{
					var dObj = document.getElementById(targetCell);
					if(dObj)
					{
						dObj.style.backgroundColor="lightblue";
						dObj.innerHTML=frmCell;
					}
					else
					{
						ijfUtils.footLog("error with target cell, no DIV " + targetCell);
					}
				}
				else
				{

					if(thisField.controlType=="nestedform")
					{
						var dObj = document.getElementById(targetCell);
						dObj.innerHTML="nested form: " + thisField.dataSource;
					}
					else
					{

						ijf.extUtils.renderField(inContainerId,ijf.currentItem,thisField,container);
					}

				}
				//




			}
			catch(e)
			{
				ijfUtils.footLog("Bad error: " + e);
			}

		}
	}


}