//var inMWF = false;



function IjfUserPool()
{
    this.nothing = "";
    this.users = new Array();
}

IjfUserPool.prototype.getUser = function(inId)
{
    if(this.users.hasOwnProperty(inId)) return this.users[inId];
    var uData = jQuery.ajax({
        type: "GET",
        url: g_root + '/rest/api/2/user?key=' + inId + '&expand=groups,applicationRoles',
        async: false
    }).responseText;


    var u = new IjfUser(inId,uData);
    this.users[inId] = u;
    return u;
}
IjfUserPool.prototype.getUserEmail=function(inId)
{
    var user = this.getUser(inId);
    return user.email;
}
IjfUserPool.prototype.getUserLastFirst=function(inId)
{
    var user = this.getUser(inId);
    return user.lastName + ", " + user.firstName;
}
IjfUserPool.prototype.getUserGroups=function(inId)
{
    var user = this.getUser(inId);
    return user.getUserGroups();
}
function IjfUser(inId,inData)
{

    this.id = inId;
    this.email = "tbd";
    this.lastName = "tbd";
    this.firstName = "tbd";
    this.groups = null;
    this.groupList = null;
    this.maxGroups = null;
    this.exerciseRoles = null;
    this.collectUser=null;
    this.displayName = "tbd";

    try
    {
        this.inObj = JSON.parse(inData);
		this.email = this.inObj.emailAddress;
		this.lastName = this.inObj.name;
		this.firstName = this.inObj.name;
		this.groups = null;
		this.groupList = null;
		if(this.inObj.groups)
			if(this.inObj.groups.items) {this.groups = this.inObj.groups.items; this.groupList = this.groups.map(function(g){return g.name});};
		this.displayName = this.inObj.displayName;
		this.maxGroups = null;
		this.exerciseRoles = null;
		this.collectUser=null;
    }
    catch(e) {}
    this.lastFirst =  this.lastName + ", " + this.firstName;
}
IjfUser.prototype.getUserGroupList=function(inFilter)
{

    if(this.groupList==null)
    {
        this.groupList = new Array();
        this.maxGroups = new Array();
        var uData = jQuery.ajax({
            type: "GET",
            url: g_root + '/getUserGroups?userId='+ this.id,
            async: false
        }).responseText;

        var gres = JSON.parse(uData);
        //var gres = JSON.parse(tval.results)
        for(var g in gres.results.maxGroupList)
        {

            if(!gres.results.maxGroupList.hasOwnProperty(g)) continue;


            this.groupList.push([gres.results.maxGroupList[g].groupId,gres.results.maxGroupList[g].groupTitle]);
            this.maxGroups[gres.results.maxGroupList[g].groupId] = gres.results.maxGroupList[g];
        }

    }

    if(inFilter)
    {
        var filteredList = [];
        for (var i in this.groupList)
        {
            if(!this.groupList.hasOwnProperty(i)) continue;
            if(this.groupList[i][0].toLowerCase().indexOf(inFilter.toLowerCase())>-1)  filteredList.push(this.groupList[i]);
        }
        return filteredList;
    }
    else
    {
        return this.groupList;
    }

}

IjfUser.prototype.hasMaxGroupByName=function(inGroupName)
{
    var gList = this.getUserGroupList();
    for(var g in this.maxGroups)
    {
        if(this.maxGroups.hasOwnProperty(inGroupName))
        {
            if(this.maxGroups[g].groupTitle==inGroupName) return true;
        }
    }
    return false;
}
IjfUser.prototype.hasMaxGroupById=function(inGroupId)
{
    var gList = this.getUserGroupList();
    if(this.maxGroups.hasOwnProperty(inGroupId)) return true;
    return false;
}

IjfUser.prototype.getExerciseRoles=function()
{

    if(this.exerciseRoles==null)
    {

        this.exerciseRoles = new Array();

        try
        {
            var uData = jQuery.ajax({
                type: "GET",
                url: g_root + '/getUserExerciseRoles?exerciseId='+ exerciseId,
                async: false
            }).responseText;

            var tval = JSON.parse(uData);

            for(var g in tval.results)
            {
                if(!tval.results.hasOwnProperty(g)) continue;
                this.exerciseRoles.push(tval.results[g]);
            }
        }
        catch(e)
        {
            footLog("Failed to get user roles");
        }

    }

    return this.exerciseRoles;
}

