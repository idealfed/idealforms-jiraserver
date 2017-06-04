var ijf = ijf || {};

ijf.main = (function(){

var items;
var itemList;
var gNodes;
var gCats;
var exerciseId;
var item;
var lastItem;
var postCopyActions;

var formName;

var gEventControl;
var allFormAttachments;
var saveQueue;
var saveQueueBatch;
var saveResultMessage;

var dataServices;
var currentUser;
var outerForm;
var gGantt;
var gNocache="false";
var gViewport;
var gSubformParams=null;
var gItemSectionGridIndex=null;

var sessionTimeout;
var gSaveItemAttributes=false;
var gSaveFormCallback = null;
var gPopupFormHandle = null;
var gRec = null;


var gNavigateOnChange = "Unsaved data exists on this page...<br><br>Are you sure you want to navigate away?<br><br> OK=navigate away<br> Cancel=return to editing.";
var updateErrorMessage = "Sorry but an update request failed.  Please refresh your browser to ensure you have the latest data and try again.";

var gSaveIncludesFile = false;


function init(inConfigVersion)
{

	/*
	   Set g_version for this version of the JS
	*/
	 window.g_version = "1.0.34";


    ijfUtils.showProgress();

    if(g_iwfFormSetId==null)
    {
        //no exercise id
        jQuery('#ijfContent').html("Sorry, no exercise ID was identified.");
        return;
    }
    //do a hard init of data for now....

	ijf.main.itemId= g_itemId;
	ijf.main.debug = g_debug;


    //var jdata = '[{"id":"1","name":"first form set","projectName":"Test Project One","projectId":"TPO","settings":"[]","forms":[{"id":"1","name":"first Form","testIssue":"TPO-1","formType":"Add","formSettings":"[]","fields":"[]"}]}]';
    //var jdata='[{"id":"40","name":"first form set","projectName":"Test Project One","projectId":"TPO","settings":"[]","snippets":[],"forms":[{"id":"38","testIssue":"TPO-1","formType":"Add","name":"first Form","fields":"[]","formSettings":"[]"}]}]';
    //ijfUtils.writeFullConfig(jdata,false);


    ijfUtils.footLog("Calling load configuration...");
    jQuery.ajax(g_root + '/plugins/servlet/iforms?ijfAction=getConfig&version='+inConfigVersion, {
        success: function(data) {
            //jQuery('#main').html(jQuery(data).find('#main *'));
            ijfUtils.footLog("Successful load");
            ijf.userPool = new IjfUserPool();
            ijf.main.currentUser = ijf.userPool.getUser(g_username);

			ijf.jiraEditMeta = [];
			ijf.jiraEditMetaKeyed = [];
			ijf.jiraAddMeta = [];
			ijf.jiraAddMetaKeyed = [];
			ijf.session = {};
            ijf.main.controlSet = new Array();
//          dataServices = new DataServices();
            ijf.main.items = new Array();
            ijf.main.itemList = new Array();
            ijf.main.gNodes = new Array();
            ijf.main.gCats = new Array();
            try
            {
 				var cleanDoubleDouble = data.replace(/\"\"/g,"\"");

				cleanDoubleDouble = cleanDoubleDouble.replace(/~pct~/g,"%");
				//substituted null values for    "~"
				cleanDoubleDouble = cleanDoubleDouble.replace("\"~\"","\"\"");

        	    ijf.fw.setup(JSON.parse(cleanDoubleDouble));
			}
			catch(e)
			{
    	        ijfUtils.footLog("Config failed to parsee: " + e.message);
    	        ijfUtils.hideProgress();
    	        ijfUtils.modalDialogMessage("Fatal","Unable to get the configuration: " + e.message);
    	        return;
			}
			if(!ijf.fw) return;

			//determine if anonymous....and not craft.....if so establish session
			if((window.g_formId) && (window.g_craft!="true"))
			{
				var tForm = ijf.fw.forms[window.g_formId];
				if(tForm)
				{
					//if((tForm.formAnon=="true") && (window.g_username=="$ijfUsername"))
					if(tForm.formAnon=="true")
					{
						//attempt to login...
						var	putObj = {"username":tForm.formSet.settings.anonUsername,"password":tForm.formSet.settings.anonPassword};
						var	jData = JSON.stringify(putObj);
						var	tApi = "/rest/auth/1/session";
						var login = ijfUtils.jiraApiSync("POST",tApi,jData);
					}
				}
			}



	  	    jQuery.ajax(g_root + '/rest/api/2/project', {
        		success: function(data) {
					try
					{
						ijf.exercise = new IjfExercise(data);
                        ijfUtils.footLog("Model loaded");
                        ijfUtils.hideProgress();
                        //?process setup?

                        ijf.main.processSetup('ijfContent');
					}
					catch(e)
					{
						ijfUtils.footLog("Config failed to parse projects " + e.message);
						ijfUtils.hideProgress();
						return;
					}
				},
				error: function(e) {
					ijfUtils.footLog("Config failed to parse " + e.message);
					ijfUtils.hideProgress();
	    	        return;
				}
			});

        },
        error: function(e) {
            ijfUtils.footLog("Failed first init load " + e.message);
            ijfUtils.hideProgress();
            if(!ijf.main.controlSet) ijf.main.controlSet=[];
            ijfUtils.renderAdminButtons('ijfContent');

        }
    });


}


function processSetup(inContainerId)
{

    ijfUtils.clearAll();
    ijfUtils.clearExt();
    ijf.jiraMeta=null;

    //hook to allow non-item based forms, ie reports
    if (ijf.main.itemId=="0")
    {
		ijf.currentItem = {};
        ijf.main.renderForm(inContainerId, window.g_formId, false, ijf.main.item);
        return;
    }

    if ((ijf.main.itemId=='') && (window.g_formId==""))
    {
		ijfUtils.renderAdminButtons(inContainerId);
		ijf.lists.renderItemList_Borderlayout(inContainerId);
		return;
	}


    if (ijf.main.itemId=='')
    {
    	//There is a form but not item.
    	//will need fields....
		if(!ijf.jiraFields)
		{
			ijf.jiraFields = ijfUtils.getJiraFieldsSync();
			ijf.jiraFieldsKeyed = [];
			ijf.jiraFields.forEach(function(f)
			{
				ijf.jiraFieldsKeyed[f.name]=f;
			});
		}
        ijf.main.renderForm(inContainerId, window.g_formId, false, null);
        ijfUtils.renderAdminButtons(inContainerId);
    }
    else
    {
        //look to see if item is constructed
        if(ijf.currentItem == null)
        {
            ijf.main.loadItem(inContainerId);
        }
        else
        {
            ijf.main.renderForm(inContainerId, window.g_formId, false, ijf.currentItem);
        }
    }
}

function loadItem(inContainerId)
{

    //load the item.....
    if(ijf.main.itemId == null)
    {
        ijfUtils.footLog('Sorry you must select an item before loading...');
        return;
    }

    var tItem = ijfUtils.getJiraIssueSync(ijf.main.itemId);


    if(tItem.key)
    {
		try
		{

			ijf.currentItem = tItem;
			ijfUtils.footLog("Modeled " + ijf.currentItem.key)

			//load fields and editMeta
			//todo:  switch the add and edit meta based on type of form

			if(!ijf.jiraFields)
			{
				ijf.jiraFields = ijfUtils.getJiraFieldsSync();
				ijf.jiraFieldsKeyed = [];
				ijf.jiraFields.forEach(function(f)
				{
					ijf.jiraFieldsKeyed[f.name]=f;
				});
			}


			ijfUtils.hideProgress(true);

			ijf.main.processSetup(inContainerId);
		}
		catch(e)
		{
			ijfUtils.hideProgress();
			ijfUtils.modalDialogMessage("Warning Message","Unable to get the issue.");
			ijfUtils.footLog("Failed to get or model item: " + e.message);
		}
	}
	else
	{
	    if(typeof tItem=="string")
	    {
		    if(tItem.indexOf("Failed")>-1)
		    {
				 ijfUtils.modalDialogMessage("Error","Unable to load issue: " + ijf.main.itemId + "<br>" + tItem);
		    }
		}
		ijf.currentItem = {};
	}
}




function renderForm(inContainerId, inFormId, isNested, item)
{

	if(!isNested)
	{
    	ijfUtils.clearAll();
    	ijfUtils.clearExt();
    	ijf.main.outerForm = ijf.fw.forms[inFormId];
    	//if the ijf.admin.dWin exists, destroy it....
    	if(ijf.lists.dWin) Ext.destroy(ijf.lists.dWin);
	}
	else
	{
		//if in craft, write something to target container and leave...
		//if(g_craft=='true')
		//{
		//	document.getElementById(inContainerId).innerHTML="Sub Form: " + inFormId;
		//	return;
		//}

	}

    var thisForm;
    //now generate the form from the spec.....

    if(inFormId=="")
    {
        //look for defaultForm in settings
        ijfUtils.footLog("No form");
        return;
    }
    else
    {
        thisForm = ijf.fw.forms[inFormId];
    }
    if(!thisForm)
    {
        ijfUtils.footLog("No form found: " + inFormId);
        return;
	}

	//based on the form, it should get edit or add meta...

	//look to see if form is add or edit? based on form type, load meta if necessary

	//and you might be in a subform of an Add event...so, if item.fields exists AND item.jiraMeta exists, then
	//you want to skip this...I think...

   	if((!isNested) || (!ijf.jiraMeta)) //should only need this if NOT nested
	{
		ijf.jiraMeta={};
		ijf.jiraMetaKeyed=[];

		//look to see if an Add type.  If so, null out the Item.
		if(thisForm.formType=="Add") item=null;

		if(item)
		{
			//item exists, pull the edit meta
			if(item.key)
			{
				if(!ijf.jiraEditMeta.hasOwnProperty(item.key))
				{
					ijf.jiraEditMeta[item.key] = ijfUtils.getJiraIssueMetaSync(item.key);
					ijf.jiraEditMetaKeyed[item.key] = [];
					Object.keys(ijf.jiraEditMeta[item.key].fields).forEach(function(f)
					{
						ijf.jiraEditMetaKeyed[item.key][ijf.jiraEditMeta[item.key].fields[f].name]=ijf.jiraEditMeta[item.key].fields[f];
					});
				}
				ijf.jiraMeta=ijf.jiraEditMeta[item.key];
				ijf.jiraMetaKeyed=ijf.jiraEditMetaKeyed[item.key];
			}
		}
		else
		{
			//no item, look for Add form
			if(thisForm.formType=="Add")
			{
				ijfUtils.loadIssueTypeDetails(thisForm.formSet.projectId);

				//meta is keyed by issue type for add
				ijf.jiraMeta.fields=ijf.jiraAddMeta[thisForm.formSet.projectId][thisForm.issueType]
				ijf.jiraMetaKeyed=ijf.jiraAddMetaKeyed[thisForm.formSet.projectId][thisForm.issueType]
				//for add items
				if(!item)  item={"fields":{}};
			}
		}
	}

    //test if craft and redirect if so
   	if(!isNested)
	{
		if(window.g_craft=="true")
		{
			ijf.admin.renderFormAdmin(ijf.fw.forms[window.g_formId]);
			return;
		}
	}

	//init form settings
	if(!thisForm.settings.headerLeft) thisForm.settings.headerLeft="";
	if(!thisForm.settings.headerCenter) thisForm.settings.headerCenter="";
	if(!thisForm.settings.headerRight) thisForm.settings.headerRight="";



    //For main for only
    if(!isNested)
    {

		ijfUtils.setElementWithStyleString("ijfOuterContainer",thisForm.settings["outerContainerStyle"]);

        if(thisForm.settings.hasOwnProperty("tabTitle"))
        {
            document.title = thisForm.settings["tabTitle"];
        }

        ijfUtils.renderHeader(inContainerId,thisForm,item);

        ijfUtils.setElementWithStyleString("ijfHead",thisForm.settings["title_style"]);
    }
    ///todo must validate settings prior to using...
    //set the panel

    var colSpans = {};
    var rowsWithSpans = {};

    try
    {
        if (thisForm.settings["columnSpans"]!=null)
        {
            var cSpans = thisForm.settings["columnSpans"].split(";");
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

    //rowspans
	   var rowSpans = {};
	   var colsWithSpans = {};

		try
		{
			if (thisForm.settings["rowSpans"]!=null)
			{
				var rSpans = thisForm.settings["rowSpans"].split(";");
				if(rSpans[0]!="")
				{
					for(var k in rSpans)
					{
						if(!rSpans.hasOwnProperty(k)) continue;
						var svals = rSpans[k].split(",");
						rowSpans[svals[0].trim()+"_"+svals[1].trim()]= svals[2].trim();
						colsWithSpans[svals[0].trim() + "spannedCol"] = "spanned col";
					}
				}
			}
		}
		catch(e)
		{
			ijfUtils.footLog("Error in rowspan settings")
			rowSpans={};
		}


    ijfUtils.setContent(inContainerId,thisForm.settings["rows"],thisForm.settings["columns"],colSpans,false,rowSpans);


    if (thisForm.settings["columnWidths"]!=null)
    {
        var colwidths = thisForm.settings["columnWidths"].split(";");

        for(var i in colwidths)
        {

            if(!colwidths.hasOwnProperty(i)) continue;
            var wPair = colwidths[i].split(":");

            var rows = thisForm.settings["rows"]/1+1;

            for (var i = 1; i<rows;i++)
            {
                if(rowsWithSpans.hasOwnProperty(i+"spannedRow")) continue;
                var tContainer = inContainerId + "_" + i + "_" + wPair[0].trim();
                var e = document.getElementById(tContainer);
                if(e!=null) e.style.width=wPair[1];
            }
        }
    }

    ijfUtils.setElementWithStyleString(inContainerId + "_ijfContentTableId", thisForm.settings["outerTableStyle"]);

    //for each field.. apply the field.

    for (var f in thisForm.fields)
    {

        if(!thisForm.fields.hasOwnProperty(f)) continue;

        var thisField = thisForm.fields[f];
        thisField.form = thisForm;
        var frmCell = thisField.formCell.split(",");
        var targetCell =  inContainerId+"_"+frmCell[0]+"_"+frmCell[1];
        var container = document.getElementById(targetCell);
        try
        {
            ijf.extUtils.renderField(inContainerId,item,thisField,container);
        }
        catch(e)
        {
            ijfUtils.footLog(thisField.formCell + " " + thisField.controlType + " failed to render: " + e.message);
        }

    }
    ijfUtils.renderAdminButtons(inContainerId);
    //look for Onload event.  If it exists, execute.
    if(thisForm.settings.hasOwnProperty("onLoad"))
    {
        var onLoadFunction=thisForm.settings["onLoad"];
        if(onLoadFunction)
        {
            ijfUtils.onLoadHandler(onLoadFunction);
        }
    }
}


function controlChanged(controlKey)
{

    var cnt = ijf.main.controlSet[controlKey];
    cnt.dirty=true;
    ijf.main.gEventControl = cnt;

    window.onbeforeunload= function() {return 'You have unsaved changes on this page...'};


    if(ijf.main.outerForm.formSet.settings["changeStyle"])
    {
		ijfUtils.setElementWithStyleString(cnt.container.id,ijf.main.outerForm.formSet.settings["changeStyle"]);
	}
	else
	{
		 var tjqid = "#" + cnt.container.id;
	    jQuery(tjqid).css(ijf.fw.onChangeStyle);
	}

}

function isFormValid()
{
    for (var i in ijf.main.controlSet)
    {
        if((!ijf.main.controlSet.hasOwnProperty(i)) || (i.indexOf("ijfContent")<0)) continue;
        var cnt = ijf.main.controlSet[i];
        try
        {
            if(cnt.control.items.items[0].isValid()==false)
            {
                return false;
            }
        }
        catch(e){}
    }
    return true;
}


function saveFormWithCallback(inCallback)
{
    ijf.main.gSaveFormCallback=inCallback;
    saveForm();
}

function saveForm(onSuccess, inFields, inForm, item)
{

    //before the save, verify if any fields is required AND is null...
    if(!ijf.main.isFormValid())
    {
        ijfUtils.modalDialogMessage("Information", "The form has invalid fields and cannot be saved.  <br><br>Please provide values for all errored fields and save again.");
        return;
    }

  	if(ijf.main.allControlsClean()) return;

    //check form business rules
    gSaveIncludesFile=false;

    //go though each field, determine if dirty...
    ijf.main.saveQueue = new Array();
    ijf.main.saveQueueBatch = new Array();


    ijfUtils.showProgress();
    for (var i in ijf.main.controlSet)
    {
        if((!ijf.main.controlSet.hasOwnProperty(i)) || (i.indexOf("_fld_")<0)) continue;
        var cnt = ijf.main.controlSet[i];
        if(cnt.dirty)
        {

                ijf.main.saveQueue[cnt.id]=cnt;
                cnt.prepForSave(ijf.main.saveQueueBatch);

        }
    }

    //process batch save
    ijf.main.saveBatch(onSuccess,inFields,inForm, item);

}

function saveBatch(onSuccess,inFields,inForm, item)
{
    //batch queue has the sections to save and the new values.
    //prep it, then have new method for single async call
    var fields = {};
    if(inFields) fields=inFields;
    var attachment = null;
    for (var i in ijf.main.saveQueueBatch)
    {
        if(ijf.main.saveQueueBatch.hasOwnProperty(i))
        {
            var thisCnt = ijf.main.saveQueueBatch[i];
            if((thisCnt.field.controlType=="attachmentupload") || (thisCnt.field.controlType=="attachmentmanaged"))
            {
				attachment = thisCnt;
				continue;
			}
            var thisSect = thisCnt.batchSaveSection;
			fields[thisSect.jiraField.id]=thisCnt.newVal;
        }
    }
    //send the update batchRaw
    var fieldsOk=true;
    var saveRes = "OK";
	var comment = null;
	if(fields.comment)
	{
		comment = {"comment":[{"add":fields.comment}]}
		delete fields.comment;
	}
	var transition = null;
	if(fields.status)
	{
		transition = fields.status;
		delete fields.status;
	}

	var putObj = {};
	if(Object.keys(fields).length > 0) putObj.fields=fields;
	if(comment) putObj.update=comment;

    if(Object.keys(putObj).length > 0)
    {
		//this can be an ADD or an UPDATE.  If the current item exists it's an update, if not it's an Add
		if(item.key)
		{
			fieldsOk=false;
			//if only transition, add blank update..
			var jData = JSON.stringify(putObj);
			var tApi = "/rest/api/2/issue/"+item.key;
			saveRes = ijfUtils.jiraApiSync("PUT",tApi,jData);
			if(saveRes=="OK")
			{
				fieldsOk=true;
			}
		}
		else
		{
			//this is an add, JSON is a little different and it's a POST
        	putObj.fields.project = {"key":inForm.formSet.projectId};
        	putObj.fields.issuetype = {"name":inForm.issueType};
        	var jData = JSON.stringify(putObj);
			var tApi = "/rest/api/2/issue";
			saveRes = ijfUtils.jiraApiSync("POST",tApi,jData);
			//saveRes is the Key of the new issue if successfull,
			//set the item to the new Key and reload, will shift form to an Edit context
			try
			{
				if(saveRes.key)
				{
					ijf.main.itemId=saveRes.key;
					//window.g_itemId=saveRes.key;
					onSuccess();
					//ijf.main.resetForm();
				}
				else
				{
					throw saveRes;
				}
			}
			catch(e)
			{
				ijfUtils.hideProgress();
				ijfUtils.modalDialogMessage("Error","Sorry, there was an error with the add: " + saveRes);
				return;
			}
		}
     }

	//transition must be handled seperatly POST vs PUT
	var transOk = true;
	if(transition)
	{
		transOk = false;
		putObj = {"transition":transition};
		jData = JSON.stringify(putObj);
		tApi = "/rest/api/2/issue/"+item.key + "/transitions";

		saveRes = ijfUtils.jiraApiSync("POST",tApi,jData);
		if((!saveRes) || (saveRes=="OK"))
		{
			transOk=true;
		}
	}

	if((!fieldsOk) || (!transOk))
	{
		ijfUtils.hideProgress();
        ijfUtils.modalDialogMessage("Error","Sorry, but something went wrong with the save: <br><br>" + saveRes);
        return;
	}

	//if comment or transition AND not attachment, refresh
	if(((comment)||(transition)) &&(!attachment))
	{
		onSuccess();
		return;
	}

	//fields done.  look for attachment
	var uploadResult = "OK";
	if(attachment)
	{
		attachmentOk = false;
		//upload attachment...
		var uForm = attachment.control.form;

        var uploadFormId = "#" + attachment.id.replace(",","_")+"UploadFormId";
		if(uForm.isValid())
		{
			var fd = new FormData(jQuery(uploadFormId)[0]);
			//fd.append("CustomField", "This is some extra data");
			jQuery.ajax({
				url: g_root + "/rest/api/2/issue/"+item.key+"/attachments",
				type: 'POST',
				headers: {"X-Atlassian-Token": "no-check"},
				//'Content-Type':'multipart/form-data; charset=UTF-8'},
				data: fd,
					success: function(fp, o) {
						onSuccess();
					},
					failure: function(e, r) {
						ijfUtils.hideProgress();
						ijfUtils.modalDialogMessage("Error","Sorry, the file failed to save:<br><br>" + r.response.responseText);
					},
				cache: false,
				contentType: false,
				processData: false
			});
		}
		else
		{
			ijfUtils.hideProgress();
			ijfUtils.modalDialogMessage("Error","The upload field has an error and cannot be processed.");
			return;
		}
	}
	else
	{
		//ijf.currentItem=ijfUtils.getJiraIssueSync(item.key);
		onSuccess();
	}

}


function setAllDirty()
{
    for (var i in ijf.main.controlSet)
    {

        if((!ijf.main.controlSet.hasOwnProperty(i)) || (i.indexOf("_fld_")<0)) continue;

        var cnt =ijf.main.controlSet[i];
        cnt.container.style = fw.onChangeStyle;
        cnt.dirty=true;
        window.onbeforeunload= function() {return 'You have unsaved changes on this page...'};

    }
}

function setAllClean()
{
    for (var i in ijf.main.controlSet)
    {

        if((!ijf.main.controlSet.hasOwnProperty(i)) || (i.indexOf("_fld_")<0)) continue;

        var cnt =ijf.main.controlSet[i];
        cnt.container.style = {};
        cnt.dirty=false;
        window.onbeforeunload= null;

    }
}

function allControlsClean()
{
    var ret = true;
    for (var i in ijf.main.controlSet)
    {
        if((!ijf.main.controlSet.hasOwnProperty(i)) || (i.indexOf("_fld_")<0)) continue;
        var cnt =ijf.main.controlSet[i];
        if(cnt.dirty) ret=false;
    }

    return ret;
}


function resetForm()
{
    ijf.currentItem=null;
    ijf.main.processSetup("ijfContent");
}


function closeForm()
{
	ijf.currentItem=null;
    window.g_itemId='';
    ijf.main.itemId='';
    ijf.main.item=null;
    window.g_formId = '';
    ijf.main.processSetup("ijfContent");
}


function loadModel(data)
{
    exercise = new Exercise(data);
}


function setItemNull()
{
    item=null;
}


return {
	gEventControl:gEventControl,
	setAllDirty:setAllDirty,
	currentUser:currentUser,
	setAllClean:setAllClean,
	allControlsClean:allControlsClean,
	saveBatch: saveBatch,
    saveQueue: saveQueue,
    isFormValid:isFormValid,
    saveQueueBatch: saveQueueBatch,
    loadItem:loadItem,
	controlChanged:controlChanged,
	gNavigateOnChange:gNavigateOnChange,
	saveForm:saveForm,
	renderForm:renderForm,
	gNodes:gNodes,
	resetForm:resetForm,
	init: init,
	outerForm: outerForm,
	processSetup:processSetup,
	closeForm:closeForm
};


})();