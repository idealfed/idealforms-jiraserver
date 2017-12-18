var ijf = ijf || {};
ijf.extUtils ={
renderField:function(inFormKey, item, inField, inContainer)
{
	//ensure  fleshed inField for key fields
	(inField.style) ? null: inField.style="";
	(inField.fieldStyle) ? null: inField.fieldStyle="";
	(inField.labelStyle) ? null: inField.labelStyle="";
	(inField.panelStyle) ? null: inField.panelStyle="";
	(inField.event) ? null: inField.event="";
	(inField.renderif) ? null: inField.renderif="";
	(inField.caption) ? null: inField.caption="";
	(inField.dataSource) ? null: inField.dataSource="";
	(inField.toolTip) ? null: inField.toolTip="";

    if(!inField.permissions)
	{
		if(!inField.hasOwnProperty("rawPermissions"))
		{
			inField.permissions =
				{"enabled":false,
				 "states":{}
				};
		}
		else
		{
			inField.permissions=JSON.parse(inField.rawPermissions);
		}
	}

    //attempt to pull data....
    try
    {
        switch(inField.controlType) {
            case 'GRID':
                ijf.extUtils.renderGridPanel(inFormKey,item,inField,inContainer);
                break;
            case 'textbox':
                ijf.extUtils.renderTextbox(inFormKey,item,inField,inContainer);
                break;
            case 'textarea':
                ijf.extUtils.renderTextarea(inFormKey,item,inField,inContainer);
                break;
            case 'formbuttons':
                ijf.extUtils.renderFormButtons(inFormKey,item,inField,inContainer);
                break;
            case 'html':
                ijf.extUtils.renderHtml (inFormKey,item,inField,inContainer);
                break;
            case 'navigatetoform':
                ijf.extUtils.renderNavigateToForm (inFormKey,item,inField,inContainer);
                break;
            case 'datebox':
                ijf.extUtils.renderDatebox(inFormKey,item,inField,inContainer);
                break;
            case 'dropdown':
                ijf.extUtils.renderDropdown (inFormKey,item,inField,inContainer);
                break;
            case 'dropdownwithpicker':
                ijf.extUtils.renderDropdownWithPicker (inFormKey,item,inField,inContainer);
                break;
            case 'radio':
                ijf.extUtils.renderRadiogroup (inFormKey,item,inField,inContainer);
                break;
            case 'workflowbuttons':
                ijf.extUtils.renderWorkflowButtons (inFormKey,item,inField,inContainer);
                break;
            case 'checkbox':
                ijf.extUtils.renderCheckbox (inFormKey,item,inField,inContainer);
                break;
            case 'multiselect':
                ijf.extUtils.renderMultiselect (inFormKey,item,inField,inContainer);
                break;
            case 'reportbutton':
                ijf.extUtils.renderXumenterbutton(inFormKey,item,inField,inContainer);
                break;
            case 'button':
                ijf.extUtils.renderBlankbutton(inFormKey,item,inField,inContainer);
                break;
            case 'tabmenu':
                ijf.extUtils.renderTabmenu(inFormKey,item,inField,inContainer);
                break;
            case 'userpicker':
                ijf.extUtils.renderUserPicker (inFormKey,item,inField,inContainer);
                break;
            case 'userpickermulti':
                ijf.extUtils.renderUserMultiselect (inFormKey,item,inField,inContainer);
                break;
            case 'grouppicker':
                ijf.extUtils.renderGroupPicker (inFormKey,item,inField,inContainer);
                break;
            case 'grouppickermulti':
                ijf.extUtils.renderGroupMultiselect (inFormKey,item,inField,inContainer);
                break;
            case 'attachmentlist':
                ijf.extUtils.renderAttchmentList (inFormKey,item,inField,inContainer);
                break;
            case 'attachmentlistgrid':
                ijf.extUtils.renderAttchmentListGrid (inFormKey,item,inField,inContainer);
                break;
            case 'attachmentmanaged':
                ijf.extUtils.renderAttchmentManaged (inFormKey,item,inField,inContainer);
                break;
            case 'attachmentupload':
                ijf.extUtils.renderAttachmentUpload(inFormKey,item,inField,inContainer);
                break;
            case 'commentlist':
                ijf.extUtils.renderCommentList (inFormKey,item,inField,inContainer);
                break;
            case 'historylist':
                ijf.extUtils.renderHistoryList (inFormKey,item,inField,inContainer);
                break;
            case 'subform':
                ijf.extUtils.renderNestedForm (inFormKey,item,inField,inContainer);
                break;
            case 'itemlist':
                ijf.extUtils.renderItemList (inFormKey,item,inField,inContainer);
                break;
            case 'itemtree':
                ijf.extUtils.renderItemTree (inFormKey,item,inField,inContainer);
                break;
            case 'chart-pie':
                ijf.extUtils.renderPieChart (inFormKey,item,inField,inContainer);
                break;
            case 'chart-bar':
                ijf.extUtils.renderBarChart (inFormKey,item,inField,inContainer);
                break;
            case 'openpopform':
                ijf.extUtils.renderPopFormButton(inFormKey,item,inField,inContainer);
                break;
            case 'formbuttonsforpopup':
                ijf.extUtils.renderPopupFormButtons(inFormKey,item,inField,inContainer);
                break;
            case 'openurl':
                ijf.extUtils.renderButtonLink(inFormKey,item,inField,inContainer);
                break;
            case 'iframe':
                ijf.extUtils.renderIframe(inFormKey,item,inField,inContainer);
                break;

            default:
                inContainer.innerHTML="no control for type: " + inField.controlType;
        }
    }
    catch(e)
    {
        throw("Error with: " + inField.controlType + " " + e.message);
    }
},
 renderIframe:function(inFormKey,item, inField, inContainer)
{
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);
    var collapsible = false;
    if (inField.style.indexOf('collapsible:true')>-1)
    {
        collapsible=true;
    }
    var collapsed = false;
    if (inField.style.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }
    var seamless = ""; // Whether or not to add the seamless HTML5 attribute and onload event to grab inner document height.
    var onload = ""
    if (inField.style.indexOf('seamless:true')>-1)
    {
        inField.style.replace('seamless:true', "")
        seamless = " seamless ";
        onload = "onload=\"this.style.height=this.contentDocument.body.scrollHeight +'px';\""
    }
    var panelTitle = "";
    if (inField.style.indexOf('panelTitle:')>-1)
    {
        panelTitle = inField.style.substr(inField.style.indexOf('panelTitle:')+11);
        var tPt = panelTitle.split(";");
        panelTitle= ijfUtils.replaceKeyValues(tPt[0],item);
    }

    var urlRe = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
    // url regex from https://gist.github.com/dperini/729294 under MIT license
    var iframeSrc = "http://www.google.com" // Default src
    if (inField.dataSource){
        iframeSrc = ijfUtils.replaceKeyValues(inField.dataSource,item);
        //if (iframeSrc.trim().match(urlRe)) iframeSrc = iframeSrc.trim().match(urlRe)
    }
    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var iframeHTML = "<iframe src=\"" + iframeSrc + "\" " + seamless + onload + "style=\"" + l_fieldStyle + "\"></iframe>";
    var pHeight =ijfUtils.getNameValueFromStyleString(inField.fieldStyle,"height");
    var simple = new Ext.Panel({
        //labelAlign: 'left',
        collapsible: collapsible,
        collapsed: collapsed,
        title: panelTitle,
        bodyStyle: l_panelStyle,
        //width:lWidth,
        //height: pHeight,
        border:false,
        hidden: hideField,
        html: iframeHTML,
        scrollable: true
    });

	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);

}
,
 renderNestedForm:function(inFormKey,item, inField, inContainer)
{

    var nestedFormKey = inField.dataSource;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);
    var collapsible = false;
    if (inField.style.indexOf('collapsible:true')>-1)
    {
        collapsible=true;
    }
    var collapsed = false;
    if (inField.style.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }
    var panelTitle = "";
    if (inField.style.indexOf('panelTitle:')>-1)
    {
        panelTitle = inField.style.substr(inField.style.indexOf('panelTitle:')+11);
        var tPt = panelTitle.split(";");
        panelTitle= ijfUtils.replaceKeyValues(tPt[0],item);
    }
	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
    if(collapsible)
    {
		var l_labelStyle = inField.labelStyle;
		var l_panelStyle = inField.panelStyle;
		var l_Style = inField.style;

		if(!l_labelStyle) l_labelStyle="background:transparent";
		if(!l_panelStyle) l_panelStyle="background:transparent";
		if(!l_Style) l_Style="background:transparent";

        if(inField.dataReference)
        {
            try
            {
                ijf.main.gSubformParams = JSON.parse(inField.dataReference);
            }
            catch(e)
            {
                footLog("Error with nested form paramMap");
                ijf.main.gSubformParams = null;
            }
        }
        var nfId = inFormKey+inField.formCell.replace(",","")+"_nest";
        var nfContainer = "<div id=\"" + nfId + "\">Initial</div>";
        var simple = new Ext.Panel({
            //labelAlign: 'left',
            collapsible: collapsible,
            collapsed: collapsed,
            title: panelTitle,
            style: l_Style,
            bodyStyle: l_panelStyle,
            border:true,
            hidden: hideField,
            html: nfContainer,
            scrollable: true
        });
		//before render....
		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);

        simple.render(inContainer);
		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
		ijf.main.controlSet[thisControl.id]=thisControl;
		ijf.main.renderForm(nfId, inField.dataSource, true, item);
	    //after render....
	    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);

    }
    else
    {
		//before render....
		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](null,inFormKey,item, inField, inContainer);
        if(!hideField) ijf.main.renderForm(inContainer.id.replace(",",""), inField.dataSource, true, item);
	    //after render....
	    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](null, inFormKey,item, inField, inContainer);

    }
    ijf.main.gSubformParams=null;
}
,
renderPopupForm:function(inFormKey,inItem, inAction)
{
    var nfId = inFormKey+inAction.inField.formCell.replace(",","")+"_pop";
    var nfContainer = "<div id=\"" + nfId + "\">Initial</div>";
    var rItem = inItem;

    //get form and use to set the dWin params
    var pForm = ijf.fw.forms[inAction.form];

    (pForm.settings.tabTitle) ? null: pForm.settings.tabTitle="No title set";
    (pForm.settings.outerContainerStyle) ? null: pForm.settings.outerContainerStyle="";
    (pForm.settings.innerContainerStyle) ? null: pForm.settings.innerContainerStyle="";

    var wWidth = ijfUtils.getNameValueFromStyleString(pForm.settings.outerContainerStyle,'width');
	(wWidth=="") ? wWidth=300: wWidth=wWidth.replace("px","").replace("%","")/1;

    var wHeight = ijfUtils.getNameValueFromStyleString(pForm.settings.outerContainerStyle,'height');
	(wHeight=="") ? wHeight=300: wHeight=wHeight.replace("px","").replace("%","")/1;

    var iWidth = ijfUtils.getNameValueFromStyleString(pForm.settings.outerTableStyle,'width');
	(iWidth=="") ? iWidth=300: iWidth=iWidth.replace("px","").replace("%","")/1;

    var iHeight = ijfUtils.getNameValueFromStyleString(pForm.settings.outerTableStyle,'height');
	(iHeight=="") ? iHeight=300: iHeight=iHeight.replace("px","").replace("%","")/1;


    var simple = new Ext.Panel({
        //bodyStyle: inAction.fieldStyle,
        width: iWidth,
        height: iHeight,
        style: pForm.innerContainerStyle,
        border:true,
        html: nfContainer
    });

    var tempItem = ijf.currentItem;
    var tempItemId = ijf.main.itemId;
    ijf.main.parentItemId =null;
    var popType="";
    if(inAction.type) popType=inAction.type;
    //some someforms need parents to complete, saved here
	switch(popType)
	{
		case "new related":
		   	ijf.main.itemId = null;
		   	ijf.currentItem =  null;
		   	rItem=null;
		   	break;
		case "new subtask":
			ijf.main.parentItemId = ijf.main.itemId;
		   	ijf.main.itemId = null;
		   	ijf.currentItem =  null;
		   	rItem=null;
		   	break;
		case "open item":
		   	ijf.main.itemId = inAction.itemId;  //the one to pop to...
		   	rItem= ijfUtils.getJiraIssueSync(ijf.main.itemId);
		   	//ijf.currentItem =  null;
		   	break;
		default:
			break;
	}

    var wTitle = ijfUtils.replaceKeyValues(pForm.settings.tabTitle, rItem);

    var dWin = new Ext.Window({
        // layout: 'fit',
        title:  wTitle,
        width: wWidth,
        height: wHeight,
        style: pForm.outerContainerStyle,
        scrollable: "vertical",
        closable: true,
        items: [simple],
        modal: true,
        listeners:{
            beforedestroy: function(f)
            {
				switch(popType)
				{
					case "new related":
					//ijf.main.itemId = the new key, and tempItemId is the OLD key.  set the 'relationship'
					    //verify both Keys exist and are different...
					    if((tempItemId) &&(ijf.main.itemId) &&(ijf.main.itemId!=tempItemId))
					    {
							var jsonString = {
											"type": {
												"name": "Relates"
											   },
											"inwardIssue": {
												"key": tempItemId
											   },
											"outwardIssue": {
												"key": ijf.main.itemId
											   },
											"comment":{
												"body":"Linked related issue"
											  }
							};
							var saveRes = ijfUtils.jiraApiSync("POST","/rest/api/2/issueLink",JSON.stringify(jsonString));
							if(saveRes!="OK")
							{
								ijfUtils.modalDialogMessage("Error","Unable to establish the issue link: " + saveRes);
							}
						}
						break;
					default:
						break;
				}

                //rerender the current form....
                ijf.currentItem = null; //tempItem;
                ijf.main.itemId = tempItemId;
				ijf.main.processSetup("ijfContent");
                //ijf.main.renderForm("ijfContent", ijf.main.outerForm.name, false, tempItem);
            }
        }
    });
    dWin.show();
    ijf.main.gPopupFormHandle = dWin;
    //need to force the render to get metadata for the new thing, null out the meta...
    ijf.jiraMeta=null;
    ijf.main.renderForm(nfId, inAction.form, true, rItem);
},
renderCommentList:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;

    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";


    var outHtml = "";
    if(item.fields.comment.comments)
    {
		//sort desc
		var sortedCmnts = item.fields.comment.comments.sort(function(a, b)
		{
			a = new Date(a.created);
		    b = new Date(b.created);
		    return a>b ? -1 : a<b ? 1 : 0;
		});
		outHtml="<div class=ijfCommentList>";
			outHtml += "<div  class=ijfCommentListHead><div class=ijfCommentListHeadName>Comment</div><div class=ijfCommentListHeadAuthor>Author</div><div class=ijfCommentListHeadDate>Date</div></div>";
		outHtml = sortedCmnts.reduce(function(outHtml,a){
			outHtml += "<div class=ijfCommentListRow><div  class=ijfCommentListName>" + a.body.replace(/\n/g,"<br>") + "</div><div class=ijfCommentListAuthor>" + a.author.displayName + "</div><div class=ijfCommentListDate>" + moment(a.created).format('ll') + "<br>" + moment(a.created).format('LT') +"</div></div>";
			return outHtml;
		},outHtml);
		outHtml+="</div>";
	}

    if(!l_Style) l_Style = l_panelStyle;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    //height:
	var l_Height=ijfUtils.getNameValueFromStyleString(l_panelStyle,"height");
	if(l_Height=="")
	{
		l_Height=300;
	}
	else
	{
		l_Height = l_Height.replace("px","").replace("%","")/1;
	}

    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items: {
            html: outHtml,
            height:l_Height,
            frame: false,
            border: false,
            bodyStyle:  l_panelStyle,
            xtype: "panel"}
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl,inFormKey,item, inField, inContainer);
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);
}
,
renderHistoryList:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;

    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";


    var outHtml = "";

    //get item history....

    if(!item.changelog)
    {
	    var tItem = ijfUtils.jiraApiSync("GET","/rest/api/2/issue/" + item.key + "?expand=changelog",null);
	    item.changelog = tItem.changelog;
	}

    if(item.changelog.histories)
    {
		//sort desc
		var sortedLogs = item.changelog.histories.sort(function(a, b)
		{
			a = new Date(a.created);
		    b = new Date(b.created);
		    return a>b ? -1 : a<b ? 1 : 0;
		});
		outHtml="<div class=ijfCommentList>";
			outHtml += "<div  class=ijfCommentListHead><div class=ijfCommentListHeadName>Change</div><div class=ijfCommentListHeadAuthor>Author</div><div class=ijfCommentListHeadDate>Date</div></div>";
		outHtml = sortedLogs.reduce(function(outHtml,a){

			var outChange = a.items.reduce(function(oStr,i){
				oStr += "<b>Field:</b> " + i.field;
				oStr += "<br>&nbsp;&nbsp;&nbsp;<b>From Value:</b> " + i.fromString;
				oStr += "<br>&nbsp;&nbsp;&nbsp;<b>To Value:</b> " + i.toString;
				oStr += "<br><br>";
				return oStr;
			},"");

			outHtml += "<div class=ijfCommentListRow><div  class=ijfCommentListName>" + outChange.replace(/\n/g,"<br>") + "</div><div class=ijfCommentListAuthor>" + a.author.displayName + "</div><div class=ijfCommentListDate>" + moment(a.created).format('ll') + "<br>" + moment(a.created).format('LT') +"</div></div>";
			return outHtml;
		},outHtml);
		outHtml+="</div>";
	}

    if(!l_Style) l_Style = l_panelStyle;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    //height:
	var l_Height=ijfUtils.getNameValueFromStyleString(l_panelStyle,"height");
	if(l_Height=="")
	{
		l_Height=300;
	}
	else
	{
		l_Height = l_Height.replace("px","").replace("%","")/1;
	}

    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items: {
            html: outHtml,
            height:l_Height,
            frame: false,
            border: false,
            bodyStyle:  l_panelStyle,
            xtype: "panel"}
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl,inFormKey,item, inField, inContainer);
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);
},
renderAttchmentList:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;

    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";

	//sort desc
	var sortedAttachments = item.fields.attachment.sort(function(a, b)
	{
		a = new Date(a.created);
		b = new Date(b.created);
		return a>b ? -1 : a<b ? 1 : 0;
	});

    if(inField.dataReference)
    {
		//filter out any occurence of the CSV list...
		sortedAttachments = sortedAttachments.reduce(function(inArray, f)
		{
			if(f.filename.indexOf(inField.dataReference)>-1) inArray.push(f);
			return inArray;
		},[]);
	}

    if(inField.referenceFilter)
    {
		//filter out any occurence of the CSV list...
		sortedAttachments = sortedAttachments.reduce(function(inArray, f)
		{
			if(inField.referenceFilter.indexOf(f.filename)>-1) return inArray;
			inArray.push(f);
			return inArray;
		},[]);
	}

    var outHtml = "<div class=ijfAttachList>";
		outHtml += "<div  class=ijfAttachListHead><div class=ijfAttachListHeadName>Name</div><div class=ijfAttachListHeadAuthor>Author</div><div class=ijfAttachListHeadDate>Date</div></div>";
    outHtml = sortedAttachments.reduce(function(outHtml,a){
		outHtml += "<div class=ijfAttachListRow><div  class=ijfAttachListName><a href='"+a.content+"' target='_blank'>" + a.filename + "</a></div><div class=ijfAttachListAuthor>" + a.author.displayName + "</div><div class=ijfAttachListDate>" + moment(a.created).format('lll') + "</div></div>";
		return outHtml;
	},outHtml);
	outHtml+="</div>";


    if(!l_Style) l_Style = l_panelStyle;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items: {
            html: outHtml,
            frame: false,
            border: false,
            bodyStyle:  l_panelStyle,
            xtype: "panel"}
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl, inFormKey,item, inField, inContainer);
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);

},
renderAttchmentListGrid:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;

	//sort desc
	var sortedAttachments = item.fields.attachment.sort(function(a, b)
	{
		a = new Date(a.created);
		b = new Date(b.created);
		return a>b ? -1 : a<b ? 1 : 0;
	});

    if(inField.dataReference)
    {
		//filter out any occurence of the CSV list...
		sortedAttachments = sortedAttachments.reduce(function(inArray, f)
		{
			if(f.filename.indexOf(inField.dataReference)>-1) inArray.push(f);
			return inArray;
		},[]);
	}

    if(inField.referenceFilter)
    {
		//filter out any occurence of the CSV list...
		sortedAttachments = sortedAttachments.reduce(function(inArray, f)
		{
			if(inField.referenceFilter.indexOf(f.filename)>-1) return inArray;
			inArray.push(f);
			return inArray;
		},[]);
	}

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;

    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";

    var ocf =  ijfUtils.getEvent(inField);

    var hideField = ijfUtils.renderIfShowField("",inField);
	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var collapsible = true;
    if (l_fieldStyle.indexOf('collapsible:false')>-1)
    {
        collapsible=false;
    }
    var collapsed = false;
    if (l_fieldStyle.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }
    var canDelete = false;
    if (l_fieldStyle.indexOf('delete:true')>-1)
    {
        canDelete=true;
    }
	if(!perms.canEdit) canDelete=false;


	var l_Height = 300;
    var l_Height=ijfUtils.getNameValueFromStyleString(l_fieldStyle,"height");
    if(l_Height=="")
    {
		l_Height=300;
	}
	else
	{
    	l_Height = l_Height.replace("px","")/1;
	}

	var l_Width = 600;
    var l_Width=ijfUtils.getNameValueFromStyleString(l_fieldStyle,"width");
    if(l_Width=="")
    {
		l_Width=600;
	}
	else
	{
    	l_Width = l_Width.replace("px","")/1;
	}

    var listColumns = [];
    var tFields = [];

    tFields.push({name: "fileid", type: 'string'});
	listColumns.push({
			header: "FID",
			sortable: true,
			hidden: true,
			width: '1%',
			dataIndex: "fileid"
	});

    tFields.push({name: "filename", type: 'string'});
	listColumns.push({
			header: "File",
			sortable: true,
			hidden: false,
			width: '45%',
			dataIndex: "filename",
			filter: {
				type: 'string'
			}
	});

    tFields.push({name: "fUser", type: 'string'});
	listColumns.push({
			header: "User",
			sortable: true,
			hidden: false,
			width: '20%',
			dataIndex: "fUser",
			filter: {
				type: 'string'
			}
	});

	tFields.push({name: "created", type: 'date'});
	listColumns.push({
			header: "Date",
			sortable: true,
			hidden: false,
			xtype: 'datecolumn',
			formatter:'date("m/d/y h:i:s A")',
			width: '20%',
			dataIndex: "created",
			filter: {
				type: 'date'
				}
	});
	if(canDelete)
	{
		listColumns.push({xtype: 'actioncolumn',
			  header: "Action",
			  width: '10%',
			  items: [{icon: '' },{
					icon: '/download/resources/com.idealfed.poc.idealforms:jiraforms-resources/images/tree/drop-no.png',
					handler: function(grid, rowIndex, colIndex, itm) {
						  try
						  {
							  var fileId = grid.store.getData().items[rowIndex].data["fileid"];
							  //function to delete and remove the record....
							  var removeFile = function()
							  {
								   var delRes = ijfUtils.jiraApiSync("DELETE","/rest/api/2/attachment/"+fileId,null);
								   if(delRes!="OK")
								   {
										ijfUtils.modalDialogMessage("Error","Unable to delete the file: " + delRes);
										return;
								   }
								  //remove the row from the grid....
								  grid.getStore().removeAt(rowIndex);
								  return;
							  }
							  ijfUtils.modalDialog("Warning","You are about to permanently remove this file, continue?",removeFile);
						  }
						  catch(e)
						  {
							  footLog("Failed delete action ");
						  }
					}
				}]
	  	});
    }

    if(!Ext.ClassManager.isCreated(inFormKey+'_mdl_'+inField.formCell.replace(",","_")))
    {
        Ext.define(inFormKey+'_mdl_'+inField.formCell.replace(",","_"), {
            extend: 'Ext.data.Model',
            fields: tFields
        });
    }
    var gridStore = new Ext.data.Store({
        model: inFormKey+'_mdl_'+inField.formCell.replace(",","_")
    });
    var fArray = sortedAttachments.map(function(a){
		    return {"fileid":a.id,"created":a.created,"filename":"<a href='"+a.content+"' target='_blank'>" + a.filename + "</a>","fUser":a.author.displayName};
	});
	gridStore.loadData(fArray);


    var gridPanel = new Ext.grid.GridPanel({
		 title:  inField.caption,
		 style: l_Style,
		 hidden: hideField,
		 bodyStyle: l_panelStyle,
		 height: l_Height,
        store: gridStore,
        width:l_Width,
        plugins: 'gridfilters',
        id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
        //reserveScrollOffset: true,
        columns: listColumns,
        frame: true,
        collapsible: collapsible,
        collapsed: collapsed
    });
	//gridStore.parentGridPanel = gridPanel;

	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](gridPanel, inFormKey,item, inField, inContainer);
    gridPanel.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, gridPanel, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](gridPanel, inFormKey,item, inField, inContainer);

},
renderAttchmentManaged:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;

    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";

	var goEditHidden = true;
	if (inField.fieldStyle.indexOf('goedit:true')>-1)
	{
		goEditHidden = false;
    }

    var attachments = item.fields.attachment.reduce(function(inArray, a)
	{
		if(a.filename==inField.dataSource) inArray.push(a);
		return inArray;
	},[]);


	//sort desc
	var sortedAttachments = attachments.sort(function(a, b)
	{
		a = new Date(a.created);
		b = new Date(b.created);
		return a>b ? -1 : a<b ? 1 : 0;
	});


    var currentAttachment = sortedAttachments[0];
	//bootstrap null
	if(!currentAttachment)
	{
		currentAttachment = {"author":{"displayName": "(not loaded)"},"created":"(not loaded)"};
	}


    var outHtml = "<div class=ijfAttachList>";
		outHtml += "<div  class=ijfAttachListHead><div class=ijfAttachListHeadName>Name</div><div class=ijfAttachListHeadAuthor>Author</div><div class=ijfAttachListHeadDate>Date</div></div>";
    outHtml = sortedAttachments.reduce(function(outHtml,a){
		outHtml += "<div class=ijfAttachListRow><div  class=ijfAttachListName><a href='"+a.content+"' target='_blank'>" + a.filename + "</a></div><div class=ijfAttachListAuthor>" + a.author.displayName + "</div><div class=ijfAttachListDate>" + moment(a.created).format('lll') + "</div></div>";
		return outHtml;
	},outHtml);
	outHtml+="</div>";


    if(!l_Style) l_Style = l_panelStyle;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	rOnly=false;
	if(!perms.canEdit) rOnly=true;


	//end permissions

	//var fileLoad = "<form enctype='multipart/form-data' id='"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFormId'><input id='"+inFormKey+'_ctr_'+inField.formCell.replace(",","_")+"' type='file' name='file' onChange=\"javascript:if(this.value.indexOf('"+inField.dataSource+"')>-1){ijf.main.controlChanged('"+inFormKey+"_fld_"+inField.formCell+"');Ext.get('"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadLabelId').update('File Selected (hit save to upload):<br><span style=color:yellow>'+this.value+'</span>');} else {ijfUtils.modalDialogMessage('Error','Sorry, you must select a file named: <br><br>"+inField.dataSource+"');}\"></form>";
	//id='"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFileId'
    var fileLoad = "<form enctype='multipart/form-data' id='"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFormId'><input id='"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFileId' type='file' name='file' onChange=\"javascript:if(this.value.indexOf('"+inField.dataSource+"')>-1){ijf.main.controlChanged('"+inFormKey+"_fld_"+inField.formCell+"');Ext.get('"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadLabelId').update('File Selected (hit save to upload):<br><span style=color:yellow>'+this.value+'</span>');} else {ijfUtils.modalDialogMessage('Error','Sorry, you must select a file named: <br><br>"+inField.dataSource+"');}\"></form>";

    var headerItems = [{
							xtype:'panel',
							html: "<div id='"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadLabelId'>File: " + inField.dataSource + "<br> uploaded by " + currentAttachment.author.displayName + " on " + moment(currentAttachment.created).format('lll') + "</div>",
							bodyStyle: 'background:transparent;color:white;width:100px'
						 },
						{
							xtype:'button',
							text:"Edit",
							hidden: goEditHidden,
							handler: function(){
							   // render a local version
							   if(window.onbeforeunload!=null)
							   {
								   //cannot run, tell them to save first
								   ijfUtils.modalDialogMessage("Information","Sorry you cannot edit a file with unsaved fields in your form.  Please save first then try again.");
								   return;
                			   }
							   if(currentAttachment)
							   {
								   var token = "xxx";
								   //start job, open window, poll, finalize...
								   var jobSpec = {fileIdentifierString:window.location.origin +"?fileID=" + currentAttachment.id};
							   }
							   else
							   {
								  ijfUtils.modalDialogMessage("Error","Failed to get the current attachment.");
								  return;
							   }
							   var	tApi = "/rest/goedit/2.0/job/create?instanceID=local";
							   var	jData = JSON.stringify(jobSpec);
						       var  fileEditJob = ijfUtils.jiraApiSync("POST",tApi,jData);

							   if(fileEditJob.job)
							   {

								   //OK, open to the URL and open a window to poll and save when done...
								   window.open("goedit://"+window.location.host+"/?platform=jira&protocol=http&goeditProtocolVersion=2.0&token="+fileEditJob.job.token+"&instanceID=local");

									var filePollerFunction = function()
									{
										var lookForResult = ijfUtils.jiraApiSync("GET","/rest/goedit/2.0/job/" + fileEditJob.job.token + "?instanceID=local",null);
										if(lookForResult.status)
										{
											if(lookForResult.status.saveAllowed)
											{
												dWin2.items.items[0].update("<br>&nbsp;Ready to Save<br><br>&nbsp;Updated: " + new Date(lookForResult.latestDraft.timestamp).toLocaleString());
												dWin2.dockedItems.items[1].items.items[0].setHidden(false);
											}
										}
									}
									var filePoller = setInterval(filePollerFunction, 3000);

								   var dWin2 = new Ext.Window({
										layout: 'vbox',
										title: "Editing file: " + currentAttachment.filename,
										width: 350,
										height:200,
										closable: false,
										items: [
											{
												xtype: 'panel',
												margin: '0 0 0 0',
												width: '100%',
												height: '100%',
												html: "<br>&nbsp;Nothing to save yet"
											},
										],
										buttons:[ {
												text:'Save',
												hidden:true,
												handler: function(){
												window.clearInterval(filePoller);
												//get status, if OK, then save and finalize...
												var lookForResult = ijfUtils.jiraApiSync("GET","/rest/goedit/2.0/job/" + fileEditJob.job.token + "?instanceID=local",null);
												if(lookForResult.status)
												{
													if(lookForResult.status.saveAllowed)
													{
														//finalize
														var finSpec = {finalizemode:"create", revisioncomment:""};
														var	tApi = "/rest/goedit/2.0/job/" + fileEditJob.job.token + "/finalize?instanceID=local";
														var	jData = JSON.stringify(finSpec);
						       							var  fileFinJob = ijfUtils.jiraApiSync("POST",tApi,jData);
						       							if(fileFinJob.status!="success")
						       							{
															ijfUtils.modalDialogMessage("Error","Failed to get finalize the job.");
														}
														dWin2.close();
													}
												}
												else
												{
													ijfUtils.modalDialogMessage("Error","Failed to get status of the job so we cannot finalize.");
													dWin2.close();
												}

											}},
											{
												text:'Cancel',
												handler: function(){

												window.clearInterval(filePoller);
												var	tApi = "/rest/goedit/2.0/job/" + fileEditJob.job.token + "?instanceID=local";
												var cancelJob = ijfUtils.jiraApiSync("DELETE",tApi,null);
												dWin2.close();

											}}
										],
										listeners:{
											destroy: function(tObj)
											{
												ijfUtils.footLog("Edit dialog done, reload the item and rerender...");
												ijf.main.resetForm();
											}
										},
										modal: true
									});



									dWin2.show();
								}
								else
								{
									ijfUtils.modalDialogMessage("Error","Failed to create file edit job");
								}

							}
						 },
						 {
							xtype:'button',
							text:"Download",
							handler: function(){
							   // render a local version
							   if(currentAttachment) window.open(currentAttachment.content);
							}
						 }];

					if(!rOnly)
					{
						headerItems.push({
											xtype:'button',
											text:"Upload",
												listeners: {
													click: function(f,n,o){
														var clickKey = "#"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFileId";
														jQuery(clickKey).val("");
														jQuery(clickKey).trigger('click');
													}
												}

										 });
					}


    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items: [{
		       header:{
						titlePosition: 1,
						items: headerItems
					 },
			//title: "Attachment: " + inField.dataSource + " uploaded by " + currentAttachment.author.displayName + " on " + moment(currentAttachment.created).format('lll'),
			collapsible: true,
			collapsed: true,
            html: outHtml,
            frame: true,
            border: true,
            bodyStyle:  l_panelStyle,
            xtype: "panel"},
           {
            html: fileLoad,
            frame: false,
            hidden: true,
            border: false,
            xtype: "panel"}]
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl, inFormKey,item, inField, inContainer);
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);

}
,
renderHtml:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;
    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;

    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";

    if(inField.dataReference=="html")
    {
	    var outHtml = ijfUtils.replaceKeyValues(inField.dataSource,item, true);
	}
    else
    {
	    var outHtml = ijfUtils.replaceKeyValues(inField.dataSource,item);
	}
    //outHtml = ijfUtils.sanitize(outHtml);
    if(!l_Style) l_Style = l_panelStyle;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items: {
            html: outHtml,
            frame: false,
            border: false,
            bodyStyle:  l_panelStyle,
            xtype: "panel"}
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl,inFormKey,item, inField, inContainer);
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);

}
,
 renderFormButtons:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var l_save="Save";
    var l_reload="Reload";
    var l_done ="Done";
    var l_style = inField.style.split(",");
    if(l_style.length==3)
    {
        l_save=l_style[0];
        l_reload=l_style[1];
        l_done =l_style[2];
    }
    var lButtons = [];
    if(l_save)
    {

		lButtons.push({
			text:l_save,
			margin: '0 4 0 0',
			xtype:'button',
			hidden: (!perms.canEdit),
			style: inField.fieldStyle,
			handler: function(){
				if(ijf.snippets.hasOwnProperty(inField["event"]))
				{
					var fValFail = ijf.snippets[inField["event"]]();
					if(!fValFail)
					{
						ijfUtils.footLog("form failed validation");
						return;
					}
				}

				if(inField.dataReference)
				{
					ijf.main.saveResultMessage = ijfUtils.replaceKeyValues(inField.dataReference,item);
				}
				else
				{
					ijf.main.saveResultMessage = null;
				}
				var onSuccessSave = function()
				{
					ijfUtils.hideProgress();
					if(ijf.main.saveResultMessage) ijfUtils.modalDialogMessage("Information",ijf.main.saveResultMessage);
					ijf.main.setAllClean();
					//ijf.currentItem=ijfUtils.getJiraIssueSync(ijf.main.itemId);
					g_itemId = ijf.main.itemId;
					if(inField.referenceFilter) g_formId = inField.referenceFilter;
					ijf.main.resetForm();
				};
					var tForm = inField.form;

					if(ijf.fw.forms.hasOwnProperty(inField.referenceFilter))
					{
	                     tForm=ijf.fw.forms[inField.referenceFilter];
					}
					Ext.getBody().mask("Saving...");
					var saveIt = function(){ijf.main.saveForm(onSuccessSave,null,inField.form,item)};
					window.setTimeout(saveIt,10);
			}});

    }
    if(l_reload)
    {
        lButtons.push( {
            text:l_reload,
            xtype:'button',
            style: inField.fieldStyle,
			margin: '0 4 0 0',
            handler: function(){
                if(window.onbeforeunload==null)
                {
                    ijf.main.resetForm();
                }
                else
                {
                    var dFunc = function(){
                        window.onbeforeunload= null;
                        ijf.main.resetForm();
                    };
                    ijfUtils.modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
                }
            }});
    }
    if(l_done)
    {
        lButtons.push( {
            text:l_done,
            style: inField.fieldStyle,
            xtype:'button',
             handler: function(){
				//target form is dataSource if it exists or default form if it exists...
				var tForm="";
				if(ijf.fw.forms.hasOwnProperty(inField.dataSource))
				{
                     tForm=inField.dataSource;
				}
				else if(ijf.fw.forms.hasOwnProperty(inField.form.formSet.settings.defaultForm))
				{
					 tForm=inField.form.formSet.settings.defaultForm;
				}
				else
				{
					ijfUtils.modalDialogMessage("Information","Sorry but the done action needs a form or the form group needs a default form.");
					return;
				}

				//12/5/2017 - changing to reset item to null unless persist item  true...
				var tarItem = item;
				if(inField.referenceFilter != "persistItem")
				{
					tarItem=null;
					window.g_itemId=null;
				}

                if(window.onbeforeunload==null)
                {
					window.g_formId=tForm;
                    ijf.main.renderForm("ijfContent", tForm, false, tarItem);
                }
                else
                {
                    var dFunc = function(){
                        window.onbeforeunload= null;
                        window.g_formId=tForm;
	                    ijf.main.renderForm("ijfContent", tForm, false, tarItem);
                    };
                    ijfUtils.modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
                }
            }});
    }
    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";


    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        buttonAlign: 'left',
        layout: 'hbox',
        border:false,
        hidden: hideField,
        style: l_Style,
        bodyStyle: l_panelStyle,
        items: lButtons
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl,inFormKey,item, inField, inContainer);
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);

}
,
renderPopupFormButtons:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions


    var l_save="Save";
    var l_reload="Save/Done";
    var l_done ="Done";
    var l_style = inField.style.split(",");
    if(l_style.length==3)
    {
        l_save=l_style[0];
        l_reload=l_style[1];
        l_done =l_style[2];
    }
    var lButtons = [];
    if(l_save)
    {
		lButtons.push({
			text:l_save,
			margin: '0 4 0 0',
			xtype:'button',
			hidden: (!perms.canEdit),
			inField: inField,
			handler: function(){

				//if you are saving and ADD form it can only save ONE time
				//then it has to shift to an edit mode....

				//perform form validation

				if(ijf.snippets.hasOwnProperty(inField["event"]))
				{
					var fValFail = ijf.snippets[inField["event"]]();
					if(!fValFail)
					{
						ijfUtils.footLog("form failed validation");
						return;
					}
				}


				if(inField.dataReference)
				{
					ijf.main.saveResultMessage = ijfUtils.replaceKeyValues(inField.dataReference,item);
				}
				else
				{
					ijf.main.saveResultMessage = null;
				}
				var onSuccessSave = function()
				{
					ijfUtils.hideProgress();
					ijf.main.gPopupFormHandle.unmask();
					ijf.main.setAllClean();
					//now change item to be the new loaded item....
					item = ijfUtils.getJiraIssueSync(ijf.main.itemId);
					if(ijf.main.saveResultMessage) ijfUtils.modalDialogMessage("Information",ijf.main.saveResultMessage);
				};
				//IF ijf.main.parentItemId is not null and we are adding
				//a subtask...then we need to set the parent ID in the fields prior to save.  initialize here...
				var fields = null;
				if(ijf.main.parentItemId)
				{
					fields = {};
					fields.parent={"key":ijf.main.parentItemId};
				}

				//ijf.main.saveForm(onSuccessSave,fields, this.inField.form, item);
				var kForm = this.inField.form;
				Ext.getBody().mask("Saving...");
				ijf.main.gPopupFormHandle.mask("Saving...");
				var saveIt = function(){ijf.main.saveForm(onSuccessSave,null,kForm,item)};
				window.setTimeout(saveIt,10);

			}});
    }
    if(l_reload)
    {
        lButtons.push( {
            text:l_reload,
            xtype:'button',
			margin: '0 4 0 0',
			inField: inField,
            handler: function(){
				if(ijf.main.allControlsClean())
				{
					ijf.main.gPopupFormHandle.close();
                    ijf.main.gPopupFormHandle=null;
                    return;
				}

				if(ijf.snippets.hasOwnProperty(inField["event"]))
				{
					var fValFail = ijf.snippets[inField["event"]]();
					if(!fValFail)
					{
						ijfUtils.footLog("form failed validation");
						return;
					}
				}

				if(inField.dataReference)
				{
					ijf.main.saveResultMessage = ijfUtils.replaceKeyValues(inField.dataReference,item);
				}
				else
				{
					ijf.main.saveResultMessage = null;
				}
				var onSuccessSave = function()
				{
					ijfUtils.hideProgress();
					ijf.main.setAllClean();
					if(ijf.main.saveResultMessage) ijfUtils.modalDialogMessage("Information",ijf.main.saveResultMessage);
                    if(ijf.main.gPopupFormHandle) ijf.main.gPopupFormHandle.close();
                    ijf.main.gPopupFormHandle=null;
				};
				//IF ijf.main.parentItemId is not null and we are adding
				//a subtask...then we need to set the parent ID in the fields prior to save.  initialize here...
				var fields = null;
				if(ijf.main.parentItemId)
				{
					fields = {};
					fields.parent={"key":ijf.main.parentItemId};
				}
			    //ijf.main.saveForm(onSuccessSave,fields, this.inField.form, item);
				var kForm = this.inField.form;
				//Ext.getBody().mask("Saving...");
				ijf.main.gPopupFormHandle.mask("Saving...");
				var saveIt = function(){ijf.main.saveForm(onSuccessSave,null,kForm,item)};
				window.setTimeout(saveIt,10);
			}});
    }
    if(l_done)
    {
        lButtons.push( {
            text:l_done,
            xtype:'button',
			margin: '0 4 0 0',
            handler: function(){
                if(ijf.main.gPopupFormHandle)
                {
                    ijf.main.gPopupFormHandle.close();
                    ijf.main.gPopupFormHandle=null;
                }
            }});
    }
    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;

    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";

    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        buttonAlign: 'left',
        layout: 'hbox',
        border:false,
        hidden: hideField,
        style: l_Style,
        bodyStyle: l_panelStyle,
        items: lButtons
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl,inFormKey,item, inField, inContainer);
   pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);

}

