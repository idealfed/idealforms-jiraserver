

function DataServices()
{
    this.nothing = "";
}
DataServices.cache = new Array();


DataServices.prototype.getData = function(dataSource, inFormKey, item, inField, inContainer, noCache)
{

    //attempt to pull data....
    try
    {
        if(DataServices.cache[dataSource]!=null) return DataServices.cache[dataSource];

        switch(dataSource) {
            case 'itemworkflowhistory':
                this.getWorkflowHistory("items",dataSource,inFormKey,item,inField,inContainer);
                break;
            case 'itemhistory':
                this.getItemHistory(dataSource,inFormKey,item,inField,inContainer);
                break;
            case 'exerciseitemsworkflowhistory':
                this.getExerciseWorkflowHistory(dataSource,inFormKey,item,inField,inContainer);
                break;
            case 'pagechangehistory':
                this.getPageHistory(dataSource,inFormKey,item,inField,inContainer);
                break;
            case 'genericdatasource':
                this.getNamedSource(dataSource,inFormKey,item,inField,inContainer);
                break;
            default:
                return "No data source for:" + dataSource;
        }
        return "loading";

    }
    catch(e)
    {
        footLog("Failed to get data:" + dataSource + " error:" + e.message);
    }

}


DataServices.prototype.getMaxApDataSynchronous = function(inDataSource)
{
    var retRes = "";
    $.ajax({
        async: false,
        type: 'GET',
        url: g_root + '/maxApDataUtil?cwfAction=select&cwfDatasource='+inDataSource,
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful return");
            retRes=data.status;
        },
        error: function(e) {
            footLog("Failed data call" + e.message);
        }
    });
    return retRes;
}
DataServices.prototype.setMaxApDataSynchronous = function(inDataSource)
{
    var retRes = "";
    $.ajax({
        async: false,
        type: 'GET',
        url: g_root + '/maxApDataUtil?cwfAction=update&cwfDatasource='+inDataSource,
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful return");
            retRes=data.status;
        },
        error: function(e) {
            footLog("Failed data call" + e.message);
        }
    });
    return retRes;
}


DataServices.prototype.getMaxApData = function(inDataSource, returnHandle)
{
    var retRes = "";
    $.ajax({
        async: true,
        type: 'GET',
        url: g_root + '/maxApDataUtil?cwfAction=select&cwfDatasource='+inDataSource,
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful return");
            returnHandle(data);
        },
        error: function(e) {
            footLog("Failed data call" + e.message);
        }
    });
}

DataServices.prototype.getGenericDataSourceSync = function(dataSource)
{

    var turl = dataSource;
    var retVal = "";

    if(fw)
    {
        if(!fw.validateUrl(turl))
        {
            retVal="Unauthorized URL";
            return retVal;
        }
    }

    $.ajax({
        async: false,
        type: 'GET',
        url: g_root + '/getGenericHtmlData?urlTarget=' + encodeURIComponent(turl),
        success: function(data) {
            footLog("Successful data acquisition");
            retVal=data;
        },
        error: function(e) {
            if(e.statusText=="OK")
            {
                footLog("Successful data acquisition");
                retVal=e.responseText;
            }
            else
            {
                footLog("Failed data acquisition: " + dataSource + " "  + e.statusText);
                retVal="Failed data acquisition";
            }
        }
    });
    return retVal;
}


DataServices.prototype.getNamedSource = function(dataSource,inFormKey,item,inField,inContainer)
{

   var turl = inField.dataReference;

    if(!fw.validateUrl(turl))
    {
        DataServices.cache[dataSource]="Unauthorized URL";
        inContainer.innerHTML="";
        setTimeout(renderField(inFormKey,item,inField,inContainer),500);
        return;
    }

    if(turl.indexOf("?")<0)
        turl = turl + '?itemId=' + itemId + '&categoryId=' + items[itemId].parent.id + '&exerciseId=' + exerciseId;
    else
        turl = turl + '&itemId=' + itemId + '&categoryId=' + items[itemId].parent.id + '&exerciseId=' + exerciseId;

    $.ajax(g_root + '/getGenericHtmlData?urlTarget=' + encodeURIComponent(turl), {
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful data acquisition");
            DataServices.cache[dataSource]=data.results;

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);

        },
        error: function(e) {

            if(e.statusText=="OK")
            {
                footLog("Successful data acquisition");

                DataServices.cache[dataSource]=e.responseText;

                //pause just a little for the initial rendering
                inContainer.innerHTML="";
                setTimeout(renderField(inFormKey,item,inField,inContainer),500);
            }
            else
            {
                footLog("Failed data acquisition: " + dataSource + " "  + e.statusText);
                DataServices.cache[dataSource]="Failed to acquire data";

                //pause just a little for the initial rendering
                inContainer.innerHTML="";
                setTimeout(renderField(inFormKey,item,inField,inContainer),500);
            }
        }
    });
}


