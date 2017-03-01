var ijf = ijf || {};

ijf.lists = {

filteredItemList:null,
checkedList:null,
itemStore:null,
checkedNodes:[],
parentNodeId:null,
templateNodeId:null,
templateNodeName:null,
templateDocType:null,
newItemName:null,
originalTitle:"IJF",
dwin:null,
thisF:null,
itemId:0,

filterItemList:function(inId)
{
    var filterColumn = 4;
    var tval="";
    try{
        tval= Ext.get(inId).component.getValue().toLowerCase();
    }
    catch(e){
        tval="";
    }



    var itemList = ijf.formList;

    this.filteredItemList = [];
    this.checkedList = [];
    var uniqueIds = Array();
    //create checked List of Items then filter by string....
    if(Object.size(ijf.lists.checkedNodes) > 0)
    {
        for(var j in ijf.lists.checkedNodes)
        {
            if(!ijf.lists.checkedNodes.hasOwnProperty(j)) continue
            var checkedNode = ijf.lists.checkedNodes[j];
            var thisNode = ijf.main.gNodes[checkedNode.id];
            for(var i in itemList)
			{
				if(itemList.hasOwnProperty(i))
				{
  				    if(!itemList.hasOwnProperty(i)) continue;
					if(thisNode.name==itemList[i][0]) this.checkedList.push([itemList[i][0],itemList[i][1],itemList[i][2],itemList[i][3],itemList[i][4]]);
				}
			}
        }
    }
    else
    {
        this.checkedList=itemList.slice();
    }

    filteredItemList = new Array();
    if(tval!="")
    {
        for (var i in this.checkedList)
        {
            if(!this.checkedList.hasOwnProperty(i)) continue;
            if(this.checkedList[i][filterColumn].toLowerCase().indexOf(tval)>-1) filteredItemList.push(this.checkedList[i]);
        }
    }
    else
    {
        filteredItemList = this.checkedList.slice();
    }

    itemStore.removeAll();
    itemStore.loadData(filteredItemList);
},

clearFilter:function(inId)
{
    var tf = Ext.getCmp(inId);
    tf.setValue("");
},

renderItemList_CustomDashBoard:function(inContainerId)
{

    var outHtml = "About to run dashboard";
    try
    {
         outHtml = window[g_dashboard]();
    }
    catch(e)
    {
         outHtml = "Failed to run dashboard: " + g_dashboard + ", error: " + e.message;
    }

    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        //width: 'auto',
        //height: 'auto',
        items: {
            html: outHtml,
            frame: false,
            border: false,
            xtype: "panel"}
    });

    var tElement = document.getElementById("ijfContent");
    pnl.render(tElement);

    controlSet[tElement.id] =   new itemControl(tElement.id, null, null, pnl, null);
},

openForm:function()
{
			var	thisF = {};
			for(var tF in ijf.fw.forms){
				if(!ijf.fw.forms.hasOwnProperty(tF)) return;
				if(ijf.fw.forms[tF].id==ijf.lists.itemId) thisF=ijf.fw.forms[tF];
			}
			if(!thisF.name){ ijfUtils.modalDialogMessage("Form Error","Sorry, undable to find the requested form: " + ijf.lists.itemId); return;}
			if(thisF.testIssue)
			{
				var tUrl = g_root + '/plugins/servlet/jforms?itemId='+thisF.testIssue+'&formId='+thisF.name;
			}
			else
			{
				var tUrl = g_root + '/plugins/servlet/jforms?formId='+thisF.name;
			}
			window.open(tUrl);
},