,
renderNavigateToForm:function(inFormKey,item, inField, inContainer)
{


    inContainer.title = inField.toolTip;
    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;



    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";


    var hideField = ijfUtils.renderIfShowField("",inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var hFunction = function(){
        //need to get the id of the form...iterate from fw.
        var targetForm = ijfUtils.replaceKeyValues(inField.dataSource,item);
        var thisForm = ijf.fw.forms[targetForm];

        if(thisForm==null)
        {
            ijfUtils.modalDialogMessage("Error Message", "Unable to find form " +targetForm)
        }
        else
        {
            if(window.onbeforeunload==null)
            {
				window.g_formId=targetForm;
                ijf.main.renderForm("ijfContent", targetForm, false, item);
            }
            else
            {
				var dFunc = function(){
					window.onbeforeunload= null;
					window.g_formId=targetForm;
					ijf.main.renderForm("ijfContent", targetForm, false, item);
				};
				ijfUtils.modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
            }
        }
    };
    if(l_labelStyle=="link")
    {
        var pnl = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            hidden:hideField,
            style: l_Style,
            bodyStyle: l_panelStyle,
            items: {
                xtype: 'simplelink',
                text: inField.caption,
                style: l_fieldStyle,
                handler: hFunction
            }
        });
    }
    else
    {
        var bPressed = false;
        if(window.g_formId == ijfUtils.replaceKeyValues(inField.dataSource,item)) bPressed = true;
        var pnl = new Ext.FormPanel({
            buttonAlign: 'center',
            layout:'hbox',
            labelAlign: 'left',
            border:false,
            hidden: hideField,
            style: l_Style,
            bodyStyle: l_panelStyle,
            items:[{
				xtype: 'button',
                text:inField.caption,
                pressed: bPressed,
                style: l_fieldStyle,
                handler: hFunction
            }
            ]
        });
    }
    	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](pnl,inFormKey,item, inField, inContainer);
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](pnl, inFormKey,item, inField, inContainer);

},
renderAttachmentUpload:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var data = null;

    var lAllowBlank = true;

    var lValidator = function(v){return true};
    var lRegex =  inField.regEx;
    if((lRegex!=null) && (lRegex!=""))
    {
        lValidator = function(v)
        {
            var rgx = new RegExp(lRegex);
            if (!rgx.exec(v)) {
                return inField.regExMessage;
            }
            return true;
        }
    }
    var hideField = ijfUtils.renderIfShowField(data,inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;

    if(!l_fieldStyle) l_fieldStyle="width:100px;background:transparent";
	if(rOnly) l_fieldStyle="background:lightgray";

    var ocf =  ijfUtils.getEvent(inField);
	var fileLoad = "<form enctype='multipart/form-data' id='"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFormId'><input id='"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFileId' type='file' name='file' onChange=ijf.main.controlChanged('"+inFormKey+"_fld_"+inField.formCell+"');Ext.get('attachmentFileDisplayId').update(ijfUtils.getFileInputName(this,'attachmentFileDisplayId')); multiple></form>";
    var simple = new Ext.FormPanel({
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items:[{
            xtype: 'button',
            labelStyle: l_labelStyle,
            style: l_panelStyle,
            fieldLabel: 'ccc',
            hideLabel:  hideLabel,
            allowBlank: true,
            validator: lValidator,
            text: lCaption,
            readOnly: rOnly,
            id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
            listeners: {
                click: function(f,n,o){
					jQuery("#"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFileId").val("");
					jQuery("#"+inFormKey+'_fld_'+inField.formCell.replace(",","_")+"UploadFileId").trigger('click');
                }
            }
        },{
            html: "None selected",
            id: "attachmentFileDisplayId",
            frame: false,
            border: false,
            bodyStyle:  l_fieldStyle,
            xtype: "panel"},
           {
            html: fileLoad,
            frame: false,
            hidden: true,
            border: false,
            xtype: "panel"}
    	]
    });

    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);

}
,
renderTextbox:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;
    var lAllowBlank = true;
    //adding concept of session vars.
    if(inField.dataSource=="session")
    {
		var data = ijf.session[inFormKey+'_fld_'+inField.formCell];
	}
	else
	{
		var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
	    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
		var jf=item.fields[jfFieldDef.id];

		if(inField.dataReference == "html")
		{
			var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf,false,true);
		}
		else
		{
			var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);
		}

	    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
	}

    if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

    var lMaxsize =  Number.MAX_VALUE;

    var lValidator = function(v){return true};
    var lRegex =  inField.regEx;
    if((lRegex!=null) && (lRegex!=""))
    {
        lValidator = function(v)
        {
            var rgx = new RegExp(lRegex);
            if (!rgx.exec(v)) {
                return inField.regExMessage;
            }
            return true;
        }
    }
    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
    //console.log(JSON.stringify(perms));
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions


    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

    var ocf =  ijfUtils.getEvent(inField);

    var sItems = [{
            xtype: 'textfield',
            labelAlign: 'left',
            //labelWidth: labelWidth,
            labelStyle: l_labelStyle,
            style: l_panelStyle,
            fieldStyle: l_fieldStyle,
            fieldLabel: lCaption,
            hideLabel:  hideLabel,
            allowBlank: lAllowBlank,
            maxLength: lMaxsize,
            validator: lValidator,
            readOnly: rOnly,
            //width: lWidth,
            value: data,
            id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
            listeners: {
					afterrender: function(f)
					{
						this.validate();
					},
					valid: function(f)
					{
						inContainer.title = inField.toolTip;
					},
					invalid: function(f,msg){
						if(!inField.toolTip) inContainer.title = f.getErrors().join();
					},
					change: function(f,n,o){
						if(inField.dataSource=="session")
						{
							ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
						}
						else
						{
							ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
						}
						if(f.isValid())
						{
							ocf(f,n,o);
						}
					}
				}
			}];
    if (inField.style.indexOf('query:true')>-1)
    {
            sItems.push({
						xtype: 'button',
						icon: '/download/resources/com.idealfed.poc.idealforms:jiraforms-resources/images/magnify.png',
						handler: function(f,n,o) {
							var cup = this.up();
							var tVal = cup.items.items[0].getValue();
							if(ijf.snippets.hasOwnProperty(inField["dataReference2"])) ijf.snippets[inField["dataReference2"]](tVal);
						}
			});
    }

    var simple = new Ext.FormPanel({
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        layout: 'hbox',
        items: sItems
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderTabmenu:function(inFormKey,item, inField, inContainer)
{

    var tabs = JSON.parse(inField.dataSource);

	    var l_labelStyle = inField.labelStyle;
	    var l_panelStyle = inField.panelStyle;
	    var l_Style = inField.style;
	    var l_fieldStyle = inField.fieldStyle;

    var tbs = [];
    var lactiveTab = null;

    for(var t in tabs)
    {
        if(!tabs.hasOwnProperty(t)) continue;
        tbs.push({id: t,
                  title: tabs[t][0],
                  style: l_fieldStyle,
                  targetFormName: tabs[t][1]});
        if(tabs[t][1]==ijf.main.outerForm.name)
        {
            lactiveTab =t;
        }
    }
    var simple = new Ext.TabPanel({
        activeTab: lactiveTab,
        items: tbs,
        style: l_Style,
        bodyStyle: l_panelStyle,
        jField: inField,
        frame: false,
        border: false,
        listeners: {
            tabchange: function(tg,t){
                //navigate to target...
                //alert(t.targetFormName);

                if(t.targetFormName!=ijf.main.outerForm.name)
                {
					if(t.targetFormName.indexOf("snippet:")>-1)
					{
						//snippet call...
						var tSnippet = t.targetFormName.replace("snippet:","");
						ijf.main.gEventControl=this.jField;
						try
						{
							var outVal = ijf.snippets[tSnippet](this.jField);
							ijfUtils.footLog("field event returned " + outVal);
						}
						catch(e)
						{
							ijfUtils.footLog("field event failed: " + e.message);
						}
					}
					else
					{
						var thisForm = ijf.fw.forms[t.targetFormName];
						if(thisForm==null)
						{
							ijfUtils.modalDialogMessage("Error Message", "Unable to find form " + t.targetFormName)
						}
						else
						{
							if(window.onbeforeunload==null)
							{
								ijfUtils.clearExt();
								window.g_formId=t.targetFormName;
								ijf.main.renderForm("ijfContent", t.targetFormName, false, item);
							}
							else
							{
								var dFunc = function(){
									window.onbeforeunload= null;
									ijfUtils.clearExt();
									window.g_formId=t.targetFormName;
									ijf.main.renderForm("ijfContent", t.targetFormName, false, item);
								};
								ijfUtils.modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
							}
						}
					}
                }
            }
        }
    });
	 //before render....
	 if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
        //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderDatebox:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	    var lAllowBlank = true;
	    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

	    var lValidator = function(v){return true};
	    var lRegex =  inField.regEx;
	    if((lRegex!=null) && (lRegex!=""))
	    {
	        lValidator = function(v)
	        {
	            var rgx = new RegExp(lRegex);
	            if (!rgx.exec(v)) {
	                return inField.regExMessage;
	            }
	            return true;
	        }
	    }


    var hideField = ijfUtils.renderIfShowField(data,inField);
	  var hideLabel = false;
	  if (inField.caption=="")
		  var lCaption = inField.dataSource;
	  else if(inField.caption=="none")
	  {
		  var lCaption = "";
		  hideLabel=true;
	  }
	  else
		var lCaption = inField.caption;


    var d = null;
    try
    {
        var tics = Date.parse(data);
        if (isNaN(tics))
        {
            d = null;
        }
        else
        {
            d = new Date(tics);
        }
    }
    catch(e)
    {d = null;}


    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;

    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;

    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }


	    var l_labelStyle = inField.labelStyle;
	    var l_panelStyle = inField.panelStyle;
	    var l_Style = inField.style;
	    var l_fieldStyle = inField.fieldStyle;

	    if(!l_labelStyle) l_labelStyle="background:transparent";
	    if(!l_panelStyle) l_panelStyle="background:transparent";
	    if(!l_Style) l_Style="background:transparent";
	    if(!l_fieldStyle) l_fieldStyle="background:white";


	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
		if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

    var ocf =  ijfUtils.getEvent(inField);
    var simple = new Ext.FormPanel({
        border:false,
        hidden: hideField,
        width: 'auto',
        bodyStyle: l_Style,
        items:[{
            xtype: 'datefield',
            labelStyle: l_labelStyle,
            style: l_panelStyle,
            fieldStyle: l_fieldStyle,
            fieldLabel: lCaption,
            hideLabel:  hideLabel,
            allowBlank: lAllowBlank,
            validator: lValidator,
            readOnly: rOnly,
            value: d,
            invalidText: "Date must be in format mm/dd/yyyy",
            id: inFormKey+'_ctr_'+ inField.formCell.replace(",","_"),
            listeners: {
                afterrender: function(f)
                {
                    this.validate();
                },
                valid: function(f)
                {
                    inContainer.title = inField.toolTip;
                },
                invalid: function(f,msg){
                    if(!inField.toolTip) inContainer.title = f.getErrors().join();
                },
                change: function(f,n,o){
                    ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
                    if(f.isValid())
                    {
                        ocf(f,n,o);
                    }
                }
            }
        }]
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderDropdown:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;

	if(inField.dataSource=="session")
	{
		  var jfFieldMeta = {};
		  if(inField.dataReference!="ijfReference") jfFieldMeta.allowedValues = JSON.parse(inField.dataReference);
		  var jfFieldDef = {};
		  jfFieldDef.id=inField.formCell;
		  jfFieldDef.schema={};
		  jfFieldDef.schema.type="option";
		  var data = ijf.session[inFormKey+'_fld_'+inField.formCell];
		  if(!data) data=inField.dataReference2;	}
	else
	{
		var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
		var jf=item.fields[jfFieldDef.id];
		var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

		//if status, the transitions are the field meta...
		if(jfFieldDef.schema.type=='status')
		{
			//cache this?
			if(!item.transitions)
			{
				item.transitions= ijfUtils.jiraApiSync('GET','/rest/api/2/issue/'+item.key+'/transitions', null);
			}
			var jfFieldMeta = item.transitions;
		}
		else
		{
			var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
		}
	}

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup

    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var limitList = true;
    if (inField.style.indexOf('limit:false')>-1)
    {
        limitList=false;
    }

    var ocf =  ijfUtils.getEvent(inField);

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";


	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";


    //two forms:  JIRA references or IJF references
    var combo = {};
    var lookup = [];
	switch (inField.dataReference)
	{
		case "ijfReference":

		   //The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells
			var cLookupDef = {"index":"0"};
			var cListener = {
								afterrender: function(f)
								{
									this.validate();
								},
								select: function(f,n,o){

									if(inField.dataSource=="session")
									{
										ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
									}
									else
									{
										ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
									}
									ocf(f,n,o);
								}
							};

			var refCheck = 	ijf.fw.CustomTypes.reduce(function(inObj,t){if(t.name==inField.referenceFilter) inObj=t; return inObj;},null);

			if(refCheck)
			{
				lookup = ijfUtils.getReferenceDataByName(inField.referenceFilter,"0");
			}
			else
			{
				//complex cascade...
				try
				{
					cLookupDef = JSON.parse(inField.referenceFilter);
					lookup = ijfUtils.getReferenceDataByName(cLookupDef.name,cLookupDef.index);

					//establish a listener for this combo if necessary
					if(cLookupDef.parents)
					{
						var parentIds = cLookupDef.parents;
						var cFilters = parentIds.reduce(function(inFilter,p){
								inFilter.push({"property":p.dataIndex.toString(), "value":"tbd", "fieldName":p.fieldName});
								return inFilter;
							},[]);
						cListener["beforeQuery"] = function(query) {
									cFilters.forEach(function(f){
										//for each filter param, we need to get the correct value...
										var cValue = 'novaluetofilterwith';

										var ctl = ijfUtils.getControlByDataSource(f.fieldName);
										if(!ctl) ctl = ijfUtils.getControlByKey(f.fieldName);

										if(ctl) cValue = ctl.control.items.items[0].getValue();
										f.value=cValue;
									});
									this.store.clearFilter();
									this.store.filter(cFilters);
								};
					}
					//for each child, you need to clear it's value
					if(cLookupDef.children)
					{
						var childFields = cLookupDef.children;
						cListener["change"]= function(n,o,f)
						{
								childFields.forEach(function(f){
									var ctl = ijfUtils.getControlByDataSource(f);
									if(!ctl) ctl = ijfUtils.getControlByKey(f);

									if(ctl) cValue = ctl.control.items.items[0].setValue(null);
								});

								if(inField.dataSource=="session")
								{
									ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
								}
								else
								{
									ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
								}
								ocf(f,n,o);
						};
					}
				}
				catch(le)
				{
					ijfUtils.footLog("failed to handle complex lookup: " + le.message);
					lookups[col.columnName] = [];
				}
			}

			combo = {xtype: 'combobox',
					store: lookup,
					labelAlign: 'left',
					labelStyle: l_labelStyle,
					style: l_panelStyle,
					fieldStyle: l_fieldStyle,
					fieldLabel: lCaption,
					hideLabel: hideLabel,
					allowBlank: lAllowBlank,
					readOnly: rOnly,
					value: data,
					displayField: cLookupDef.index,
					valueField: cLookupDef.index,
					forceSelection: limitList,
					triggerAction: 'all',
					emptyText:'Please select...',
					selectOnFocus:true,
					id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
					listeners: cListener
					};

			break;
		default:

			switch(jfFieldDef.schema.type)
			{
				case "securitylevel":
				case "priority":
					var lookup = jfFieldMeta.allowedValues.map(function(e)
					{
							return [e.id,e.name];
					});
					break;
				case "status":
					var lookup = jfFieldMeta.transitions.map(function(e)
					{
							return [e.id,e.name];
					});
					lookup.push([data,item.fields.status.name]);
					break;
				case "option":
					var lookup = jfFieldMeta.allowedValues.map(function(e)
					{
							return [e.id,e.value];
					});
					break;
				default:
					var lookup = [];
					ijfUtils.footLog("No options found for schema: " + jfFieldDef.schema.type);
			}

			combo = {xtype: 'combobox',
            store: lookup,
			labelAlign: 'left',
			labelStyle: l_labelStyle,
			style: l_panelStyle,
			fieldStyle: l_fieldStyle,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			value: data,
			forceSelection: limitList,
			triggerAction: 'all',
			emptyText:'Please select...',
			selectOnFocus:true,
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			listeners: {
				afterrender: function(f)
				{
					this.validate();
				},
				change: function(f,n,o){
					if(inField.dataSource=="session")
					{
						ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
					}
					else
					{
						ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					}
					ocf(f,n,o);
				}
			}};
			break;
    }


    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[combo]
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
},
 renderDropdownWithPicker:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;


    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value,item);
            var lookup = ijfUtils.getReferenceDataByName(ref.name,ref.index);
            break;
        default:
			var lookup = jfFieldMeta.allowedValues.map(function(e)
			{
				return [e.id,e.value];
			});
     		break;
    }
    var pickListWindow = {};
	var openPicklistForm = function(inControl)
	{

       var colSettingsArray = [];
       var gridFieldArray=[];
	   var fType = 'list';

	   gridFieldArray.push({name: "value", type: "string"});
	   colSettingsArray.push({
				header: "Option Value",
				width: 'auto',
				dataIndex: "value",
				width: "100%",
				sortable: true,
				filter: {
				  type: 'string'
	            }
			});
		if(!Ext.ClassManager.isCreated(inField.dataSource + inField.formCell.replace(",","")))
		{
			Ext.define(inField.dataSource + inField.formCell.replace(",",""), {
				extend: 'Ext.data.Model',
				fields: gridFieldArray
			});
		}
	 	var store = Ext.create('Ext.data.Store', {
			model: inField.dataSource + inField.formCell.replace(",",""),
			proxy: {
				type: 'memory',
				reader: {
					type: 'json'
				}},
				autoLoad: false});
		var fLookup = lookup.map(function(e){
			return {"id":e[0],"value":e[1]};
		});
		store.proxy.data=fLookup;
		store.load();
		var pgrid= new Ext.grid.GridPanel({
			store: store,
			plugins: 'gridfilters',
			//style: l_panelStyle,
			height: 380,
			width: 580,
			inControl: inControl,
			columns: colSettingsArray,
			selModel: {selType: 'rowmodel', mode: 'SINGLE'},
			listeners: {
				'beforeitemdblclick': function(selMod, record, something ){
					var nVal = record.data.id;
					pickListWindow.close();
					this.inControl.items.items[0].setValue(nVal);
				}
			}
		});
		//need a grid of lookup, ID hidden, rest one column with string search
		pickListWindow = new Ext.Window({
            // layout: 'fit',
            closeAction:'destroy',
            title:  "Make Selection",
            width:  600,
            height: 400,
            closable: true,
            items:[pgrid],
            bodyStyle:'#fff',
            modal: true,
            inControl: inControl,
            layout:'fit',
            buttons:[{
                text:"Select",
                width: 80,
                handler: function(){
					    var thisUp = this.up().up();
						var nVal = thisUp.items.items[0].selection;
						pickListWindow.close();
						if(nVal) thisUp.inControl.items.items[0].setValue(nVal.data.id);
					}}
            ]
        });
        pickListWindow.show();
	}

    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var limitList = true;
    if (inField.style.indexOf('limit:false')>-1)
    {
        limitList=false;
    }

    var ocf =  ijfUtils.getEvent(inField);

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";


	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        layout: 'hbox',
        items:[{xtype: 'combobox',
            store: lookup,
			labelAlign: 'left',
			labelStyle: l_labelStyle,
			style: l_panelStyle,
			fieldStyle: l_fieldStyle,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			value: data,
			forceSelection: limitList,
			triggerAction: 'all',
			emptyText:'Please select...',
			selectOnFocus:true,
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			listeners: {
				afterrender: function(f)
				{
					this.validate();
				},
				change: function(f,n,o){
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					ocf(f,n,o);
				}
			}},
			{
			            text: "(List)",
			            style:  "background:transparent;margin-top:4px;margin-left:4px",
                        xtype: "simplelink",
                        handler: function(){
							openPicklistForm(this.up());
						}
			}]
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
},