DataServices.prototype.getRenderNamedSource = function(dataSource,inContainer)
{

    var turl = dataSource;

    if(!fw.validateUrl(turl))
    {
        inContainer.innerHTML="Unauthorized URL";
        return;
    }

    $.ajax(g_root + '/getGenericHtmlData?urlTarget=' + encodeURIComponent(turl), {
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful data acquisition");
            //pause just a little for the initial rendering
            inContainer.innerHTML=data.results;

        },
        error: function(e) {

            if(e.statusText=="OK")
            {
                footLog("Successful data acquisition");
                //lose html
//                var retHtml = mwfUtil_replaceAll(e.responseText,"<html>","");
//                retHtml = mwfUtil_replaceAll(retHtml,"</html>","");
//                retHtml = mwfUtil_replaceAll(retHtml,"<body>","");
//                retHtml = mwfUtil_replaceAll(retHtml,"</body>","");
                inContainer.innerHTML=e.responseText;
            }
            else
            {
                footLog("Failed data acquisition: " + dataSource + " "  + e.statusText);

                //pause just a little for the initial rendering
                inContainer.innerHTML="Failed data acquisition";
            }
        }
    });
}



DataServices.prototype.getPageHistory = function(dataSource,inFormKey,item,inField,inContainer)
{

    $.ajax(g_root + '/getCommunityPageHistory?pageId=' + inField.dataReference, {
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful data acquisition");
            //DataServices.cache[dataSource]=data;


            var localItems = [];


            var orgTree = {};
            orgTree.children = new Array();


            var firstForItem=true;
            var lastTime;
            var lastToState;
            var toState="not set";
            var thisTime= null;
            var modifier="";

            var tempWorkflows = [];


            var loadLocalItems = function(inData, inTree)
            {
                for(var pId in inData)
                {
                    if (inData.hasOwnProperty(pId))
                    {

                        firstForItem=true;
                        toState="not set";
                        thisTime= null;
                        modifier="";

                        var tItem = {};
                        tItem["id"]=pId;
                        tItem["name"]=inData[pId].name;
                        if(inData[pId].title) tItem["name"]=inData[pId].title;
                        tItem["stage"]="not set";
                        tItem["text"]=tItem["name"];
                        tItem.leaf =false;
                        tItem.cls = "folder";
                        tItem.children = new Array();
                        tItem.checked=false;
                        tItem.getAllItemsInList = function(inList,inUniqueIds)
                        {
                            for(var i in this.children)
                            {
                                if(!this.children.hasOwnProperty(i)) continue;
                                var thisItem = this.children[i];
                                if(inUniqueIds.hasOwnProperty(thisItem.id)==false)
                                {
                                    inList.push([thisItem.id,thisItem.name]);
                                    var tObj = {};
                                    inUniqueIds[thisItem.id]=tObj;
                                }
                                this.children[i].getAllItemsInList(inList,inUniqueIds);
                            }
                        };
                        //load logs
                        var tArray = new Array();
                        //rip through log and add array of logs to item...
                        for(var l in inData[pId].history)
                        {
                            if(inData[pId].history.hasOwnProperty(l))
                            {
                                if(inData[pId].history[l].versionComment.indexOf("Workflow")>-1)
                                {
                                    var m = inData[pId].history[l].versionComment;

                                    m = m.replace("Workflow moved to ","");
                                    var mA = m.split(" from ");
                                    var fromState = mA[1].replace(/\"/g,"");
                                    toState = mA[0].replace(/\"/g,"");

                                    tempWorkflows[fromState]=0;
                                    tempWorkflows[toState]=0;

                                    var dateString = inData[pId].history[l].modified.month + "/" + inData[pId].history[l].modified.day + "/" + inData[pId].history[l].modified.year + " " + inData[pId].history[l].modified.hour + ":" + inData[pId].history[l].modified.min + ":" + inData[pId].history[l].modified.sec;
                                    thisTime = Date.parse(dateString);
                                    modifier = inData[pId].history[l].modifier;
                                    if(firstForItem)
                                    {
                                        //add root milestone, and first row
                                        tItem["stage"]=toState;
                                        tArray.push([toState,thisTime,null,modifier]);
                                        firstForItem=false;
                                        lastTime = thisTime;
                                        lastToState = toState;
                                    }
                                    else
                                    {
                                        tArray.push([toState,thisTime,lastTime,modifier]);
                                        lastTime = thisTime;
                                    }
                                }
                            }
                        }
                        //The VERY last row has been added and we need its toState
                        //if(toState!="not set") tArray.push([fromState,lastTime,null,modifier])
                        tItem["workflowLog"] = tArray;


                        //load child pages
                        if(inData[pId].hasOwnProperty("children"))
                        {
                            loadLocalItems(inData[pId].children,tItem.children);
                        }

                        inTree.push(tItem);
                        localItems[pId]=tItem;
                    }
                }
            }
            loadLocalItems(data,orgTree.children);


            var localWorkflows = new Array();
            localWorkflows.push({alias: "not set", exclude: false});
            for(var twf in tempWorkflows)
            {
                if(tempWorkflows.hasOwnProperty(twf))
                {
                    localWorkflows.push({alias: twf, exclude: false});
                }
            }


            var pageData = {};
            pageData["items"] = localItems;
            pageData["ggNodes"] = localItems;
            pageData["workflow"]= localWorkflows;
            pageData["tree"]=orgTree.children[0];
            pageData["getWorkflowName"] = function(inName){
                return inName;
            };
            DataServices.cache[dataSource]=pageData;


            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);

        },
        error: function() {
            footLog("Failed data acquisition: " + dataSource);
            DataServices.cache[dataSource]="Failed to acquire data";

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);
        }
    });
}


