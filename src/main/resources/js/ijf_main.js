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
var itemId=g_itemId;
var debug = g_debug;
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


function init()
{
    ijfUtils.showProgress();

    if(g_iwfFormSetId==null)
    {
        //no exercise id
        jQuery('#ijfContent').html("Sorry, no exercise ID was identified.");
        return;
    }
    //do a hard init of data for now....

    var jdata = '[{"id":"1","name":"first form set","projectName":"Test Project One","projectId":"TPO","settings":"[]","forms":[{"id":"1","name":"first Form","testIssue":"TPO-1","formType":"Add","formSettings":"[]","fields":"[]"}]}]';
         jdata='[{"id":"40","name":"first form set","projectName":"Test Project One","projectId":"TPO","settings":"[]","snippets":[],"forms":[{"id":"38","testIssue":"TPO-1","formType":"Add","name":"first Form","fields":"[]","formSettings":"[]"}]}]';
    //ijfUtils.writeFullConfig(jdata,false);

    ijfUtils.footLog("Calling load configuration...");


    jQuery.ajax(g_root + '/plugins/servlet/jforms?ijfAction=getConfig', {
        success: function(data) {
            //jQuery('#main').html($(data).find('#main *'));
            ijfUtils.footLog("Successful load");
            ijf.userPool = new IjfUserPool();
            ijf.main.currentUser = ijf.userPool.getUser(g_username);

			ijf.jiraEditMeta = [];
			ijf.jiraEditMetaKeyed = [];
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
        }
    });


}


function processSetup(inContainerId)
{

    ijfUtils.clearAll();
    ijfUtils.clearExt();

    //hook to allow non-item based forms, ie reports
    if (ijf.main.itemId=="0")
    {
		ijf.currentItem = {};
        ijf.main.renderForm(inContainerId, g_formId, false, ijf.main.item);
        return;
    }

    if ((ijf.main.itemId=='') && (g_formId==""))
    {
		ijf.lists.renderItemList_Borderlayout(inContainerId);
		ijfUtils.renderAdminButtons(inContainerId);
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
        ijf.main.renderForm(inContainerId, g_formId, false, null);
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
            ijf.main.renderForm(inContainerId, g_formId, false, ijf.currentItem);
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
		ijf.currentItem = {};
	}
}




function renderForm(inContainerId, inFormId, isNested, item)
{

	if(!isNested)
	{
    	ijfUtils.clearAll();
    	ijfUtils.clearExt();
	}
	else
	{
		//if in craft, write something to target container and leave...
		if(g_craft=='true')
		{
			document.getElementById(inContainerId).innerHTML="Sub Form: " + inFormId;
			return;
		}
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
        ijf.main.outerForm = thisForm;
    }
    if(!thisForm)
    {
        ijfUtils.footLog("No form found: " + inFormId);
        return;
	}

	//based on the form, it should get edit or add meta...

	//look to see if form is add or edit? based on form type, load meta if necessary

	if(item)
	{
		if(thisForm.formType=="Edit")
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
		}
		if(thisForm.formType=="Add")
		{
			if(!ijf.jiraAddMeta.hasOwnProperty(item.key))
			{
				ijf.jiraAddMeta[item.key] = ijfUtils.getJiraIssueMetaSync(item.key);
				ijf.jiraAddMetaKeyed[item.key] = [];
				Object.keys(ijf.jiraAddMeta[item.key].fields).forEach(function(f)
				{
					ijf.jiraAddMetaKeyed[item.key][ijf.jiraAddMeta[item.key].fields[f].name]=ijf.jiraAddMeta[item.key].fields[f];
				});
			}
		}
	}

    //test if craft and redirect if so
    if(g_craft=="true")
    {
        ijf.admin.renderFormAdmin();
        return;
    }


    //For main for only
    if(!isNested)
    {

		ijfUtils.setElementWithStyleString("ijfOuterContainer",thisForm.settings["outerContainerStyle"]);

        if(thisForm.settings.hasOwnProperty("tabTitle"))
        {
            document.title = thisForm.settings["tabTitle"];
        }

        ijfUtils.renderHeader(inContainerId,thisForm);

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

    ijfUtils.setContent(inContainerId,thisForm.settings["rows"],thisForm.settings["columns"],colSpans);


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
            if(container==null)
            {
                try
                {
                    ijfUtils.modalDialogMessage("Error", "Failed to create container for :" + thisField.dataSource + " (the target cell is row "+frmCell[0]+", col "+frmCell[1]+"...does it actually exist? Check your colspans for row "+frmCell[0]+")");
                }
                catch(e)
                {
                    ijfUtils.modalDialogMessage("Error", "Failed to create container for div with id of "+targetCell+" check your colspans?");
                }
            }
            else
            {
                ijfUtils.container.innerHTML="Error: " + e;
            }
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

    var tjqid = "#" + cnt.container.id;
    jQuery(tjqid).css(ijf.fw.onChangeStyle);

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

function saveForm()
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
    ijf.main.saveBatch();

    ijf.main.checkSaveEnd();
}