IjfUser.prototype.hasExerciseRoleId=function(inId)
{
    if(!this.exerciseRoles) return false;
    for(var r in this.exerciseRoles)
    {
        if(this.exerciseRoles.hasOwnProperty(r))
        {
            if(this.exerciseRoles[r].objectRoleId==inId) return true;
        }
    }
    return false;
}



function IjfExercise(inData)
{

    //this.name = inName;

    this.data = inData;
    this.type = "jira";
    this.tree = inData; //JSON.parse(inData.exercise.tree);
    //this.maxId = g_username;
    // GLOBAL VARS

    //this.node = this.tree.results[0];
    //this.attr = this.node.attr;
    this.name= "Projects";

    this.id = "root";

    // GLOBAL VAR
    ijf.main.gNodes[this.id] = this;

    //this.groups = new Array();

    this.projects = new Array();

    //this.templates = new Array();
    //this.stylesheets = new Array();
    this.snippets = []; //inData.exercise.snippets;

    //this.workflow= JSON.parse(this.data.exercise.workflow);
    for(var p in inData)
    {
		if(!inData.hasOwnProperty(p)) continue;
		this.projects[inData[p].id] = new IjfProject(inData[p], this);
	}

    //this.loadStylesheets();
}


IjfExercise.prototype.getTreeStructure = function(withChecks)
{
    var retJson = {};
    retJson.text = this.name;
    retJson.id=this.id;
    retJson.leaf = false;
    retJson.cls = "folder";
    if(withChecks) retJson.checked=false;
    retJson.children = new Array();
    if(Object.size(this.projects) > 0)
    {

        for(var i in this.projects)
        {

            if(!this.projects.hasOwnProperty(i)) continue;

            retJson.children.push(this.projects[i].getTreeStructure(withChecks));
        }
    }
    else
    {
        retJson.leaf =true;
    }
    return retJson;
}

IjfExercise.prototype.getAllItemsInList = function(inList, inUniqueIds)
{
    if(Object.size(this.groups) > 0)
    {

        for(var i in this.groups)
        {

            if(!this.groups.hasOwnProperty(i)) continue;

            if(window.g_debug != 'true')
            {
                if(this.groups[i].name=="Collect Forms") continue;
            }
            this.groups[i].getAllItemsInList(inList,inUniqueIds);
        }
    }
}


function IjfProject(inProject, inExercise)
{
    this.node = inProject;
    this.exercise=inExercise;
    this.name=inProject.name;
    this.type="project";
    this.id = inProject.id;
    this.key = inProject.key;
    this.items = new Array();
    this.categories = new Array();
    //GLOBAL
    ijf.main.gNodes[this.id] = this;

}

IjfProject.prototype.getTreeStructure = function(withChecks)
{
    var retJson = {};

    retJson.text = this.name;
    retJson.id=this.id;
    retJson.leaf =false;
    retJson.cls = "folder";
    retJson.children = new Array();
    if(withChecks) retJson.checked=false;
    if(Object.size(this.categories) > 0)
    {
        for(var i in this.categories)
        {
            if(!this.categories.hasOwnProperty(i)) continue;
            retJson.children.push(this.categories[i].getTreeStructure(withChecks));
        }
    }
    else
    {
        retJson.leaf =true;
    }
    return retJson;
}