renderUserPicker:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];

    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;


    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value,item);
            var lookup =  ijfUtils.getReferenceDataByName(ref.name,ref.index);
            break;
        default:

			var apiUrl = "/rest/api/2/user/picker";
			var	fParam = "query";
			var xtrParam = null;
			var uRoot = 'users';
            if(inField.dataSource=="Assignee")
            {
	            apiUrl = "/rest/api/2/user/assignable/search";
	            fParam = "username";
	            xtrParam={project:inField.form.formSet.projectId};
	            uRoot = '';
			}

     		Ext.define('JiraUserModel', {
			        extend: 'Ext.data.Model',
			        fields: [{name:'name', type: 'string'},
			                 {name: 'displayName', type: 'string'}]
    		});
			var lookup = Ext.create('Ext.data.Store', {
				storeId: 'userDropdownId',
				model: 'JiraUserModel',
				autoLoad: false,
				proxy: {
					type: 'ajax',
					url: g_root + apiUrl,
					extraParams : xtrParam,
					filterParam: fParam,
					groupParam: '',
					limitParam: '',
					pageParam: '',
					sortParam: '',
					startParam: '',
					reader: {
						type: 'json',
						root: uRoot
					}
				}
		    });
		    //now you need to load the inital data:
			if(jf)
			{
				if(jf.displayName)
				{
					lookup.loadData([{"name":jf.key, "displayName":jf.displayName}]);
				}
				else
				{
					lookup.loadData([{"name":jf.key, "displayName":jf.key}]);
				}
			}
     		break;
    }

    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var limitList = true;
    if (inField.style.indexOf('limit:false')>-1)
    {
        limitList=false;
    }

    var ocf =  ijfUtils.getEvent(inField);

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";


	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[{xtype: 'combobox',
            store: lookup,
            displayField: 'displayName',
            valueField: 'name',
			labelAlign: 'left',
			labelStyle: l_labelStyle,
			style: l_panelStyle,
			fieldStyle: l_fieldStyle,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			value: data,
			forceSelection: limitList,
			hideTrigger: true,
			triggerAction: 'all',
			queryMode: 'remote',
			queryParam: fParam,
			minChars: 2,
			emptyText:'Start typing...',
			selectOnFocus:true,
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			listeners: {
				afterrender: function(f)
				{
					this.validate();
				},
				change: function(f,n,o){
					if(!n) return;
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					ocf(f,n,o);
				}
			}}]
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
        //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderUserMultiselect:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value,item);
            var lookup =  ijfUtils.getReferenceDataByName(ref.name,ref.index);
            break;
        default:

            var apiUrl = "/rest/api/2/user/picker";
			var	fParam = "query";
			var xtrParam = null;
			var uRoot = 'users';

     		Ext.define('JiraUserMultiModel', {
			        extend: 'Ext.data.Model',
			        fields: [{name:'name', type: 'string'},
			                 {name: 'displayName', type: 'string'}]
    		});
			var lookup = Ext.create('Ext.data.Store', {
				storeId: 'userDropdownMultiId',
				model: 'JiraUserMultiModel',
				autoLoad: false,
				proxy: {
					type: 'ajax',
					url: g_root + apiUrl,
					extraParams : xtrParam,
					filterParam: fParam,
					groupParam: '',
					limitParam: '',
					pageParam: '',
					sortParam: '',
					startParam: '',
					reader: {
						type: 'json',
						root: uRoot
					}
				}
		    });
			var cValue = [];
			if(data)
			{
				cValue = data.map(function(cv){return cv.name;});
				lookup.loadData(data.map(function(cv){return {name:cv.name, displayName:cv.displayName};}));
			}
     		break;
    }


    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var limitList = true;
    if (inField.style.indexOf('limit:false')>-1)
    {
        limitList=false;
    }

    var ocf =  ijfUtils.getEvent(inField);

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";


	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[{xtype: 'tagfield',
            store: lookup,
            filterPickList: true,
			labelStyle: l_labelStyle,
			style: l_panelStyle,
			fieldStyle: l_fieldStyle,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			valueField: 'name',
			displayField: 'displayName',
			value: cValue,
			triggerAction: 'all',
			//selectOnFocus:false,
			forceSelection: true,
			queryMode: 'remote',
			queryParam: fParam,
			minChars: 2,
			emptyText:'Start typing...',
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			listeners: {
				afterrender: function(f)
				{
					this.validate();
				},
				change: function(f,n,o){
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					ocf(f,n,o);
				}
			}}]
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderGroupPicker:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];

    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;


    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value,item);
            var lookup =  ijfUtils.getReferenceDataByName(ref.name,ref.index);
            break;
        default:

			var apiUrl = "/rest/api/2/groups/picker";
			var	fParam = "query";
			var xtrParam = null;
			var uRoot = 'groups';

     		Ext.define('JiraGroupModel', {
			        extend: 'Ext.data.Model',
			        fields: [{name:'name', type: 'string'},
			                 {name: 'html', type: 'string'}]
    		});
			var lookup = Ext.create('Ext.data.Store', {
				storeId: 'groupDropdownId',
				model: 'JiraGroupModel',
				autoLoad: false,
				proxy: {
					type: 'ajax',
					url: g_root + apiUrl,
					extraParams : xtrParam,
					filterParam: fParam,
					groupParam: '',
					limitParam: '',
					pageParam: '',
					sortParam: '',
					startParam: '',
					reader: {
						type: 'json',
						root: uRoot
					}
				}
		    });
		    //now you need to load the inital data:
			if(jf)  lookup.loadData([{"name":jf.name, "html":jf.name}]);
     		break;
    }

    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var limitList = true;
    if (inField.style.indexOf('limit:false')>-1)
    {
        limitList=false;
    }

    var ocf =  ijfUtils.getEvent(inField);

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";
	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[{xtype: 'combobox',
            store: lookup,
            displayField: 'html',
            valueField: 'name',
			labelAlign: 'left',
			labelStyle: l_labelStyle,
			style: l_panelStyle,
			fieldStyle: l_fieldStyle,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			value: data,
			forceSelection: true,
			hideTrigger: true,
			triggerAction: 'all',
			queryMode: 'remote',
			queryParam: fParam,
			minChars: 2,
			emptyText:'Please select...',
			selectOnFocus:true,
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			listeners: {
				afterrender: function(f)
				{
					this.validate();
				},
				change: function(f,n,o){
					if(!n) return;
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					ocf(f,n,o);
				}
			}}]
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
        //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderGroupMultiselect:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value,item);
            var lookup =  ijfUtils.getReferenceDataByName(ref.name,ref.index);
            break;
        default:

            var apiUrl = "/rest/api/2/groups/picker";
			var	fParam = "query";
			var xtrParam = null;
			var uRoot = 'groups';

     		Ext.define('JiraGroupModelMulti', {
			        extend: 'Ext.data.Model',
			        fields: [{name:'name', type: 'string'},
			                 {name: 'html', type: 'string'}]
    		});
			var lookup = Ext.create('Ext.data.Store', {
				storeId: 'groupDropdownMultiId',
				model: 'JiraGroupModelMulti',
				autoLoad: false,
				proxy: {
					type: 'ajax',
					url: g_root + apiUrl,
					extraParams : xtrParam,
					filterParam: fParam,
					groupParam: '',
					limitParam: '',
					pageParam: '',
					sortParam: '',
					startParam: '',
					reader: {
						type: 'json',
						root: uRoot
					}
				}
		    });
			var cValue = [];
			if(data)
			{
				cValue = data.map(function(cv){return cv.name;});
				lookup.loadData(data.map(function(cv){return {name:cv.name, html:cv.name};}));
			}
     		break;
    }

    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var limitList = true;
    if (inField.style.indexOf('limit:false')>-1)
    {
        limitList=false;
    }

    var ocf =  ijfUtils.getEvent(inField);

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";
	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[{xtype: 'tagfield',
            store: lookup,
            filterPickList: true,
			labelStyle: l_labelStyle,
			style: l_panelStyle,
			fieldStyle: l_fieldStyle,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			valueField: 'name',
			displayField: 'html',
			value: cValue,
			triggerAction: 'all',
			//selectOnFocus:false,
			forceSelection: true,
			queryMode: 'remote',
			queryParam: fParam,
			minChars: 2,
			emptyText:'Please select...',
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			listeners: {
				afterrender: function(f)
				{
					this.validate();
				},
				change: function(f,n,o){
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					ocf(f,n,o);
				}
			}}]
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderMultiselect:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	if(inField.dataSource=="session")
	{
		  var jfFieldMeta = {};
		  if(inField.dataReference!="ijfReference") jfFieldMeta.allowedValues = JSON.parse(inField.dataReference);
		  var jfFieldDef = {};
		  jfFieldDef.id=inField.formCell;
		  jfFieldDef.schema={};
		  jfFieldDef.schema.type="option";
		  var data = ijf.session[inFormKey+'_fld_'+inField.formCell];
		  if(data) data = data.map(function(v){return {"id":v};});
		  if(!data) data=inField.dataReference2;	}
	else
	{
		var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
		var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
		var jf=item.fields[jfFieldDef.id];
		var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);
	}


    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;


    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    var lookup = [];
	var cListener = {
						afterrender: function(f)
						{
							this.validate();
						},
						change: function(f,n,o){

							if(inField.dataSource=="session")
							{
								ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
							}
							else
							{
								ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
							}
							ocf(f,n,o);
						}
					};
    switch (inField.dataReference)
    {
        case "ijfReference":

		   //The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells
			var cLookupDef = {"index":"0"};

			var refCheck = 	ijf.fw.CustomTypes.reduce(function(inObj,t){if(t.name==inField.referenceFilter) inObj=t; return inObj;},null);
			if(refCheck)
			{
				lookup = ijfUtils.getReferenceDataByName(inField.referenceFilter,"0",true);
				var cLookupDef = {"index":"0"};
			}
			else
			{
                var cLookupDef = JSON.parse(inField.referenceFilter);
                //value only for now...
        	    lookup =  ijfUtils.getReferenceDataByName(cLookupDef.name,cLookupDef.index,true);
			}
            var lId = 0;
            //look for filter key, parent id that is, if exists, then add a filter to this animal

			if(cLookupDef.parent)
			{
				//yes filter....
				lookup = lookup.map(function(e)
				{
					return {id: lId++, show: e[cLookupDef.index], filterField:e[cLookupDef.parent.dataIndex]};
				});
				//switch the data value to the ID of the row containing, IF data is from jira and not session
				if(data)
				{
					if((typeof data)=="string")
					{
						data = JSON.parse(data);
						data = data.map(function(v){
							var valKey = lookup.reduce(function(inV,av){if(v==av.show) inV=av.id;return inV;},null);
							return {"id":valKey};
						});
					}
			    }

				var cFilters = [{"property":"filterField", "value":"tbd", "fieldName":cLookupDef.parent.fieldName}];

				cListener["beforeQuery"] = function(query) {
							cFilters.forEach(function(f){
								//for each filter param, we need to get the correct value...
								var cValue = 'novaluetofilterwith';

								var ctl = ijfUtils.getControlByDataSource(f.fieldName);
								if(!ctl) ctl = ijfUtils.getControlByKey(f.fieldName);

								if(ctl) cValue = ctl.control.items.items[0].getValue();
								f.value=cValue;
							});
							this.store.clearFilter();
							this.store.filter(cFilters);
						};
	            var cValue = [];
				if(data) cValue = data.map(function(cv){return cv.id});
				var shows = Ext.create('Ext.data.Store', {
				  fields: ['id','show','filterField'],
				  data: lookup
				});
			}
			else
			{
				//no filter
				lookup = lookup.map(function(e)
				{
					return {id: lId++, show: e[cLookupDef.index]};
				});
				//switch the data value to the ID of the row containing, IF data is from jira and not session
				if(data)
				{
					if((typeof data)=="string")
					{
						data = JSON.parse(data);
						data = data.map(function(v){
							var valKey = lookup.reduce(function(inV,av){if(v==av.show) inV=av.id;return inV;},null);
							return {"id":valKey};
						});
					}
			    }
	            var cValue = [];
				if(data) cValue = data.map(function(cv){return cv.id});
				var shows = Ext.create('Ext.data.Store', {
				  fields: ['id','show'],
				  data: lookup
				});
			}

            break;
        default:

			if((jfFieldDef.schema.system=="components")
				|| (jfFieldDef.schema.system=="versions")
				|| (jfFieldDef.schema.system=="fixVersions"))
			{
				var lookup = jfFieldMeta.allowedValues.map(function(e)
				{
						return {id: e.id, show: e.name};
				});
				var cValue = [];
				if(data) cValue = data.map(function(cv){return cv.id});
				var shows = Ext.create('Ext.data.Store', {
				  fields: ['id','show'],
				  data: lookup
				});
			}
			else
			{
				var lookup = jfFieldMeta.allowedValues.map(function(e)
				{
						return {id: e.id, show: e.value};
				});
				var cValue = [];
				if(data) cValue = data.map(function(cv){return cv.id});
				var shows = Ext.create('Ext.data.Store', {
				  fields: ['id','show'],
				  data: lookup
				});
			}
     		break;
    }

    inField.ijfLookup = lookup;

    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var limitList = true;
    if (inField.style.indexOf('limit:false')>-1)
    {
        limitList=false;
    }

    var ocf =  ijfUtils.getEvent(inField);

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";
	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";


    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[{xtype: 'tagfield',
            store: shows,
            filterPickList: true,
			labelStyle: l_labelStyle,
			style: l_panelStyle,
			fieldStyle: l_fieldStyle,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			valueField: 'id',
			displayField: 'show',
			value: cValue,
			queryMode: 'local',
			//forceSelection: limitList,
			triggerAction: 'all',
			emptyText:'Please select...',
			selectOnFocus:true,
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			listeners: cListener
		}]
    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderRadiogroup:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	if(inField.dataSource=="session")
	{
		  var jfFieldMeta = {};
		  jfFieldMeta.allowedValues = JSON.parse(inField.dataReference);
		  var jfFieldDef = {};
		  jfFieldDef.id=inField.formCell;
		  jfFieldDef.schema={};
		  jfFieldDef.schema.type="option";
		  var data = ijf.session[inFormKey+'_fld_'+inField.formCell];
		  if(data) data = data[Object.keys(data)[0]];
		  if(!data) data=inField.dataReference2;	}
	else
	{
      var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	  var jf=item.fields[jfFieldDef.id];
      var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

		//if status, the transitions are the field meta...
		if(jfFieldDef.schema.type=='status')
		{
			//cache this?
			if(!item.transitions)
			{
				item.transitions= ijfUtils.jiraApiSync('GET','/rest/api/2/issue/'+item.key+'/transitions', null);
			}
			var jfFieldMeta = item.transitions;
		}
		else
		{
			var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
		}
	}

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }
    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

	var ocf =  ijfUtils.getEvent(inField);

	var l_labelStyle = inField.labelStyle;
	var l_panelStyle = inField.panelStyle;
	var l_Style = inField.style;
	var l_fieldStyle = inField.fieldStyle;

	if(!l_labelStyle) l_labelStyle="background:transparent";
	if(!l_panelStyle) l_panelStyle="background:transparent";
	if(!l_Style) l_Style="background:transparent";
	if(!l_fieldStyle) l_fieldStyle="background:transparent; margin: 0 10 0 0";

     var cColumns = ijfUtils.getNameValueFromStyleString(l_fieldStyle,'columns');
      if(!cColumns) cColumns = 2;

		switch(jfFieldDef.schema.type)
		{
			case "securitylevel":
			case "priority":
				var rOptions= jfFieldMeta.allowedValues.map(function(e)
				{
								return {id: "radio_" + jfFieldDef.id + "_" + e.id,
										boxLabel: e.name,
										value : (data==e.id) ?  true : false,
										style: l_fieldStyle,
										readOnly: rOnly,
										name: jfFieldDef.id,
										inputValue: e.id};
				 });
				break;
			case "status":
				var rOptions= jfFieldMeta.transitions.map(function(e)
				{
								return {id: "radio_" + jfFieldDef.id + "_" + e.id,
										boxLabel: e.name,
										value :  false,
										style: l_fieldStyle,
										name: jfFieldDef.id,
										readOnly: rOnly,
										inputValue: e.id};
				});
				rOptions.push({id: "radio_" + jfFieldDef.id + "_" + data,
										boxLabel: item.fields.status.name,
										value : true,
										style: l_fieldStyle,
										readOnly: rOnly,
										name: jfFieldDef.id,
										inputValue: data});
				break;
			case "option":
				var rOptions= jfFieldMeta.allowedValues.map(function(e)
				{
								return {id: "radio_" + jfFieldDef.id + "_" + e.id,
										boxLabel: e.value,
										value : (data==e.id) ?  true : false,
										style: l_fieldStyle,
										readOnly: rOnly,
										name: jfFieldDef.id,
										inputValue: e.id};
				 });
				break;
			default:
				var rOptions = [];
				ijfUtils.footLog("No options found for schema: " + jfFieldDef.schema.type);
		}

    var ocf =  ijfUtils.getEvent(inField);
    var hideField = ijfUtils.renderIfShowField(data,inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";
    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[{xtype: 'radiogroup',
			labelAlign: 'left',
			labelStyle: l_fieldStyle, //was panel style
			style: l_panelStyle,
  			columns: cColumns,
			fieldLabel: lCaption,
			hideLabel: hideLabel,
			allowBlank: lAllowBlank,
			readOnly: rOnly,
			selectOnFocus:true,
			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
			items: rOptions,
			listeners: {
				afterrender: function(f)
				{
					this.validate();
				},
				change: function(f,n,o){
					if(inField.dataSource=="session")
					{
						ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
					}
					else
					{
						ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					}
					ocf(f,n,o);
				}
			}}]
    });

	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);



}
,renderWorkflowButtons:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	//if status, the transitions are the field meta...
	if(jfFieldDef.schema.type=='status')
	{
		//cache this?
		if(!item.transitions)
		{
			item.transitions= ijfUtils.jiraApiSync('GET','/rest/api/2/issue/'+item.key+'/transitions', null);
		}
		var jfFieldMeta = item.transitions;
	}
	else
	{
		var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
	}

    var lAllowBlank = true;

    var hideLabel = false;
    var lCaption = "";
    var rOnly = false;

	var ocf =  ijfUtils.getEvent(inField);

	var l_labelStyle = inField.labelStyle;
	var l_panelStyle = inField.panelStyle;
	var l_Style = inField.style;
	var l_fieldStyle = inField.fieldStyle;

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	//end permissions

    //if(!l_labelStyle) l_labelStyle="background:transparent";
    //if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    //if(!l_fieldStyle) l_fieldStyle="background:white";


     var cColumns = ijfUtils.getNameValueFromStyleString(l_fieldStyle,'columns');
     if(!cColumns) cColumns = 2;

     var ocf =  ijfUtils.getEvent(inField);

	var workflowButtonsOptions= jfFieldMeta.transitions.map(function(e)
	{
		return {
			xtype: "button",
			text: e.name,
			margin: '0 4px 0 0',
			statusId: e.id,
			hidden: (!perms.canEdit),
			style: l_fieldStyle,
			handler: function(){
				   //verify that form is clean, if so,
				   //change to the new status and save....using a callback to on saveWithCallback
					if(!ocf(this)) return;
					if(!ijf.main.allControlsClean())
					{
					   ijfUtils.modalDialogMessage("Error", "The form has been modified, please save the form before changing the status.");
					   return;
					}

					var onSuccessSave = function()
					{
						if(ijf.main.saveResultMessage) ijfUtils.modalDialogMessage("Information",ijf.main.saveResultMessage);
						ijf.currentItem=ijfUtils.getJiraIssueSync(item.key);
						ijf.main.resetForm();
					};

					var fields = {"status":{"id":this.statusId}};
				    ijf.main.saveBatch(onSuccessSave,fields, inField.form, item);
			}
		};
	});

    var hideField = ijfUtils.renderIfShowField(data,inField);

    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items: workflowButtonsOptions
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, inFormKey,item, inField, inContainer);
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderCheckbox:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	if(inField.dataSource=="session")
	{
		  var jfFieldMeta = {};
		  jfFieldMeta.allowedValues = JSON.parse(inField.dataReference);
		  var jfFieldDef = {};
		  jfFieldDef.id=inField.formCell;
		  var data = ijf.session[inFormKey+'_fld_'+inField.formCell];

		  if(!data) data=inField.dataReference2;
	}
	else
	{
		  var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
		  var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
		  var jf=item.fields[jfFieldDef.id];
		  var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);
	}


      var lAllowBlank = true;
      if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

      var hideLabel = false;
      if (inField.caption=="")
          var lCaption = inField.dataSource;
      else if(inField.caption=="none")
      {
          var lCaption = "";
          hideLabel=true;
      }
      else
          var lCaption = inField.caption;
      if (inField.style.indexOf('hidden:true')>-1)
      {
          hideLabel=true;
          hideField=true;
      }
      var rOnly = false;
      if (inField.fieldStyle.indexOf('readonly:true')>-1)
      {
          rOnly=true;
      }
      if (inField.style.indexOf('enteronce:true')>-1)
      {
          if (!!data) rOnly=true;
      }

  	var ocf =  ijfUtils.getEvent(inField);

  	var l_labelStyle = inField.labelStyle;
  	var l_panelStyle = inField.panelStyle;
  	var l_Style = inField.style;
  	var l_fieldStyle = inField.fieldStyle;


  	if(!l_labelStyle) l_labelStyle="background:transparent";
  	if(!l_panelStyle) l_panelStyle="background:transparent";
  	if(!l_Style) l_Style="background:transparent";
  	if(!l_fieldStyle) l_fieldStyle="background:transparent; margin: 0 10 0 0";

      var cColumns = ijfUtils.getNameValueFromStyleString(l_fieldStyle,'columns');
      if(!cColumns) cColumns = 2;

      var getChecked = function(inId)
      {
		  var retVal = false;
		  if(data) data.forEach(function(c){if(c.id==inId) retVal=true});
		  return retVal;
	  }

      var rOptions= jfFieldMeta.allowedValues.map(function(e)
      {
  			     	return {id: "check_" + jfFieldDef.id + "_" + e.id,
  			     			boxLabel: e.value,
  			     			value : getChecked(e.id),
       						style: l_fieldStyle,
  			     			name: jfFieldDef.id,
  			     			readOnly: rOnly,
  			     			inputValue: e.id};
      });

      var ocf =  ijfUtils.getEvent(inField);
      var hideField = ijfUtils.renderIfShowField(data,inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!rOnly) && (!perms.canEdit)) rOnly=true;
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions
	if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";

      var simple = new Ext.FormPanel({
          hidden: hideField,
          border:false,
          bodyStyle: l_Style,
          items:[{xtype: 'checkboxgroup',
  			labelStyle: l_labelStyle,
  			style: l_panelStyle,
  			columns: cColumns,
  			fieldLabel: lCaption,
  			hideLabel: hideLabel,
  			allowBlank: lAllowBlank,
  			selectOnFocus:true,
  			id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
  			items: rOptions,
  			listeners: {
  				afterrender: function(f)
  				{
  					this.validate();
  				},
  				change: function(f,n,o){
					if(inField.dataSource=="session")
					{
	  					//somehow ijf.session needs the current values of this animal....
	  					//perhaps: up().items[], create lData and set session to it

	  					var newVals = f.items.items.reduce(function(iVal,e){
							if(e.value) iVal.push({"id":e.inputValue});
							return iVal;
						},[]);
						ijf.session[inFormKey+'_fld_'+inField.formCell]=newVals;

					}
					else
					{
	  					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					}
  					ocf(f,n,o);
  				}
  			}}]
      });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);

      simple.render(inContainer);
      var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
 renderButtonLink:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var hideField = ijfUtils.renderIfShowField(null,inField);

    var lCaption = inField.caption;

    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideField=true;
    }

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    //if(!l_labelStyle) l_labelStyle="background:transparent";
    //if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    //if(!l_fieldStyle) l_fieldStyle="background:white";

    var ocf =  ijfUtils.getEvent(inField);

    var xType = "button";
    if(l_labelStyle=="link") xType="simplelink";

        var simple = new Ext.FormPanel({
            border:false,
            hidden:hideField,
            bodyStyle: l_Style,
            jField: inField,
            items: {
                xtype: xType,
                text: lCaption,
                style: l_panelStyle,
               handler: function(){
			                   var url =ijfUtils.replaceKeyValues(inField.dataSource,item);
			                   window.open(url);
            	}
            }
        });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, item, inField, inContainer);

	simple.render(inContainer);
	var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
 renderBlankbutton:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var hideField = ijfUtils.renderIfShowField(null,inField);

    var lCaption = inField.caption;

    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideField=true;
    }

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    //if(!l_labelStyle) l_labelStyle="background:transparent";
    //if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    //if(!l_fieldStyle) l_fieldStyle="background:white";

    var ocf =  ijfUtils.getEvent(inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var xType = "button";
    if(l_labelStyle=="link") xType="simplelink";

        var simple = new Ext.FormPanel({
            border:false,
            hidden:hideField,
            bodyStyle: l_Style,
            jField: inField,
            items: {
                xtype: xType,
                text: lCaption,
                style: l_panelStyle,
                handler: function(){
					ijf.main.gEventControl=this.up().jField;
                    ocf();
                }
            }
        });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, item, inField, inContainer);

	simple.render(inContainer);
	var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
 renderXumenterbutton:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var hideField = ijfUtils.renderIfShowField(null,inField);

    var lCaption = inField.caption;

    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideField=true;
    }

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    //if(!l_labelStyle) l_labelStyle="background:transparent";
    //if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    //if(!l_fieldStyle) l_fieldStyle="background:white";

    var ocf =  ijfUtils.getEvent(inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var xType = "button";
    if(l_labelStyle=="link") xType="simplelink";

        var simple = new Ext.FormPanel({
            border:false,
            hidden:hideField,
            bodyStyle: l_Style,
            jField: inField,
            items: {
                xtype: xType,
                text: lCaption,
                style: l_panelStyle,
                handler: function(){
					ijf.main.gEventControl=this.up().jField;

					//get custom type, then load file detail, generate output, download
					var thisT = {};
					for(var tF in ijf.fw.CustomTypes){
						if(!ijf.fw.CustomTypes.hasOwnProperty(tF)) return;
						if(ijf.fw.CustomTypes[tF].name==inField.dataSource) thisT=ijf.fw.CustomTypes[tF];
					}
					if(thisT.customType!="FILE")
					{
						ijfUtils.modalDialogMessage("Error","Unable to get report file from types");
						return;
					}

					var fileDetailRaw = ijfUtils.jiraApiSync('GET',g_root + '/plugins/servlet/iforms?ijfAction=getCustomType&customTypeId='+thisT.id, null);

					var cleanDoubleDouble = fileDetailRaw.replace(/\"\"/g,"\"");
					cleanDoubleDouble = cleanDoubleDouble.replace(/~pct~/g,"%");
					cleanDoubleDouble = cleanDoubleDouble.replace("\"~\"","\"\"");

					var fileType = JSON.parse(cleanDoubleDouble);
					var fileDetail = {};
					//thisT.settings...
					var fileInfoString = "No file loaded yet";
					try
					{
						var fileDetail = JSON.parse(fileType.settings);
						fileInfoString = fileDetail.fileInfoString;
					}
					catch(e)
					{
						ijfUtils.modalDialogMessage("Error","Unable to get parse file from type");
						return;
					}
					var decodedFile = ijfUtils.Base64Binary.base64ToArrayBuffer(fileDetail.file);
					//prep data
					var itemData={};
					Object.keys(ijf.jiraMeta.fields).forEach(function(k)
					{
						if(ijf.currentItem.fields.hasOwnProperty(k))
						{
							var f = ijf.currentItem.fields[k];
							var v = ijfUtils.handleJiraFieldType(ijf.jiraMeta.fields[k],f,true,true);
							itemData[ijf.jiraMeta.fields[k].name]=v;
						}
					});

					//add special values:  key, status
					itemData["key"]=ijf.currentItem.key;
					itemData["status"]=ijf.currentItem.status.name;

					//add ocf hook to alter data
					ocf(itemData);

					//Process the file:
					var zip = new JSZip(decodedFile);
					var doc=new Docxtemplater();
					doc.includeTags=false;
					doc.loadZip(zip);
					doc.setData(itemData);
					doc.render(); //apply them (replace all occurences of {first_name} by Hipp, ...)
					//mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					out=doc.getZip().generate({
						type:"blob",
						mimeType: "application/octet-stream",
					});

				   //name is the name
				   var fParts = fileDetail.fileInfoString.split("\\");
				   if(fParts.length==1)
				   {
					   var fName = fileDetail.fileInfoString;
				   }
				   else
				   {
					   var fName = fParts[fParts.length-1];
				   }
					//var blob = new Blob([decodedFile], {type: "application/octet-stream"});
					saveAs(out,fName);

                }
            }
        });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple, item, inField, inContainer);

	simple.render(inContainer);
	var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
 renderPopFormButton:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.controlType;
    else
        var lCaption = inField.caption;

	var l_labelStyle = inField.labelStyle;
	var l_panelStyle = inField.panelStyle;
	var l_Style = inField.style;
	var l_fieldStyle = inField.fieldStyle;

	if(!l_Style) l_Style="background:transparent";

    var hideField = ijfUtils.renderIfShowField("",inField);

    var ocf =  ijfUtils.getEvent(inField);

	var aWidth = ijfUtils.getNameValueFromStyleString(inField.panelStyle,"width");
	var aHeight = ijfUtils.getNameValueFromStyleString(inField.panelStyle,"height");
	var aTitle = ijfUtils.getNameValueFromStyleString(inField.panelStyle,"title");

	if(aWidth)
	{
		aWidth = aWidth.replace("px","").replace("%","")/1;
	}
	else
	{
		aWidth=300;
	}
	if(aHeight)
	{
		aHeight = aHeight.replace("px","").replace("%","")/1;
	}
	else
	{
		aHeight=300;
	}
    var xType = "button";
    if(l_labelStyle=="link") xType="simplelink";
    var simple = new Ext.FormPanel({
            border:false,
            hidden:hideField,
            bodyStyle: l_Style,
            jField: inField,
            items: {
                xtype: xType,
                text: lCaption,
                handler: function(){
                    var action = {};
                    action.form = inField.dataSource;
                    //action.title = aTitle;
                    //action.width = aWidth;
                    //action.height = aHeight;
                    action.type = inField.dataReference;
                    //action.fieldStyle = inField.fieldStyle;
                    action.inField = inField;
                    ijf.extUtils.renderPopupForm(inFormKey,item,action)
                }
            }
        });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);

	simple.render(inContainer);
	var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
 renderTextarea:function(inFormKey,item, inField, inContainer)
{

    var collapsible = false;
    if (inField.style.indexOf('collapsible:true')>-1)
    {
        collapsible=true;
    }
    var collapsed = false;
    if (inField.style.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }

    var panelTitle = "";
    if (inField.style.indexOf('panelTitle:')>-1)
    {
        panelTitle = inField.style.substr(inField.style.indexOf('panelTitle:')+11);
        var tPt = panelTitle.split(";");
        panelTitle=tPt[0];
    }

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraMetaKeyed[inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=item.fields[jfFieldDef.id];

	if(inField.dataReference == "html")
	{
	    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf,false,true);
	}
	else
	{
	    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);
	}

	    var lAllowBlank = true;
	    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;
        if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

	    var lMaxsize =  Number.MAX_VALUE;

	    var lValidator = function(v){return true};
	    var lRegex =  inField.regEx;
	    if((lRegex!=null) && (lRegex!=""))
	    {
	        lValidator = function(v)
	        {
	            var rgx = new RegExp(lRegex);
	            if (!rgx.exec(v)) {
	                return inField.regExMessage;
	            }
	            return true;
	        }
	    }
	    var hideField = ijfUtils.renderIfShowField(data,inField);
	    var hideLabel = false;
	    if (inField.caption=="")
	        var lCaption = inField.dataSource;
	    else if(inField.caption=="none")
	    {
	        var lCaption = "";
	        hideLabel=true;
	    }
	    else
	        var lCaption = inField.caption;
	    if (inField.style.indexOf('hidden:true')>-1)
	    {
	        hideLabel=true;
	        hideField=true;
	    }
	    var rOnly = false;
	    if (inField.fieldStyle.indexOf('readonly:true')>-1)
	    {
	        rOnly=true;
	    }
	    if (inField.style.indexOf('enteronce:true')>-1)
	    {
	        if (!!data) rOnly=true;
	    }

	    var l_labelStyle = inField.labelStyle;
	    var l_panelStyle = inField.panelStyle;
	    var l_Style = inField.style;
	    var l_fieldStyle = inField.fieldStyle;


	    if(!l_labelStyle) l_labelStyle="background:transparent";
	    if(!l_panelStyle) l_panelStyle="background:transparent";
	    if(!l_Style) l_Style="background:transparent";
	    if(!l_fieldStyle) l_fieldStyle="background:white";


		//permissions check....has to exist...
		if(inField.permissions.enabled)
		{
			var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
		}
		else
		{
			var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
		}
		if((!rOnly) && (!perms.canEdit)) rOnly=true;
		if((!hideField) && (!perms.canSee))	hideField=true;
		//end permissions

		if(rOnly) l_fieldStyle=l_fieldStyle+";background:lightgray";


		var collapsible = false;
		if (inField.style.indexOf('collapsible:true')>-1)
		{
			collapsible=true;
		}
		var collapsed = false;
		if (inField.style.indexOf('collapsed:true')>-1)
		{
			collapsed=true;
		}

		var panelTitle = "";
		if (inField.style.indexOf('panelTitle:')>-1)
		{
			panelTitle = inField.style.substr(inField.style.indexOf('panelTitle:')+11);
			var tPt = panelTitle.split(";");
			panelTitle=tPt[0];
		}

	    var ocf =  ijfUtils.getEvent(inField);

	    var simple = new Ext.FormPanel({
	        border:false,
	        hidden: hideField,
	        collapsible: collapsible,
	        collapsed: collapsed,
	        title: panelTitle,
	        width: 'auto',
	        height: 'auto',
	        bodyStyle: l_Style,
	        items:[{
	            xtype: 'textarea',
	            labelAlign: 'left',
	            labelStyle: l_labelStyle,
	            style: l_panelStyle,
	            fieldStyle: l_fieldStyle,
	            fieldLabel: lCaption,
	            hideLabel:  hideLabel,
	            allowBlank: lAllowBlank,
	            maxLength: lMaxsize,
	            validator: lValidator,
	            readOnly: rOnly,
	            value: data,
	            id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
	            listeners: {
	                afterrender: function(f)
	                {
	                    this.validate();
	                },
	                valid: function(f)
	                {
	                    inContainer.title = inField.toolTip;
	                },
	                invalid: function(f,msg){
	                    if(!inField.toolTip) inContainer.title = f.getErrors().join();
	                },
	                change: function(f,n,o){
	                    ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
	                    if(f.isValid())
	                    {
	                        ocf(f,n,o);
	                    }
	                }
	            }
	        }]
	    });
    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](simple,inFormKey,item, inField, inContainer);

	    simple.render(inContainer);
	    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](simple, inFormKey,item, inField, inContainer);
}
,
renderItemList:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var curIndex = 0;

    var lCaption = inField.caption;

    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }

    var hideField = ijfUtils.renderIfShowField("",inField);

    var collapsible = true;
    if (inField.style.indexOf('collapsible:false')>-1)
    {
        collapsible=false;
    }
    var collapsed = false;
    if (inField.style.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }


	    var l_labelStyle = inField.labelStyle;
	    var l_panelStyle = inField.panelStyle;
	    var l_Style = inField.style;
	    var l_fieldStyle = inField.fieldStyle;


	    if(!l_labelStyle) l_labelStyle="background:transparent";
	    if(!l_panelStyle) l_panelStyle="background:transparent";
	    if(!l_Style) l_Style="background:transparent";
	    if(!l_fieldStyle) l_fieldStyle="background:transparent";

	var l_Height = 'auto';
    var l_Height=ijfUtils.getNameValueFromStyleString(l_panelStyle,"height");
    if(l_Height=="")
    {
		l_Height='auto';
	}
	else
	{
    	l_Height = l_Height.replace("px","")/1;
	}

   //item list may be query, related or child
   	   var colMeta = [];
   	   colMeta["key"]={"id":"key","name":"key","schema":{}};
   	   var dataItems =[];
   	   var jqlType = false;
   if(inField.dataSource=="related")
   {
	    var translateFields = inField.dataReference;
   		 dataItems = item.fields.issuelinks.map(function(ri){
				var i = {};
				if(ri.outwardIssue) i = ri.outwardIssue;
				if(ri.inwardIssue) i = ri.inwardIssue;
	   			var retObj ={};
	   			inField.dataReference.split(",").forEach(function(f){
	   				var thisField = f.trim();
	   				var dVal = "unknown";
	   				var jField = ijfUtils.getJiraFieldById(thisField);
	   				if(i.fields.hasOwnProperty(jField.id))
	   				{
	   					dVal = ijfUtils.handleJiraFieldType(jField,i.fields[jField.id],true);
	   					//perhaps build the types here...
	   					colMeta[jField.id]=jField;
	   				}
	   				retObj[thisField]= dVal;
	   			});
	   			//retObj.iid=i.id;
	   			retObj.iid=i.key;
	   			return retObj;
		});
		dataItems = dataItems.sort(function(a, b)
		{
			var tv1 = a.iid.split("-")[1]/1;
		    var tv2  = b.iid.split("-")[1]/1;
		    return tv1>tv2 ? -1 : tv1<tv2 ? 1 : 0;
		});
   }
   else if(inField.dataSource=="children")
   {
	   var translateFields = inField.dataReference;
	   	   		 dataItems = item.fields.subtasks.map(function(i){
	   	   			var retObj ={};
	   	   			inField.dataReference.split(",").forEach(function(f){
	   	   				var thisField = f.trim();
	   	   				var dVal = "unknown";
	   	   				var jField = ijfUtils.getJiraFieldById(thisField);
	   	   				if(i.fields.hasOwnProperty(jField.id))
	   	   				{
	   	   					dVal = ijfUtils.handleJiraFieldType(jField,i.fields[jField.id],true);
	   	   					//perhaps build the types here...
	   	   					colMeta[jField.id]=jField;
	   	   				}
	   	   				retObj[thisField]= dVal;
	   	   			});
	   	   			//retObj.iid=i.id;
	   	   			retObj.iid=i.key;
	   	   			return retObj;
		});
		dataItems = dataItems.sort(function(a, b)
		{
			var tv1 = a.iid.split("-")[1]/1;
		    var tv2  = b.iid.split("-")[1]/1;
		    return tv1>tv2 ? -1 : tv1<tv2 ? 1 : 0;
		});
   }
   else
   {
	   var translateFields = ijfUtils.translateJiraFieldsToIds(inField.dataReference);
	   //get 1 row of data to set metadaa

	   //look for session vars for this itemList and handle
	   //syntax:    {"replace":[{"status":"Open"}],"remove":["status","maxResults"]]}
	   //roject=DJP and reporter = currentUser() order by key desc
	   var lds = inField.dataSource;
	   var qSet = function(inStr,key,value)
	   {
		   var retStr = inStr;
		   if(inStr.indexOf(key)>-1){
			  var startKey = inStr.indexOf(key);
			  var vStart = 0;
			  var vEnd = 0;
			  var vStartFound=false;
			  for(var i=startKey;i<inStr.length;i++)
			  {
				  if(!vStartFound)
				  {
					  if(inStr[i]=="=")
					  {
						  vStart=i+1;
						  vStartFound=true;
					  }
					  if(inStr[i]=="~")
					  {
						  vStart=i+1;
						  vStartFound=true;
					  }
					  if(inStr[i]=="!")
					  {
						  vStart=i+1;
						  vStartFound=true;
					  }
					  if((vStart==0) && (i<inStr.length-7))
					  {
						//where IN
						if(inStr.substr(i,3).toUpperCase()==" IN")
						{
							vStart=i+1;
							vStartFound=true;
						}
						//where NOT IN
						if(inStr.substr(i,7).toUpperCase()==" NOT IN")
						{
							vStart=i+1;
							vStartFound=true;
						}
						//where IS
						if(inStr.substr(i,3).toUpperCase()==" IS")
						{
							vStart=i+1;
							vStartFound=true;
						}
						//where IS NOT
						if(inStr.substr(i,7).toUpperCase()==" IS NOT")
						{
							vStart=i+1;
							vStartFound=true;
						}
					  }
			      }
				  if((vStart>0) && (i<inStr.length-4))
				  {
					if((inStr.substr(i,4).toUpperCase()==" AND") || (inStr.substr(i,4).toUpperCase()==" ORD"))
					{
						vEnd=i;
						break;
					}
				  }
			  }
			  if(vStart>0)
			  {
				  if(vEnd==0) vEnd=inStr.length;
	  			  vEnd=vEnd-vStart;
	  			  var tmpStr = inStr.substr(vStart,vEnd);
	  			  value = value.replace("!~","");
	  			  value = value.replace("~","");
				  retStr=inStr.replace(tmpStr,value);
			  }
		   }
		   else
		   {
			//it's an add
			if(value.toUpperCase().indexOf("NOT IN")>-1)
			{
				retStr = key + " " + value + " and " + inStr;
			}
			else if((value.toUpperCase().indexOf("IN(")>-1) || (value.toUpperCase().indexOf("IN (")>-1))
			{
				retStr = key + " " + value + " and " + inStr;
			}
			else if(value.toUpperCase().indexOf(" IS ")>-1)
			{
				retStr = key + " " + value + " and " + inStr;
			}
			else if(value.toUpperCase().indexOf("~")>-1)
			{
				//~needs to be outside quote...
				if(value.indexOf("!~")>-1)
				{
					value = value.replace("!~","");
					retStr = key + " !~ " + value + " and " + inStr;
				}
				else
				{
					value = value.replace("~","");
					retStr = key + " ~ " + value + " and " + inStr;
				}
			}
			else
			{
				retStr = key + "=" + value + " and " + inStr;
			}
			//clean the and...
			 retStr = retStr.replace(/and *order/i,"order");

		   }
		   return retStr;
	   };
	   var qRemove = function(inStr,key)
	   {
		   var retStr = inStr;
		   if(inStr.indexOf(key)>-1){
			  var startKey = inStr.indexOf(key);
			  var vStart = 0;
			  var vEnd = 0;
			  var vStartFound=false;
			  for(var i=startKey;i<inStr.length;i++)
			  {
				  if(!vStartFound)
				  {
					  if(inStr[i]=="=")
					  {
						  vStart=i+1;
						  vStartFound=true;
					  }
					  if(inStr[i]=="~")
					  {
						  vStart=i+1;
						  vStartFound=true;
					  }
					  if(inStr[i]=="!")
					  {
						  vStart=i+1;
						  vStartFound=true;
					  }
					  if((vStart==0) && (i<inStr.length-7))
					  {
						//where IN
						if(inStr.substr(i,3).toUpperCase()==" IN")
						{
							vStart=i-1;
							vStartFound=true;
						}
						//where NOT IN
						if(inStr.substr(i,7).toUpperCase()==" NOT IN")
						{
							vStart=i-1;
							vStartFound=true;
						}
						//where IS
						if(inStr.substr(i,3).toUpperCase()==" IS")
						{
							vStart=i+1;
							vStartFound=true;
						}
						//where IS NOT
						if(inStr.substr(i,7).toUpperCase()==" IS NOT")
						{
							vStart=i+1;
							vStartFound=true;
						}
					  }
			      }
				  if((vStart>0) && (i<inStr.length-4))
				  {
					if((inStr.substr(i,4).toUpperCase()==" AND") || (inStr.substr(i,4).toUpperCase()==" ORD"))
					{
						vEnd=i;
						break;
					}
				  }
			  }
			  if(vStart>0)
			  {
				  if(vEnd==0) vEnd=inStr.length;
	  			  vEnd=vEnd-startKey;
	  			  var tmpStr = inStr.substr(startKey,vEnd);
				  retStr=inStr.replace(tmpStr,"");
				  //now look for and and
				  retStr = retStr.replace(/and *and/i,"and");
				  //look for and order
				  retStr = retStr.replace(/and *order/i,"order");
				  //and leading and
				  if(retStr.substr(0,5).toUpperCase()==" AND ")
				  	retStr = retStr.substr(5,retStr.length);
				  //and trailing and
				  retStr=retStr.trim();
				  if(retStr.substr(retStr.length-4,4).toUpperCase() == " AND")
				  	retStr = retStr.substr(0,retStr.length-4);
			  }
		   }
		   return retStr;
	   };

	   if(ijf.session.hasOwnProperty(inFormKey+'_fld_'+inField.formCell))
	   {
		   var filterObj = ijf.session[inFormKey+'_fld_'+inField.formCell];
		   if(filterObj.set)
		   {
			   filterObj.set.forEach(function(r){
			   		lds = qSet(lds,Object.keys(r)[0],r[Object.keys(r)[0]]);
			   });
	   	   }
	   	   if(filterObj.remove)
	   	   {
			   filterObj.remove.forEach(function(r){
					lds = qRemove(lds,r);
			   });
	       }
	       inField.dataSource=lds;
	   }

	  //debug, write jql to console
	  //console.log(lds);

        var tSearch = "jql="+lds+"&maxResults=1&fields="+translateFields;
 	    tSearch = ijfUtils.replaceKeyValues(tSearch,item);
		var aUrl = '/rest/api/2/search?'+tSearch;

        if(inField.form.formProxy=="true")
        {
			aUrl=aUrl.replace(/ /g,"%20");
 	   		var rawList = ijfUtils.getProxyApiCallSync(aUrl, inField.form.formSet.id);
	    }
	    else
	    {
		    var rawList = ijfUtils.jiraApiSync('GET',aUrl, null);
		}

       rawList.issues.forEach(function(i){
			translateFields.split(",").forEach(function(f){
				var thisField = f.trim();
				var dVal = "unknown";
				var jField = ijfUtils.getJiraFieldById(thisField);
				if(i.fields.hasOwnProperty(jField.id))
				{
					colMeta[jField.id]=jField;
				}
			});
		});
	   jqlType = true;
   }

    if((inField.referenceFilter) & (!jqlType))
    {
        //filter the items...
        if(ijf.snippets.hasOwnProperty(inField.referenceFilter))
	        dataItems = ijf.snippets[inField.referenceFilter](dataItems);
    }

	//calculate column widths...and headers
	var colWidths=[];
	var colNames = translateFields.split(","); //inField.dataReference.split(",");
	var colHeaders = [];
	if(inField.tableWidths) colWidths=inField.tableWidths.split(",");
	var colHeaders = [];
	if(inField.tableHeaders) colHeaders=inField.tableHeaders.split(",");
	for (var i = 0; i<colNames.length;i++)
	{
		if(colWidths[i]>0)
		{

			if(colMeta[colNames[i]])
			{
				if(colWidths[i].indexOf("%")>-1)
				{
					colMeta[colNames[i]].width=colWidths[i];
				}
				else
				{
					try{
					colMeta[colNames[i]].width=colWidths[i]/1;}catch(e){}
				}
			}
		}
		else
		{
			if(colMeta[colNames[i]]) colMeta[colNames[i]].width=100;
		}

		if(colHeaders[i])
		{
			if(colMeta[colNames[i]]) colMeta[colNames[i]].header=colHeaders[i];
		}
		else
		{
			if(colMeta[colNames[i]]) colMeta[colNames[i]].header=colMeta[colNames[i]].name;
		}
	}


    var colSettingsArray = [];
    var gridFieldArray=[];
    //colSettingsArray.push(new Ext.grid.RowNumberer());
    //push iid as special first field...

    //look for key, hide if not there...
	var hideKey=true;
    if(inField.dataReference.indexOf("key")>-1) hideKey=false;

    gridFieldArray.push({name: "iid", type: "string"});
    colSettingsArray.push({
        header: colMeta["key"].header,
        dataIndex: "iid",
        hidden: hideKey,
        style: l_labelStyle,
        width: colMeta["key"].width,
        sortable: true
    });
	delete colMeta["key"];

    Object.keys(colMeta).forEach(function(k){
		var f = colMeta[k];
		if(f.schema.type=="date")
		{
			gridFieldArray.push({name: f.id, type: "date"});
			colSettingsArray.push({
				header: f.header,
				dataIndex: f.id,
				xtype: 'datecolumn',
				sortable: true,
				width: f.width,
				style: l_labelStyle,
				format: 'm/d/y',
				filter: {
				  type: 'date'
	            }
			});
		}
		else if(f.schema.type=="datetime")
		{
			gridFieldArray.push({name: f.id, type: "date"});
			colSettingsArray.push({
				header: f.header,
				dataIndex: f.id,
				xtype: 'datecolumn',
				sortable: true,
				width: f.width,
				style: l_labelStyle,
				format: 'm/d/y',
				filter: {
				  type: 'date'
	            }
			});
		}
		else
		{
			var fType = 'list';
			if(f.id=="summary") fType='string';
			gridFieldArray.push({name: f.id, type: "string"});
			colSettingsArray.push({
				header: f.header,
				width: 'auto',
				dataIndex: f.id,
				width: f.width,
				style: l_labelStyle,
				sortable: true,
				filter: {
				  type: fType
	            }
			});
        }
	});

    //preap and apply actions.
    var actions=null;
    var aWidth = 10;
    try
    {
        actions = JSON.parse(inField.dataReference2);
    }
    catch(e){}
    if(actions)
    {
        var actionItems = [];
        for(var a in actions)
        {
            if(actions.hasOwnProperty(a))
            {
              switch(actions[a].action)
              {
                  case "popForm":
                      actionItems.push({icon   : actions[a].icon,
                              action: actions[a],
                              handler: function(grid, rowIndex, colIndex, itm) {
                              var rec = grid.getStore().getAt(rowIndex);
                              var thisId =rec.data.iid;
                              //var tItem = mwf_loadChildItemSynchronous(thisId);
                              //itm.action.inField = inField;
                              //renderPopupForm(inFormKey,tItem,itm.action)
                            }
                          });
                      break;
                  case "runSnippet":
                      actionItems.push({icon   : actions[a].icon,
                          action: actions[a],
                          handler: function(grid, rowIndex, colIndex, itm) {
                              try
                              {
                                  ijf.snippets[itm.action.snippet](grid, rowIndex, colIndex, itm);
                              }
                              catch(e)
                              {
                                  footLog("Failed snippet action: " + itm.action.snippet);
                              }
                          }
                      });
                      break;
                  case "openForm":
                      actionItems.push({icon   : actions[a].icon,
                          action: actions[a],
                          handler: function(grid, rowIndex, colIndex,itm) {

                              var rec = grid.getStore().getAt(rowIndex);
                              var thisId =rec.data.iid;
                              if(thisId==0)
                              {
                                  ijfUtils.modalDialogMessage("Error Message", "Unable to find Item id");
                              }
                              else
                              {
                                  if(window.onbeforeunload==null)
                                  {
										ijf.currentItem=null;
										ijf.main.itemId = thisId;
										window.g_formId=itm.action.form;;
										ijf.main.processSetup("ijfContent");
                                  }
                                  else
                                  {
                                      var dFunc = function(){
                                          window.onbeforeunload= null;
											ijf.currentItem=null;
											window.g_itemId= thisId;
											window.g_formId=itm.action.form;;
											ijf.main.processSetup("ijfContent");
                                      };
                                      ijfUtils.modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
                                  }
                              }
                          }
                      });
                      break;
                  default:
                      ijfUtils.footLog("No action: " + actions[a].action);
              }
              aWidth = aWidth + 30;
            }
        }
        if(actionItems.length>0)
        {
			colSettingsArray.push({
				header: 'Actions',
				xtype: 'actioncolumn',
				width: aWidth,
				items: actionItems
			});
		}
    }
    if(!Ext.ClassManager.isCreated(inField.dataSource + inField.formCell.replace(",","")))
    {
        Ext.define(inField.dataSource + inField.formCell.replace(",",""), {
            extend: 'Ext.data.Model',
            fields: gridFieldArray
        });
    }
    var itemsPerPage =1001;
    if(!jqlType)
    {
		var store = Ext.create('Ext.data.Store', {
			model: inField.dataSource + inField.formCell.replace(",",""),
			proxy: {
				type: 'memory',
				reader: {
					type: 'json'
				}},
			autoLoad: false});
		store.proxy.data=dataItems;
		store.load();
    }
    else
    {
        itemsPerPage = 1001;
        var l_PageSize=ijfUtils.getNameValueFromStyleString(l_fieldStyle,"paging");
		if(l_PageSize) itemsPerPage = l_PageSize/1;

	    var tSearch = "jql="+lds+"&fields="+translateFields;
		tSearch = ijfUtils.replaceKeyValues(tSearch,item);
		//var rawList = ijfUtils.jiraApiSync('GET','/rest/api/2/search?'+tSearch, null);

  	    var aUrl = '/rest/api/2/search?'+tSearch;
  	    var xtraParams = {};
        if(inField.form.formProxy=="true")
        {
			//aUrl = aUrl.replace(/ /g,"%20");
		    xtraParams = {
				"ijfAction":"proxyApiCall",
				"url": encodeURI(aUrl.replace(/ /g,"%20")),
				"formSetId":inField.form.formSet.id
			}
		    aUrl=g_root + "/plugins/servlet/iforms";
		    //?ijfAction=proxyApiCall&formSetId="+inField.form.formSet.id+"&url="+encodeURI(aUrl);
	    }

        var store = Ext.create('Ext.data.Store', {
            model: inField.dataSource + inField.formCell.replace(",",""),
	        pageSize: itemsPerPage,
        	proxy: {
			        type: 'ajax',
			        url: aUrl,
			        extraParams: xtraParams,
			        reader: {
			            type: 'json',
			            rootProperty: 'issues',
			            totalProperty: 'total',
						transform: function(data) {
								// do some manipulation of the raw data object
								var dataItems = data.issues.map(function(i){
											var retObj ={};
											translateFields.split(",").forEach(function(f){
												var thisField = f.trim();
												var dVal = "unknown";
												var jField = ijfUtils.getJiraFieldById(thisField);
												if(i.fields.hasOwnProperty(jField.id))
												{
													dVal = ijfUtils.handleJiraFieldType(jField,i.fields[jField.id],true);
													//perhaps build the types here...
													colMeta[jField.id]=jField;
												}
												retObj[thisField]= dVal;
											});
											//retObj.iid=i.id;
											retObj.iid=i.key;
											return retObj;
										});
								if(ijf.snippets.hasOwnProperty(inField.referenceFilter)) dataItems = ijf.snippets[inField.referenceFilter](dataItems);
								data.issues=dataItems;
								return data;
			            }
					}
        	},
        	listeners: {"beforeload":function (store, operation, eOpts ) {
				var test = "here";
				operation._proxy.extraParams["maxResults"]= operation._limit;
				operation._proxy.extraParams["startAt"]= operation._start;
			}}
        });
        store.load({
					params: {
						limit: itemsPerPage,
						start: 0,
						// specify params for the first page load if using paging
						startAt: 0,
						maxResults: itemsPerPage,
					}
				});
	  }


    var myBbar = null;
    if(itemsPerPage<1000)
    {
		myBbar={
				        xtype: 'pagingtoolbar',
				        displayInfo: true
    	};
	}

    var l_tbar=[];
    var lXtype="";
    var grid= new Ext.grid.GridPanel({
        store: store,
        plugins: 'gridfilters',
        style: l_panelStyle,
        height: l_Height,
        width: "100%",
        ijfForm: inField,
        columns: colSettingsArray,
        selModel: {selType: 'rowmodel', mode: 'SINGLE'},
        bbar: myBbar,
        listeners: {
            'selectionchange':  function(selMod, record, something ){
				//if event,
					//see if name = form, if so, set the item to this selectoin and render form
					//look for event by name, then run if there...
                ijf.main.gItemSectionGridIndex = record[0].data.iid;
				var tEvent = this.ijfForm.event;
				if(ijf.fw.forms.hasOwnProperty(tEvent))
				{
					ijf.currentItem=null;
                    ijf.main.itemId= record[0].data.iid;
                    window.g_formId=tEvent;
                    ijf.main.processSetup("ijfContent");
					return;
				}
				//look for snippet...
				if(ijf.snippets.hasOwnProperty(tEvent))
				{
					ijf.snippets[tEvent](record[0].data.iid,this);
					return;
				}
            },
			'beforeitemdblclick': function(selMod, record, something ){
                ijf.main.gItemSectionGridIndex = record.data.iid;
				var tEvent = this.ijfForm.tableDblClick;
				if(ijf.fw.forms.hasOwnProperty(tEvent))
				{
					ijf.currentItem=null;
                    ijf.main.itemId= record.data.iid;
                    window.g_formId=tEvent;
                    ijf.main.processSetup("ijfContent");
					return;
				}
				//look for snippet...
				if(ijf.snippets.hasOwnProperty(tEvent))
				{
					ijf.snippets[tEvent](record.data.iid,this);
					return;
				}
				//look for popform: xxx and pop the form
				tEvent=tEvent.replace("popform:","");
				if(ijf.fw.forms.hasOwnProperty(tEvent))
				{
 				    var action = {};
					action.form = tEvent;
					action.type = "open item";
					action.itemId = record.data.iid;
					action.inField = inField;
                    ijf.extUtils.renderPopupForm(inFormKey, item, action)
					return;
				}
			}
		}
    });
    var layout = new Ext.Panel({
        title: lCaption,
        collapsible: false,
        collapsed: false,
        hidden: hideField,
        width: "100%",
        layoutConfig: {
            columns: 1
        },
        style: l_Style,
        items: [grid]
    });
	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](layout, inFormKey,item, inField, inContainer);

    layout.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, layout, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](layout, inFormKey,item, inField, inContainer);
},

