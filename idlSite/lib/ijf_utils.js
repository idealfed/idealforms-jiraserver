Ext.define('SimpleLink', {
    extend: 'Ext.Component',
    alias: 'widget.simplelink',
    baseCls: Ext.baseCSSPrefix + 'simplelink',
    autoEl: {
        tag: 'a',
        href: '#'
    },
    renderTpl: '{text}',
    initComponent: function() {
        this.renderData = {
            text: this.text
        };
        this.callParent(arguments);
    },
    afterRender: function() {
        this.mon(this.getEl(), 'click', this.handler, this);
    },
    handler: Ext.emptyFn
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var ijfUtils = {
 pWin:null,
 dWin:null,
 dWinVal:false,
	getJiraIssueSync:function(inKey)
	{
		ijfUtils.footLog("Calling get issue for " + inKey);
		var retData = null;
		jQuery.ajax({
			async: false,
			type: 'GET',
			url: g_root + '/rest/api/2/issue/' + inKey,
			timeout: 60000,
			success: function(data) {
				retData = data;
			},
			error: function(e) {
				ijfUtils.footLog("Failed cache data set!");
				retData = "Failed issue get: " + e.message;
			}
		});
		return retData;
	},
	getJiraIssue:function(inKey, onSuccess, onError)
	{
		ijfUtils.footLog("Calling get issue for " + inKey);
		var retData = null;
		jQuery.ajax({
			async: true,
			type: 'GET',
			url: g_root + '/rest/api/2/issue/'+inKey+'/editmeta',
			timeout: 60000,
			success: onSuccess,
			error: onError
		});
	},
	getJiraIssueMetaSync:function(inKey)
	{
		ijfUtils.footLog("Calling get issue for " + inKey);
		var retData = null;
		jQuery.ajax({
			async: false,
			type: 'GET',
			url: g_root + '/rest/api/2/issue/'+inKey+'/editmeta',
			timeout: 60000,
			success: function(data) {
				retData = data;
			},
			error: function(e) {
				ijfUtils.footLog("Failed meta get set!");
				retData = "Failed meta get: " + e.message;
			}
		});
		return retData;
	},
	getJiraIssueMeta:function(inKey, onSuccess, onError)
	{
		ijfUtils.footLog("Calling get issue for " + inKey);
		var retData = null;
		jQuery.ajax({
			async: true,
			type: 'GET',
			url: g_root + '/rest/api/2/issue/' + inKey,
			timeout: 60000,
			success: onSuccess,
			error: onError
		});
	},
	getJiraCommentsSync:function(inKey)
	{
		ijfUtils.footLog("Calling get fields");
		var retData = null;
		jQuery.ajax({
			async: false,
			type: 'GET',
			url: g_root + '/rest/api/2/issue/' + inKey + '/comment',
			timeout: 60000,
			success: function(data) {
				retData = data;
			},
			error: function(e) {
				ijfUtils.footLog("Failed cache fields set!");
				retData = "Failed field get: " + e.message;
			}
		});
		return retData;
	},
	getJiraComments:function(inKey, onSuccess, onError)
	{
		ijfUtils.footLog("Calling get fields");
		var retData = null;
		jQuery.ajax({
			async: true,
			type: 'GET',
			url: g_root + '/rest/api/2/issue/' + inKey + '/comment',
			timeout: 60000,
			success: onSuccess,
			error: onError
		});
	},
	getJiraFieldsSync:function(inKey)
	{
		ijfUtils.footLog("Calling get fields");
		var retData = null;
		jQuery.ajax({
			async: false,
			type: 'GET',
			url: g_root + '/rest/api/2/field',
			timeout: 60000,
			success: function(data) {
				retData = data;
			},
			error: function(e) {
				ijfUtils.footLog("Failed cache fields set!");
				retData = "Failed field get: " + e.message;
			}
		});
		return retData;
	},
	getJiraFields:function(onSuccess, onError)
	{
		ijfUtils.footLog("Calling get fields");
		var retData = null;
		jQuery.ajax({
			async: true,
			type: 'GET',
			url: g_root + '/rest/api/2/field',
			timeout: 60000,
			success: onSuccess,
			error: onError
		});
	},
    saveJiraFormSync:function(inJson,ijfAction){
		var retVal = "";

		var outJson = inJson.replace(/\%/g,"~pct~");

		jQuery.ajax({
				async: false,
				type: 'POST',
				url: g_root + '/plugins/servlet/iforms',
				data: {
					jsonConfig: outJson,
					action: ijfAction
				},
				timeout: 60000,
				success: function(data) {
				ijfUtils.hideProgress();

					ijfUtils.footLog("Saved form data " + data);
					try{
					    var jRet = JSON.parse(data);
				    }
				    catch(e)
				    {
						jRet = {status:data};
					}
					if(jRet.status=="OK")
					{
						if(jRet.result)
						{
							retVal=jRet.result;
						}
						else
						{
							retVal = "OK";
						}
					}
					else
					{
						retVal = "Failed to save " + jRet.status;
					}
				},
				error: function(e) {
					ijfUtils.footLog("Failed init data set! " + e.message);
					retVal = "Failed to save " + e.message;
				}
			});
			return retVal;
		},
	getFieldDef:function(issueKey, inFieldName)
		{
			if(inFieldName=="Status")
			{
				return {
					jiraMeta: ijf.currentItem.transitions,
					jiraField: ijf.jiraFieldsKeyed[inFieldName]
				}
			}
			else
			{
				return {
					jiraMeta: ijf.jiraMetaKeyed[inFieldName],
					jiraField: ijf.jiraFieldsKeyed[inFieldName]
				}
			}
		},
   jiraApiSync:function(inMethod, inApi, inData){

     	var retVal="tbd";
     	jQuery.ajax({
                 async: false,
                 type: inMethod,
                 contentType:"application/json; charset=utf-8",
                 url: g_root + inApi,
                 data: inData,
                 timeout: 60000,
             success: function(data,e,f) {
                 ijfUtils.footLog("Successful data response code: " + f.status);
                 if((f.status==200) || (f.status==201) || (f.status==204))
                 {
					 if((this.type=="GET") || (this.type=="POST")) retVal=data;
					 else
						 retVal="OK";
				 }
				 else
				 {
					 retVal="Unsuccessful Api Call: " + f.status;
				 }
             },
             error: function(e) {
				 if((e.status==201) && (e.statusText=="Created"))
                 {
					 retVal="OK";
				 }
				 else if(e.statusText=="OK")
                 {
                     ijfUtils.footLog("Successful data post");
                     retVal=e.responseText;
                 }
                 else
                 {
                     ijfUtils.footLog("Failed data post: " + " "  + e.statusText);
                     retVal="Failed data put: " + e.statusText;
                 }
             }
        });
		return retVal;
},
   jiraApi:function(inMethod,inApi, inData, onSuccess, onError){

     	var retVal="tbd";
     	jQuery.ajax({
                 async: false,
                 type: inMethod,
                 contentType:"application/json; charset=utf-8",
                 url: g_root + inApi,
                 data: inData,
                 timeout: 60000,
             success: onSuccess,
             error: onError
        });
},
loadIssueTypeDetails:function(projectKey)
{
	if(!ijf.jiraAddMeta.hasOwnProperty(projectKey))
	{
		//get the create meta for all issue types of the project.  project key
		//each will be keyed fields by issue type...
		ijf.jiraAddMeta[projectKey] = [];
		ijf.jiraAddMetaKeyed[projectKey] = [];
		var rawMeta = ijfUtils.jiraApiSync("GET",'/rest/api/2/issue/createmeta',"expand=projects.issuetypes.fields&projectKeys="+projectKey);
		rawMeta.projects[0].issuetypes.forEach(function(it){

			ijf.jiraAddMeta[projectKey][it.name]=it.fields;
			var fieldsKeyed = [];
			Object.keys(it.fields).forEach(function(fk){
				var f = it.fields[fk];
				fieldsKeyed[f.name]=f;
			});
			ijf.jiraAddMetaKeyed[projectKey][it.name]=fieldsKeyed;
		});
	}
},
///////////END JIRA UTILS
applyStyle:function(element, style){
    Object.keys(style).forEach(function(key){
        element.style[key] = style[key];
    });
},

helpLink:function(inCaller)
{

	return "&nbsp;&nbsp;<img src='https://pilot1.tcg.com/javascripts/test/ijf/blueQuestion14.png' onclick=alert(\"hi\")>";
},

cssToJson: function (inStr) {

	var retJson = {};
	try
	{
 		var nvp = inStr.split(";");
 		for(var i =0; i< nvp.length; i++)
 		{
			var pr = nvp[i].split(":");
			retJson[pr[0].trim()]=pr[1];
		}
	}
	catch(e)
	{
		return {};
	}
	return retJson;
},


footLog:function(inMsg)
{

    if(ijf.main.debug=='true')
    {
        var tNow = Math.floor(Date.now() / 1000);

        jQuery('#ijfDebug').prepend("<br>"+tNow+"&nbsp;&nbsp"+inMsg);
    }
},
applyVersionHistory:function(inId)
{
	ijfUtils.clearExt();
	ijf.main.init(inId);
	ijfUtils.modalDialogMessage("RECOVERY","You have loaded a MEMORY ONLY configuration version.  To apply this configuration you must Download the configuration, then upload the configuration.<br><br>Note, only opening form in this window will use the memory configuration.");
},
showSaveHistory:function()
{
	var tDiv = document.getElementById('ijfJsonUpload');
	var saveHistory = ijfUtils.jiraApiSync("GET","/plugins/servlet/iforms","ijfAction=getVersions");
	var saveData = JSON.parse(saveHistory);
	var TblStart = "<table><tr><td>User</td><td>Date</td><td>Click to Apply</td></tr>";
	var outStr = saveData.resultSet.reduce(function(bStr, s){
		if(!s.author) return bStr;
		bStr+= "<tr><td>"+s.author +"</td><td>" + s.created + "</td><td><a href=JAVASCRIPT:ijfUtils.applyVersionHistory("+s.id+")>Click to apply "+s.id+"</a></td></tr>";
		return bStr;
	},TblStart);
	outStr += "</table>";
	tDiv.innerHTML = outStr;
},
renderAdminButtons:function(inContainerId)
{
    //todo if owner manager do this...
    jQuery('#ijfManage').html('');
    jQuery('#ijfJsonUpload').html('');

    if((ijf.main.debug=='true') && (!ijf.main.outerForm))
    {
        //Craft section, if debug or if in craft mode...
		var fileLoad = "View Save History(last 20): <input type='button' value='Save History' onclick='ijfUtils.showSaveHistory()'><br>";
		fileLoad += "Upload Entire Config File: <input type='file' accept='text/plain' onchange='ijfUtils.readConfigFile(event)'><br>";
		fileLoad += "Download Entire Config to a File: <input type='button' value='Download' onclick='ijfUtils.writeConfigFile()'>";
        var pnl = new Ext.FormPanel({
			layout:'vbox',
            items: [{
                html: "Idealfed Jira Forms Version = " + g_version,
                frame: false,
                border: false,
                xtype: "panel"},
                {html: fileLoad,
					frame: false,
					border: false,
					xtype: "panel"},
                ],
        });
      // ijf.main.controlSet['jsonUploadForm'] =   new itemControl('jsonUploadForm', null, null, jForm, null);
       ijf.main.controlSet['adminButtons'] =   new itemControl('jsonUploadForm', null, null, pnl, null);

      //  jForm.render(document.getElementById("ijfJsonUpload"));
        pnl.render(document.getElementById("ijfManage"));
    }
},
writeConfigFile:function()
{
	var outStr = ijfUtils.getConfigJson();
	var blob = new Blob([outStr], {type: "text/plain;charset=utf-8"});
	saveAs(blob,"ijfFormsConfig.txt")
}
,
readConfigFile:function(event)
{
	    var input = event.target;

	    var reader = new FileReader();
	    reader.onload = function(){
	      var text = reader.result;
	      ijfUtils.writeFullConfig(reader.result, true);
	    };
  		reader.readAsText(input.files[0]);
},
writeFullConfig:function(inConfig, doReset)
{
		var outJsonConfig = inConfig.replace(/\%/g,"~pct~");

	    var outConfig = '{"ijfConfig":'+outJsonConfig+'}';

	    var initResp = "";
	    jQuery.ajax({
				async: false,
				type: 'POST',
				url: g_root + '/plugins/servlet/iforms',
				data: {
					jsonConfig: outConfig,
					action: "setConfig"
				},
				timeout: 60000,
				success: function(data) {

					//jQuery('#main').html(jQuery(data).find('#main *'));
					initResp= data;
					ijfUtils.footLog("Set init data " + data.status);
					if(doReset)
					{
						ijfUtils.clearExt();
	            	    ijf.main.init(0);
				    }
				},
				error: function(e) {

					ijfUtils.footLog("Failed init data set!");
					initResp= null;
				}
		});

},
getConfigJson:function()
{
	var outFormSets = [];
	outFormSets = ijf.fw.formSets.reduce(function(outFormSets,fs)
	{
		if(!fs.name) return outFormSets;
		var settingsOut = new Array();
		for(var j in fs.settings)
		{
			if(!fs.settings.hasOwnProperty(j)) continue;
			settingsOut.push({name:j,value:fs.settings[j],comment:""});
		};

		var outForms = [];
		var fsOut = {
			id: fs.id,
			name: fs.name,
			projectName: fs.projectName,
			projectId: fs.projectId,
			settings: JSON.stringify(JSON.stringify(settingsOut)),
			snippets: fs.snippets.map(function(s){
					return {
								name: s.name,
								snippet: JSON.stringify(s.snippet)
							};
			}),
			forms: fs.forms.reduce(function(outForms,thisForm){
					//process the Form
					if(!thisForm.name) return outForms;
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
						id: thisForm.id,
						testIssue: thisForm.testIssue,
						formType: thisForm.formType,
						issueType: thisForm.issueType,
						name: thisForm.name,
						fields: JSON.stringify(JSON.stringify(fieldsOut)),
						formSettings: JSON.stringify(JSON.stringify(settingsOut))
					};
					outForms.push(jOut);
					return outForms;
			},outForms)
		}
		outFormSets.push(fsOut);
		return outFormSets;
},outFormSets);

var outStr = JSON.stringify(outFormSets);

return outStr;
},
clearAll:function()
{

    jQuery('#ijfHead').html('');
    jQuery('#ijfContent').html('');
    jQuery('#ijfFoot').html('');
    jQuery('#ijfHead').removeAttr("style");
    jQuery('#ijfContent').removeAttr("style");
    jQuery('#ijfFoot').removeAttr("style")
    jQuery('#ijfOuterContainer').removeAttr("style")

},

setElementWithStyleString:function(inDomId,inStyleString)
{
	try
	{
		var hStyle = ijfUtils.cssToJson(inStyleString);
		var ocs = document.getElementById(inDomId);
		if(ocs) ijfUtils.applyStyle(ocs,hStyle);
	}
	catch(e)
	{
		ijfUtils.footLog("Error in style setting " + inStyleString);
	}

},

renderHeader:function(inContainerId, thisForm)
{

    var headerLeft = ijfUtils.replaceKeyValues(thisForm.settings["headerLeft"]);
    var headerCenter = ijfUtils.replaceKeyValues(thisForm.settings["headerCenter"]);
    var headerRight = ijfUtils.replaceKeyValues(thisForm.settings["headerRight"]);

    ijfUtils.setHead("<table width='100%' borders=0><tr><td width='33%' align='left'>" + headerLeft + "</td>" +
        "<td  width='33%' align ='center'>"  + headerCenter + "</td>" +
        "<td  width='33%' align='right'>" + headerRight + "</td></tr></table>");
},

setHead:function(inMsg)
{

    jQuery('#ijfHead').html(inMsg);

},

setHeadStyle:function(inStyle)
{

    jQuery('#ijfHead').css(JSON.parse("{" + inStyle + "}"));

},

setFoot:function(inMsg)
{

    jQuery('#ijfFoot').html(inMsg);

},

setContent:function(cId,x,y,colSpans,cellsOnly)
{

		var rows = x/1+1;
		var cols = y/1+1;

		var cHtml = "<table  role='presentation' id='"+cId+"_ijfContentTableId' cellspacing=3 cellpadding=0>";


		var cellStyle = 'ijf-cell';
		if(cellsOnly) cellStyle = 'ijfAdmin-cell';

		for (var i = 1; i<rows;i++)
		{
			cHtml += "<tr>";
			for (var j=1; j<cols; j++)
			{
				if(colSpans.hasOwnProperty(i+"_"+j))
				{
					var cSpan = colSpans[i+"_"+j];
					cHtml += "<td  valign='top' colspan='" + cSpan + "'><div class='"+cellStyle+"' id='"+cId+"_"+i+"_"+j+"'></div></td>";
					j=j+(cSpan/1)-1;
				}
				else
				{
					cHtml += "<td valign='top'><div  class='"+cellStyle+"' id='"+cId+"_"+i+"_"+j+"'></div></td>";
				}
			}
			cHtml += "<tr>";
		}
		cHtml += "</table>";
		var fContent = document.getElementById(cId);
		fContent.innerHTML=cHtml;
},

modalDialog:function(inTitle,inMessage,inFunction)
{

	Ext.Msg.show({
	    title: inTitle,
	    message: inMessage,
	    buttons: Ext.Msg.OKCANCEL,
	    icon: Ext.Msg.QUESTION,
	    fn: function(btn) {
	        if (btn === 'ok') {
	            console.log('Yes pressed');
	            inFunction();
			}
	    }
    });

},

modalDialogMessage:function(inTitle,inMessage)
{

    Ext.Msg.alert(inTitle,inMessage);

},


modalDialogMessageWithFunction:function(inTitle,inMessage,inFunction)
{

    var dMes = "<div id='dialog1inner' style=\"word-wrap: break-word; padding:5px; 5px, 5px, 5px; border:solid lightblue 0px;\">"+inMessage+"</div>";
    dwinval=false;
    dWin = new Ext.Window({
        layout: 'fit',
        title: inTitle,
        width: 300,
        height: 200,
        closable: false,
        items: {
            html: dMes,
            xtype: "panel"},
        buttons:[{
            text:'OK',
            handler: function(){
                // alert('ok')

                dWin.close();
                inFunction();
            }}
        ],
        modal: true
    });
    dWin.show();

},

showProgress:function()
{



    if(Ext.getCmp('pbar3')) return;

    //var pdiv = "<div id='progress1inner' style=\"position: relative; left: -50%; border:solid lightblue 0px;\"></div>";

    var pbar1 = new Ext.ProgressBar({
        id:'ijfProgresspbar3Id',
        //height:28,
        //style:"height:28 !important",
        //bodyStyle:"height:30 !important",
        //text: "",
        layout: 'fit',
    });

    this.pWin = new Ext.Window({
        //layout: 'fit',
        id:'ijfProgessBarWinId',
        //header:false,
        headerPosition: 'bottom',
        title: "Working...",
        width:200,
        //style:"height:28 !important",
        //bodyStyle:"height:30 !important",
        //style: "border-width:4px",
        closable: false,
        items: [pbar1],
        modal:true
	});
    this.pWin.show();

    pbar1.wait({
        interval:100,
        increment:15
    });

},

hideProgress:function(focusTop)
{
    //jQuery('#progress1').html("");
    if(Ext.getCmp('ijfProgresspbar3Id'))
    {
        this.pWin.close();
        //Ext.getCmp('pbar3').destroy();
    }
    //jQuery('#mwfContent').show();
    //if (focusTop == true) {
    //   new Ext.Window({ header: false, closable: false, frame: false, baseCls: 'x-panel', cls: 'x-window', height: 1, width: 1}).showAt(-48,-48).destroy();
    //}
},

loadConfig:function(onSuccess, onError)
{
    jQuery.ajax(g_root + '/plugins/servlet/iforms?ijfAction=getConfig', {
        success: onSucess,
        error: onError
    });
},



	resetTimeout:function()
	{
		if(sessionTimeout) clearTimeout(sessionTimeout);
		//setting to 30 minutes idle time.  30 * 60sec * 1000 = 1,800,000
		sessionTimeout = setTimeout(handleTimeout, 1800000);
	},

	handleTimeout:function()
	{
		modalDialogMessage("Warning","Your session has been idle for a long time.  Please refresh the browser prior to attempting any form saves.");
	},

	setItemListWorkflowName:function(inItemId, inWfName)
	{

		for(var i in itemList)
		{
			if (itemList.hasOwnProperty(i))
			{
				if(itemList[i][0]==inItemId)
					itemList[i][2]=inWfName;
			}
		}
	},

	getFirstItemByName:function(inName)
	{

		for(var i in itemList)
		{
			if (itemList.hasOwnProperty(i))
			{
				if(itemList[i][1]==inName) return items[itemList[i][0]];
			}
		}
		return null;
	},

	deleteItemListValue:function(inKey)
	{
		delete items[inKey];
		itemList = [];
		for(var i in items)
		{
			if (items.hasOwnProperty(i))
			{
				var thisItem = items[i];
				itemList.push([thisItem.id,thisItem.name,thisItem.stage]);
			}
		}
	},


	setCacheValue:function(inKey, inValue)
	{
		ijfUtils.footLog("Calling set cache for " + inKey);
		$.ajax({
			async: false,
			type: 'POST',
			url: g_root + '/setCacheValue',
			data: {
				inKey: inKey,
				inValue: inValue
			},
			timeout: 60000,
			success: function(data) {
				//jQuery('#main').html(jQuery(data).find('#main *'));
				return data;
			},
			error: function() {
				ijfUtils.footLog("Failed cache data set!");
				return null;
			}
		});
	},

	getNextSequence:function(inName, inBase)
	{
		ijfUtils.footLog("Calling get seq for " + inName);
		var retval= "seq failed";
		$.ajax({
			async: false,
			type: 'GET',
			url: g_root + '/getNextSequence?exerciseId='+g_exerciseId+ '&name=' + inName + '&base=' +inBase,
			timeout: 60000,
			success: function(data) {
				retval=data.value
			},
			error: function() {
				ijfUtils.footLog("Failed cache data get!");

			}
		});
		return retval;
	},

	getCacheValue:function(inKey)
	{
		ijfUtils.footLog("Calling get cache for " + inKey);
		$.ajax({
			async: false,
			type: 'GET',
			url: g_root + '/setCacheValue?inKey='+inKey,
			timeout: 60000,
			success: function(data) {
				//jQuery('#main').html(jQuery(data).find('#main *'));
				return data;

			},
			error: function() {
				ijfUtils.footLog("Failed cache data get!");
				return null;
			}
		});
	},


	cleanId:function(inId)
	{
		var outId = inId.replace(/ /g,"_");
		 outId = outId.replace(/,/g,"_");
		 outId = outId.replace(/\?/g,"_");
		 outId = outId.replace(/\./g,"_");
		 outId = outId.replace(/\:/g,"_");
		 outId = outId.replace(/\//g,"_");
		return outId;
	},

	sanitize:function(inText)
	{
		if(inText)
		{
			var outText = inText.replace(/<[s,S][c,C][r,R][i,I][p,P][t,T].*<\/[s,S][c,C][r,R][i,I][p,P][t,T]>/g,"");
			return outText;
		}
		return inText;
	},

	clearExt:function()
	{
		//var mcm = new Ext.ComponentManager();
		//var comps = Ext.ComponentManager.getAll();
		if(ijf.main.controlSet)
		{
			for(var c in ijf.main.controlSet)
			{
			   if(ijf.main.controlSet.hasOwnProperty(c))
			   {
				   if(ijf.main.controlSet[c].hasOwnProperty('control'))
				   {
					   if(ijf.main.controlSet[c].control)
					   {
						   try
						   {
								controlSet[c].control.removeAll(true);
						   }
						   catch(e){}
					   }
				   }
				   if (ijf.main.controlSet[c].control) {
					Ext.destroy(ijf.main.controlSet[c].control);
					}
			   }
			}
		}
		controlSet = new Array();
	},

	IsNumeric:function(_in) {
		if (parseFloat(_in) === Number(_in) && Number(_in) !== NaN)
			return true;
		return false;
	},





	getComboList:function(inList, inComboRef, inKeys)
	{

		if(inKeys.length==0)
		{
			//this is the level we want to get, return all the elements...
			//if last level is array....
			if(Array.isArray(inComboRef))
			{
				for(var cItem in inComboRef)
				{
					//({'item':sVal,'value':sVal});
					if(inComboRef.hasOwnProperty(cItem)) inList.push({'item':inComboRef[cItem],'value':inComboRef[cItem]});
				}
			}
			else
			{
				//not array, get elements keys
				for(var cItem in inComboRef)
				{
					if(inComboRef.hasOwnProperty(cItem)) inList.push({'item':cItem,'value':cItem});
				}
			}
		}
		else
		{
			//not last level, get first level of inKeys, find and recurse
			var key = inKeys.pop();
			//not array, get elements keys
			for(var cItem in inComboRef)
			{
				if(inComboRef.hasOwnProperty(cItem))
				{
					if(cItem==key)
					{
						getComboList(inList, inComboRef[cItem],inKeys);
						break;
					}
				}
			}
		}
	},

	getEvent:function(inField)
	{
		var ocf = function(){};
		var l_Event = "";
		try
		{
			l_Event = inField.event.trim();

			if(l_Event!="")
			{


				var ocf = function(f,n,o)
				{
					try
					{
						//var anonFunct = evxxxal("(function(){ " + l_Event + "})");
						//var outVal = anonFunct();

						var outVal = ijf.snippets[l_Event](f,n,o);

						if(!outVal) ijfUtils.footLog("field event returned false");
						else
							ijfUtils.footLog("field event returned true");

					}
					catch(e)
					{
						ijfUtils.footLog("field event failed: " + e.message);
					}
				};
			}
			return ocf;

		}
		catch(e)
		{
			ocf = function(){};
			ijfUtils.footLog("error setting up event " + e.message);
			return ocf;
		}
	},


	renderIfShowField:function(inData, inField)
	{
		if(!inField.renderIf) return false;
		var hideField = false;
		var l_renderIf = "";
		try
		{
			l_renderIf = inField.renderIf.trim();
			if((l_renderIf!="") && (l_renderIf!=null))
			{
				var outVal = ijf.snippets[l_renderIf](inData, inField);
				if(outVal==false) hideField = true;
			}
			return hideField;
		}
		catch(e){
			ijfUtils.footLog("Error in renderIf: " + e.message);
			return true;
		}

	},

	onLoadHandler:function(inFun)
	{
		var valid = true;
		var l_br = "";
		try
		{
			l_br = inFun;
			if((l_br!="") && (l_br!=null))
			{
				var bFunc = l_br;
				var bVars = null;
				if(l_br.indexOf("(")>-1)
				{
					var bSplit = l_br.split("(");
					bFunc = bSplit[0];
					var bVar = bSplit[1].replace(")","");
					bVars = bVar.split(",");
				}

				var outVal = window[bFunc](bVars);

				if(outVal==false) valid = false;
			}
			return valid;
		}
		catch(e){
			ijfUtils.footLog("Error in form on load event: " + e.message);
			return false;
		}
	},

	businessRuleValidate:function(inBr)
	{
		var valid = true;
		var l_br = "";
		try
		{
			l_br = inBr.rule;
			if((l_br!="") && (l_br!=null))
			{
				var bFunc = l_br;
				var bVars = null;
				if(l_br.indexOf("(")>-1)
				{
				   var bSplit = l_br.split("(");
				   bFunc = bSplit[0];
				   var bVar = bSplit[1].replace(")","");
				   bVars = bVar.split(",");
				}

				var outVal = window[bFunc](bVars);

				if(outVal==false) valid = false;
			}
			return valid;
		}
		catch(e){
			ijfUtils.footLog("Error in form business rule: " + e.message);
			return false;
		}
	},


	setFieldVisible:function(controlKey,visible)
	{
		var targetControlKey =ijf.main.controlSet[controlKey];
		targetControlKey.control.setVisible(visible);
	},

	getFieldValue:function(controlKey)
	{
		var retVal = null;
		try
		{
			var targetControlKey =ijf.main.controlSet[controlKey];
			retVal = targetControlKey.control.items.items[0].getValue();
		}
		catch(e)
		{
			ijfUtils.footLog("Error getting value from" + controlKey + " " +  e.message);
		}
		return retVal;
	},

	getTableRowCount:function(controlKey)
	{
		var retVal = 0;
		try
		{
			var targetControlKey =ijf.main.controlSet[controlKey];
			var tData =targetControlKey.control.items.items[0].getStore();
			retVal = tData.getCount();

			if(retVal==1)
			{
				//must look at values to ensure they are not all null....
				retVal=0;
				for(var v in tData.data.items[0].data)
				{
					if(tData.data.items[0].data.hasOwnProperty(v))
					{
						if(v=="id") continue;
						if(tData.data.items[0].data[v])
						{
							retVal=1;
							break;
						}
					}
				}
			}

		}
		catch(e)
		{
			ijfUtils.footLog("Error getting row count from" + controlKey + " " +  e.message);
		}
		return retVal;
	},


	getNameValueFromStyleString:function(inString,inKey)
	{
		var retStr="";
		var innerArray=[];
		var outerArray=[];
		var i;
		var j;
		try
		{
			outerArray = inString.split(";");
			for(i=0;i<outerArray.length;i++)
			{
				innerArray=outerArray[i].split(":");
				if(innerArray[0].trim()==inKey) return innerArray[1].trim();
			}
		}
		catch(e)
		{
			return "";
		}
		return retStr;
	},


	switchParamsFromObject:function(inText,inObj)
	{
		var retText = inText;
		if((!retText)||(retText=="")) return "";

		var retText = inText;
		var pat = "\#\{obj:.*?\}";
		var rgx = new RegExp(pat);
		var m = rgx.exec(inText)
		if(m==null)
		{
			return retText;
		}
		else
		{
			var keyVal = m[0].replace("#{obj:","");
			keyVal = keyVal.replace("}","");
			retText = inText.replace(m[0],inObj[keyVal]);
			retText = switchParamsFromObject(retText,inObj);
		}
		return retText;
	},

	replaceKeyValues:function(inText)
	{
		var retText = inText;
		if(!inText)  return inText;

		retText=retText.replace("#{user}",ijf.main.currentUser.displayName);
        retText=retText.replace("#{datetime}",moment().format('LL'));

		if(!ijf.currentItem) return retText;
		if(!ijf.currentItem.key) return retText;

		if((!retText)||(retText=="") || (!ijf.currentItem)) return "";

		if(!ijf.currentItem) return retText;

		retText = retText.replace("#{key}",ijf.currentItem.key);
		retText = retText.replace("#{summary}",ijf.currentItem.fields.summary);
		retText = retText.replace("#{status}",ijf.currentItem.fields.status.name);
	    retText = this.switchAtts(retText);

		return retText;
	},

	switchAtts:function(inText)
	{
		var retText = inText;
		var pat = "\#\{.*?\}";
		var rgx = new RegExp(pat);
		var m = rgx.exec(inText);

		if(m==null)
		{
			return retText;
		}
		else
		{
			var keyVal = m[0].replace("#{","");
			keyVal = keyVal.replace("}","");

			var repVal = "";
			if(ijf.jiraFieldsKeyed.hasOwnProperty(keyVal))
			{
				var jField = ijf.currentItem.fields[ijf.jiraFieldsKeyed[keyVal].id];
				if(jField)
				{
					repVal = this.handleJiraFieldType(ijf.jiraFieldsKeyed[keyVal],jField,true);
				}
			}
			if(repVal)
			{
				retText = inText.replace(m[0],repVal);
			}
			else
			{
				retText = inText.replace(m[0], " ("+keyVal+" not found) ");
			}
			retText = this.switchAtts(retText);
		}
		return retText;
	},

	handleJiraFieldType:function(inType, inField, forDisplay)
	{
		if(!inField) return null;
		switch(inType.schema.type)
		{
			case "string":
				return inField;
				break;
			case "issuetype":
				return inField.name;
				break;
			case "user":
				if(forDisplay) if(inField) return inField.displayName;
				return inField.name;
				break;
			case "datetime":
			     if(inField) return this.ConvertDb2Date(inField);
 				 return inField;
				break;
			case "date":
			     if(inField) return this.ConvertDb2Date(inField);
 				 return inField;
				break;
		    case "array":
 				 return inField;
				break;
			case "priority":
			case "status":
			case "option":
				 if(forDisplay) return inField.name;
			     if(inField) return inField.id;
 				 return inField;
				break;
			case "comments-page":
			    return "";
			    break;
			default:
				return "unknown type";
		}
	},

    getJiraFieldById:function(inId)
    {
		var retVal ={};
		ijf.jiraFields.forEach(function(f){if(f.id==inId)retVal=f});
		return retVal;
	},

	formatDateMDY:function(value)
	{
		return value ? value.dateFormat('m/d/y') : '';
	},



	dateFormatAMPM:function() {
		var date = new Date();
		var currDate = date.getDate();
		var hours = date.getHours();
		var dayName = getDayName(date.getDay());
		var minutes = date.getMinutes();
		var monthName = getMonthName(date.getMonth());
		var year = date.getFullYear();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = dayName + ' ' + monthName + ' ' + currDate + ' ' + year + ' ' + hours + ':' + minutes + ' ' + ampm;
		return strTime;
	},


	getMonthName:function(month) {
		var ar = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		return ar[month];
	},


	getDayName:function(day) {
		var ar1 = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
		return ar1[day];
	},


	ConvertLongDateToShort:function(inDateStr)
	{
		var d = null;
		var retVal = "";
		try
		{
			var tics = Date.parse(inDateStr);
			if (isNaN(tics))
			{
				d = null;
			}
			else
			{
				d = new Date(tics);
			}
			retVal = ((d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear());
		}
		catch(e)
		{}
		return retVal;
	},


	ConvertDb2Date:function(inDateStr)
	{

		var rgx = new RegExp("2[0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]");
		if (rgx.exec(inDateStr)) {
			var newStr = inDateStr.substr(5,2) + "/" + inDateStr.substr(8,2) + "/" +inDateStr.substr(0,4);
			return newStr;
		}
		return inDateStr;
	},


	ConvertShort2Db2Date:function(inDateStr)
	{

		if((inDateStr!=null) && (inDateStr.length==10))
		{
			var rgx = new RegExp("[0-1][0-9]/[0-3][0-9]/2[0-9][0-9][0-9]");
			if (rgx.exec(inDateStr)) {
				var newStr =inDateStr.substr(6,4) + "-" + inDateStr.substr(0,2) + "-" +  inDateStr.substr(3,2);
				return newStr;
			}
		}
		return inDateStr;
	},


	tagBody:'(?:[^"\'>]|"[^"]*"|\'[^\']*\')*',


	tagOrComment: new RegExp(
		'<(?:'
			// Comment body.
			+ '!--(?:(?:-*[^->])*--+|-?)'
			// Special "raw text" elements whose content should be elided.
			+ '|script\\b' + this.tagBody + '>[\\s\\S]*?</script\\s*'
			+ '|style\\b' + this.tagBody + '>[\\s\\S]*?</style\\s*'
			// Regular name
			+ '|/?[a-z]'
			+ this.tagBody
			+ ')>',
		'gi'),


	xmlDecode:function(inData)
	{
		if(inData==null) return "";

		var lData = inData;

		lData = lData.replace(/\&\#9;/g,"\t");
		lData = lData.replace(/\&\#10;/g,"\n");

		lData = lData.replace(/\&\#32;/g," ");
		lData = lData.replace(/\&\#33;/g,"!");
		lData = lData.replace(/\&\#34;/g,"\"");
		lData = lData.replace(/\&\#35;/g,"#");
		lData = lData.replace(/\&\#36;/g,"$");
		lData = lData.replace(/\&\#37;/g,"%");
		lData = lData.replace(/\&\#38;/g,"&");
		lData = lData.replace(/\&\#39;/g,"'");
		lData = lData.replace(/\&\#40;/g,"(");
		lData = lData.replace(/\&\#41;/g,")");
		lData = lData.replace(/\&\#42;/g,"*");
		lData = lData.replace(/\&\#43;/g,"+");
		lData = lData.replace(/\&\#44;/g,",");
		lData = lData.replace(/\&\#45;/g,"-");
		lData = lData.replace(/\&\#46;/g,".");
		lData = lData.replace(/\&\#47;/g,"/");
		lData = lData.replace(/\&\#48;/g,"0");
		lData = lData.replace(/\&\#49;/g,"1");
		lData = lData.replace(/\&\#50;/g,"2");
		lData = lData.replace(/\&\#51;/g,"3");
		lData = lData.replace(/\&\#52;/g,"4");
		lData = lData.replace(/\&\#53;/g,"5");
		lData = lData.replace(/\&\#54;/g,"6");
		lData = lData.replace(/\&\#55;/g,"7");
		lData = lData.replace(/\&\#56;/g,"8");
		lData = lData.replace(/\&\#57;/g,"9");
		lData = lData.replace(/\&\#58;/g,":");
		lData = lData.replace(/\&\#59;/g,";");
		lData = lData.replace(/\&\#60;/g,"<");
		lData = lData.replace(/\&\#61;/g,"=");
		lData = lData.replace(/\&\#62;/g,">");
		lData = lData.replace(/\&\#63;/g,"?");
		lData = lData.replace(/\&\#64;/g,"@");
		lData = lData.replace(/\&\#65;/g,"A");
		lData = lData.replace(/\&\#66;/g,"B");
		lData = lData.replace(/\&\#67;/g,"C");
		lData = lData.replace(/\&\#68;/g,"D");
		lData = lData.replace(/\&\#69;/g,"E");
		lData = lData.replace(/\&\#70;/g,"F");
		lData = lData.replace(/\&\#71;/g,"G");
		lData = lData.replace(/\&\#72;/g,"H");
		lData = lData.replace(/\&\#73;/g,"I");
		lData = lData.replace(/\&\#74;/g,"J");
		lData = lData.replace(/\&\#75;/g,"K");
		lData = lData.replace(/\&\#76;/g,"L");
		lData = lData.replace(/\&\#77;/g,"M");
		lData = lData.replace(/\&\#78;/g,"N");
		lData = lData.replace(/\&\#79;/g,"O");
		lData = lData.replace(/\&\#80;/g,"P");
		lData = lData.replace(/\&\#81;/g,"Q");
		lData = lData.replace(/\&\#82;/g,"R");
		lData = lData.replace(/\&\#83;/g,"S");
		lData = lData.replace(/\&\#84;/g,"T");
		lData = lData.replace(/\&\#85;/g,"U");
		lData = lData.replace(/\&\#86;/g,"V");
		lData = lData.replace(/\&\#87;/g,"W");
		lData = lData.replace(/\&\#88;/g,"X");
		lData = lData.replace(/\&\#89;/g,"Y");
		lData = lData.replace(/\&\#90;/g,"Z");
		lData = lData.replace(/\&\#91;/g,"[");
		lData = lData.replace(/\&\#92;/g,"\\");
		lData = lData.replace(/\&\#93;/g,"]");
		lData = lData.replace(/\&\#94;/g,"^");
		lData = lData.replace(/\&\#95;/g,"_");
		lData = lData.replace(/\&\#96;/g,"`");
		lData = lData.replace(/\&\#97;/g,"a");
		lData = lData.replace(/\&\#98;/g,"b");
		lData = lData.replace(/\&\#99;/g,"c");
		lData = lData.replace(/\&\#100;/g,"d");
		lData = lData.replace(/\&\#101;/g,"e");
		lData = lData.replace(/\&\#102;/g,"f");
		lData = lData.replace(/\&\#103;/g,"g");
		lData = lData.replace(/\&\#104;/g,"h");
		lData = lData.replace(/\&\#105;/g,"i");
		lData = lData.replace(/\&\#106;/g,"j");
		lData = lData.replace(/\&\#107;/g,"k");
		lData = lData.replace(/\&\#108;/g,"l");
		lData = lData.replace(/\&\#109;/g,"m");
		lData = lData.replace(/\&\#110;/g,"n");
		lData = lData.replace(/\&\#111;/g,"o");
		lData = lData.replace(/\&\#112;/g,"p");
		lData = lData.replace(/\&\#113;/g,"q");
		lData = lData.replace(/\&\#114;/g,"r");
		lData = lData.replace(/\&\#115;/g,"s");
		lData = lData.replace(/\&\#116;/g,"t");
		lData = lData.replace(/\&\#117;/g,"u");
		lData = lData.replace(/\&\#118;/g,"v");
		lData = lData.replace(/\&\#119;/g,"w");
		lData = lData.replace(/\&\#120;/g,"x");
		lData = lData.replace(/\&\#121;/g,"y");
		lData = lData.replace(/\&\#122;/g,"z");
		lData = lData.replace(/\&\#123;/g,"{");
		lData = lData.replace(/\&\#124;/g,"|");
		lData = lData.replace(/\&\#125;/g,"}");
		lData = lData.replace(/\&\#126;/g,"~");
		lData = lData.replace(/\&\#126;/g,"~");
		lData = lData.replace(/\&\#8211;/g,"~");
		return lData;
	},

	removeTags:function(html) {

		if((html==null)||(html=="")) return html;

		var oldHtml;
		do {
			oldHtml = html;
			html = html.replace(tagOrComment, '');
		} while (html !== oldHtml);
		return html.replace(/</g, '&lt;');
	},

	escapeRegExp:function(string) {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	},

	replaceAll:function(string, find, replace) {
		return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}


};