function itemControl(inId, inField, inItem, inControl, inContainer)
{
    this.dirty = false;
    this.id=inId;
    this.field = inField;
    this.item = inItem;
    this.control = inControl;
    this.container = inContainer;
    this.newVal;
    this.message;
    this.mappedSectionName;
    this.batchSaveSection;
    this.batchSaveValue;
}
itemControl.prototype.saveGridToCollect=function(inGridData, inSectionName)
{
    //special handeler for grid cells...
    //cnvert array of ojbect
    var jOut = new Array();
    var tObj;
    for(var j in inGridData)
    {
        if(!inGridData.hasOwnProperty(j)) continue;
        tObj = {};
        for(var key in inGridData[j])
        {
            if(!inGridData[j].hasOwnProperty(key)) continue;
            tObj[key]=mwfUtils_ConvertShort2Db2Date(inGridData[j][key]);
        }
        jOut.push(tObj);
    }

    var outJson = JSON.stringify(jOut);
    var procall = "/updateGrid";
    if(this.field.controlType=="tablecellappend") procall = "/appendGrid";

    if(fw.forms[window.g_formId].settings.batchSave=="true")
    {
        var thisSect = this.item.getSectionByName(inSectionName);
        this.batchSaveSection = thisSect;
        this.batchSaveValue = jOut;
        saveQueueBatch.push(this);
        return;
    }


    footLog("Calling " + procall + " on for grid cellfamily");
    jQuery.ajax({
        async: true,
        url: g_root + procall,
        type: 'POST',
        data: {
            controlId: this.id,
            itemId: this.item.id,
            sectionName: inSectionName,
            additionalTarget: fw.saveToAdditionalTarget,
            sectionId: this.item.getSectionIdByName(inSectionName),
            inGrid: outJson
        },
        timeout: 1200000,
        success: function(data) {
            //jQuery('#main').html(jQuery(data).find('#main *'));
            footLog("Successful response but...checking...");
            //todo need to parse for good
            if(data=="refresh")
            {
                window.onbeforeunload= null;
                window.location.reload();
                return;
            }
            var c = controlSet[data.controlId];

            var r = data.results;
            var stat = true;
            if(c!=null)
            {
                delete saveQueue[c.id];

                for(var i in r)
                {
                    if(!r.hasOwnProperty(i)) continue;
                    if(r[i].status!=200) stat=false;
                }

                //ok check results...
                c.message = "";
                if(data.rows)
                {
                    var rawRows = JSON.parse(data.rows);
                    for(var i in rawRows.results)
                    {
                        if(!rawRows.results.hasOwnProperty(i)) continue;
                        if(rawRows.results[i].status=='error')
                        {
                            c.message+=" Row: " + rawRows.results[i].row + ", " + rawRows.results[i].message;
                            stat=false;
                        }
                    }
                }
                if(stat)
                {
                    if(saveQueueFamilies.hasOwnProperty(c.id))
                    {
                        for(var fCont in saveQueueFamilies[c.id])
                        {
                            if(saveQueueFamilies[c.id].hasOwnProperty(fCont))
                            {
                                var tjqid = "#" + saveQueueFamilies[c.id][fCont].container.id;
                                jQuery(tjqid).removeAttr("style");
                                saveQueueFamilies[c.id][fCont].dirty=false;
                            }
                        }
                    }
                    else
                    {
                        var tjqid = "#" + c.container.id;
                        jQuery(tjqid).removeAttr("style");
                        c.dirty=false;
                    }
                    //lastly, upate local model
                    //this is an update or append, if table append, append
                    if(procall == "/appendGrid")
                    {
                        c.item.appendSectionTableObjData(inSectionName, jOut);
                    }
                    else
                    {
                        c.item.setSectionTableObjData(inSectionName, jOut);
                    }

                }
                else
                {
                    footLog("Failed section save on return....");
                    if(r.hasOwnProperty("statusMessage"))
                    {
                        c.message = c.field.dataSource + ": " + r.statusMessage
                    }
                    else
                    {
                        c.message= c.field.dataSource + " failed to save: " + r.results;
                    }

                    saveQueueFailures.push(c);
                    if(r.hasOwnProperty("results")) footLog("Failed section save...." + r.results);
                    if(r.hasOwnProperty("statusMessage")) footLog("Error: " + r.statusMessage);
                    var tjqid = "#" + c.container.id;
                    jQuery(tjqid).css(fw.saveErrorStyle);
                }
                mwf_checkSaveEnd();
            }
            else
            {

                hideProgress();
                footLog("Failed section save....");
                alert("Sorry but a table failed to upload with message:\n" + results.message);

            }
            //must determine the saved control by the return result...

        },
        error: function() {
            footLog("Failed section save!");
            //this.container.style.borderRight = "solid red 3px";
            //failed, notify the user...
            hideProgress();
            alert("Sorry but a table failed to upload with message:\n" + results.message);

        }



    });

}
itemControl.prototype.prepForSave=function(saveQueueBatch)
{



    //OK, value in the control, is now the value you want to save...
    //need to switch on the type of control, text or grid
	var tSection = ijfUtils.getFieldDef(ijf.main.itemId,this.field.dataSource);

	//manage custom types first....
	if(!tSection.jiraMeta)
	{
		var thisT = {};
		var testDs = this.field.dataSource;
		ijf.fw.CustomTypes.forEach(function(t){if(t.name==testDs) thisT=t;});
		if(thisT)
		{
			//we have a custom type....
			if(thisT.customType=="GRID")
			{
				tSection = {"jiraMeta":{"schema":{"type":"grid"}}};
				tSection["jiraField"]={};
				tSection.jiraField["id"] = ijf.jiraFieldsKeyed[thisT.fieldName].id; //jira id of the custom type field store
			}
		}
	}


	//switch on field type to determine how to pull value...
	if(tSection.jiraMeta)
	{
		//check for transition change, add schema if necessary
		if(tSection.jiraMeta.transitions) tSection.jiraMeta.schema = {"type":"status"};

		switch(tSection.jiraMeta.schema.type)
		{
			case 'other':
				//std text value
				this.newVal = this.control.items.items[0].getValue();
				if(this.newVal instanceof Date)
				{
					this.newVal = dateFormat(this.newVal,"yyyy-mm-dd");
				}
				break;
			case 'user':
				//std text value
				var sc = {};
				var newUser = this.control.items.items[0].getValue();
				var tv = {"name":newUser};
 				this.newVal = tv;
				break;
			case 'group':
				//std text value
				var sc = {};
				var newGroup = this.control.items.items[0].getValue();
				var tv = {"name":newGroup};
 				this.newVal = tv;
				break;
			case 'securitylevel':
			case 'status':
			case 'priority':
			case 'option':
				//std text value
				  var sc = {};
				  sc.data={};
				  if(this.field.controlType=="radio")
				  {
					  sc = this.control.items.items[0].getValue();
					  var newId = sc[Object.keys(sc)[0]];
					  var tv = {"id":newId};
				      this.newVal = tv;
				  }
				  else
				  {
					  sc = this.control.items.items[0].getSelection();
					  var tv = {"id":sc.data.field1};
 					  this.newVal = tv;
				  }

				break;
			case 'array':
				//multi select
				  if(this.field.controlType=="multiselect")
				  {
					  var sc = this.control.items.items[0].getValue();
					  var tv = sc.map(function(av){ return {"id":av};});
					  this.newVal = tv;
				  }
				  else if(this.field.controlType=="userpickermulti")
				  {
					   var sc = this.control.items.items[0].getValue();
					   var tv = sc.map(function(av){ return {"name":av};});
					   this.newVal = tv;
			      }
				  else if(this.field.controlType=="grouppickermulti")
				  {
					   var sc = this.control.items.items[0].getValue();
					   var tv = sc.map(function(av){ return {"name":av};});
					   this.newVal = tv;
			      }
				  else if(this.field.controlType=="attachmentupload")
				  {
					  this.newVal = 'na';
			      }
				  else
				  {
					  //standard checkbox array
					  var sc = this.control.items.items[0].getChecked();
					  var tv = sc.map(function(av){ return {"id":av.inputValue};});
					  this.newVal = tv;
			  	  }
				break;
			case 'comments-page':
			    var cmt = this.control.items.items[0].getValue();
			    var sc = ijfUtils.sanitize(cmt);
			 	var tv = {"body":sc};
 				this.newVal =  tv;
				break;
			case 'number':
				this.newVal = this.control.items.items[0].getValue()/1;
				break;
			case 'string':
				//std text value
				//in cases where a multiselect control with ijfReference i need special handling for this
				if(this.field.controlType=="multiselect")
				{
					//value is array.  get the array, switch to actual array values from ijfReference, save a json
					var vArr = this.control.items.items[0].getValue();
					var saveVal = [];
					//need the ijfReference data used for lookup. - it's stored in this.ijfLookup
					var lookups = this.field.ijfLookup;
					if(lookups)
					{
						vArr.forEach(function(v){
							var addVal = lookups.reduce(function(inV,av){if(v==av.id) inV=av.show;return inV;},null);
							if(addVal) saveVal.push(addVal);
						});
					}
					this.newVal = JSON.stringify(saveVal);
				}
				else
				{
					this.newVal = this.control.items.items[0].getValue();
				}
				break;
			case 'grid':
				//std text value
				var gridData = this.control.getStore().getData();
				var dataArray = gridData.items.map(function(r){return r.data;});
				//sanitize grid
				var rawGrid = JSON.stringify(dataArray);
				rawGrid = ijfUtils.sanitize(rawGrid);
				this.newVal = rawGrid;
				break;
			case 'datetime':
				var tDate = this.control.items.items[0].getValue();
				this.newVal = "";
				if(tDate) this.newVal=moment(tDate).format().substring(0,19)+".000-0500";
				break;
			case 'date':
				//std text value
				var tDate = this.control.items.items[0].getValue();
				this.newVal = "";
				if(tDate) this.newVal = moment(tDate).format("YYYY-MM-DD");
				break;
			default:
				this.newVal="";
				break;
		}
	}
	this.batchSaveSection = tSection;
	this.batchSaveValue = this.newVal;
	saveQueueBatch.push(this);
	return;
}