renderItemTree:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var curIndex = 0;

    var lCaption = inField.caption;

    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }

    var hideField = ijfUtils.renderIfShowField("",inField);

    var collapsible = true;
    if (inField.style.indexOf('collapsible:false')>-1)
    {
        collapsible=false;
    }
    var collapsed = false;
    if (inField.style.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }


	    var l_labelStyle = inField.labelStyle;
	    var l_panelStyle = inField.panelStyle;
	    var l_Style = inField.style;
	    var l_fieldStyle = inField.fieldStyle;


	    if(!l_labelStyle) l_labelStyle="background:transparent";
	    if(!l_panelStyle) l_panelStyle="background:transparent";
	    if(!l_Style) l_Style="background:transparent";
	    if(!l_fieldStyle) l_fieldStyle="background:transparent";

	var l_Height = 'auto';
    var l_Height=ijfUtils.getNameValueFromStyleString(l_panelStyle,"height");
    if(l_Height=="")
    {
		l_Height='auto';
	}
	else
	{
    	l_Height = l_Height.replace("px","")/1;
	}

   //item list may be query, related or child
   	   var colMeta = [];
   	   colMeta["key"]={"id":"key","name":"key","schema":{}};
   	   var dataItems =[];

	    var translateFields = ijfUtils.translateJiraFieldsToIds(inField.dataReference);
		var tSearch = "jql="+inField.dataSource+"&fields="+translateFields+",issuelinks";

		var rawList = ijfUtils.jiraApiSync('GET','/rest/api/2/search?'+tSearch, null);
		//bail if dataItems not

		var dataItems = rawList.issues.map(function(i){
			var retObj ={};
			translateFields.split(",").forEach(function(f){
				var thisField = f.trim();
				var dVal = "unknown";
				var jField = ijfUtils.getJiraFieldById(thisField);
				if(i.fields.hasOwnProperty(jField.id))
				{
					dVal = ijfUtils.handleJiraFieldType(jField,i.fields[jField.id],true);
					//perhaps build the types here...
					colMeta[jField.id]=jField;
				}
				retObj[thisField]= dVal;
			});
			//retObj.iid=i.id;
			retObj.iid=i.key;

			if(i.fields.issuelinks.length > 0)
			{
				//set an issues parent assignments
				retObj.parents = i.fields.issuelinks.reduce(function(inParents,link)
				{
					if(link.inwardIssue)
					{
						inParents.push(link.inwardIssue.key);
					}
					return inParents;
				},[]);
			}
			retObj.leaf = true;
			return retObj;
		});

        var taskOrderKey = Object.keys(colMeta).reduce(function(inV,c)
        {
			if(colMeta[c].name=="taskOrder") inV=colMeta[c].id;
			return inV;},null);
        //now rip through and set parent assignments,
        dataItems.forEach(function(i){
			if(i.parents)
			{
				i.parents.forEach(function(pKey){
					dataItems.forEach(function(p){
						if(p.iid==pKey)
						{
							//this is parent of i
							i.moved=true;
							p.leaf=false;
							if(p.children)	p.children.push(i);
							else p.children = [i];
						}
					});
				});
			}
		});
		//reduce moved
		dataItems = dataItems.reduce(function(inArray,i){
			if(i.moved) return inArray;
			inArray.push(i);
			return inArray;
		},[]);

    //add sort function to all nodes...if taskOrder is included...
    if(tSearch.indexOf("taskOrder")>-1)
    {
		dataItems.forEach(function(i){
			i.sort = function(a,b)
			{
				return(a[taskOrderKey]-b[taskOrderKey]);
			};
		});
	}

   //data items are here, you now need to restructure into a tree based on Item relations...
    if(inField.referenceFilter)
    {
        //filter the items...
        if(ijf.snippets.hasOwnProperty(inField.referenceFilter))
	        dataItems = ijf.snippets[inField.referenceFilter](dataItems);
    }

	//calculate column widths...and headers
	var colWidths=[];
	var colNames = translateFields.split(","); //inField.dataReference.split(",");
	var colHeaders = [];
	if(inField.tableWidths) colWidths=inField.tableWidths.split(",");
	var colHeaders = [];
	if(inField.tableHeaders) colHeaders=inField.tableHeaders.split(",");
	for (var i = 0; i<colNames.length;i++)
	{
		if(colWidths[i]>0)
		{
			try{
			if(colMeta[colNames[i]]) colMeta[colNames[i]].width=colWidths[i]/1;}catch(e){}
		}
		else
		{
			if(colMeta[colNames[i]]) colMeta[colNames[i]].width=100;
		}

		if(colHeaders[i])
		{
			if(colMeta[colNames[i]]) colMeta[colNames[i]].header=colHeaders[i];
		}
		else
		{
			if(colMeta[colNames[i]]) colMeta[colNames[i]].header=colMeta[colNames[i]].name;
		}
	}

    var updateTreeQuiet = function(inId,inName,inValue)
    {
		var taskOrderKey = null;
		var iKey = inId;
		var putObj = {};
		putObj["fields"]={};
		putObj["fields"][inName]=inValue;
		//how to save asynch....
		var jData = JSON.stringify(putObj);
		var tApi = "/rest/api/2/issue/"+iKey;

		return ijfUtils.jiraApiSync("PUT",tApi,jData);
	}
    var updateTree = function(container,inName,inValue)
    {
		var taskOrderKey = null;
		var iKey = container.grid.selection.data.iid;
		var putObj = {};
		putObj["fields"]={};
		putObj["fields"][inName]=inValue;
		//how to save asynch....
		var jData = JSON.stringify(putObj);
		var tApi = "/rest/api/2/issue/"+iKey;
		var cRow = container.grid.selection;//container.grid.selection.data.index;

        var onsuccess =  function(data,e,f) {
                 ijfUtils.footLog("Successful data response code: " + f.status);
                 if((f.status==200) || (f.status==201) || (f.status==204))
                 {
					var delayCommit = function() {cRow.commit()};
					window.setTimeout(delayCommit,300);
				 }
				 else
				 {
					 ijfUtils.modalDialogMessage('Error','Sorry a network error prevented the field from saving.');
				 }
        };
        var onerror = function(e) {
				 if(e.status==201)
                 {
				 	var delayCommit = function() {cRow.commit()};
					window.setTimeout(delayCommit,300);
				 }
                 else
                 {
                     ijfUtils.footLog("Failed data post: " + " "  + e.statusText);
                     ijfUtils.modalDialogMessage('Error','Sorry a network error prevented the field from saving.');
                 }
	    };
		ijfUtils.jiraApi("PUT",tApi,jData,onsuccess,onerror);
	}



    var colSettingsArray = [];
    var gridFieldArray=[];
    //colSettingsArray.push(new Ext.grid.RowNumberer());
    //push iid as special first field...

    //look for key, hide if not there...
	var hideKey=true;
    if(inField.dataReference.indexOf("key")>-1) hideKey=false;
	var kWidth = 150;
	if(colMeta.key) kWidth = colMeta.key.width/1;
    gridFieldArray.push({name: "iid", type: "string"});
    colSettingsArray.push({
		xtype: 'treecolumn',
        text: colMeta["key"].header,
        dataIndex: "iid",
        hidden: hideKey,
        //flex: 1,
        style: l_labelStyle,
        width: kWidth,
        sortable: true
    });
	delete colMeta["key"];

    Object.keys(colMeta).forEach(function(k){
		var f = colMeta[k];
		if(f.schema.type=="date")
		{
			gridFieldArray.push({name: f.id, type: "date"});
			colSettingsArray.push({
				text: f.header,
				dataIndex: f.id,
				xtype: 'datecolumn',
				sortable: true,
				width: f.width,
				style: l_labelStyle,
				format: 'm/d/y',
				editor: {
					completeOnEnter: true,
					field: {
						xtype: 'datefield',
						format: 'm/d/y',
						listeners: {
							focusleave: function(n,o,f)
							{
								if(n.lastValue==n.originalValue) return;
								var container = n.up();
								if(!container) return;
								updateTree(container,n.name,moment(n.lastValue).format("YYYY-MM-DD"));
							}
						}
					}
				},
				filter: {
				  type: 'date'
	            }
			});
		}
		else if(f.schema.type=="datetime")
		{
			gridFieldArray.push({name: f.id, type: "date"});
			colSettingsArray.push({
				text: f.header,
				dataIndex: f.id,
				xtype: 'datecolumn',
				sortable: true,
				width: f.width,
				style: l_labelStyle,
				format: 'm/d/y',
				filter: {
				  type: 'date'
	            }
			});
		}
		else  if(f.schema.type=="number")
		{
			gridFieldArray.push({name: f.id, type: "number"});
			var hideIt = false;
			if(f.id==taskOrderKey) hideIt=true;
			colSettingsArray.push({
				text: f.header,
				width: 'auto',
				dataIndex: f.id,
				width: f.width,
				style: l_labelStyle,
				sortable: true,
				hidden: hideIt,
				filter: {
				  type: fType
	            },
	            editor: {
					completeOnEnter: true,
					field: {
						xtype:'numberfield',
						//allowBlank: (col.required!="Yes"),
						listeners: {
							focusleave: function(n,o,f)
							{
								if(n.lastValue==n.originalValue) return;
								var container = n.up();
								if(!container) return;
								updateTree(container,n.name,n.lastValue);
							}
						}
					}
				}

			});
        }
		else
		{
			var fType = 'list';
			if(f.id=="summary") fType='string';
			gridFieldArray.push({name: f.id, type: "string"});
			colSettingsArray.push({
				text: f.header,
				width: 'auto',
				dataIndex: f.id,
				width: f.width,
				style: l_labelStyle,
				sortable: true,
				filter: {
				  type: fType
	            },
	            editor: {
					completeOnEnter: true,
					field: {
						xtype:'textfield',
						//allowBlank: (col.required!="Yes"),
						listeners: {
							focusleave: function(n,o,f)
							{
								if(n.lastValue==n.originalValue) return;
								var container = n.up();
								if(!container) return;
								updateTree(container,n.name,n.lastValue);
							}
						}
					}
				}

			});
        }
	});

    //preap and apply actions.
    var actions=null;
    var aWidth = 10;

    if(!Ext.ClassManager.isCreated(inField.dataSource + inField.formCell.replace(",","")))
    {
        Ext.define(inField.dataSource + inField.formCell.replace(",",""), {
            extend: 'Ext.data.Model',
            fields: gridFieldArray
        });
    }
    var store = Ext.create('Ext.data.TreeStore', {
        model: inField.dataSource + inField.formCell.replace(",",""),
        root: {
			 	expanded:true,
			 	children: dataItems
			},
		sorters: [{
					property: taskOrderKey,
					direction: 'ASC'}]
	});
	var treeMenu = new Ext.menu.Menu({ items:
		[
			{ text: 'Edit Task', handler: function()  {
					var rId = tree.selection.data.iid
					ijf.main.gItemSectionGridIndex = rId;
					var tEvent = tree.ijfForm.tableDblClick;
					tEvent=tEvent.replace("popform:","");
					if(ijf.fw.forms.hasOwnProperty(tEvent))
					{
						var action = {};
						action.form = tEvent;
						action.type = "open item";
						action.itemId = rId;
						action.inField = inField;
						ijf.extUtils.renderPopupForm(inFormKey, item, action)
						return;
					}
				} },
			{ text: 'Add Child Task', handler: function()  {
					var rId = tree.selection.data.iid
					//add the issue with "new item" summary and insert into grid no refresh...
					var putObj = {};
					putObj["fields"]={};
					putObj["fields"]["summary"]="new item";
        			putObj.fields.project = {"key":inField.form.formSet.projectId};
        			putObj.fields.issuetype = {"name":inField.form.issueType};
					var jData = JSON.stringify(putObj);
					var tApi = "/rest/api/2/issue";
					saveRes = ijfUtils.jiraApiSync("POST",tApi,jData);
					//saveRes is the Key of the new issue if successfull,
					//set the relationship and reload
					try
					{
						if(saveRes.key)
						{
							var jsonString = {
											"type": {
												"name": "Relates"
											   },
											"inwardIssue": {
												"key": rId
											   },
											"outwardIssue": {
												"key": saveRes.key
											   },
											"comment":{
												"body":"Linked related issue"
											  }
							};
							var saveRelRes = ijfUtils.jiraApiSync("POST","/rest/api/2/issueLink",JSON.stringify(jsonString));
							if(saveRelRes!="OK")
							{
								ijfUtils.modalDialogMessage("Error","Unable to establish the issue link: " + saveRes);
								return;
							}
							var rec = Ext.create(tree.store.model);
							rec.data.iid=saveRes.key;
							rec.data.text=saveRes.key;
							rec.data.summary= "new item";
							//refresh the grid....
							tree.selection.appendChild(rec);
							tree.selection.expand();
						}
						else
						{
							ijfUtils.modalDialogMessage("Error","Unable to add the issue");
						}
					}
					catch(e)
					{
						ijfUtils.modalDialogMessage("Error","Sorry, there was an error with the add: " + e.message);
					}


				} },
                { text: 'Add Peer Task', handler: function()  {
					var rId = tree.selection.data.iid
					//add the issue with "new item" summary and insert into grid no refresh...
					var putObj = {};
					putObj["fields"]={};
					putObj["fields"]["summary"]="new item";
        			putObj.fields.project = {"key":inField.form.formSet.projectId};
        			putObj.fields.issuetype = {"name":inField.form.issueType};
					var jData = JSON.stringify(putObj);
					var tApi = "/rest/api/2/issue";
					saveRes = ijfUtils.jiraApiSync("POST",tApi,jData);
					//saveRes is the Key of the new issue if successfull,
					//set the relationship and reload
	 				var pNode = tree.selection.parentNode;
					try
					{
						if(saveRes.key)
						{
							//if parant NOT Root.  Set the parent to the current selection parent....
							if(pNode.data.text!="Root")
							{
								var jsonString = {
												"type": {
													"name": "Relates"
												   },
												"inwardIssue": {
													"key": pNode.data.iid
												   },
												"outwardIssue": {
													"key": saveRes.key
												   },
												"comment":{
													"body":"Linked related issue"
												  }
								};
								var saveRelRes = ijfUtils.jiraApiSync("POST","/rest/api/2/issueLink",JSON.stringify(jsonString));
								if(saveRelRes!="OK")
								{
									ijfUtils.modalDialogMessage("Error","Unable to establish the issue link: " + saveRes);
									return;
								}
						    }
							var rec = Ext.create(tree.store.model);
							rec.data.iid=saveRes.key;
							rec.data.text=saveRes.key;
							rec.data.summary= "new item";
							//refresh the grid....
							pNode.appendChild(rec);
						}
						else
						{
							ijfUtils.modalDialogMessage("Error","Unable to add the issue");
						}
					}
					catch(e)
					{
						ijfUtils.modalDialogMessage("Error","Sorry, there was an error with the add: " + e.message);
					}
				} },
 				{text: 'Delete Task', handler: function()  {
					var rId = tree.selection.data.iid

					var delFunc = function()
					{
						var delKeys = [];
						var getKeys = function(inNode){if(inNode.data.iid) delKeys.push(inNode.data.iid); inNode.childNodes.forEach(function(n){getKeys(n)});};
						getKeys(tree.selection);
						delKeys.reverse();
						delKeys.forEach(function(k)
						{
							var tApi = "/rest/api/2/issue/"+k;
							var delRes = ijfUtils.jiraApiSync("DELETE",tApi,null);
							try
							{
								if(delRes=="OK")
								{
									var rec = tree.store.findBy(function(r)
									{
										if(r.data.iid==k)return true;
										return false;
									});
									if(rec) tree.store.removeAt(rec);
								}
								else
								{
									ijfUtils.modalDialogMessage("Error","Unable to delete all the issues");
									return;
								}
							}
							catch(e)
							{
								ijfUtils.modalDialogMessage("Error","Sorry, there was an error with the delete: " + e.message);
								return
							}
						});
				    }
				    ijfUtils.modalDialog("Warning","You are about to permanently remove this item and it's children, continue?",delFunc);
				} }
		]});

	//alter tree menue to only show order options if "taskOrder" exists in query

	var refCheck = 	Object.keys(colMeta).reduce(function(inV,c){if(colMeta[c].name=="taskOrder") inV=true; return inV;},false);
	if(refCheck)
	{
		treeMenu.add({  text: 'Move Up', handler: function()  {
					var rId = tree.selection.data.iid
					//find out it it's order and flip it's order with the node above
					var cNode = tree.selection;
	 				var pNode = tree.selection.parentNode;

					var cOrder = cNode.data[taskOrderKey];
					var switchOrder = -999999999;
					var switchWith = null;
					//switch orders with the one just above.
					pNode.childNodes.forEach(function(n)
					{
						if((n.data.iid!=rId)&&(n.data[taskOrderKey] <= cOrder))
						{
							if(n.data[taskOrderKey] > switchOrder)
							{
								switchOrder = n.data[taskOrderKey];
								switchWith = n;
							}
						}
					});
					if(switchWith)
					{
						//two updates, the refresh tree.
						if(switchOrder == cOrder) switchOrder=switchOrder-1;
						var res = updateTreeQuiet(cNode.data.iid,taskOrderKey,switchOrder);
						var res2 = updateTreeQuiet(switchWith.data.iid,taskOrderKey,cOrder);
						if((res!="OK") || (res2!="OK"))
						{
							ijfUtils.modalDialogMessage("Error","Sorry but the reorder did not save properly, try again.");
						}
						else
						{
							cNode.set(taskOrderKey,switchOrder);
							cNode.commit();
							switchWith.set(taskOrderKey,cOrder);
							switchWith.commit();
							pNode.sort();
						}
					}
				} });
treeMenu.add({  text: 'Move Down', handler: function()  {
					var rId = tree.selection.data.iid
					//find out it it's order and flip it's order with the node above
					var cNode = tree.selection;
	 				var pNode = tree.selection.parentNode;

					var cOrder = cNode.data[taskOrderKey];
					var switchOrder = 999999999;
					var switchWith = null;
					//switch orders with the one just above.
					pNode.childNodes.forEach(function(n)
					{
						if((n.data.iid!=rId)&&(n.data[taskOrderKey] >= cOrder))
						{
							if(n.data[taskOrderKey] < switchOrder)
							{
								switchOrder = n.data[taskOrderKey];
								switchWith = n;
							}
						}
					});
					if(switchWith)
					{
						//two updates, the refresh tree.
						if(switchOrder == cOrder) switchOrder=switchOrder+1;
						var res = updateTreeQuiet(cNode.data.iid,taskOrderKey,switchOrder);
						var res2 = updateTreeQuiet(switchWith.data.iid,taskOrderKey,cOrder);
						if((res!="OK") || (res2!="OK"))
						{
							ijfUtils.modalDialogMessage("Error","Sorry but the reorder did not save properly, try again.");
						}
						else
						{
							cNode.set(taskOrderKey,switchOrder);
							cNode.commit();
							switchWith.set(taskOrderKey,cOrder);
							switchWith.commit();
							pNode.sort();
						}
					}
				} });
		/*
		treeMenu.add({ text: 'Indent', handler: function()  {
					//each row, blow away if same cell.
					ijfUtils.modalDialogMessage("Hi","here");
		} });
		treeMenu.add({ text: 'Outdent', handler: function()  {
					//each row, blow away if same cell.
					ijfUtils.modalDialogMessage("Hi","here");
		} });
		*/
	}


    var tree= new Ext.tree.Panel({
        store: store,
        style: l_panelStyle,
        height: l_Height,
        useArrows: true,
        width: "100%",
        ijfForm: inField,
       	id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
        rootVisible: false,
        columns: colSettingsArray,
        ijfForm: inField,
		plugins: {
		        ptype: 'cellediting',
		        clicksToEdit: 1
        },
		listeners: {
            'selectionchange':  function(selMod, record, something ){
				//if event,
					//see if name = form, if so, set the item to this selectoin and render form
					//look for event by name, then run if there...

                ijf.main.gItemSectionGridIndex = record[0].data.iid;
				var tEvent = this.ijfForm.event;
				if(ijf.fw.forms.hasOwnProperty(tEvent))
				{
					ijf.currentItem=null;
                    ijf.main.itemId= record[0].data.iid;
                    window.g_formId=tEvent;
                    ijf.main.processSetup("ijfContent");
					return;
				}
				//look for snippet...
				if(ijf.snippets.hasOwnProperty(tEvent))
				{
					ijf.snippets[tEvent](record[0].data.iid,this);
					return;
				}
            },
			'beforeitemdblclick': function(selMod, record, something ){

                ijf.main.gItemSectionGridIndex = record.data.iid;
				var tEvent = this.ijfForm.tableDblClick;
				if(ijf.fw.forms.hasOwnProperty(tEvent))
				{
					ijf.currentItem=null;
                    ijf.main.itemId= record.data.iid;
                    window.g_formId=tEvent;
                    ijf.main.processSetup("ijfContent");
					return;
				}
				//look for snippet...
				if(ijf.snippets.hasOwnProperty(tEvent))
				{
					ijf.snippets[tEvent](record.data.iid,this);
					return;
				}
				//look for popform: xxx and pop the form
				tEvent=tEvent.replace("popform:","");
				if(ijf.fw.forms.hasOwnProperty(tEvent))
				{
 				    var action = {};
					action.form = tEvent;
					action.type = "open item";
					action.itemId = record.data.iid;
					action.inField = inField;
                    ijf.extUtils.renderPopupForm(inFormKey, item, action)
					return;
				}
			}
		}
    });

    var layout = new Ext.Panel({
        title: lCaption,
        collapsible: false,
        collapsed: false,
        hidden: hideField,
        width: "100%",
        layoutConfig: {
            columns: 1
        },
        style: l_Style,
        items: [tree]
    });

	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](layout, inFormKey,item, inField, inContainer);

    layout.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, layout, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](layout, inFormKey,item, inField, inContainer);

    tree.expandAll();
    //lastly disable context menu for this element
	tree.getEl().on('contextmenu', function(e) {
  	    e.preventDefault();
		treeMenu.showAt(e.clientX,e.clientY);
	});

},
renderGridPanel:function(inFormKey,item, inField, inContainer)
{
	//get type definition
	var thisT = {};
    for(var tF in ijf.fw.CustomTypes){
		if(!ijf.fw.CustomTypes.hasOwnProperty(tF)) return;
  		if(ijf.fw.CustomTypes[tF].name==inField.dataSource) thisT=ijf.fw.CustomTypes[tF];
	}

	if(!thisT)	throw("Invalid type name: " + inField.dataSource);

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraMetaKeyed[thisT.fieldName];
	var jfFieldDef = ijf.jiraFieldsKeyed[thisT.fieldName];
	var jf=item.fields[jfFieldDef.id];

	var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

    if (ijfUtils.getNameValueFromStyleString(inField.fieldStyle,'required')=="true") lAllowBlank=false;

    var lMaxsize =  Number.MAX_VALUE;

    var lValidator = function(v){return true};
    var lRegex =  inField.regEx;
    if((lRegex!=null) && (lRegex!=""))
    {
        lValidator = function(v)
        {
            var rgx = new RegExp(lRegex);
            if (!rgx.exec(v)) {
                return inField.regExMessage;
            }
            return true;
        }
    }
    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    if (inField.style.indexOf('hidden:true')>-1)
    {
        hideLabel=true;
        hideField=true;
    }

    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }

    var l_labelStyle = inField.labelStyle;
    var l_panelStyle = inField.panelStyle;
    var l_Style = inField.style;
    var l_fieldStyle = inField.fieldStyle;


    if(!l_labelStyle) l_labelStyle="background:transparent";
    if(!l_panelStyle) l_panelStyle="background:transparent";
    if(!l_Style) l_Style="background:transparent";
    if(!l_fieldStyle) l_fieldStyle="background:white";
	//if(rOnly) l_fieldStyle="background:lightgray";

    var ocf =  ijfUtils.getEvent(inField);

	//permissions check....has to exist...
	if(inField.permissions.enabled)
	{
		var perms = ijfUtils.getPermissionObj(inField.permissions,ijf.currentItem,ijf.main.currentUser);
	}
	else
	{
		var perms = ijfUtils.getPermissionObj(inField.form.permissions,ijf.currentItem,ijf.main.currentUser);
	}

	if((!hideField) && (!perms.canSee))	hideField=true;
	//end permissions

    var collapsible = true;
    if (l_fieldStyle.indexOf('collapsible:false')>-1)
    {
        collapsible=false;
    }
    var collapsed = false;
    if (l_fieldStyle.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }

	var l_Height = 300;
    var l_Height=ijfUtils.getNameValueFromStyleString(l_fieldStyle,"height");
    if(l_Height=="")
    {
		l_Height=300;
	}
	else
	{
    	l_Height = l_Height.replace("px","")/1;
	}

	var l_Width = 600;
    var l_Width=ijfUtils.getNameValueFromStyleString(l_fieldStyle,"width");
    if(l_Width=="")
    {
		l_Width=600;
	}
	else
	{
    	l_Width = l_Width.replace("px","")/1;
	}

	var colWidths=[];
	var colHeaders = [];
	if(inField.tableWidths) colWidths=inField.tableWidths.split(",");
	if(inField.tableHeaders) colHeaders=inField.tableHeaders.split(",");

    //The grid setup....
    var listColumns = [];
    var tFields = [];
    var lookups = [];

    var gCols = JSON.parse(thisT.settings);
    //order by order
    gCols = gCols.sort(function(a,b){return (a.order-b.order);});
    var cIndex = 0;
    var lookups = [];
    gCols.forEach(function(col){

		var lValidator = function(v){return true};
		if((col.regEx!=null) && (col.regEx!=""))
		{
			lValidator = function(v)
			{
				var rgx = new RegExp(col.regEx);
				if (!rgx.exec(v)) {
					return col.regExMess;
				}
				return true;
			}
	    }

        var validRenderer = function (val, meta, rec, rowIndex, colIndex, store) {
                //at this poing you have the column def, if required or regex fails, make pink

                if((col.required=="Yes") && (!val))
                {
                    meta.style = "background-color:pink;";
				}
				if((col.regEx!=null) && (col.regEx!=""))
				{
					var rgxRenderCheck = new RegExp(col.regEx);
					if (!rgxRenderCheck.exec(val)) {
						meta.style = "background-color:pink;";
					}
				}

			//now manage the value formatting....
			switch(col.controlType)
			{
				case "datefield":
					if(col.format) return Ext.util.Format.dateRenderer(col.format)(val); //moment(val).format(col.format);
					return val;
					break;
				case "combobox":
					//if value lookup is two dimensional, lookup value of val...
					var retVal = val;
					if(lookups[col.columnName])
					{
						var lLookup = lookups[col.columnName];
						if(lLookup)
						{
							if((typeof lLookup[0]) == "object") lLookup.forEach(function(r){if(r[0]==val) retVal=r[1];});
						}
					}
					return retVal;
					break;
			    case "numberfield":
					if(col.format) return Ext.util.Format.numberRenderer(col.format)(val); //moment(val).format(col.format);
					return val;
					break;
				default:
					return val;
			}
        }

		var thisColWidth = 120;
		if(colWidths[cIndex]) thisColWidth=colWidths[cIndex]/1;
		var thisColHeader = col.columnName;
		if(colHeaders[cIndex]) thisColHeader=colHeaders[cIndex];

		switch(col.controlType)
		{
			case "datefield":
					tFields.push({name: col.columnName, type: 'date'});
					listColumns.push({
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
									allowBlank: (col.required!="Yes"),
									validator: lValidator,
									format:col.format,
									listeners: {
										change: function(n,o,f)
										{
											ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
										}
									}
								}
							}
			});
			break;
			case "numberfield":
					tFields.push({name: col.columnName, type: 'number'});
					listColumns.push({
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
									allowBlank: (col.required!="Yes"),
									validator: lValidator,
									format:col.format,
									listeners: {
										change: function(n,o,f)
										{
											ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
										}
									}
								}
							}
			});
			break;
			case "checkbox":
				tFields.push({name: col.columnName, type: 'boolean'});
				listColumns.push({
						header: thisColHeader,
						sortable: true,
						hidden: false,
						xtype: 'checkcolumn',
						centered:true,
						//renderer: validRenderer,
						width: thisColWidth,
						dataIndex: col.columnName,
						listeners: {
							checkchange: function(n,o,f)
							{
								ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
							}
						}
			});
			break;
			case "combobox":
					tFields.push({name: col.columnName, type: 'string'});
					//The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells
					var cLookupDef = {"index":"0"};
					var cListener = {
										change: function(n,o,f)
										{
											ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
										},
										focus: function(){
											this.validate();
										}
									};
					if(ijf.fw.CustomTypes.reduce(function(inObj,t){if(t.name==col.reference) inObj=t; return inObj;},null))
					{
						lookups[col.columnName] = ijfUtils.getReferenceDataByName(col.reference,"0");
					}
					else
					{
						//complex cascade...
						try
						{
							cLookupDef = JSON.parse(col.reference);
							lookups[col.columnName] = ijfUtils.getReferenceDataByName(cLookupDef.name,cLookupDef.index);

							//establish a listener for this combo if necessary
							if(cLookupDef.parents)
							{
								var parentIds = cLookupDef.parents;
								var cFilters = parentIds.reduce(function(inFilter,p){
										inFilter.push({"property":p.dataIndex.toString(), "value":"tbd", "columnName":p.columnName});
										return inFilter;
									},[]);
								cListener["beforeQuery"] = function(query) {
										 	var cContainer = this.up();
											//cFilters["value"]= cValue;
											cFilters.forEach(function(f){
												//for each filter param, we need to get the correct value...
												var cValue = cContainer.grid.getSelectionModel().getSelected().items[0].data[f.columnName];
												if(!cValue) cValue = 'novaluetofilterwith';
												f.value=cValue;
											});
											this.store.clearFilter();
											this.store.filter(cFilters);
										};
							}

							//for each child, you need to clear it's value
							if(cLookupDef.children)
							{
								var childFields = cLookupDef.children;
								cListener["change"]= function(n,o,f)
								{
										var cContainer = this.up();
										childFields.forEach(function(f){
											cContainer.grid.getSelectionModel().getSelected().items[0].set(f,null);
										});
										ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
								};
							}

						}
						catch(le)
						{
							ijfUtils.footLog("failed to handle complex lookup: " + le.message);
							lookups[col.columnName] = [];
						}
					}
					listColumns.push({
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
									allowBlank: (col.required!="Yes"),
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
			});
			break;
			default:
					tFields.push({name: col.columnName, type: 'string'});

					listColumns.push({
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
									allowBlank: (col.required!="Yes"),
									validator: lValidator,
									listeners: {
										change: function(n,o,f)
										{
											ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
										},
										focus: function(){
											this.validate();
										}
									}
								}
							}
			});
		}
		cIndex++;
	});

    if(!Ext.ClassManager.isCreated(inFormKey+'_mdl_'+inField.formCell.replace(",","_")))
    {
        Ext.define(inFormKey+'_mdl_'+inField.formCell.replace(",","_"), {
            extend: 'Ext.data.Model',
            fields: tFields
        });
    }

    var gridStore = new Ext.data.Store({
        model: inFormKey+'_mdl_'+inField.formCell.replace(",","_")
    });
	gridStore.ijfCols = gCols;

    //thisT.settings...
    if(data)
    {
		try
		{
			var cts = JSON.parse(data);
			cts = cts.map(function(r){ delete r.id; return r;});
			gridStore.loadData(cts);
		}
		catch(e)
		{
			throw('Failed to parse the grid json');
		}
	}
	var headerButtons =[];
		headerButtons.push({
						xtype:'button',
						text: 'Add Row',
						scope: this,
						handler: function(){
							 //create record...

							var newRecord = {id:Ext.id()};
							gCols.forEach(function(col){
								newRecord[col.columnName]=col["default"];
							});
							 //gridStore.parentGridPanel.stopEditing();
							 var position = gridStore.getCount();
							 gridStore.insert(position, newRecord);

							ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
							//gridStore.parentGridPanel.startEditing(position, 1);
						}
					});
		headerButtons.push({
						xtype:'button',
						text: 'Delete Row',
						scope: this,
						handler: function(){
							var selection = gridStore.parentGridPanel.getSelection();
							if (selection) {
								selection.forEach(function(r){
									gridStore.remove(r);
								});
							}
							ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
						}
					});
		headerButtons.push({
					xtype:'button',
					text:"Clear All",
					scope: this,
					handler: function(){
					   //need the formset ID...
					   var clearGridRows = function(){
							gridStore.getData().each(function(r){
									gridStore.remove(r);
							});
							ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					   };
					   ijfUtils.modalDialog("Warning","You are about to remove all rows, are you sure?",clearGridRows);
					}
				});
		headerButtons.push({
					xtype:'button',
					text: 'Download',
					margin: '0 0 0 20',
					scope: this,
					handler: function(){
						var outStr = "";
						gridStore.ijfCols
						gridStore.getData().each(function(r){
							gridStore.ijfCols.forEach(function(c){
								if(r.data.hasOwnProperty(c.columnName))
								{
									//must cast this correctly
									switch(c.controlType)
									{
										case "datefield":
											outStr+=Ext.util.Format.dateRenderer(c.format)(r.data[c.columnName]) + ","
										break;
										case "numberfield":
											outStr+=r.data[c.columnName] + ","
										break;
										default:
											outStr+="\"" + r.data[c.columnName] + "\","
									}
								}
								else
								{
									outStr+=",";
								}
							});
							outStr+="\n";
						});
						var blob = new Blob([outStr], {type: "text/plain;charset=utf-8"});
						saveAs(blob,inField.dataSource+".csv");
					}
				});
			headerButtons.push({
				html:  "<form enctype='multipart/form-data' id='"+inFormKey+'_upGrdFrm_'+inField.formCell.replace(",","_")+"'><input id='"+inFormKey+'_upGrd_'+inField.formCell.replace(",","_")+"' type='file' name='file' onchange='ijfUtils.gridUploadCsvFile(event,\""+inFormKey+'_ctr_'+inField.formCell.replace(",","_")+"\",\""+inFormKey+'_fld_'+inField.formCell+"\");'></form>",
				frame: false,
				hidden: true,
				border: false,
			    xtype: "panel"});
			headerButtons.push({
				xtype:'button',
				text:"Upload",
				scope: this,
				handler: function(){
				   //need the formset ID...
				   var jKey = '#'+inFormKey+'_upGrd_'+inField.formCell.replace(",","_");
				   jQuery(jKey).val("");
				   jQuery(jKey).trigger('click');
				}
			});


    var gridPanel = new Ext.grid.GridPanel({
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
        plugins: 'gridfilters',
        id: inFormKey+'_ctr_'+inField.formCell.replace(",","_"),
        //reserveScrollOffset: true,
        columns: listColumns,
        frame: true,
        collapsible: collapsible,
        collapsed: collapsed,
        selModel: 'cellmodel',
        disabled: rOnly,
		plugins: {
			ptype: 'cellediting',
			clicksToEdit: 1
        }
    });

	gridStore.parentGridPanel = gridPanel;

	//this is pretty much a repeat of render cell, check required and regex for every value....
	gridPanel.items.items[0].isValid = function(){
        var retVal = true;
		var gridData = gridStore.getData();
		//look for bad data and return false...
		gridData.items.forEach(function(r){
			//r = object of a row of data, keys are the columnNames
			gCols.forEach(function(col){
				var rowVal = r.data[col.columnName];
				//validate...
					if((col.required=="Yes") && (!rowVal)) retVal= false;
					if((col.regEx!=null) && (col.regEx!=""))
					{
						var rgxRenderCheck = new RegExp(col.regEx);
						if (!rgxRenderCheck.exec(rowVal)) retVal= false;
					}
			});
		});
		return retVal;
	};

    //before render....
    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](gridPanel,inFormKey,item, inField, inContainer);

    gridPanel.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, gridPanel, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](gridPanel, inFormKey,item, inField, inContainer);
}
,
//charting
renderPieChart :function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var curIndex = 0;

    var lCaption = inField.caption;

    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }

    var hideField = ijfUtils.renderIfShowField("",inField);

    var collapsible = true;
    if (inField.style.indexOf('collapsible:false')>-1)
    {
        collapsible=false;
    }
    var collapsed = false;
    if (inField.style.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }


	    var l_labelStyle = inField.labelStyle;
	    var l_panelStyle = inField.panelStyle;
	    var l_Style = inField.style;
	    var l_fieldStyle = inField.fieldStyle;


	    if(!l_labelStyle) l_labelStyle="background:transparent";
	    if(!l_panelStyle) l_panelStyle="background:transparent";
	    if(!l_Style) l_Style="background:transparent";
	    if(!l_fieldStyle) l_fieldStyle="background:transparent";

	var l_Height = 'auto';
    var l_Height=ijfUtils.getNameValueFromStyleString(l_panelStyle,"height");
    if(l_Height=="")
    {
		l_Height='auto';
	}
	else
	{
    	l_Height = l_Height.replace("px","")/1;
	}


    var store = Ext.create('Ext.data.Store', {
		fields: ['wedge', 'data1' ],
		data: [
			{ wedge: 'Android', data1: 68.3 },
			{ wedge: 'BlackBerry', data1: 1.7 },
			{ wedge: 'iOS', data1: 17.9 },
			{ wedge: 'Windows Phone', data1: 10.2 },
			{ wedge: 'Others', data1: 1.9 }
		]
	});

    var layout = new Ext.Panel({
        title: lCaption,
        collapsible: false,
        collapsed: false,
        hidden: hideField,
        width: "100%",
        controller:  Ext.create('Ext.app.ViewController', {
		    onDataRender: function (v) {
		        return v + '%';
		    },
		    onSeriesTooltipRender: function (tooltip, record, item) {
		        tooltip.setHtml(record.get('wedge') + ': ' + record.get('data1') + '%');
		    }
		}),
        layoutConfig: {
            columns: 1
        },
        style: l_Style,
        items: [Ext.create('Ext.chart.PolarChart',{
			        theme: 'default-gradients',
			        width: '100%',
			        height: 500,
			        insetPadding: 50,
			        innerPadding: 20,
			        store: store,
			        legend: {
			            docked: 'bottom'
			        },
			        interactions: ['rotate'],
			        sprites: [{
			            type: 'text',
			            text: 'Title of my Pie Chart',
			            fontSize: 22,
			            width: 100,
			            height: 30,
			            x: 40, // the sprite x position
			            y: 20  // the sprite y position
			        }, {
			            type: 'text',
			            text: 'Use beforeRender to alter data',
			            x: 12,
			            y: 375
			        }, {
			            type: 'text',
			            text: 'signature of before render: (chart, inFormKey,item, inField, inContainer)',
			            x: 12,
			            y: 390
			        }],
			        series: [{
			            type: 'pie',
			            angleField: 'data1',
			            label: {
			                field: 'wedge',
			                calloutLine: {
			                    length: 60,
			                    width: 3
			                    // specifying 'color' is also possible here
			                }
			            },
			            highlight: true,
			            tooltip: {
			                trackMouse: true,
			                renderer: 'onSeriesTooltipRender'
			            }
			        }]
    		})]
    });


	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](layout, inFormKey,item, inField, inContainer);

    layout.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, layout, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](layout, inFormKey,item, inField, inContainer);
}
,