renderItemList_Borderlayout:function(inContainerId)
{
    //state is no item, so display selected or default item selector....
    //var itmRoot="mwfContent";
//debugger;

    if(ijf.fw.tabTitle)
    {
        document.title = ijf.fw.tabTitle;
        this.originalTitle=ijf.fw.tabTitle;
    }
    else
    {
        document.title = this.originalTitle;
    }

    var colSpans = {};
    ijfUtils.setContent(inContainerId,1,1,colSpans);

    var Tree = Ext.tree;
    var treeStruct = ijf.exercise.getTreeStructure(true);
    var tree = new Ext.tree.Panel({
        xtype: 'check-tree',
        height: 100,
        width: 400,
        useArrows:true,
        autoScroll:true,
        rowLines: false,
        animate:false,
        enableDD:false,
        containerScroll: true,
        rootVisible: false,
        frame: false,
        id: 'cwfTreeListPanelId',
        root: {
            name: 'root',
            description: 'root',
            expanded: true,
            id:'0',
            children: [treeStruct]
        },
        listeners: {
            checkchange: function(){
                ijf.lists.checkedNodes = tree.getChecked();
                ijf.lists.filterItemList("cwfItemSearchFilterId");
          }
        }
    });

    tree.addCls("x-panel-body-default2");

    if(Ext.getCmp('cwfItemSearchFilterId'))
    {
        var tIsf = Ext.getCmp('cwfItemSearchFilterId');
        Ext.destroy(tIsf);
    }
    var filterField = new Ext.FormPanel({
        frame:false,
        border: false,
        height:30,
        buttonAlign: 'left',
        buttons:[{
            xtype: 'textfield',
            width: 600,
            value: '',
            allowBlank:true,
            enableKeyEvents: true,
            hideLabel:false,
            id: "cwfItemSearchFilterId",
            listeners: {
                keyup: function(){
                    ijf.lists.filterItemList("cwfItemSearchFilterId");
                }
            }
        }]
    });


    var cButtons = [];
    cButtons.push({
        text:'Open Form',
        xtype: 'button',
        margin: '0 3 0 3',
        handler: function(){
            ijf.lists.openForm();
        }});

	cButtons.push({
		text:'Delete Form',
		xtype: 'button',
		margin: '0 3 0 3',
		handler: function(){
			mwf_addItem(inContainerId);
            }});

	cButtons.push({
		text:'Edit Form',
		xtype: 'button',
		margin: '0 3 0 3',
		handler: function(){
			ijf.lists.addEditForm(ijf.lists.itemId);
            }});

	cButtons.push({
		text:'Add Form',
		xtype: 'button',
		margin: '0 3 0 3',
		handler: function(){
			ijf.lists.addEditForm(null);
            }});

	cButtons.push({
		text:'Design Form',
		xtype: 'button',
		margin: '0 3 0 3',
		handler: function(){
				if(!ijf.lists.itemId)
				{
					ijfUtils.modalDialogMessage("Information","Sorry, no form was selected from list.");
				}
				else
				{
					var	thisF = {};
					for(var tF in ijf.fw.forms){
						if(!ijf.fw.forms.hasOwnProperty(tF)) return;
						if(ijf.fw.forms[tF].id==ijf.lists.itemId) thisF=ijf.fw.forms[tF];
					}
					if(!thisF.name){ ijfUtils.modalDialogMessage("Form Error","Sorry, undable to find the requested form: " + ijf.lists.itemId); return;}
					var tUrl = g_root + '/plugins/servlet/jforms?debug=true&craft=true&itemId='+thisF.testIssue+'&formId='+thisF.name;
					window.open(tUrl);
				}
            }});

	cButtons.push({
		text:'Refresh Settings',
		xtype: 'button',
		margin: '0 3 0 3',
		handler: function(){
			mwf_addItem(inContainerId);
            }});

    var selectItem = new Ext.FormPanel({
        //labelAlign: 'left',
        //title: "hey",
        //frame:true,
        //layout: 'fit',
        border:false,
        frame:false,
        layout: {
            type: 'hbox',
            align: 'end'
        },
        buttons: cButtons

    });


    var listColumns = [];
    var tFields = [];
    tFields.push({name: 'iid',  type: 'integer'});

    listColumns.push({
        header: 'ID',
        width:10,
        hidden: true,
        dataIndex: 'iid'
    });

    tFields.push({name: 'iFormName', type: 'string'});
    tFields.push({name: 'iFormType', type: 'string'});
    //tFields.push({name: 'iProjectId', type: 'string'});
    tFields.push({name: 'iProjectName', type: 'string'});
    tFields.push({name: 'iname', type: 'string'});

    listColumns.push({
            header: 'Form Name',
            width:ijf.fw.listNameWidth,
            sortable: true,
            hidden: false,
            width: 300,
            dataIndex: 'iFormName',
            filter: {
                type: 'string'
            }
    });
    listColumns.push({
		            header: 'Form Type',
		            width:ijf.fw.listFormIdWidth,
		            sortable: true,
		            hidden: false,
		            dataIndex: 'iFormType',
		            filter: {
		                type: 'string'
		            }
    });
    listColumns.push({
            header: 'Project',
            width:ijf.fw.listProjectNameWidth,
            sortable: true,
            hidden: false,
            dataIndex: 'iProjectName',
            filter: {
                type: 'string'
            }
    });
        listColumns.push({
	            header: 'Form Group',
	            width:ijf.fw.listFormNameWidth,
	            sortable: true,
	            hidden: false,
	            width:185,
	            dataIndex: 'iname',
	            filter: {
	                type: 'string'
	            }
    });



    if(!Ext.ClassManager.isCreated('gridFieldArray'))
    {
        Ext.define('gridFieldArray', {
            extend: 'Ext.data.Model',
            fields: tFields
        });
    }


    itemStore = new Ext.data.Store({
        model: 'gridFieldArray'
    });


    ijf.lists.filterItemList("cwfItemSearchFilterId")


    if(Ext.getCmp('itemListViewId')) Ext.getCmp('itemListViewId').destroy();

    var listView = new Ext.grid.GridPanel({
        store: itemStore,
        height:500,
        width:500,
        plugins: 'gridfilters',
        id: "itemListViewId",
        //reserveScrollOffset: true,
        columns: listColumns,
        listeners: {
         selectionchange:function(view, record, eops) {
			  if(record.length==0) return;
              ijf.lists.itemId = record[0].data.iid;
          },
          rowdblclick: function(grid,rowIndex,e) {

              ijf.lists.itemId = rowIndex.data.iid;
               ijf.lists.openForm();
            }}
    });

    listView.addCls("x-panel-body-default2");
        //render simple  combo of
    if(ijf.fw.listTitle=="")
        ijfUtils.setHead("Please use this menu to administer your forms.");
    else
        ijfUtils.setHead(ijf.fw.listTitle);


    var bArray = [selectItem];
    var pSouthHeight=50;

    var tCollapsed = false;
    if(ijf.fw.treeCollapsed=="true") tCollapsed=true;

     var pnl = new Ext.Panel({

         width: ijf.fw.listWidth,
         height: ijf.fw.listHeight,
        //title: 'Search Form',
        id: 'cwfListPanelId',
        //frame: true,
        //border: true,
        layout: 'border',
        items: [{
            //title: 'Search by Name',
            xtype: 'container',
            region: 'south',     // position for region
            frame: false,
            height: pSouthHeight,
            //layout: 'vbox',
            //split: true,         // enable resizing
            //minSize: 90,         // defaults to 50
            //maxSize: 60,
           // id: 'itemsSouth',
            items: bArray

        },{
            title: 'Search by Form Name',
            region: 'north',     // position for region
            frame: true,
            height:80,
            split: false,         // enable resizing
            minSize: 60,         // defaults to 50
            maxSize: 60,
            margins: '0 5 5 5',
           // id: 'itemsNorth',
            items: [filterField]

        },{
            // xtype: 'panel' implied by default
            title: 'Filter Forms',
            region:'west',
            frame: true,
            margins: '5 0 0 5',
            width: ijf.fw.listTreeWidth,
            collapsible: true,   // make collapsible
            collapsed:  tCollapsed,
            cmargins: '5 5 0 5', // adjust top margin when collapsed
           // id: 'itemsWest',
            split: true,
            layout: 'fit',
            unstyled: true,
            items: [tree]
        },{
            title: 'Center Region',
            region: 'center',     // center region is required, no width/height specified
            //id: 'itemsCenter',
            frame: true,
            xtype: 'container',
            layout: 'fit',
            margins: '5 5 0 0',
            items: [listView]
        }]
    });
    var tElement = document.getElementById(inContainerId+"_1_1");

    pnl.render(tElement);

    ijf.main.controlSet[tElement.id] =   new itemControl(tElement.id, null, null, pnl, null);
    //tree.render();
    //root.expand(true);
    //root.collapse(true);
    if(!ijf.fw.listTreeCollapsed) tree.expandAll();
},