DataServices.prototype.getWorkflowHistory = function(inType,dataSource,inFormKey,item,inField,inContainer)
{

    $.ajax(g_root + '/getWorkflowHistory?scope=' + inType + '&itemId=' + itemId + '&categoryId=' + items[itemId].parent.id + '&exerciseId=' + g_exerciseId, {
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful data acquisition");
            DataServices.cache[dataSource]=data.results;

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);

        },
        error: function() {
            footLog("Failed data acquisition: " + dataSource);
            DataServices.cache[dataSource]="Failed to acquire data";

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);
        }
    });
}

DataServices.prototype.getItemHistory = function(dataSource,inFormKey,item,inField,inContainer)
{

    $.ajax(g_root + '/getItemHistory?itemId=' + itemId, {
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful data acquisition");
            DataServices.cache[dataSource]=data.results;

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);

        },
        error: function() {
            footLog("Failed data acquisition: " + dataSource);
            DataServices.cache[dataSource]="Failed to acquire data";

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);
        }
    });
}

DataServices.prototype.getExerciseWorkflowHistory = function(dataSource,inFormKey,item,inField,inContainer)
{

    $.ajax(g_root + '/getExerciseWorkflowHistory?exerciseId=' + g_exerciseId, {
        success: function(data) {
            //$('#main').html($(data).find('#main *'));
            footLog("Successful data acquisition");

            //, create child array for each Item so the itemList owns its states...
            var firstForItem=true;
            var lastTime;
            var lastToState;
            var toState="No stage";
            var thisTime= null;

            var localItems = [];
            var tItem = {};

            for(var iId in items)
            {
                if (items.hasOwnProperty(iId))
                {
                    var tItem = {};
                    tItem["id"]=items[iId].id;
                    tItem["name"]=items[iId].name;
                    tItem["stage"]=items[iId].stage;

                    firstForItem=true;
                    toState="No stage";
                    var tArray = new Array();
                    //rip through log and add array of logs to item...
                    for(var l in data.results)
                    {
                        if(data.results.hasOwnProperty(l))
                        {
                            if(data.results[l].item_id==iId)
                            {
                                var m = data.results[l].message;
                                if(m.indexOf("Statuus")>0) continue;
                                m= m.replace("[","");
                                m= m.replace("]","");
                                m= m.replace("--","");
                                m= m.replace("=","");
                                m= m.replace("Demote ","");
                                m= m.replace("Promote ","");
                                var mA = m.split(">");
                                var fromState = mA[0].trim();
                                toState = mA[1].trim();
                                thisTime = Date.parse(data.results[l].stimestamp);

                                if(firstForItem)
                                {
                                    //add root milestone, and first row
                                    tArray.push([fromState,thisTime,thisTime]);
                                    firstForItem=false;
                                    lastTime = thisTime;
                                    lastToState = toState;
                                }
                                else
                                {
                                    tArray.push([fromState,lastTime,thisTime]);
                                    firstForItem=false;
                                    lastTime = thisTime;
                                }


                            }
                        }
                    }
                    //The VERY last row has been added and we need its toState
                    if(toState!="No stage") tArray.push([toState,lastTime,null])
                    tItem["workflowLog"] = tArray;
                    localItems[iId]=tItem;
                }
            }

            var rData = {};
            rData["items"] = localItems;
            rData["ggNodes"] = gNodes;
            rData["workflow"]= exercise.workflow.results;
            rData["tree"]=exercise.getTreeStructure(true);
            rData["getWorkflowName"] = function(inName){
                return exercise.getWorkflowName(inName);
            };
            DataServices.cache[dataSource]=rData;

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);

        },
        error: function() {
            footLog("Failed data acquisition: " + dataSource);
            DataServices.cache[dataSource]="Failed to acquire data";

            //pause just a little for the initial rendering
            inContainer.innerHTML="";
            setTimeout(renderField(inFormKey,item,inField,inContainer),500);
        }
    });
}