renderBarChart :function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var curIndex = 0;

    var lCaption = inField.caption;

    var rOnly = false;
    if (inField.fieldStyle.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }

    var hideField = ijfUtils.renderIfShowField("",inField);

    var collapsible = true;
    if (inField.style.indexOf('collapsible:false')>-1)
    {
        collapsible=false;
    }
    var collapsed = false;
    if (inField.style.indexOf('collapsed:true')>-1)
    {
        collapsed=true;
    }


	    var l_labelStyle = inField.labelStyle;
	    var l_panelStyle = inField.panelStyle;
	    var l_Style = inField.style;
	    var l_fieldStyle = inField.fieldStyle;


	    if(!l_labelStyle) l_labelStyle="background:transparent";
	    if(!l_panelStyle) l_panelStyle="background:transparent";
	    if(!l_Style) l_Style="background:transparent";
	    if(!l_fieldStyle) l_fieldStyle="background:transparent";

	var l_Height = 'auto';
    var l_Height=ijfUtils.getNameValueFromStyleString(l_panelStyle,"height");
    if(l_Height=="")
    {
		l_Height='auto';
	}
	else
	{
    	l_Height = l_Height.replace("px","")/1;
	}


    var store = Ext.create('Ext.data.Store', {
    fields: ['category', 'value'],
    data: [
        { category: 'USA',     value:20},
        { category: 'China',   value:30},
        { category: 'Japan',   value:40},
        { category: 'UK',      value:50}
    ]
	});

    var layout = new Ext.Panel({
        title: lCaption,
        collapsible: false,
        collapsed: false,
        hidden: hideField,
        width: "100%",
        layoutConfig: {
            columns: 1
        },
        style: l_Style,
        controller:  Ext.create('Ext.app.ViewController', {

				onAxisLabelRender: function (axis, label, layoutContext) {
					return Ext.util.Format.number(layoutContext.renderer(label), '0,000');
				},

				onSeriesLabelRender: function (v) {
					return Ext.util.Format.number(v, '0,000');
				},

				onItemEditTooltipRender: function (tooltip, item, target, e) {
					var formatString = '0,000',
						record = item.record;

					tooltip.setHtml(record.get('category') + ': ' +
						Ext.util.Format.number(target.yValue, formatString));
				},

				onSeriesTooltipRender: function(tooltip, record, item) {
					var formatString = '0,000';

					tooltip.setHtml(record.get('category') + ': ' +
						Ext.util.Format.number(record.get('value'), formatString));
				},

				onColumnRender: function (v) {
					return v;
				}
		}),
          items: [Ext.create('Ext.chart.CartesianChart',{
		        width: '100%',
		        height: 500,
		        insetPadding: 40,
		        flipXY: false,
		        interactions: {
		            type: 'itemedit',
		            style: {
		                lineWidth: 2
		            },
		            tooltip: {
		                renderer: 'onItemEditTooltipRender'
		            }
		        },
		        animation: {
		            easing: 'easeOut',
		            duration: 500
		        },
		        store: store,
		        axes: [{
		            type: 'numeric',
		            position: 'left',
		            fields: 'value',
		            grid: false,
		            maximum: 100,
		            majorTickSteps: 10,
		            title: 'My Axis Title',
		            renderer: 'onAxisLabelRender'
		        }, {
		            type: 'category',
		            position: 'bottom',
		            fields: 'category',
		            grid: true
		        }],
		        series: [{
		            type: 'bar',
		            xField: 'category',
		            yField: 'value',
		            style: {
		                minGapWidth: 10
		            },
		            highlightCfg: {
		                strokeStyle: 'black',
		                radius: 10
		            },
		            label: {
		                field: 'value',
		                display: 'insideEnd',
		                renderer: 'onSeriesLabelRender'
		            },
		            tooltip: {
		                trackMouse: true,
		                renderer: 'onSeriesTooltipRender'
		            }
		        }],
		        sprites: [{
		            type: 'text',
		            text: 'Title of My Bar Chart',
		            fontSize: 22,
		            width: 100,
		            height: 30,
		            x: 40, // the sprite x position
		            y: 20  // the sprite y position
		        }, {
		            type: 'text',
		            text: 'Use beforeRender to alter: signature(chart, inFormKey, item, inField, inContainer)',
		            fontSize: 10,
		            x: 12,
		            y: 490
		        }]
		    })]

    });


	//before render....
	if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](layout, inFormKey,item, inField, inContainer);

    layout.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, layout, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
    //after render....
    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](layout, inFormKey,item, inField, inContainer);
}


}