function saveBatch()
{
    //batch queue has the sections to save and the new values.
    //prep it, then have new method for single async call
    var fields = {};
    var attachment = null;
    for (var i in ijf.main.saveQueueBatch)
    {
        if(ijf.main.saveQueueBatch.hasOwnProperty(i))
        {
            var thisCnt = ijf.main.saveQueueBatch[i];
            if(thisCnt.field.controlType=="attachmentupload")
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
		fieldsOk=false;
		//if only transition, add blank update..
		var jData = JSON.stringify(putObj);
		var tApi = "/rest/api/2/issue/"+ijf.currentItem.key;
		saveRes = ijfUtils.jiraApiSync("PUT",tApi,jData);
		if(saveRes=="OK")
		{
			fieldsOk=true;
		}
     }

	//transition must be handled seperatly POST vs PUT
	var transOk = true;
	if(transition)
	{
		transOk = false;
		putObj = {"transition":transition};
		jData = JSON.stringify(putObj);
		tApi = "/rest/api/2/issue/"+ijf.currentItem.key + "/transitions";
		saveRes = ijfUtils.jiraApiSync("POST",tApi,jData);
		if(saveRes=="OK")
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
		ijfUtils.hideProgress();
		ijf.main.setAllClean();
		ijf.currentItem=ijfUtils.getJiraIssueSync(ijf.currentItem.key);
		ijf.main.resetForm();
		return;
	}


	//fields done.  look for attachment
	var uploadResult = "OK";
	if(attachment)
	{
		attachmentOk = false;
		//upload attachment...
		var uForm = attachment.control.form;

		if(uForm.isValid())
		{
			var fd = new FormData($("#attachmentUploadFormId")[0]);
			//fd.append("CustomField", "This is some extra data");
			jQuery.ajax({
				url: g_root + "/rest/api/2/issue/"+ijf.currentItem.key+"/attachments",
				type: 'POST',
				headers: {"X-Atlassian-Token": "no-check"},
				//'Content-Type':'multipart/form-data; charset=UTF-8'},
				data: fd,
					success: function(fp, o) {
						ijfUtils.hideProgress();
						ijf.main.setAllClean();
						ijf.currentItem=ijfUtils.getJiraIssueSync(ijf.currentItem.key);
						ijf.main.resetForm();
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
		ijfUtils.hideProgress();
		ijf.main.setAllClean();
		ijf.currentItem=ijfUtils.getJiraIssueSync(ijf.currentItem.key);
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

function checkSaveEnd()
{
    if(Object.keys(ijf.main.saveQueue).length==0)
    {
        ijfUtils.hideProgress();
        //check for save attributes

        if(ijf.main.allControlsClean())
        {
            window.onbeforeunload= null;


                if(ijf.main.gSaveFormCallback) ijf.main.gSaveFormCallback();
                ijf.main.gSaveFormCallback=null;
                if(ijf.main.saveResultMessage)
                     ijfUtils.modalDialogMessage("Save Message",ijf.main.saveResultMessage);

        }
        else
        {
            var outMessage = "<br>";
            for(var ec in ijf.main.saveQueueFailures)
            {
                if(ijf.main.saveQueueFailures.hasOwnProperty(ec)) outMessage+="<br>"+ijf.main.saveQueueFailures[ec].message;
            }
            ijfUtils.modalDialogMessage("Warning Message","Sorry but the save process didn't complete successfully."+outMessage);
        }
    }
}
function resetForm()
{
    ijf.currentItem=null;
    ijf.main.processSetup("ijfContent");
}


function closeForm()
{
	ijf.currentItem=null;
    g_itemId='';
    ijf.main.itemId='';
    ijf.main.item=null;
    g_formId = '';
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
	checkSaveEnd:checkSaveEnd,
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
	debug:debug,
	itemId:itemId,
	resetForm:resetForm,
	init: init,
	outerForm: outerForm,
	processSetup:processSetup,
	closeForm:closeForm,
	gItemSectionGridIndex
};


})();