modalReferenceEntry:function(inFunction)
{

    var dMes = "This dialog adds items into the "+ijf.fw.includeAddByReference.root+" section of the exercise.  Double click to add.<br>"+ijf.fw.includeAddByReference.message;
    dwinval=false;
    var dHeight = 600;
    //need to iterate through all structure levels and create entries for each....

    var fieldVals = [];
    var combVals;
    fieldVals["root"] = {"name":"root",valid:true, "order":0,"name":ijf.fw.includeAddByReference.root};
    var order = 1;
    var messageField = {
        html: dMes,
        margin: '5 5 5 5',
        xtype: "panel"};


    var refEntity = ijf.fw.reference[ijf.fw.includeAddByReference.reference.entity];

    var firstRow;
    for(var rw in refEntity.rows)
    {
        if(refEntity.rows.hasOwnProperty(rw))
        {
            firstRow = refEntity.rows[rw];
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
            hidden: true,
            readOnly: true,
            dataIndex: "rowkey"
        }
    );
    var colIndex = 0;
    for(var rf in firstRow.fields)
    {
        if(firstRow.fields.hasOwnProperty(rf))
        {
            var thisField = firstRow.fields[rf];

            var isHidden = true;
            var visColWidth = 0;
            var colWidth = 100;
            if(ijf.fw.includeAddByReference.reference.fields.indexOf(thisField.colName)>-1)
            {
                isHidden=false;
                colWidth =  ijf.fw.includeAddByReference.reference.widths[ijf.fw.includeAddByReference.reference.fields.indexOf(thisField.colName)];
                visColWidth = colWidth;
            }


            tFieldDefs.push({name:thisField.colName,type:"string"});
            tPanelCols.push( {
                    header: thisField.colName,
                    width:colWidth,
                    hidden: isHidden,
                    dataIndex: thisField.colName,
                    readOnly: true,
                    filter: {
                        type: 'string'
                    }
                }
            );
            winWidth+=visColWidth;
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

    tableEditorStore.loadData(refEntity.getTableAsObjArray());




    var listTables = new Ext.grid.GridPanel({
        xtype: "cell-editing",
        store: tableEditorStore,
        height:dHeight-20,
        width:winWidth-20,
        plugins: 'gridfilters',
        id: "addByReferenceTableId",
        columns: tPanelCols,
        selModel: {selType: 'rowmodel', mode: 'SINGLE'},
        listeners: {
            'rowdblclick': function(grid,rec,e) {

                //create the fields using the 'structure' of the addbystructure....
                var order = 1;
                var addLevel=function(inName,inNode)
                {
                    if(!inName) return;
                    if(inNode.itemTemplate)
                    {
                        var tVal = inName;
                    }
                    else
                    {
                        var tVal = rec.data[inName];
                    }

                    if(!tVal)
                    {
                        //error and get out....
                        modalDialogMessage("Error Message","Error with determining the name from the add by structure settings.");
                        fieldVals = [];
                        fieldVals["root"] = {"name":"root",valid:true, "order":0,"name":ijf.fw.includeAddByReference.root};
                        order = 1;
                        return;
                    }
                    fieldVals[inName] = {"name":inName,valid:true,"value":tVal, "order":order++,"itemTemplate":inNode.itemTemplate, "cat":inNode};

                    var child = inNode.child;
                    if(child) addLevel(child.name,child);
                }
                var child = ijf.fw.includeAddByReference.structure.child;
                if(child) addLevel(child.name,child);

                //fieldVals should be set.. create...
                var dFunct = function(){  pdWin.close(); inFunction(fieldVals,rec);}
                modalDialog("Alert","You are about to create an item based on your selection, continue? <br><br>(Note if the item already exists it will open.)",dFunct);
            }
        }
    });

    var pdWin = new Ext.Window({
        // layout: 'fit',
        title: "Add Item",
        width: winWidth,
        height:dHeight+20,
        closable: false,
        items: [messageField,listTables],
        buttons:[
            {
                text:'Cancel',
                handler: function(){
                    pdWin.close();
                }}
        ],
        modal: true
    });
    pdWin.show();
},


addEditForm:function (inFrmId)
{
	var editForm = false;
	ijf.lists.thisF = {};
	var thisF = ijf.lists.thisF;
    if(inFrmId)
    {
		editForm = true;
		for(var tF in ijf.fw.forms){
			if(!ijf.fw.forms.hasOwnProperty(tF)) return;
			if(ijf.fw.forms[tF].id==ijf.lists.itemId) thisF=ijf.fw.forms[tF];
		}
		if(!thisF.name){ ijfUtils.modalDialogMessage("Form Error","Sorry, undable to find the requested form: " + inFrmId); return;}
		ijf.lists.thisF=thisF;

    }
    else
    {
		//construct blank form...
		thisF.formSet = {};
		thisF.name = "";
		thisF.formType = "Edit";
		thisF.testIssue = "";
		thisF.id = 0;
		thisF.settings=[];
	    thisF.fields=[];
	}

    var dMes = "Adding a new form creates the container for your form settings.  Once the container is";
    dMes+=" added you can edit your form.  Please note:";
    dMes+="<ul><li>Form name should be unique for all forms.</li>";
    dMes+="<li>Form type determines available JIRA fields (based on JIRA Views).</li>";
    dMes+="<li>Test issue determines the JIRA Project the form will be based upon.<br><i>&nbsp;&nbsp;(and helps form creation by binding to that issue)</i></li>";
    dMes+="<li>Form Group is an arbitrary group of forms, it's used for common Javascript snippets.</li></ul>";
    var formTypeLookup = ["Edit","Add","List"];
    var formGroups =ijf.fw.formSets.map(function(fs){return fs.name});
    ijf.lists.dWin = new Ext.Window({
        layout: 'vbox',
        title: "IJF Form Settings",
        width: 600,
        height:370,
        closable: true,
        items: [{
            html: dMes,
            border: false,
            width: 580,
            margin: '4 0 0 10',
            frame: false,
            xtype: "panel"},
            {
                xtype: 'textfield',
                labelAlign: 'left',
                fieldLabel: 'Form Name',
                labelWidth: 100,
                labelStyle: "color:darkblue",
  				margin: '4 0 0 10',
                width: 400,
                value: thisF.name,
                allowBlank:false,
                listeners: {
                    change: function(f,n,o){
                        thisF.name = n;
                    }
                }
            },
			{
				xtype: 'combobox',
				labelAlign: 'left',
				forceSelection: true,
				store: formTypeLookup,
				forceSelection: true,
				labelWidth: 100,
				margin: '4 0 0 10',
				fieldLabel: "Form Type",
				allowBlank:false,
				labelStyle: "color:darkblue",
				triggerAction: 'all',
				width: 200,
				value: thisF.formType,
				listeners: {
					change: function(f, n, o){
						thisF.formType = n;
									}}
			},
            {
				xtype: 'textfield',
				labelAlign: 'left',
				labelWidth: 100,
				margin: '4 0 0 10',
				fieldLabel: "Test Issue",
				allowBlank:true,
				labelStyle: "color:darkblue",
				width: 200,
				value: thisF.testIssue,
				listeners: {
					change: function(f, n, o){
						thisF.testIssue = n;
					}}
			},
			{
				xtype: 'combobox',
				labelAlign: 'left',
				labelWidth: 100,
				forceSelection: true,
				store: formGroups,
				fieldLabel: "Form Group",
				labelStyle: "color:darkblue",
				width: 400,
				margin: '4 0 0 10',
				value: thisF.formSet.name,
				listeners: {
					change: function(f, n, o){
						thisF.formSet.name = n;
					}}
			}
        ],
        buttons:[{
            text:'OK',
            handler: function(f,i,n){
				var thisForm = ijf.lists.thisF;

				if(thisForm.name=="") {ijfUtils.modalDialogMessage("Form Error","Sorry, the form name cannot be blank."); return;}
				if(thisForm.id==0) if(ijf.fw.forms.hasOwnProperty(thisForm.name)) {ijfUtils.modalDialogMessage("Form Error","Sorry, the form name is already being used."); return;}
				if(!thisForm.formSet.name) {ijfUtils.modalDialogMessage("Form Error","Sorry, the gorm group name cannot be blank."); return;}
				//if(thisForm.testIssue=="") {ijfUtils.modalDialogMessage("Form Error","Sorry, the test issue must exist and not be empty."); return;}

				//need to have a valid "formSet" ID at this point....
				var formSet = ijf.fw.formSetsKeyed[thisF.formSet.name];

				var settingsOut = new Array();
				var fieldsOut = new Array();
				for(var j in thisForm.settings)
				{
					if(!thisForm.settings.hasOwnProperty(j)) continue;
					settingsOut.push({name:j,value:thisForm.settings[j],comment:""});
				};
				for(var j in thisForm.fields)
				{
					if(!thisForm.fields.hasOwnProperty(j)) continue;
					fieldsOut.push(thisForm.fields[j]);
				};

		        var jOut = {
							formId: thisForm.id,
							testIssue: thisForm.testIssue,
							formType: thisForm.formType,
							formName: thisForm.name,
							formSetId: formSet.id,
							fields: JSON.stringify(JSON.stringify(fieldsOut)),
							formSettings: JSON.stringify(JSON.stringify(settingsOut))
				};
				var jdata = JSON.stringify(jOut);

				var sStat = ijfUtils.saveJiraFormSync(jdata);

				if(sStat="OK")
				{
	                ijf.lists.dWin.close();
 	                ijfUtils.clearExt();
	                ijf.main.init();
				}
				else
				{
					ijfUtils.modalDialogMessage("SAve Error","Sorry, something went wrong with the save: " + sStat);
				}

            }},
            {
                text:'Cancel',
                handler: function(){
                    ijf.lists.dWin.close();
                }}
        ],
        modal: true
    });
    ijf.lists.dWin.show();
}

};







