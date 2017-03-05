var ijf = ijf || {};
ijf.extUtils ={
renderField:function(inFormKey, item, inField, inContainer)
{
    //attempt to pull data....
    try
    {
        switch(inField.controlType) {
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
            case 'radio':
                ijf.extUtils.renderRadiogroup (inFormKey,item,inField,inContainer);
                break;
            case 'checkbox':
                ijf.extUtils.renderCheckbox (inFormKey,item,inField,inContainer);
                break;
            case 'multiselect':
                ijf.extUtils.renderMultiselect (inFormKey,item,inField,inContainer);
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
            case 'attachmentlist':
                ijf.extUtils.renderAttchmentList (inFormKey,item,inField,inContainer);
                break;
            case 'attachmentupload':
                ijf.extUtils.renderAttachmentUpload(inFormKey,item,inField,inContainer);
                break;
            case 'commentlist':
                ijf.extUtils.renderCommentList (inFormKey,item,inField,inContainer);
                break;
            case 'subform':
                ijf.extUtils.renderNestedForm (inFormKey,item,inField,inContainer);
                break;
            case 'itemlist':
                ijf.extUtils.renderItemList (inFormKey,item,inField,inContainer);
                break;



            case 'iframe':
                renderIframe(inFormKey,item,inField,inContainer);
                break;
            case 'popform':
                renderPopFormButton(inFormKey,item,inField,inContainer);
                break;
            case 'additem':
                renderAddItem(inFormKey,item,inField,inContainer);
                break;
            case 'htmldata':
                renderRawData(inFormKey,item,inField,inContainer);
                break;
            case 'htmldatawithcache':
                renderRawDataCached(inFormKey,item,inField,inContainer);
                break;
            case 'htmleditor':
                renderHtmleditor(inFormKey,item,inField,inContainer);
                break;
            case 'popupformbuttons':
                renderPopupFormButtons(inFormKey,item,inField,inContainer);
                break;
            case 'buttonlink':
                renderButtonLink(inFormKey,item,inField,inContainer);
                break;
            case 'table':
                renderGrid (inFormKey,item,inField,inContainer);
                break;
            case 'tableItemList':
                renderGridItemList (inFormKey,item,inField,inContainer);
                break;
            case 'gantt':
                renderGantt (inFormKey,item,inField,inContainer);
                break;
            case 'gantt2':
                renderGantt2 (inFormKey,item,inField,inContainer);
                break;
            case 'workflowStateButtons':
                renderWorkflowStates (inFormKey,item,inField,inContainer);
                break;
            case 'promoteDemote':
                renderPromoteDemoteButtons (inFormKey,item,inField,inContainer);
                break;
            case 'watching':
                renderWatching (inFormKey,item,inField,inContainer);
                break;
            case 'notifywatchers':
                renderNotifyWatchers (inFormKey,item,inField,inContainer);
                break;
            case 'notifylist':
                renderNotifyList (inFormKey,item,inField,inContainer);
                break;
            case 'getwatchers':
                renderGetWatchers (inFormKey,item,inField,inContainer);
                break;
            case 'comments':
                renderComments (inFormKey,item,inField,inContainer);
                break;
            case 'keyValue':
                renderKeyValue (inFormKey,item,inField,inContainer);
                break;
            case 'picklist':
                renderPicklist(inFormKey,item,inField,inContainer);
                break;
            case 'reportrunner':
                renderReportDropdown (inFormKey,item,inField,inContainer);
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
        panelTitle= ijfUtils.replaceKeyValues(tPt[0]);
    }
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var urlRe = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
    // url regex from https://gist.github.com/dperini/729294 under MIT license
    var iframeSrc = "https://max.gov" // Default src
    if (inField.dataSource){
        iframeSrc = ijfUtils.replaceKeyValues(inField.dataSource);
        if (iframeSrc.trim().match(urlRe)) iframeSrc = iframeSrc.trim().match(urlRe)
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if (l_Style.indexOf('width') === -1){
        l_Style = l_Style + ";width:100%;"
    }
    var iframeHTML = "<iframe src=\"" + iframeSrc + "\" " + seamless + onload + "style=\"" + l_Style + "\"></iframe>";
    var pHeight =mwfUtils_getNameValueFromStyleString(inField.panelStyle,"height");
    var simple = new Ext.Panel({
        //labelAlign: 'left',
        collapsible: collapsible,
        collapsed: collapsed,
        title: panelTitle,
        bodyStyle: l_panelStyle,
        width:lWidth,
        height: pHeight,
        border:false,
        hidden: hideField,
        html: iframeHTML,
        scrollable: true
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
    gSubformParams=null;
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
        panelTitle= ijfUtils.replaceKeyValues(tPt[0]);
    }

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

        simple.render(inContainer);
		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
		ijf.main.controlSet[thisControl.id]=thisControl;
		ijf.main.renderForm(nfId, inField.dataSource, true, item);
    }
    else
    {
        if(!hideField) ijf.main.renderForm(inContainer.id.replace(",",""), inField.dataSource, true, item);
    }
    ijf.main.gSubformParams=null;
}
,
 renderPopupForm:function(inFormKey,inItem, inAction)
{
    if(inAction.inField.dataReference)
    {
        try
        {
            gSubformParams = JSON.parse(inAction.inField.dataReference);
        }
        catch(e)
        {
            footLog("Error with nested form paramMap");
            gSubformParams = null;
        }
    }
    var nfId = inFormKey+inAction.inField.formCell.replace(",","")+"_pop";
    var nfContainer = "<div id=\"" + nfId + "\">Initial</div>";
    var simple = new Ext.Panel({
        //labelAlign: 'left',
        width:inAction.width/1,
        height: inAction.height/1,
        border:true,
        html: nfContainer
    });
    itemId = inItem.id;
    var dWin = new Ext.Window({
        // layout: 'fit',
        title:  inAction.title,
        width:inAction.width/1 + 10,
        height: inAction.height/1 + 10,
        closable: true,
        items: [simple],
        modal: true,
        listeners:{
            beforedestroy: function(f)
            {
                //rerender the current form....
                itemId = item.id;
                mwfUtils_clearExt();
                renderForm("mwfContent", g_formId, false, item);
            }
        }
    });
    dWin.show();
    gPopupFormHandle = dWin;
    //var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    //controlSet[thisControl.id]=thisControl;
    renderForm(nfId, inAction.form, true, inItem);
    //if(!hideField) renderForm(inContainer.id, inField.dataSource, true);
    gSubformParams=null;
}
,
 renderAddItem:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var hFunction = function(){
        if(window.onbeforeunload==null)
        {
            var tId = fw.getTemplateIdByName(inField.dataSource);
            if(tId==null)
            {
                modalDialogMessage("Error Message", "Unable to find a template id: " + inField.dataSource);
                return;
            }
            var sCatId = items[tId].parent.id;
            //if successful....rerender the current form....
            if((tId==null) || (sCatId==null))
            {
                modalDialogMessage("Error Message", "Unable to find a key id.");
                return;
            }
            if(inField.dataReference2)
            {
                //switch variables before you parse....
                try
                {
                    var pCopyString = ijfUtils.replaceKeyValues(inField.dataReference2);
                    postCopyActions = JSON.parse(pCopyString)
                }
                catch(e)
                {
                    postCopyActions = null;
                }
            }
            var newName = ijfUtils.replaceKeyValues(inField.dataReference);
            mwfUtils_copyItemToCategory(items[itemId].parent.id, sCatId, tId, newName, null);
            mwfUtils_clearExt();
            renderForm("mwfContent", g_formId, false, item);
            //if(!hideField) renderForm(inContainer.id, inField.dataSource, true);
        }
        else
        {
            var dFunc = function(){
                window.onbeforeunload= null;
                var tId = fw.getTemplateIdByName(inField.dataSource);
                var sCatId = items[tId].parent.id;
                //if successful....rerender the current form....
                if((tId==null) || (sCatId==null))
                {
                    modalDialogMessage("Error Message", "Unable to find a key id.");
                    return;
                }
                if(inField.dataReference2)
                {
                    //switch variables before you parse....
                    try
                    {
                        var pCopyString = ijfUtils.replaceKeyValues(inField.dataReference2);
                        postCopyActions = JSON.parse(pCopyString)
                    }
                    catch(e)
                    {
                        postCopyActions = null;
                    }
                }
                var newName = ijfUtils.replaceKeyValues(inField.dataReference);
                mwfUtils_copyItemToCategory(items[itemId].parent.id, sCatId, tId, newName, null);
                mwfUtils_clearExt();
                renderForm("mwfContent", g_formId, false, item);
            };
            modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
        }
    };
    if(l_labelStyle=="link")
    {
        var pnl = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            width: lWidth,
            hidden:hideField,
            bodyStyle: l_Style,
            items: {
                xtype: 'simplelink',
                text: inField.caption,
                handler: hFunction
            }
        });
    }
    else
    {
        var bPressed = false;
        var pnl = new Ext.FormPanel({
            buttonAlign: 'center',
            layout:'hbox',
            labelAlign: 'left',
            border:false,
            hidden: hideField,
            height: 36,
            bodyStyle: l_Style,
            width: lWidth,
            buttons:[{
                text:inField.caption,
                //enableToggle: true,
                pressed: bPressed,
                width: lBwidth,
                handler: hFunction
            }
            ]
        });
    }
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
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
    if(ijf.currentItem.fields.comment.comments)
    {
		//sort desc
		var sortedCmnts = ijf.currentItem.fields.comment.comments.sort(function(a, b)
		{
			a = new Date(a.created);
		    b = new Date(b.created);
		    return a>b ? -1 : a<b ? 1 : 0;
		});
		outHtml="<div class=ijfCommentList>";
			outHtml += "<div  class=ijfCommentListHead><div class=ijfCommentListHeadName>Name</div><div class=ijfCommentListHeadAuthor>Author</div><div class=ijfCommentListHeadDate>Date</div></div>";
		outHtml = sortedCmnts.reduce(function(outHtml,a){
			outHtml += "<div class=ijfCommentListRow><div  class=ijfCommentListName>" + a.body.replace("\n","<br>") + "</div><div class=ijfCommentListAuthor>" + a.author.displayName + "</div><div class=ijfCommentListDate>" + moment(a.created).format('lll') + "</div></div>";
			return outHtml;
		},outHtml);
		outHtml+="</div>";
	}

    if(!l_Style) l_Style = l_panelStyle;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

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
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
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
	var sortedAttachments = ijf.currentItem.fields.attachment.sort(function(a, b)
	{
		a = new Date(a.created);
		b = new Date(b.created);
		return a>b ? -1 : a<b ? 1 : 0;
	});

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
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
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


    var outHtml = ijfUtils.replaceKeyValues(inField.dataSource);
    outHtml = ijfUtils.sanitize(outHtml);
    if(!l_Style) l_Style = l_panelStyle;
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);

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
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderKeyValue:function(inFormKey,item, inField, inContainer)
{
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);
    var outVal = "";
    switch (inField.dataSource)
    {
        case "itemname":
            outVal = item.name;
            break;
        case "date":
            outVal = dateFormatAMPM();
            break;
        case "username":
            outVal=userPool.getUserLastFirst(exercise.maxId);
            break;
        case "workflowstate":
            outVal = exercise.getWorkflowName(item.workflowState);
            break;
        case "parentname":
            try
            {
                outVal = items[itemId].parent.name;
            }
            catch(e)
            {
                outVal = "No parent";
            }
            break;
        case "parentparentname":
            try
            {
                outVal = items[itemId].parent.parent.name;
            }
            catch(e)
            {
                outVal = "No parent parent";
            }
            break;
        default:
            headerRight = inField.dataSource;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        width: lWidth,
        hidden: hideField,
        bodyStyle: l_Style,
        items: {
            html: outVal,
            frame: false,
            border: false,
            bodyStyle: l_panelStyle,
            xtype: "panel"}
    });
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    controlSet[thisControl.id]=thisControl;
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
			handler: function(){
				if(inField.dataReference)
				{
					saveResultMessage = ijfUtils.replaceKeyValues(inField.dataReference);
				}
				else
				{
					saveResultMessage = null;
				}
				ijf.main.saveForm();
			}});

    }
    if(l_reload)
    {
        lButtons.push( {
            text:l_reload,
            xtype:'button',
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

                if(window.onbeforeunload==null)
                {
                    ijf.main.renderForm("ijfContent", tForm, false, item);
                }
                else
                {
                    var dFunc = function(){
                        window.onbeforeunload= null;
	                    ijf.main.renderForm("ijfContent", tForm, false, item);
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
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
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
    var l_save="Save";
    var l_savedone = "Save/Done"
    var l_done ="Done";
    var l_style = inField.style.split(",");
    if(l_style.length==2)
    {
        l_save=l_style[0];
        l_savedone =l_style[1];
        l_done =l_style[2];
    }
    var lButtons = [];
    if(l_save)
    {
        if(item.rawObj.readOnly!=true)
        {
            lButtons.push({
                text:l_save,
                handler: function(){
                    if(inField.dataReference)
                    {
                        saveResultMessage = ijfUtils.replaceKeyValues(inField.dataReference);
                    }
                    else
                    {
                        saveResultMessage = null;
                    }
                    var lobj = this;
                    mwf_saveForm();
                }});
        }
    }
    if(l_savedone)
    {
        if(item.rawObj.readOnly!=true)
        {
            lButtons.push({
                text:l_savedone,
                handler: function(){
                    if(inField.dataReference)
                    {
                        saveResultMessage = ijfUtils.replaceKeyValues(inField.dataReference);
                    }
                    else
                    {
                        saveResultMessage = null;
                    }
                    var cfunction = function()
                    {
                        if(gPopupFormHandle)
                        {
                            gPopupFormHandle.close();
                            gPopupFormHandle=null;
                        }
                    };
                    mwf_saveFormWithCallback(cfunction);
                }});
        }
    }
    if(l_done)
    {
        lButtons.push( {
            text:l_done,
            handler: function(){
                //dwin close
                if(gPopupFormHandle)
                {
                    gPopupFormHandle.close();
                    gPopupFormHandle=null;
                }
            }});
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        buttonAlign: 'center',
        border:false,
        hidden: hideField,
        height: '36px',
        width: lWidth,
        bodyStyle: l_Style,
        buttons: lButtons
    });
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderFormButtonsNoSave:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var lButtons = [];
    var l_reload="Reload";
    var l_done ="Done";
    var l_style = inField.style.split(",");
    if(l_style.length==2)
    {
        l_reload=l_style[0];
        l_done =l_style[1];
    }
    var hideField = ijfUtils.renderIfShowField("",inField);
    lButtons.push( {
        text:l_reload,
        handler: function(){
            if(window.onbeforeunload==null)
            {
                g_formId=inField.dataSource;
                mwf_resetForm();
            }
            else
            {
                var dFunc = function(){
                    window.onbeforeunload= null;
                    mwf_resetForm();
                };
                modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
            }
        }});
    lButtons.push( {
        text:l_done,
        handler: function(){
            if(window.onbeforeunload==null)
            {
                g_formId=inField.dataSource;
                mwf_closeForm();
            }
            else
            {
                var dFunc = function(){
                    window.onbeforeunload= null;
                    mwf_closeForm();
                };
                modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
            }
        }});
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        buttonAlign: 'center',
        border:false,
        hidden: hideField,
        height: '36px',
        width: lWidth,
        bodyStyle: l_Style,
        buttons: lButtons
    });
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderCopyItem:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    //commented out because it's flawed.  approach needs to just set the style of the button to a linkish thing.
    var hFunction = function(){
        //need to get the id of the form...iterate from fw.
        footLog("messageHandler: attempting to copy this item");
        if(window.onbeforeunload!=null)
        {
            modalDialogMessage("Error Message","Sorry but your form has unsaved data, please save or reload before this action.");
            return;
        }
        var copyItemFun = function(){
            lastItem = item;
            try
            {
                if(inField.dataReference2)
                {
                    postCopyActions = JSON.parse(inField.dataReference2)
                }
                var workingItem = items[item.id];
                var suffix = inField.dataReference;
                var newItemName = workingItem.name;
                if(suffix)
                {
                    if(newItemName.indexOf(suffix)>-1)
                    {
                        var nameParts = newItemName.split(suffix);
                        newItemName = nameParts[0].trim();
                    }
                }
                newItemName += workingItem.parent.getNextVersion(newItemName,suffix);
                mwfUtils_copyItemToCategory(workingItem.parent.id,workingItem.parent.id,workingItem.id,newItemName,g_formId);
            }
            catch(e)
            {
                modalDialogMessage("Error Message","Sorry, the copy settings are invalid and this action cannot be completed.");
                return;
            }
        };
        modalDialog("Information","This action will create a copy of this item into the same category it is in.<br><br>Please hit OK to continue or cancel to stop.",copyItemFun);
    };
    if(l_labelStyle=="link")
    {
        var pnl = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            width: lWidth,
            hidden:hideField,
            bodyStyle: l_Style,
            items: {
                xtype: 'simplelink',
                text: inField.caption,
                handler: hFunction
            }
        });
    }
    else
    {
        var pnl = new Ext.FormPanel({
            buttonAlign: 'center',
            layout:'hbox',
            labelAlign: 'left',
            border:false,
            hidden: hideField,
            height: 36,
            bodyStyle: l_Style,
            width: lWidth,
            buttons:[{
                text:inField.caption,
                //enableToggle: true,
                pressed: false,
                width: lBwidth,
                handler: hFunction
            }
            ]
        });
    }
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    controlSet[thisControl.id]=thisControl;
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

    var hFunction = function(){
        //need to get the id of the form...iterate from fw.
        var targetForm = ijfUtils.replaceKeyValues(inField.dataSource);
        var thisForm = ijf.fw.forms[targetForm];

        if(thisForm==null)
        {
            ijfUtils.modalDialogMessage("Error Message", "Unable to find form " +targetForm)
        }
        else
        {
            if(window.onbeforeunload==null)
            {
                if((inField.referenceFilter=="save first") && (!ijf.main.allControlsClean()))
                {
                    ijf.main.saveForm();
                    ijf.main.renderForm("ijfContent", targetForm, false, item);
                }
                else
                {
                    ijf.main.renderForm("ijfContent", targetForm, false, item);
                }
            }
            else
            {
                if((inField.referenceFilter=="save first") && (!ijf.main.allControlsClean()))
                {
                    ijf.main.saveForm();
                    var dFunc = function(){
                        window.onbeforeunload= null;
                        g_formId=targetForm;
                        ijf.main.renderForm("ijfContent", targetForm, false, item);
                    };
                    ijfUtils.modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
                }
                else
                {
                    var dFunc = function(){
                        window.onbeforeunload= null;
                        g_formId=targetForm;
                        ijf.main.renderForm("ijfContent", targetForm, false, item);
                    };
                    ijfUtils.modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
                }
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
        if(g_formId == ijfUtils.replaceKeyValues(inField.dataSource)) bPressed = true;
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
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, pnl, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
},
 renderNavigateToFormItem:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var hideField = ijfUtils.renderIfShowField("",inField);
    var bPressed = false;
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    if(g_formId == ijfUtils.replaceKeyValues(inField.dataSource)) bPressed = true;
    var hFunction =  function(){
        var targetForm = ijfUtils.replaceKeyValues(inField.dataSource);
        //need to get the id of the form...iterate from fw.
        var thisForm = fw.forms[targetForm];
        if(thisForm==null)
        {
            modalDialogMessage("Error Message", "Unable to find form " + targetForm)
        }
        else
        {
            //now look fo rthe item by name from reference_data
            var l_itemId = 0;
            //must find the the current item in the tree.
            var lItem = items[itemId];
            if(lItem!=null)
            {
                for (var i in lItem.parent.items)
                {
                    if(!lItem.parent.items.hasOwnProperty(i)) continue;
                    if (lItem.parent.items[i].name==ijfUtils.replaceKeyValues(inField.dataReference))
                    {
                        l_itemId = lItem.parent.items[i].id;
                    }
                }
            }
            if(l_itemId==0)
            {
                modalDialogMessage("Error Message", "Unable to find Item named " + ijfUtils.replaceKeyValues(inField.dataReference))
            }
            else
            {
                if(window.onbeforeunload==null)
                {
                    if((inField.referenceFilter=="save first") && (!mwf_allControlsClean()))
                    {
                        setItemNull();
                        itemId = l_itemId;
                        g_itemId= l_itemId;
                        g_formId=targetForm;
                        mwf_saveForm();
                    }
                    else
                    {
                        setItemNull();
                        itemId = l_itemId;
                        g_itemId= l_itemId;
                        g_formId=targetForm;
                        processSetup("mwfContent");
                    }
                }
                else
                {
                    if((inField.referenceFilter=="save first") && (!mwf_allControlsClean()))
                    {
                        setItemNull();
                        itemId = l_itemId;
                        g_itemId= l_itemId;
                        g_formId=targetForm;
                        mwf_saveForm();
                    }
                    else
                    {
                        var dFunc = function(){
                            window.onbeforeunload= null;
                            setItemNull();
                            itemId = l_itemId;
                            g_itemId= l_itemId;
                            g_formId=targetForm;
                            processSetup("mwfContent");
                        };
                        modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
                    }
                }
            }
        }
    };
    if(l_labelStyle=="link")
    {
        var pnl = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            width: lWidth,
            hidden:hideField,
            bodyStyle: l_Style,
            items: {
                xtype: 'simplelink',
                text: inField.caption,
                handler: hFunction
            }
        });
    }
    else
    {
        var pnl = new Ext.FormPanel({
            buttonAlign: 'left',
            labelAlign: 'left',
            border:false,
            height: '36px',
            hidden: hideField,
            bodyStyle: l_Style,
            width: lWidth,
            buttons:[{
                text:inField.caption,
                enableToggle: true,
                width: lBwidth,
                pressed: bPressed,
                handler: hFunction
             }
            ]
        });
    }
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    controlSet[thisControl.id]=thisControl;
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
    if (inField.style.indexOf('readonly:true')>-1)
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
	var fileLoad = "<form enctype='multipart/form-data' id='attachmentUploadFormId'><input id='attachmentUploadFileId' type='file' name='file' onChange=ijf.main.controlChanged('"+inFormKey+"_fld_"+inField.formCell+"');Ext.get('attachmentFileDisplayId').update(this.value);></form>";
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
					$('#attachmentUploadFileId').trigger('click');
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

/*
	var fileLoad = "<form enctype='multipart/form-data' id='attachmentUploadId'>Upload Config File: <input type='file' name='file' onChange=ijf.main.controlChanged('"+inFormKey+"_fld_"+inField.formCell+"')></form>";
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items: {
            html: fileLoad,
            frame: false,
            border: false,
            bodyStyle:  l_panelStyle,
            xtype: "panel"}
    });
*/

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
renderTextbox:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=ijf.currentItem.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	    var lAllowBlank = true;
	    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;


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
    if (inField.style.indexOf('readonly:true')>-1)
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
	if(rOnly) l_fieldStyle="background:lightgray";

    var ocf =  ijfUtils.getEvent(inField);

    var simple = new Ext.FormPanel({
        border:false,
        hidden: hideField,
        bodyStyle: l_Style,
        items:[{
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
                    ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
                    if(f.isValid())
                    {
                        ocf(f,n,o);
                    }
                }
            }
        }]
    });

    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderItemName:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var data = item.name;
    var lAllowBlank = true
    var lMaxsize = Number.MAX_VALUE;
    var lValidator = function(v){return true};
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
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var rOnly = false;
    if (inField.style.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }
    //data = mwfUtil_xmlDecode(data);
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var labelWidth = mwfUtils_getNameValueFromStyleString(l_labelStyle,'width');
    labelWidth = labelWidth.replace("px","");
    if(!labelWidth) labelWidth=150;
    labelWidth = labelWidth/1;
    var ocf =  ijfUtils.getEvent(inField);
    var simple = new Ext.FormPanel({
        //labelAlign: 'left',
        //url:'save-form.php',
        //frame:true,
        border:false,
        hidden: hideField,
        width: 'auto',
        bodyStyle: l_panelStyle,
        items:[{
            xtype: 'textfield',
            labelAlign: 'left',
            labelWidth: labelWidth,
            labelStyle: l_labelStyle,
            style: l_Style,
            bodyStyle: l_panelStyle,
            fieldLabel: lCaption,
            hideLabel:  hideLabel,
            allowBlank: lAllowBlank,
            maxLength: lMaxsize,
            validator: lValidator,
            readOnly: rOnly,
            width: lWidth,
            value: data,
            id: inFormKey+'_mwfControl_'+inField.formCell.replace(",","_"),
            listeners: {
                change: function(f,n,o){
                    controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                    if(f.isValid())
                    {
                        ocf(f,n,o);
                    }
                }
            }
        }]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
},
 renderItemDescBody:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if(inField.controlType=="itemdescription")
    {
        var data = items[item.id].description;
    }
    else
    {
        var data = JSON.stringify(items[item.id].attributes);
    }
    var lAllowBlank = true
    var lMaxsize = Number.MAX_VALUE;
    var lValidator = function(v){return true};
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
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var rOnly = false;
    if (inField.style.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }
    //data = mwfUtil_xmlDecode(data);
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var labelWidth = mwfUtils_getNameValueFromStyleString(l_labelStyle,'width');
    labelWidth = labelWidth.replace("px","");
    if(!labelWidth) labelWidth=150;
    labelWidth = labelWidth/1;
    var ocf =  ijfUtils.getEvent(inField);
    var simple = new Ext.FormPanel({
        //labelAlign: 'left',
        //url:'save-form.php',
        //frame:true,
        border:false,
        hidden: hideField,
        width: 'auto',
        bodyStyle: l_panelStyle,
        items:[{
            xtype: 'textarea',
            labelAlign: 'left',
            labelWidth: labelWidth,
            labelStyle: l_labelStyle,
            style: l_Style,
            bodyStyle: l_panelStyle,
            fieldLabel: lCaption,
            hideLabel:  hideLabel,
            allowBlank: lAllowBlank,
            maxLength: lMaxsize,
            validator: lValidator,
            readOnly: rOnly,
            width: lWidth,
            value: data,
            id: inFormKey+'_mwfControl_'+inField.formCell.replace(",","_"),
            listeners: {
                change: function(f,n,o){
                    controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                    if(f.isValid())
                    {
                        ocf(f,n,o);
                    }
                }
            }
        }]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
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
								ijf.main.renderForm("ijfContent", t.targetFormName, false, item);
							}
							else
							{
								var dFunc = function(){
									window.onbeforeunload= null;
									ijfUtils.clearExt();
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
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderDatebox:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=ijf.currentItem.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	    var lAllowBlank = true;
	    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;


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
    if (inField.style.indexOf('readonly:true')>-1)
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
		if(rOnly) l_fieldStyle="background:lightgray";

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
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;

}
,
 renderDropdown:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=ijf.currentItem.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	//if status, the transitions are the field meta...
	if(jfFieldDef.schema.type=='status')
	{
		//cache this?
		if(!ijf.currentItem.transitions)
		{
			ijf.currentItem.transitions= ijfUtils.jiraApiSync('GET','/rest/api/2/issue/'+ijf.currentItem.key+'/transitions', null);
		}
		var jfFieldMeta = ijf.currentItem.transitions;
	}
	else
	{
		var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
	}

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;



    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value);
            var lookup = fw.getReferenceItemsAsSimpleArray(ref.entity,ref.field,ref.filter);
            break;
        default:

			switch(jfFieldDef.schema.type)
			{
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
					lookup.push([data,ijf.currentItem.fields.status.name]);
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
    if (inField.style.indexOf('readonly:true')>-1)
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
	if(rOnly) l_fieldStyle="background:lightgray";


    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
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
			}}]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
},


renderUserPicker:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=ijf.currentItem.fields[jfFieldDef.id];

    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;



    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value);
            var lookup = fw.getReferenceItemsAsSimpleArray(ref.entity,ref.field,ref.filter);
            break;
        default:


            var apiUrl = "/rest/api/2/user/assignable/search";
            if(inField.controlType="userpicker") apiUrl = "/rest/api/2/user/search";


     		Ext.define('JiraUserModel', {
			        extend: 'Ext.data.Model',
			        fields: [{name:'name', type: 'string'},
			                 {name: 'displayName', type: 'string'}]
    		});
			var lookup = Ext.create('Ext.data.Store', {
				storeId: 'userDropdownId',
				model: 'JiraUserModel',
				autoLoad: true,
				proxy: {
					type: 'ajax',
					url: g_root + "/rest/api/2/user/assignable/search",
					extraParams : {
								issueKey:'TPO-1'},
					filterParam: 'username',
					groupParam: '',
					limitParam: '',
					pageParam: '',
					sortParam: '',
					startParam: '',
					reader: {
						type: 'json',
						root: ''
					}
				}
		    });
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
    if (inField.style.indexOf('readonly:true')>-1)
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
	if(rOnly) l_fieldStyle="background:lightgray";


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
			queryParam: 'username',
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
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderMultiselect:function(inFormKey,item, inField, inContainer)
{

    inContainer.title = inField.toolTip;

	var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=ijf.currentItem.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;



    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    switch (inField.dataReference)
    {
        case "ijfReference":
            var ref = JSON.parse(inField.referenceFilter);
            //value only for now...
            if((ref.filter) && (ref.filter!="")) ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value);
            var lookup = fw.getReferenceItemsAsSimpleArray(ref.entity,ref.field,ref.filter);
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
    if (inField.style.indexOf('readonly:true')>-1)
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
	if(rOnly) l_fieldStyle="background:lightgray";


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
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderGroupDropdown:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var origDatasource = inField.dataSource;
    var mappedField=null;
    if(gSubformParams)
    {
        if(gSubformParams.hasOwnProperty(inField.dataSource))
        {
            inField.dataSource=gSubformParams[inField.dataSource];
            mappedField = inField.dataSource;
        }
    }
    var data = item.getSectionTextData(inField.dataSource);
    var lAllowBlank = true
    if(item.getSectionRequired(inField.dataSource)) lAllowBlank=false;
    //manage cases for the lookups
    //case one, simple collect constraint
    //case two reference lookup
    var lookup = currentUser.getUserGroupList(inField.referenceFilter);
    var hideLabel=false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    var lWidth ='auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var rOnly = false;
    if (inField.style.indexOf('readonly:true')>-1)
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
    var hideField = ijfUtils.renderIfShowField(data,inField);
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var labelWidth = mwfUtils_getNameValueFromStyleString(l_labelStyle,'width');
    labelWidth = labelWidth.replace("px","");
    if(!labelWidth) labelWidth=150;
    labelWidth = labelWidth/1;
    var ocf =  ijfUtils.getEvent(inField);
    var comboFromArray = new Ext.form.ComboBox({
        store: lookup,
        labelAlign: 'left',
        labelStyle: l_labelStyle,
        labelWidth: labelWidth,
        bodyStyle: l_panelStyle,
        fieldLabel: lCaption,
        hideLabel: hideLabel,
        allowBlank: lAllowBlank,
        readOnly: rOnly,
        width: lWidth,
        value: data,
        //typeAhead: true,
        forceSelection: limitList,
        triggerAction: 'all',
        emptyText:'Please select...',
        selectOnFocus:true,
        id: inFormKey+'_mwfControl_'+inField.formCell.replace(",","_"),
        listeners: {
            afterrender: function(f)
            {
                this.validate();
            },
            change: function(f,n,o){
                data = n;
                controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                ocf(f,n,o);
            }
        }
    });
    var popGroupList = function(){
        try
        {
            var users = CollectForms.Cache.groupEmails[data];
            if(!users){
              var uList = mwf_getGroupUsers(data);
              users = JSON.parse(uList.results);
              CollectForms.Cache.groupEmails[data]=users;
            }
            var oMessage = "";
            for(var u in users.results.maxUserProfileSummaryList)
            {
                if(users.results.maxUserProfileSummaryList.hasOwnProperty(u)) oMessage += users.results.maxUserProfileSummaryList[u].email + ";<br>";
            }
            modalDialogMessage("User List",oMessage);
        }
        catch(e)
        {
            modalDialogMessage("Error Getting List",uList);
        }
    }
    var notifyGroupList = function(){
        var pItems = [];
        var pSubject = "Notification for " + items[itemId].name;
        var pBody = "Enter message here...\n\n\n\nhttps://collect-forms.max.gov/?exerciseId=" + exerciseId + "&itemId=" + itemId + "&formId=" +g_formId;
        pItems.push({
            xtype: 'textfield',
            labelAlign: 'left',
            labelWidth: 100,
            style: l_Style,
            fieldLabel: '&nbsp;Subject',
            readOnly: false,
            value: pSubject,
            allowBlank:false,
            width:680,
            listeners: {
                change: function(f,n,o){
                    pSubject = n;
                }
            }
        });
        pItems.push({
            xtype: 'textarea',
            labelAlign: 'left',
            labelWidth: 100,
            style: l_Style,
            fieldLabel: '&nbsp;Body',
            readOnly: false,
            value: pBody,
            allowBlank:false,
            width:680,
            height: 400,
            listeners: {
                change: function(f,n,o){
                    pBody = n;
                }
            }
        })
        var dWin = new Ext.Window({
            // layout: 'fit',
            title:  "Notify Group: " + data,
            width:  750,
            height: 550,
            closable: true,
            items: pItems,
            modal: true,
            buttons:[{
                text:"Send",
                width: 80,
                handler: function(){
                    mwf_notifyGroup(data, pSubject, pBody);
                }}
            ]
        });
        dWin.show();
    }
    var manageGroup = function(){
        var url = g_groupMngUrl + data;
        window.open(url);
    }
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        //url:'save-form.php',
        //frame:true,
        layout: {type: 'hbox'},
        layout: {type: 'hbox'},
        hidden: hideField,
        border:false,
        //title: 'simple panel',
        //bodyStyle:'padding:5px 5px 0',
        width: 'auto',
        bodyStyle: l_Style,
        items:[comboFromArray,
            {
                xtype: 'simplelink',
                text: '&nbsp;List',
                handler: popGroupList
            },
            {
                xtype: 'simplelink',
                text: '&nbsp;Email',
                handler: notifyGroupList
            }
            ,
            {
                xtype: 'simplelink',
                text: '&nbsp;Manage',
                handler: manageGroup
            }
        ]
    });
    inField.dataSource = origDatasource;
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    thisControl.mappedSectionName =  mappedField;
    controlSet[thisControl.id]=thisControl;
}
,
 renderReportDropdown:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var hideLabel=false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var comboFromArray = new Ext.form.ComboBox({
        store: exercise.stylesheets,
        labelAlign: 'left',
        labelStyle: l_labelStyle,
        bodyStyle: l_panelStyle,
        fieldLabel: lCaption,
        hideLabel: hideLabel,
        allowBlank: true,
        readOnly: false,
        width: lWidth,
        //typeAhead: true,
        //forceSelection: true,
        triggerAction: 'all',
        emptyText:'export as...',
        selectOnFocus:true,
        id: inFormKey+'_mwfControl_'+inField.formCell.replace(",","_")
    });
    var lOut = 'hbox';
    var isIE11 = window.location.hash = !!window.MSInputMethodContext;
    //if ((Ext.isIE) || (isIE11)) lOut = 'fit';
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        //url:'save-form.php',
        //frame:true,
        hidden: false,
        layout: 'hbox',
        border:false,
        //title: 'simple panel',
        //bodyStyle:'padding:5px 5px 0',
        width: 'auto',
        bodyStyle: l_Style,
        items:[comboFromArray,{
            xtype: "button",
            text:"Export",
            handler: function(s,d,y){
                var combobox = s.ownerCt.items.items[0];
                var v = combobox.getValue();
                var record = combobox.findRecord(combobox.valueField || combobox.displayField, v);
                if(!record)
                {
                    modalDialogMessage("Information","Please select an export template before exporting.");
                    return;
                }
                var sId = record.data.field1;
                var sType =record.data.field3;
                //ok set doc type
                var docType = "doc";
                if(sType=="Excel") docType = "excelxml";
                if(sType=="PDF") docType = "pdf";
                var url = g_collectBase + "export/question/" + itemId + "." + docType + "?stylesheet_id=" + sId;
                window.open(url);
            }}
        ]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderRadiogroup:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;

    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=ijf.currentItem.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	//if status, the transitions are the field meta...
	if(jfFieldDef.schema.type=='status')
	{
		//cache this?
		if(!ijf.currentItem.transitions)
		{
			ijf.currentItem.transitions= ijfUtils.jiraApiSync('GET','/rest/api/2/issue/'+ijf.currentItem.key+'/transitions', null);
		}
		var jfFieldMeta = ijf.currentItem.transitions;
	}
	else
	{
		var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
	}

    var lAllowBlank = true;
    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;

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
    if (inField.style.indexOf('readonly:true')>-1)
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
	if(rOnly) l_fieldStyle="background:lightgray";


     var cColumns = ijfUtils.getNameValueFromStyleString(l_fieldStyle,'columns');
      if(!cColumns) cColumns = 2;


		switch(jfFieldDef.schema.type)
		{
			case "priority":
				var rOptions= jfFieldMeta.allowedValues.map(function(e)
				{
								return {id: "radio_" + jfFieldDef.id + "_" + e.id,
										boxLabel: e.name,
										value : (data==e.id) ?  true : false,
										style: l_fieldStyle,
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
										inputValue: e.id};
				});
				rOptions.push({id: "radio_" + jfFieldDef.id + "_" + data,
										boxLabel: ijf.currentItem.fields.status.name,
										value : true,
										style: l_fieldStyle,
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



    var simple = new Ext.FormPanel({
        hidden: hideField,
        border:false,
        bodyStyle: l_Style,
        items:[{xtype: 'radiogroup',
			labelAlign: 'left',
			labelStyle: l_labelStyle,
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
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
					ocf(f,n,o);
				}
			}}]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderCheckbox:function(inFormKey,item, inField, inContainer)
{
      inContainer.title = inField.toolTip;

  	var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
      var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
  	var jf=ijf.currentItem.fields[jfFieldDef.id];

      var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

      var lAllowBlank = true;
      if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;


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
      if (inField.style.indexOf('readonly:true')>-1)
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
  	if(rOnly) l_fieldStyle="background:lightgray";


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
  			     			inputValue: e.id};
       });

      var ocf =  ijfUtils.getEvent(inField);
      var hideField = ijfUtils.renderIfShowField(data,inField);



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
  					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
  					ocf(f,n,o);
  				}
  			}}]
      });
      simple.render(inContainer);
      var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderGetWatchers:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.controlType;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var ocf =  ijfUtils.getEvent(inField);
    var simple = new Ext.FormPanel({
        buttonAlign: 'center',
        layout:'hbox',
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        height: 36,
        bodyStyle: l_Style,
        width: lWidth,
        buttons:[{
            text:lCaption,
            width: lBwidth,
            handler: function(){
                mwf_getWatchers();
            }}
        ]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
},
 renderNotifyWatchers:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.controlType;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var ocf =  ijfUtils.getEvent(inField);
    var simple = new Ext.FormPanel({
        buttonAlign: 'center',
        layout:'hbox',
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        height: 36,
        bodyStyle: l_Style,
        width: lWidth,
        buttons:[{
            text:lCaption,
            width: lBwidth,
            handler: function(){
                var dFunc = function(){
                    ocf();
                    mwf_notifyWatchers(ijfUtils.replaceKeyValues(inField.dataReference), ijfUtils.replaceKeyValues(inField.dataReference2));
                };
                modalDialog("Warning","This will notify all watchers a change on this item has occured, procceed?",dFunc);
            }}
        ]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderNotifyList:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.controlType;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var ocf =  ijfUtils.getEvent(inField);
    var simple = new Ext.FormPanel({
        buttonAlign: 'center',
        layout:'hbox',
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        height: 36,
        bodyStyle: l_Style,
        width: lWidth,
        buttons:[{
            text:lCaption,
            width: lBwidth,
            handler: function(){
                var srcList = inField.dataSource;
                var tList = item.getSectionTextData(inField.dataSource);
                tList = tList.replace(/<br>/g,"");
                tList = tList.replace(/<p>/g,"");
                tList = tList.replace(/<\/p>/g,"");
                if(tList=="no data found")
                {
                    //NOT simple list.  So, look for reference values
                    try
                    {
                        var ref = JSON.parse(inField.dataSource);
                        var tList  = fw.getReferenceItemsAsCSV(ref.entity,ref.field,ref.filter);
                        srcList = ref.entity;
                    }
                    catch(e)
                    {
                        modalDialogMessage("Error","Failed to identify target list from data source: " + srcList);
                        return;
                    }
                }
                var dFunc = function(){
                    ocf();
                    mwf_notifyList(tList, ijfUtils.replaceKeyValues(inField.dataReference), ijfUtils.replaceKeyValues(inField.dataReference2));
                };
                modalDialog("Warning","This will notify all emails in the " + srcList + " list, procceed?",dFunc);
            }}
        ]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
},
 renderPromoteDemoteButtons:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else
        var lCaption = inField.caption;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var curStateName = exercise.getWorkflowName(item.workflowState);
    var priorState=null;
    var nextState=null;
    var lastState = null;
    var wfButtons = [];
    var getNext=false;
    for(var i in exercise.workflow.results)
    {
        if(!exercise.workflow.results.hasOwnProperty(i)) continue;
        var wf = exercise.workflow.results[i];
        if (wf.exclude==true) continue;
        if(getNext)
        {
            nextState=wf;
            break;
        }
        if(wf.alias==curStateName)
        {
            priorState=lastState;
            getNext=true;
        }
        lastState = wf;
    }
    //promote event....
    //works differnet from other event settings.  this is true if OK to promote, else, a message.
    var ocf = function(){return false;};
    var l_Event = "";
    try
    {
        l_Event = inField.event;
        if(l_Event!="")
        {
            ocf = function(f,n,o)
            {
                try
                {
                    //var anonFunct = eval("(function(){ " + l_Event + "})");
                    var outVal = window[l_Event]();
                    return outVal;
                }
                catch(e)
                {
                    footLog("field event failed: " + e.message);
                    return "field event failed: " + e.message;
                }
            };
        }
    }
    catch(e)
    {
        ocf = function(){return false;};
        footLog("error setting up promote event " + e.message);
    }
    if(priorState!=null)
        wfButtons.push({xtype: 'button',text:"Demote to: " + priorState.alias, wfId:priorState.workflowStatusId, handler:function(){mwf_setWorkflow(this.text, this.wfId)}});
    wfButtons.push({
        html: "&nbsp;&nbsp;&nbsp;Current Stage is: " + curStateName + "&nbsp;&nbsp;&nbsp;", border: false,
        bodyStyle: l_panelStyle,
        xtype: "panel"});
    if(nextState != null)
        wfButtons.push({xtype: 'button',text:"Promote to: " + nextState.alias, wfId:nextState.workflowStatusId,
            handler: function(){
                //ONLY do this if the form is VALID and if event returns true
                var rMessage=ocf();
                if(rMessage) modalDialogMessage("Promote Error",rMessage);
                else
                {
                    if(mwf_isFormValid())
                        mwf_setWorkflow(this.text, this.wfId);
                    else
                        modalDialogMessage("Promote Error","Sorry, there are invalid field on this form, please fix before promoting.");
                }
            }});
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        layout:'hbox',
        hidden: hideField,
        bodyStyle:l_Style,
        border:false,
        items:wfButtons
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderWatching:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else
        var lCaption = inField.caption;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var watching = item.rawObj.watching;
    //promote event....
    //works differnet from other event settings.  this is true if OK to promote, else, a message.
    var ocf = function(){return false;};
    var l_Event = "";
    try
    {
        l_Event = inField.event;
        if(l_Event!="")
        {
            ocf = function(f,n,o)
            {
                try
                {
                    //var anonFunct = eval("(function(){ " + l_Event + "})");
                    var outVal = window[lEvent]();
                    return outVal;
                }
                catch(e)
                {
                    footLog("field event failed: " + e.message);
                    return "field event failed: " + e.message;
                }
            };
        }
    }
    catch(e)
    {
        ocf = function(){return false;};
        footLog("error setting up promote event " + e.message);
    }
    var wMessage = "Not Watching";
    var bMessage = "Start Watching";
    if(watching)
    {
        wMessage = "Watching";
        bMessage = "Stop  Watching";
    }
    var wfButtons = [];
    wfButtons.push({
        html: wMessage, border: false,
        bodyStyle: l_panelStyle,
        xtype: "panel"});
    wfButtons.push({xtype: 'button',text:bMessage, watchAction:bMessage,
            handler: function(){
                //ONLY do this if the form is VALID and if event returns true
                var rMessage=ocf();
                if(rMessage) modalDialogMessage("Watch Error",rMessage);
                else
                {
                    if(mwf_isFormValid())
                        mwf_setWatch(this.watchAction);
                    else
                        modalDialogMessage("Watch Error","Sorry, there are invalid field on this form, please fix before promoting.");
                }
            }});
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        layout:'hbox',
        hidden: hideField,
        bodyStyle:l_Style,
        border:false,
        items:wfButtons
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderGridNavigation:function(inFormKey,item, inField, inContainer)
{
    var curIndex = 0;
    if(gItemSectionGridIndex.hasOwnProperty(inField.dataSource))
    {
        curIndex = gItemSectionGridIndex[inField.dataSource][0];
    }
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else
        var lCaption = inField.caption;
    if(lCaption=="none") lCaption=null;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var wfButtons = [];
    var gridNav = function(inInc){
        if(window.onbeforeunload==null)
        {
            var tCount=  gItemSectionGridIndex[inField.dataSource][0]+inInc;
            if((tCount<0)||(tCount==gItemSectionGridIndex[inField.dataSource][1])) return;
            gItemSectionGridIndex[inField.dataSource][0] = tCount;
            processSetup("mwfContent");
        }
        else
        {
            var dFunc = function(){
                var tCount=  gItemSectionGridIndex[inField.dataSource][0]+inInc;
                if((tCount<0)||(tCount==gItemSectionGridIndex[inField.dataSource][1])) return;
                window.onbeforeunload= null;
                gItemSectionGridIndex[inField.dataSource][0] = tCount;
                processSetup("mwfContent");
            };
            modalDialog("Warning",ijf.main.gNavigateOnChange,dFunc);
        }
    };
    if(lCaption)
    {
        wfButtons.push({
            html: lCaption + "&nbsp;&nbsp;", border: false,
            bodyStyle: l_panelStyle,
            xtype: "panel"});
    }
    wfButtons.push({xtype: 'button',text:" << ", handler: function(){
            gridNav(-1);
        }});
    wfButtons.push({
        html: "&nbsp;&nbsp;" + (curIndex+1) + "&nbsp;of&nbsp;" + gItemSectionGridIndex[inField.dataSource][1] + "&nbsp;&nbsp;", border: false,
        bodyStyle: l_panelStyle,
        xtype: "panel"});
    wfButtons.push({xtype: 'button',text:" >> ", handler: function(){
            gridNav(1);
        }});
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        layout:'hbox',
        hidden: hideField,
        bodyStyle:l_Style,
        width: lWidth,
        border :false,
        items:wfButtons
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderButtonLink:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.controlType;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var simple = new Ext.FormPanel({
        buttonAlign: 'center',
        layout:'hbox',
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        height: 36,
        bodyStyle: l_Style,
        width: lWidth,
        buttons:[{
            text:lCaption,
            width: lBwidth,
            handler: function(){
                var url =ijfUtils.replaceKeyValues(inField.dataSource);
                window.open(url);
            }}
        ]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
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


    if(l_labelStyle=="link")
    {
        var simple = new Ext.FormPanel({
            border:false,
            hidden:hideField,
            bodyStyle: l_Style,
            jField: inField,
            items: {
                xtype: 'simplelink',
                text: lCaption,
                style: l_panelStyle,
                handler: function(){
					ijf.main.gEventControl=this.up().jField;
                    ocf();
                }
            }
        });
    }
    else
    {
        var simple = new Ext.FormPanel({
            border:false,
            hidden: hideField,
            bodyStyle: l_Style,
            jField: inField,
            items:[{
				xtype: 'button',
                text:lCaption,
				style: l_panelStyle,
                handler: function(){
					ijf.main.gEventControl=this.up().jField;
                    ocf();
                }}
            ]
        });
    }

	simple.render(inContainer);
	var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderPopFormButton:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.controlType;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var ocf =  ijfUtils.getEvent(inField);
    if(l_labelStyle=="link")
    {
        var simple = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            width: lWidth,
            hidden:hideField,
            bodyStyle: l_Style,
            items: {
                xtype: 'simplelink',
                text: lCaption,
                handler: function(){
                    var action = {};
                    action.form = inField.dataSource;
                    action.title = inField.caption;
                    action.width = inField.width;
                    action.height = mwfUtils_getNameValueFromStyleString(inField.style,'height');
                    action.inField = inField;
                    renderPopupForm(inFormKey,item,action)
                }
            }
        });
    }
    else
    {
        var simple = new Ext.FormPanel({
            buttonAlign: 'center',
            layout:'hbox',
            labelAlign: 'left',
            border:false,
            hidden: hideField,
            height: 36,
            bodyStyle: l_Style,
            width: lWidth,
            buttons:[{
                text:lCaption,
                width: lBwidth,
                handler: function(){
                    var action = {};
                    action.form = inField.dataSource;
                    action.title = inField.caption;
                    action.width = inField.width;
                    action.height = mwfUtils_getNameValueFromStyleString(inField.style,'height');
                    action.inField = inField;
                    renderPopupForm(inFormKey,item,action)
                }}
            ]
        });
    }
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderNavigateToParent:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.controlType;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    var lBwidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
        lBwidth = lWidth-10;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var ocf =  ijfUtils.getEvent(inField);
    var simple = new Ext.FormPanel({
        buttonAlign: 'center',
        layout:'hbox',
        labelAlign: 'left',
        border:false,
        hidden: hideField,
        height: 36,
        bodyStyle: l_Style,
        width: lWidth,
        buttons:[{
            text:lCaption,
            width: lBwidth,
            handler: function(){
                ocf();
                if(fw.parentWindowName)
                {
                    var goBack = window.open('', fw.parentWindowName);
                    //Ext.getWin().blur();
                    //window.blur();
                    //goBack.focus();
                    goBack.postMessage("focus",fw.messagingSource);
                }
                else
                {
                    modalDialogMessage("Warning Message","No parent window is configured for this forms environment.");
                }
            }}
        ]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderWorkflowStates:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var hideField = ijfUtils.renderIfShowField("",inField);
    var wfButtons = [];
    for(var i in exercise.workflow.results)
    {
        if(!exercise.workflow.results.hasOwnProperty(i)) continue;
        var wf = exercise.workflow.results[i];
        if (wf.exclude==false)
        {
            wfButtons.push({text:wf.alias, wfId:wf.workflowStatusId,
                handler: function(){mwf_setWorkflow(this.text, this.wfId)}});
        }
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    if(!l_Style) l_Style = l_panelStyle;
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        height: '36px',
        border:false,
        hidden: hideField,
        buttonAlign:'center',
        bodyStyle: l_Style,
        buttons:wfButtons
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
 renderWorkflowReport:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var rData = dataServices.getData(inField.dataSource,inFormKey,item, inField, inContainer, true);
    if((rData=="loading") || (rData=="Failed to acquire data"))
    {
        var dValue = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='javascripts/cwf/images/loading20.gif'>";
        if(rData=="Failed to acquire data") dValue = rData;
        var pnl = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            hidden: false,
            bodyStyle: l_Style,
            items: {
                html: dValue,
                frame: false,
                border: false,
                bodyStyle:  l_panelStyle,
                xtype: "panel"}
        });
        pnl.render(inContainer);
        var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
        controlSet[thisControl.id]=thisControl;
        return;
    }
    //data is the raw data return.
    //items now contains child log workflow records.
    //chart prep
    var wfStatesByName = [];
    var resetWfStatesByName = function()
    {
        wfStateCount =[];
        wfStatesByName = [];
        wfStages = [];
        for(var i in rData["workflow"])
        {
            if(!rData["workflow"].hasOwnProperty(i)) continue;
            var wf = rData["workflow"][i];
            if (wf.exclude==false)
            {
                wfStatesByName[wf.alias]=0;
            }
        }
    }
    resetWfStatesByName();
    //gantt prep
    var data = [];
    //need a generic row object..
    var gridRecord = Ext.data.Record.create([{name:'Id'},
        {name:'Name', type:'string'},
        {name:'StartDate', type : 'date', dateFormat:'c'},
        {name:'EndDate', type : 'date', dateFormat:'c'},
        {name:'PercentDone'},
        {name:'ParentId', type: 'auto'},
        {name:'IsLeaf', type: 'bool'}]);
    var sDate = Date.now();
    var eDate = Date.now();
    var oLabel = "";
    var tDate = null;
    var i = 1;
    var parentId=0;
    var firstLog=true;
    var lTasks = rData["items"];
    var wfStateCount = [];
    var wfStages = [];
    var loadDataForReport = function(inStageFilter, inOrgFilter)
    {
        data = [];
        var workingUniqueIds = new Array();
        var workingTasks = [];
        var tempTasks = [];
        //check for org filter and apply
        if(Object.size(inOrgFilter) > 0)
        {
            for(var eachOrgNodeKey in inOrgFilter)
            {
                if(inOrgFilter.hasOwnProperty(eachOrgNodeKey))
                {
                    var thisChNodeId = inOrgFilter[eachOrgNodeKey];
                    var thisNode = rData["ggNodes"][thisChNodeId.id];
                    thisNode.getAllItemsInList(tempTasks,workingUniqueIds);
                    if(inField.dataSource=="pagechangehistory") tempTasks[thisNode.id]=[thisNode.id];
                }
            }
            //here, tempTasks is an array of arrays with ID = [0].  remove all not found
            for(var tId in lTasks)
            {
                if(!lTasks.hasOwnProperty(tId)) continue;
                //if not in tempTasks , remove it
                for(var tempId2 in tempTasks)
                {
                    if(!tempTasks.hasOwnProperty(tempId2)) continue;
                    if(tempTasks[tempId2][0]==tId) workingTasks[tId] = lTasks[tId];
                }
            }
        }
        else
        {
            workingTasks = lTasks.slice(0);
        }
        //build items
        for(var t in workingTasks)
        {
            if(!workingTasks.hasOwnProperty(t)) continue;
            //add the item as a task
            var cItemWfState = rData["getWorkflowName"](workingTasks[t].stage);
            var pObj = {ParentId:null, Id:i,PercentDone:0,IsLeaf:false,Name:workingTasks[t].name + " - " + cItemWfState,StartDate:null,EndDate:null};
            if(inStageFilter)
            {
                if(inStageFilter.indexOf(cItemWfState)<0)
                {
                    continue;
                }
                data.push(pObj);
                parentId=i;
                i++;
            }
            else
            {
                data.push(pObj);
                parentId=i;
                i++;
            }
            //tic wf count
            if(wfStatesByName.hasOwnProperty(cItemWfState))  wfStatesByName[cItemWfState]++;
            //add the wfl for this task as children
            var firstLog = true;
            var veryFirstDate = null;
            var veryLastDate = null;
            for (var le in workingTasks[t].workflowLog)
            {
                if(!workingTasks[t].workflowLog.hasOwnProperty(le)) continue;
                var sTaskDate=null;
                var eTaskDate=null;
                if(workingTasks[t].workflowLog[le][1]) sTaskDate = new Date(workingTasks[t].workflowLog[le][1]);
                if(workingTasks[t].workflowLog[le][2]) eTaskDate = new Date(workingTasks[t].workflowLog[le][2]);
                data.push({ParentId:parentId, Id:i,PercentDone:0,IsLeaf:true,Name:workingTasks[t].workflowLog[le][0],StartDate:sTaskDate,EndDate:eTaskDate});
                i++;
                if(firstLog)
                {
                    sDate = workingTasks[t].workflowLog[le][1];
                    veryFirstDate=new Date(sTaskDate);
                    eDate = workingTasks[t].workflowLog[le][2];
                    firstLog=false;
                }
                else
                {
                    if(workingTasks[t].workflowLog[le][1]) if(sDate>workingTasks[t].workflowLog[le][1]) sDate = workingTasks[t].workflowLog[le][1];
                    if(workingTasks[t].workflowLog[le][2]) if(eDate<workingTasks[t].workflowLog[le][2]) eDate = workingTasks[t].workflowLog[le][2];
                }
                if(eTaskDate) veryLastDate = new Date(eTaskDate);
            }
            //set pObj start and end...
            if(inField.dataSource=="pagechangehistory")
            {
                pObj.StartDate=veryLastDate;
                pObj.EndDate=veryFirstDate;
            }
            else
            {
                pObj.StartDate=veryFirstDate;
                pObj.EndDate=veryLastDate;
            }
        }
        for(var wfStage in wfStatesByName)
        {
            if(wfStatesByName.hasOwnProperty(wfStage)) {
                wfStateCount.push([wfStage,wfStatesByName[wfStage]]);
                wfStages.push(wfStage);
            }
        }
    };
    loadDataForReport(null,null);
    var cstore = new Ext.data.ArrayStore({
        fields: ['stage', 'items'],
        data: wfStateCount
    });
    var wfBarChart = new Ext.Panel({
        xtype: 'column-basic',
        width: 400,
        height: 400,
        title: 'Workflow Stage Count',
        items: [Ext.create('Ext.chart.CartesianChart', {
            //store: cstore,
            insetPadding: {
                top: 40,
                bottom: 40,
                left: 20,
                right: 40
            },
            interactions: 'itemhighlight',
            axes: [{
                type: 'numeric',
                position: 'left',
                //minimum: 40,
                titleMargin: 20,
                title: {
                    text: 'Count of Stage'
                }
            }, {
                type: 'category',
                position: 'bottom'
            }],
            animation: Ext.isIE8 ? false : {
                easing: 'backOut',
                duration: 500
            },
            series: {
                type: 'bar',
                xField: 'stage',
                yField: 'items',
                style: {
                    minGapWidth: 20
                }
//                highlight: {
//                    strokeStyle: 'black',
//                    fillStyle: 'gold',
//                    lineDash: [5, 3]
//                },
//                label: {
//                    field: 'items',
//                    display: 'insideEnd',
//                    renderer: function (value) {
//                        return value.toFixed(1);
//                    }
//                }
            },
            sprites: {
                type: 'text',
                text: 'Items by Workflow Stage',
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }
        }
        )]
    });
    var wfPieChart = new Ext.Panel({
        xtype: 'pie-basic',
        width: 400,
        height: 400,
        title: 'Workflow Stage Count',
        items: [{
            xtype: 'polar',
            theme: 'default-gradients',
            width: '100%',
            height: 350,
            store: cstore,
            insetPadding: 50,
            innerPadding: 20,
            legend: {
                docked: 'bottom'
            },
            interactions: ['rotate', 'itemhighlight'],
            sprites: [{
                type: 'text',
                text: 'Itms by Stage',
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }],
            series: [{
                type: 'pie',
                angleField: 'items',
                label: {
                    field: 'stage',
                    calloutLine: {
                        length: 60,
                        width: 3
                    }
                },
                highlight: true,
                tooltip: {
                    trackMouse: true,
                    renderer: function(storeItem, item) {
                        this.setHtml(storeItem.get('os') + ': ' + storeItem.get('data1') + '%');
                    }
                }
            }]
        }]
    });
    //filter for workflow stage
    var stageListPnl = new Ext.Panel({
        title: 'Filter by Stage',
        width: 180,
        height: 'auto',
        bodyStyle: 'padding:10px;',
        items:[{
            xtype: 'multiselect',
            name: 'stageSelectList',
            width: 150,
            height: 'auto',
            store: wfStages,
            ddReorder: true
        }]
    });
    //filter for org tree
    var Tree = Ext.tree;
    var otree = new Ext.tree.TreePanel({
        title: 'Filter Tree',
        height: 140,
        width: 440,
        useArrows:true,
        autoScroll:true,
        animate:false,
        enableDD:false,
        //containerScroll: true,
        rootVisible: false,
        frame: true,
        root: {
            nodeType: 'async'
        },
        loader: new Tree.TreeLoader()
    });
    var otreeStruct = [rData["tree"]];
    // set the root node
    var oroot = new Tree.AsyncTreeNode({
        text: "Exercise",
        draggable:false,
        id:'0',
        children: otreeStruct
    });
    otree.setRootNode(oroot);
    //gantt...
    var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
        defaultExpanded : false,
        autoLoad : true,
        proxy : new Ext.data.MemoryProxy(data),
        reader: new Ext.data.JsonReader({id: 'Id'}, gridRecord)
    });
    var colSlider = new Ext.slider.SingleSlider({
        width: 120,
        value: Sch.PresetManager.getPreset('monthAndYear').timeColumnWidth,
        minValue: 80,
        maxValue: 240,
        increment: 10
    });
    colSlider.on({
        change: function (s, v) {
            g.updateTimeColumnHeaderWidths(v);
        },
        changecomplete: function (s, v) {
            g.setTimeColumnWidth(v);
        }
    });
    //hack the gantt does not like a sinle row in the grid
    if(data.length ==0)
    {
        var pnl = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            width: lWidth,
            bodyStyle: l_Style,
            items: {
                html: "No tasks to display in Gantt.",
                frame: false,
                border: false,
                bodyStyle:  l_panelStyle,
                xtype: "panel"}
        });
        pnl.render(inContainer);
        var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, g, inContainer);
    }
    else
    {
        //always move start date back one month incase first day of start date is milestone...
        sDate = new Date(sDate);
        if(eDate)
        {
            eDate = new Date(eDate);
        }
        else
        {
            eDate = new Date(sDate);
        }
        sDate.setDate(sDate.getDate()-28);
        eDate.setDate(eDate.getDate()+28);
        var g = new Sch.gantt.GanttPanel({
            title: "Workflow Report",
            height: 800,
            width: lWidth,
            collapsible: true,
            highlightWeekends: false,
            showTodayLine: false,
            loadMask: true,
            enableDependencyDragDrop: false,
            readOnly:true,
            //snapToIncrement : true,
            hidden: false,
            stripeRows: true,
            stateful : false,
            id : 'Id',
            startDate:sDate,
            endDate:  eDate,
            viewPreset: 'monthAndYear',
            // Setup your static columns
            columns: [
                {
                    header: 'Tasks',
                    sortable: true,
                    dataIndex: 'Name',
                    locked: true,
                    width: 350,
                    editor: new Ext.form.TextField()
                },
                new Ext.grid.DateColumn({
                    format : 'm-d-Y',
                    header: 'Start',
                    dataIndex: 'StartDate',
                    locked: true,
                    hidden : false,
                    width: 80
                }),
                new Ext.grid.DateColumn({
                    format : 'm-d-Y',
                    header: 'Finish',
                    dataIndex: 'EndDate',
                    locked: true,
                    hidden : false,
                    width: 80
                })
//                    {
//                        header: 'Name',
//                        dataIndex: 'Name',
//                        locked: true,
//                        hidden : false,
//                        width: 100
//                    },
//                    {
//                        header: '% done',
//                        dataIndex: 'PercentDone',
//                        locked: true,
//                        hidden : false,
//                        width: 60
//                    }
            ],
            tbar: [
                '->',
                {
                    xtype: 'label',
                    text: 'Calendar Zoom'
                },
                ' ',
                colSlider
            ],
            taskStore: store
        });
        var filterLogEntries = function()
        {
            var selectedStages = stageListPnl.getComponent(0).getValue();
            var checkedNodes = otree.getChecked();
            resetWfStatesByName();
            loadDataForReport(selectedStages,checkedNodes);
            //reload two stores...
            cstore.removeAll();
            cstore.loadData(wfStateCount);
            //gantt
            store.removeAll();
            store.loadData(data);
        };
        var fButtons = new Ext.Panel({
            // layout:'vbox',
//            layoutConfig: {
//                padding:'10',
//                pack:'center',
//                align:'top'
//            },
            title: "Actions",
            border: true,
            width: 'auto',
            items: [{
                xtype: "button",
                text: "Apply Filter",
                width: 100,
                handler: function(){
                    filterLogEntries();
                }},
                {
                    xtype: "button",
                    text: "Reset Filter",
                    width: 100,
                    handler: function(){
                        stageListPnl.getComponent(0).reset();
                        otree.getRootNode().cascade(function(n) {
                            var ui = n.getUI();
                            ui.toggleCheck(false);
                        });
                        resetWfStatesByName();
                        loadDataForReport(null,null);
                        cstore.removeAll();
                        cstore.loadData(wfStateCount);
                        //gantt
                        store.removeAll();
                        store.loadData(data);
                    }},
                {
                    xtype: "button",
                    title: "Data will open in a new window.  Cut and paste into excel",
                    text: "Export",
                    width: 100,
                    handler: function(){
                        var tw = window.open();
                        var outData = "<table border=0><tr><td>Item</td><td>Current Stage</td><td>Stage History</td><td>From<td>To</td></tr>";
                        for (var iId in rData.items)
                        {
                            if(!rData.items.hasOwnProperty(iId)) continue;
                            outData += "<tr><td>" + rData.items[iId].name + "</td><td>" + rData.getWorkflowName(rData.items[iId].stage) + "</td><td></td><td></td><td></td></tr>";
                            for(var wflid in rData.items[iId].workflowLog)
                            {
                                if(!rData.items[iId].workflowLog.hasOwnProperty(wflid)) continue;
                                outData += "<tr><td></td><td></td><td>" + rData.items[iId].workflowLog[wflid][0] +"</td><td>" + new Date(rData.items[iId].workflowLog[wflid][1]) +"</td><td>" + new Date(rData.items[iId].workflowLog[wflid][2]) + "</td></tr>";
                            }
                        }
                        tw.document.write(outData + "</table>");
                    }},
                {
                    xtype: "button",
                    text: "Reload Report",
                    width: 100,
                    handler: function(){
                        mwf_resetForm();
                    }}
            ]
        });
        var fpnl = new Ext.Panel({
            //height: 600,
            collapsible: true,
            layout:'hbox',
            layoutConfig: {
                padding:'10',
                pack:'center',
                align:'top'
            },
            title: "Filter",
            collapsed: true,
            border:true,
            width: 'auto',
            bodyStyle: 'height:200px',
            items: [otree, stageListPnl,fButtons]
        });
        var cpnl = new Ext.Panel({
            layout:'hbox',
            layoutConfig: {
                padding:'10',
                pack:'center',
                align:'middle'
            },
            border:false,
            width: 'auto',
            bodyStyle: l_Style,
            items: [wfBarChart,wfPieChart]
        });
        var pnl = new Ext.FormPanel({
            //layout: 'vbox',
            border:true,
            width: lWidth,
            bodyStyle: l_Style,
            items: [fpnl,cpnl, g]
        });
        pnl.render(inContainer);
        oroot.expand(true);
        var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    }
    controlSet[thisControl.id]=thisControl;
}
,
 renderRawData:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var data = dataServices.getData(inField.dataSource,inFormKey,item, inField, inContainer, true);
    var outHtml;
    if(data=="loading")
    {
        outHtml = "<img src='javascripts/cwf/images/loading20.gif'>";
    }
    else
    {
        try{
            if (data instanceof Object)
            {
                outHtml = JSON.stringify(data);
            }
            else
            {
                outHtml = data;
            }
        }
        catch(e){
            outHtml = data;
        }
    }
    inContainer.title = inField.toolTip;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    //rendeIf logic
    var hideField = ijfUtils.renderIfShowField("",inField);
    var pnl = new Ext.FormPanel({
        labelAlign: 'left',
        border:false,
        width: lWidth,
        hidden: hideField,
        bodyStyle: l_Style,
        items: {
            html: outHtml,
            frame: false,
            border: false,
            bodyStyle:  l_panelStyle,
            xtype: "panel"}
    });
    pnl.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, pnl, inContainer);
    controlSet[thisControl.id]=thisControl;
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

	var jfFieldMeta = ijf.jiraEditMetaKeyed[ijf.currentItem.key][inField.dataSource];
    var jfFieldDef = ijf.jiraFieldsKeyed[inField.dataSource];
	var jf=ijf.currentItem.fields[jfFieldDef.id];
    var data = ijfUtils.handleJiraFieldType(jfFieldDef,jf);

	    var lAllowBlank = true;
	    if (jfFieldMeta.hasOwnProperty("required")) lAllowBlank = (jfFieldMeta.required) ? false : true;


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
	    if (inField.style.indexOf('readonly:true')>-1)
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
		if(rOnly) l_fieldStyle="background:lightgray";


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
	        bodyStyle: l_Style,
	        items:[{
	            xtype: 'textarea',
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
	                    ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
	                    if(f.isValid())
	                    {
	                        ocf(f,n,o);
	                    }
	                }
	            }
	        }]
	    });

	    simple.render(inContainer);
	    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, simple, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;



}
,
 renderComments:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var origDatasource = inField.dataSource;
    var mappedField=null;
    if(gSubformParams)
    {
        if(gSubformParams.hasOwnProperty(inField.dataSource))
        {
            inField.dataSource=gSubformParams[inField.dataSource];
            mappedField = inField.dataSource;
        }
    }
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
    }
    else
        var lCaption = inField.caption;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var rOnly = false;
    if (inField.style.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var cData = item.getSectionTableObjData(inField.dataSource);
    if(cData)
    {
        cData.reverse();
    }
    else
    {
        cData = [];
    }
    var cHtml = "<u>Comment Log</u><br>" +
        "<table>";
    var moreComments = "<table>";
    var cCount = 0;
    for(var ll in cData)
    {
        if(!cData.hasOwnProperty(ll)) continue;
        if(cData[ll].datetime==null) continue;
        if(cCount<3)
        {
            cHtml+= "<tr>" +
                "<td colspan=2 style='font-style: italic'>On "+ cData[ll].datetime +", "+ cData[ll].author +" commented:</td></tr>" +
                "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;</td></td><td>"+ mwfUtil_removeTags(cData[ll].comment) +"<br></td></tr>" +
                "<tr><td colspan=2>&nbsp;</td></tr></tr>";
        }
        else
        {
            moreComments += "<tr>" +
                "<td colspan=2 style='font-style: italic'>On "+ cData[ll].datetime +", "+ cData[ll].author +" commented:</td></tr>" +
                "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;</td></td><td>"+ mwfUtil_removeTags(cData[ll].comment) +"<br></td></tr>" +
                "<tr><td colspan=2>&nbsp;</td></tr></tr>";
        }
        cCount++;
    }
    cHtml+="</table>"
    moreComments+="</table>"
    var litems =[];
    litems.push({
        xtype: 'textarea',
        labelAlign: 'left',
        labelStyle: l_labelStyle,
        style: l_Style,
        fieldLabel: lCaption,
        readOnly: rOnly,
        //name: "field_"+inField.formCell,
        value: "",
        allowBlank:true,
        width:lWidth,
        hideLabel:false,
        id: inFormKey+'mwfControl_'+inField.formCell.replace(",","_"),
        listeners: {
            change: function(){
                controlChanged(inFormKey+'mwfControl_'+inField.formCell);
            }
        }});
    litems.push({
        html: cHtml,
        frame: false,
        bodyStyle: l_panelStyle,
        border: false,
        xtype: "panel"});
    litems.push({
        title: "more comments...",
        html: moreComments,
        frame: false,
        collapsible: true,
        bodyStyle: l_panelStyle,
        collapsed: true,
        border: false,
        xtype: "panel"});
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        hidden: hideField,
        border:false,
        defaultType: 'textarea',
        bodyStyle: l_panelStyle,
        items: litems
    });
    inField.dataSource = origDatasource;
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    thisControl.mappedSectionName =  mappedField;
    controlSet[thisControl.id]=thisControl;
}
,
 renderGridCell:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var origDatasource = inField.dataSource;
    var mappedField=null;
    if(gSubformParams)
    {
        if(gSubformParams.hasOwnProperty(inField.dataSource))
        {
            inField.dataSource=gSubformParams[inField.dataSource];
            mappedField =inField.dataSource;
        }
    }
    //var data = item.getSectionTextData(inField.dataSource);
    var dataSourceKeys = inField.dataSource.split(",");
    var dataRowIndex = dataSourceKeys[1].trim();
    var dataColumnName = dataSourceKeys[2].trim();
    var dataSourceName = dataSourceKeys[0].trim();
    //examine data row index, if "x" then set to curIndex
    //this grabs the current Item index in case it is used
    var curIndex = 0;
    if(gItemSectionGridIndex.hasOwnProperty(dataSourceName))
    {
        curIndex = gItemSectionGridIndex[dataSourceName][0];
    }
    if(dataRowIndex=="x") dataRowIndex=curIndex;
    var tableData = item.getSectionTableObjData(dataSourceName);
    var data = tableData[dataRowIndex][dataColumnName];
    //check for append...
    if (inField.controlType=="tablecellappend") data="";
    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = dataSourceName + ", row " + dataRowIndex + " ," + dataColumnName;
    else if(inField.caption=="none")
    {
        var lCaption = "";
        hideLabel=true;
    }
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    //data = mwfUtil_xmlDecode(data);
    var combVals = [];
    var fList = item.getSectionColDefs(dataSourceName);
    fList.sort(function(a, b) {
        return parseFloat(a.column) - parseFloat(b.column);
    });
    var thisCol = null;
    for (var i in fList)
    {
        if(!fList.hasOwnProperty(i)) continue;
        //look for column with cascading constraints and prep fList as needed
        if((fList[i].constraints.cascadeLevels>1) && (!fList[i].constraints.hasOwnProperty("controlId")))
        {
            combVals = JSON.parse(fList[i].constraints.optionsAsJson);
            fList[i].constraints["comboRef"] = combVals;
            fList[i].constraints["cLevel"]=1;
            var cLevels = fList[i].constraints.cascadeLevels/1;
            fList[i].constraints["cLevels"]=cLevels;
            fList[i].constraints["controlId"]=mwfUtils_cleanId(inFormKey+'mwfControl_'+dataSourceName+'_' + dataRowIndex + '_' + fList[i].name + '_id');
            fList[i].constraints["dependentCols"]=new Array();
            fList[i].constraints["addDependents"] = function(inId, inConst)
            {
                inConst.dependentCols.push(inId);
                if(inConst.hasOwnProperty("parentCol")) {
                    var pConst =inConst["parentCol"];
                    pConst.addDependents(inId,pConst);
                }
            };
            for(var li = 1;li<cLevels;li++)
            {
                var fIndex=i/1+li/1;
                fList[fIndex].constraints["optionsAsJson"] = "cascade";
                fList[fIndex].constraints["comboStore"]=Ext.create('Ext.data.Store', {
                                                                fields: ['item','value'],
                                                                proxy: {
                                                                    type: 'memory',
                                                                    reader: {
                                                                        type: 'json'
                                                                    }},
                                                                autoLoad: false});
                fList[fIndex].constraints["comboRef"] = combVals;
                fList[fIndex].constraints["cLevel"]=fIndex;
                fList[fIndex].constraints["cLevels"]=cLevels;
                fList[fIndex].constraints["controlId"]=mwfUtils_cleanId(inFormKey+'mwfControl_'+dataSourceName+'_' + dataRowIndex + '_' +fList[fIndex].name + '_id');
                fList[fIndex].constraints["dependentCols"]=new Array();
                fList[fIndex].constraints["parentCol"]=fList[fIndex-1].constraints;
                fList[fIndex].constraints["addDependents"] = function(inId, inConst)
                {
                    inConst.dependentCols.push(inId);
                    if(inConst.hasOwnProperty("parentCol")) {
                        var pConst =inConst["parentCol"];
                        pConst.addDependents(inId,pConst);
                    }
                };
                fList[fIndex-1].constraints.addDependents(fList[fIndex].constraints["controlId"],fList[fIndex-1].constraints);
                fList[fIndex-1].constraints["boundStore"]=fList[fIndex].constraints["comboStore"];
                fList[fIndex-1].constraints["setKeys"] = function(inKeys, inConst)
                {
                    inKeys.push(inConst["cValue"]);
                    if(inConst.hasOwnProperty("parentCol")) {
                        var pConst =inConst["parentCol"];
                        pConst.setKeys(inKeys,pConst);
                    }
                };
            }
            //set combVals to the root level of combVals
            var cArray = [];
            for(var sVal in combVals)
            {
                if(combVals.hasOwnProperty(sVal)) cArray.push({'item':sVal,'value':sVal});
            }
            combVals = Ext.create('Ext.data.Store', {
                fields: ['item','value'],
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json'
                    }},
                autoLoad: false});
            combVals.proxy.data = cArray;
            combVals.load();
            fList[i].constraints["comboStore"]=combVals;
        }
        //end cascade
        if(fList[i].name==dataColumnName) {
            thisCol = fList[i];
        }
    }
    if(thisCol==null) throw "Cannot find column: " + dataColumnName;
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var ocf =  ijfUtils.getEvent(inField);
    var rOnly = false;
    if (inField.style.indexOf('readonly:true')>-1)
    {
        rOnly=true;
    }
    if (inField.style.indexOf('enteronce:true')>-1)
    {
        if (!!data) rOnly=true;
    }
    var outField = {};
    //read only
    var eAble = true;
    //need to look for regex constraint here...
    var regX = false;
    var valFunction = function(v){};
    if (thisCol.constraints.hasOwnProperty("regularExpression"))
    {
        if (thisCol.constraints.regularExpression!="")
        {
            regX=true;
        }
    }
    valFunction=function(v){
        //fList is still in scope...so, find i
        try
        {
            if (thisCol.constraints.regularExpression!="")
            {
                var rgx = new RegExp(thisCol.constraints.regularExpression);
                if (!rgx.exec(v)) {
                    return(thisCol.constraints.invalidRegExMessage);
                }
            }
            //check for numeric...
            if((thisCol.type=="DEC") || (thisCol.type=="INT"))
            {
                if(isNaN(v)==true)
                {
                    return("Field must be a number");
                }
            }
            return true;
        }
        catch(e)
        {
            return("Generic validation error: " + e.message);
        }
    };
    var aBlank = true;
    if(thisCol.required) aBlank=false;
    if(thisCol.locked) eAble=false;
    if(eAble) eAble=false;
    else eAble=true;
    if(rOnly) eAble=true;
    if(thisCol.type=="DATE")
    {
        outField= {
            xtype: 'datefield',
            labelAlign: 'left',
            labelStyle: l_labelStyle,
            style: l_Style,
            fieldLabel: lCaption,
            readOnly: eAble,
            width: lWidth,
            value: data,
            invalidText: "Date must be in format mm/dd/yyyy",
            validator: valFunction,
            allowBlank:aBlank,
            hideLabel:hideLabel,
            id: inFormKey+'_mwfControl_'+inField.formCell.replace(",","_"),
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
                    controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                    if(f.isValid())
                    {
                        ocf(f,n,o);
                    }
                }
            }
        };
    }
    else if((thisCol.type=="string") && (regX==false) && (thisCol.constraints.hasOwnProperty('optionsAsJson')) && (thisCol.constraints.optionsAsJson!=""))
    {
        try
        {
            combVals = [];
            //add the existing value if it's not there.
            if(thisCol.constraints.hasOwnProperty("comboStore"))
            {
                combVals=thisCol.constraints["comboStore"];
                //look to see if the list has current value.  if not, then add
                if(combVals.data.items.length==0)
                {
                    combVals.proxy.data=[{'item':data,'value':data}];
                    combVals.load();
                }
                else
                {
                    //rip through values and add if not there.
                    var cValFound = false;
                    for(var thisCVal in combVals.proxy.data)
                    {
                         if(combVals.proxy.data.hasOwnProperty(thisCVal))
                         {
                             if(combVals.proxy.data[thisCVal].value==data) cValFound = true;
                         }
                    }
                    if(!cValFound) {
                        combVals.proxy.data.push({'item':data,'value':data});
                        combVals.load();
                    }
                }
            }
            else
            {
                combVals = JSON.parse(thisCol.constraints.optionsAsJson);
            }
        }
        catch(e)
        {
            combVals = [];
        }
        if(thisCol.constraints.name=="checkbox")
        {
            //this is a checkbox constraint...
            var chked = false;
            if (data=="checked") chked = true;
            outField = {
                xtype: 'checkbox',
                labelStyle: l_labelStyle,
                bodyStyle: l_panelStyle,
                    name: 'cbName_'+inField.formCell,
                boxLabel: lCaption,
                hideLabel: hideLabel,
                checked: chked,
                margin: '0 0 10 0',
                scope: this,
                listeners: {
                    afterrender: function(f)
                    {
                        this.validate();
                    }
                },
                handler: function(f,n){
                controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                ocf(f,n);
                }
            }
        }
        else
        {
            outField = {labelAlign: 'left',
                xtype: 'combo',
                store: combVals,
                labelStyle: l_labelStyle,
                forceSelection: true,
                style: l_Style,
                bodyStyle: l_panelStyle,
                fieldLabel: lCaption,
                hideLabel:  hideLabel,
                allowBlank: aBlank,
                sourceColumn: thisCol,
                id: mwfUtils_cleanId(inFormKey+'mwfControl_'+dataSourceName+'_' + dataRowIndex + '_' + thisCol.name + '_id'),
                //maxLength: lMaxsize,
                readOnly: eAble,
                //mode: 'local',
                displayField: 'item',
                valueField: 'value',
                triggerAction: 'all',
                emptyText:'Please select...',
                selectOnFocus:true,
                width: lWidth,
                value: data,
                //id: inFormKey+'_mwfControl_'+inField.formCell.replace(",","_"),
                listeners: {
                    afterrender: function(f)
                    {
                        this.validate();
                    },
                    'select':  function(field,nval,oval){
                        var sCol = this.sourceColumn;
                        if(sCol.constraints["cLevels"]==sCol.constraints["cLevel"]) return;
                        sCol.constraints["cValue"]=nval.data.value;
                        var tArray = new Array();
                        var cKeys = new Array();
                        if(sCol.constraints.setKeys)
                        {
                            sCol.constraints.setKeys(cKeys,sCol.constraints);
                            //cKeys.push(nval.data.value);
                            mwfUtils_getComboList(tArray, sCol.constraints["comboRef"],cKeys);
                            var tStore = sCol.constraints["boundStore"];
                            tStore.proxy.data=tArray;
                            tStore.load();
                            for(var depIds in sCol.constraints["dependentCols"])
                            {
                                if(sCol.constraints["dependentCols"].hasOwnProperty(depIds))
                                {
                                    //clear the value
                                    var tcmp = Ext.getCmp(sCol.constraints["dependentCols"][depIds]);
                                    tcmp.setValue(null);
                                }
                            }
                        }
                    },
                    valid: function(f)
                    {
                        inContainer.title = inField.toolTip;
                    },
                    invalid: function(f,msg){
                        if(!inField.toolTip) inContainer.title = f.getErrors().join();
                    },
                    change: function(f,n,o){
                        controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                        if(f.isValid())
                        {
                            ocf(f,n,o);
                        }
                    }
                }
            };
        }
    }
    else if(thisCol.type=="TEXTAREA")
    {
        outField = {
            xtype: "textarea",
            labelAlign: 'left',
            labelStyle: l_labelStyle,
            style: l_Style,
            bodyStyle: l_panelStyle,
            fieldLabel: lCaption,
            readOnly: eAble,
            hideLabel: hideLabel,
            //maxLength: lMaxsize,
            value: data,
            validator: valFunction,
            allowBlank:aBlank,
            width:lWidth,
            id: inFormKey+'mwfControl_'+inField.formCell.replace(",","_"),
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
                    controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                    if(f.isValid())
                    {
                        ocf(f,n,o);
                    }
                }
            }
        };
    }
    else
    {
        //plain string
        outField = {labelAlign: 'left',
            xtype: 'textfield',
            labelStyle: l_labelStyle,
            style: l_Style,
            bodyStyle: l_panelStyle,
            fieldLabel: lCaption,
            hideLabel:  hideLabel,
            allowBlank: aBlank,
            //maxLength: lMaxsize,
            validator: valFunction,
            readOnly: eAble,
            width: lWidth,
            value: data,
            id: inFormKey+'_mwfControl_'+inField.formCell.replace(",","_"),
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
                    controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                    if(f.isValid())
                    {
                        ocf(f,n,o);
                        //FORMAT NUMBER?
                    }
                }
            }
        };
    }
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        //url:'save-form.php',
        //frame:true,
        border:false,
        hidden: hideField,
        //title: 'simple panel',
        //bodyStyle:'padding:5px 5px 0',
        width: 'auto',
        bodyStyle: l_panelStyle,
        items:[outField]
    });
    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    controlSet[thisControl.id]=thisControl;
}
,
renderItemList:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;

    var curIndex = 0;

    var lCaption = inField.caption;

    var rOnly = false;
    if (inField.style.indexOf('readonly:true')>-1)
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
	    if(!l_fieldStyle) l_fieldStyle="background:white";


	var tSearch = "jql="+inField.dataSource+"&fields="+inField.dataReference;
    var rawList = ijfUtils.jiraApiSync('GET','/rest/api/2/search?'+tSearch, null);
	//bail if dataItems not
    var colMeta = [];

	var dataItems = rawList.issues.map(function(i){
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
		colMeta["key"]={"id":"key","name":"key","schema":{}};
		return retObj;
	});

    if(inField.referenceFilter)
    {
        //filter the peerItems...
        if(ijf.snippets.hasOwnPropery(inField.referenceFilter))
	        dataItems = window[iFilters.snippet](dataItems);
    }

	//calculate column widths...and headers
	var colWidths=[];
	var colNames = inField.dataReference.split(",");
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
				format: 'm/d/y',
				filter: {
				  type: 'date'
	            }
			});
		}
		else
		{
			gridFieldArray.push({name: f.id, type: "string"});
			colSettingsArray.push({
				header: f.header,
				width: 'auto',
				dataIndex: f.id,
				width: f.width,
				sortable: true,
				filter: {
				  type: 'string'
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
										g_formId=itm.action.form;;
										ijf.main.processSetup("ijfContent");
                                  }
                                  else
                                  {
                                      var dFunc = function(){
                                          window.onbeforeunload= null;
											ijf.currentItem=null;
											g_itemId= thisId;
											g_formId=itm.action.form;;
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
    var l_tbar=[];
    var lXtype="";
    var grid= new Ext.grid.GridPanel({
        store: store,
        plugins: 'gridfilters',
        bodyStyle: l_panelStyle,
        width: "100%",
        ijfForm: inField,
        columns: colSettingsArray,
        selModel: {selType: 'rowmodel', mode: 'SINGLE'},
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
                    g_formId=tEvent;
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
                    g_formId=tEvent;
                    ijf.main.processSetup("ijfContent");
					return;
				}
				//look for snippet...
				if(ijf.snippets.hasOwnProperty(tEvent))
				{
					ijf.snippets[tEvent](record.data.iid,this);
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
    layout.render(inContainer);
    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, layout, inContainer);
    ijf.main.controlSet[thisControl.id]=thisControl;
}
,
 renderGrid:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var origDatasource = inField.dataSource;
    var ocf =  ijfUtils.getEvent(inField);
    var mappedField=null;
    if(gSubformParams)
    {
        if(gSubformParams.hasOwnProperty(inField.dataSource))
        {
            inField.dataSource=gSubformParams[inField.dataSource];
            mappedField = inField.dataSource;
        }
    }
    var curIndex = 0;
    if(gItemSectionGridIndex.hasOwnProperty(inField.dataSource))
    {
        curIndex = gItemSectionGridIndex[inField.dataSource][0];
    }
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else
        var lCaption = inField.caption;
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var rOnly = false;
    if (inField.style.indexOf('readonly:true')>-1)
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
    //var l_Style = mwfUtils_getStyle(inField.style);
    var l_Height=mwfUtils_getNameValueFromStyleString(inField.style,"height");
    if(l_Height=="") l_Height=300;
    else l_Height = l_Height/1;
    var l_includeSums = false;
    if(mwfUtils_getNameValueFromStyleString(inField.style,"includeSums")=="true") l_includeSums=true;
    var gridFieldArray = new Array();
    var fList = item.getSectionColDefs(inField.dataSource);
    var colSettingsArray = new Array();
    colSettingsArray.push(new Ext.grid.RowNumberer());
    var tWidth=0;
    var cEvents = new Array();
    fList.sort(function(a, b) {
        return parseFloat(a.column) - parseFloat(b.column);
    });
    var lastColumn = fList.length-1; // For CWF-238 - used to set flex on last column
    var colWidthIndex = -1;          // For CWF-238 - used to "skip" hidden columns when setting custom column widths
    for(var i in fList)
    {
        if(!fList.hasOwnProperty(i)) continue;
        var tConst = inField.getConstraint(i);
        var cStyle = inField.getColumnStyle(i);
        //read only
        var disabled = false;
        if(cStyle!=null)
        {
            if (cStyle.indexOf('readonly:true')>-1)
            {
                disabled = true;
            }
        }
        var hideColumn = inField.isHidden(fList[i].name);
        var cwidth=0;
        // CWF-238
        // Columns are hidden by entering the column headers for the columns that should be displayed
        // for example if an enhanced grid in collect has columns A, B, C, D and E, then entering
        // "A,C,E" in the controls' "Table Columns" config, would hide columns B and D
        // Now, to specify the widths of the visible columns, the user should only have to enter, say,
        // "100,200,300" and those values should get applied only to the visible columns - A, C, and E
        // in this example.
        // The following "if(!hideColumn)..." logic was added to support this requirement "skipping" widths on hidden columns
        // so we only apply them to visible columns
        if(!hideColumn){
          colWidthIndex += 1;
          cwidth = inField.getWidth(colWidthIndex);
        }
        tWidth = tWidth/1+cwidth;
        //If table has Forms constraints, then they override Collect constraints
        if((tConst=="") || (tConst==null))
        {
            //case where we use Collect constraints and types
            //need to look for regex constraint here...
            var regX = false;
            var valFunction = function(v){};
            if (fList[i].constraints.hasOwnProperty("regularExpression"))
            {
                if (fList[i].constraints.regularExpression!="")
                {
                    regX=true;
                }
            }
            valFunction=function(v){
                //fList is still in scope...so, find i
                try
                {
                    var cId = (this.column.fullColumnIndex-1);
                    if (fList[cId].constraints.regularExpression!="")
                    {
                        var rgx = new RegExp(fList[cId].constraints.regularExpression);
                        if (!rgx.exec(v)) {
                            return("Column: " + (cId+1) + " " + fList[cId].constraints.invalidRegExMessage);
                        }
                    }
                    //check for numeric...
                    if((fList[cId].type=="DEC") || (fList[cId].type=="INT"))
                    {
                        if(isNaN(v)==true)
                        {
                            return("Column: " + (cId+1) + " must be a number");
                        }
                    }
                    return true;
                }
                catch(e)
                {
                    return("Generic validation error: " + e.message);
                }
            };
            var aBlank = true;
            if(fList[i].required) aBlank=false;
            if(fList[i].locked==true)
            {
                disabled = true;
            }
            var flexAmount = i==lastColumn ? 1 : 0; // CWF-238 - apply flex:1 only to last column
            if(fList[i].type=="DATE")
            {
                gridFieldArray.push({name: fList[i].name, type: 'date'});
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                colSettingsArray.push({
                    header: headerName,
                    dataIndex: fList[i].name,
                    xtype: 'datecolumn',
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    sortable: true,
                    format: 'm/d/y',
                    editor: {
                        xtype: 'datefield',
                        allowBlank: aBlank,
                        readOnly: disabled,
                        invalidText: "API Date must be in format mm/dd/yyyy",
                        format: 'm/d/y',
                        width: 'auto',
                        validator: valFunction,
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'change': function() {
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);    }
                        }
                    }
                });
            }
            else if((fList[i].type=="DEC") || (fList[i].type=="INT"))
            {
                var nFormat = '0,000.00';
                if (fList[i].type=="INT") nFormat = '0,000';
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                gridFieldArray.push({name: fList[i].name, type: "number"});
                colSettingsArray.push({
                    header: headerName,//fList[i].name,
                    dataIndex: fList[i].name,
                    align: 'right',
                    renderer:  Ext.util.Format.numberRenderer(nFormat),
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex, rowIndex, colIndex, store, view) {
                        return Ext.String.format('Total: {0}', value);
                    },
                    sortable: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: aBlank,
                        readOnly: disabled,
                        msgTarget : 'qtip',
                        width: 'auto',
                        validator: valFunction,
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'change': function() {
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);   }
                        }
                    }
                });
            }
            else if((!rOnly) && (fList[i].type=="string") && (regX==false) && (fList[i].constraints.hasOwnProperty('optionsAsJson')) && (fList[i].constraints.optionsAsJson!=""))
            {
                var combVals = [];
                try
                {
                    if(fList[i].constraints.optionsAsJson=="cascade")
                    {
                        combVals = fList[i].constraints["comboStore"];
                    }
                    else
                    {
                        combVals = JSON.parse(fList[i].constraints.optionsAsJson);
                        //IF comboVals is a deep object then this is a cascading constraint
                        //that impacts the next n columns..
                        //first, break the list...
                        if(!Array.isArray(combVals))
                        {
                            fList[i].constraints["comboRef"] = combVals;
                            fList[i].constraints["cLevel"]=1;
                            var cLevels = fList[i].constraints.cascadeLevels/1;
                            fList[i].constraints["cLevels"]=cLevels;
                            fList[i].constraints["controlId"]=inFormKey+'mwfControl_'+inField.formCell.replace(",","")+'_'+mwfUtils_cleanId(fList[i].name) + '_id';
                            fList[i].constraints["dependentCols"]=new Array();
                            fList[i].constraints["addDependents"] = function(inId, inConst)
                            {
                                inConst.dependentCols.push(inId);
                                if(inConst.hasOwnProperty("parentCol")) {
                                    var pConst =inConst["parentCol"];
                                    pConst.addDependents(inId,pConst);
                                }
                            };
                            for(var li = 1;li<cLevels;li++)
                            {
                                var fIndex=i/1+li/1;
                                fList[fIndex].constraints["optionsAsJson"] = "cascade";
                                fList[fIndex].constraints["comboStore"]= Ext.create('Ext.data.Store', {
                                                                            fields: ['item','value'],
                                                                            proxy: {
                                                                                type: 'memory',
                                                                                reader: {
                                                                                    type: 'json'
                                                                                }},
                                                                            autoLoad: false});
                                fList[fIndex].constraints["comboRef"] = combVals;
                                fList[fIndex].constraints["cLevel"]=li+1;
                                fList[fIndex].constraints["cLevels"]=cLevels;
                                fList[fIndex].constraints["controlId"]=inFormKey+'mwfControl_'+inField.formCell.replace(",","")+'_'+mwfUtils_cleanId(fList[fIndex].name) + '_id';
                                fList[fIndex].constraints["dependentCols"]=new Array();
                                fList[fIndex].constraints["colName"]=fList[fIndex].name;
                                fList[fIndex].constraints["parentCol"]=fList[fIndex-1].constraints;
                                fList[fIndex].constraints["addDependents"] = function(inId, inConst)
                                {
                                    inConst.dependentCols.push(inId);
                                    if(inConst.hasOwnProperty("parentCol")) {
                                        var pConst =inConst["parentCol"];
                                        pConst.addDependents(inId,pConst);
                                    }
                                };
                                fList[fIndex].constraints["setValues"] = function(inRow)
                                {
                                    this["cValue"] = inRow.data[this.colName];
                                    if(this.hasOwnProperty("parentCol")) {
                                        this["parentCol"].setValues(inRow);
                                    }
                                };
                                fList[fIndex].constraints["setKeys"] = function(inKeys, inConst)
                                {
                                    inKeys.push(inConst["cValue"]);
                                    if(inConst.hasOwnProperty("parentCol")) {
                                        var pConst =inConst["parentCol"];
                                        pConst.setKeys(inKeys,pConst);
                                    }
                                };
                                fList[fIndex-1].constraints["colName"]=fList[fIndex-1].name;
                                fList[fIndex-1].constraints.addDependents(fList[fIndex].constraints["controlId"],fList[fIndex-1].constraints);
                                fList[fIndex-1].constraints["boundStore"]=fList[fIndex].constraints["comboStore"];
                                fList[fIndex-1].constraints["setKeys"] = function(inKeys, inConst)
                                {
                                    inKeys.push(inConst["cValue"]);
                                    if(inConst.hasOwnProperty("parentCol")) {
                                        var pConst =inConst["parentCol"];
                                        pConst.setKeys(inKeys,pConst);
                                    }
                                };
                                fList[fIndex-1].constraints["setValues"] = function(inRow)
                                {
                                    this["cValue"] = inRow.data[this.colName];
                                    if(this.hasOwnProperty("parentCol")) {
                                        this["parentCol"].setValues(inRow);
                                    }
                                };
                            }
                            //set combVals to the root level of combVals
                            var cArray = [];
                            for(var sVal in combVals)
                            {
                                if(combVals.hasOwnProperty(sVal)) cArray.push({'item':sVal,'value':sVal});
                            }
                            combVals = Ext.create('Ext.data.Store', {
                                fields: ['item','value'],
                                proxy: {
                                    type: 'memory',
                                    reader: {
                                        type: 'json'
                                    }},
                                autoLoad: false});
                            combVals.proxy.data = cArray;
                            combVals.load();
                        }
                    }
                }
                catch(e)
                {
                    combVals = [];
                }
                gridFieldArray.push({name: fList[i].name, type: "string"});
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                colSettingsArray.push({
                    header: headerName,//fList[i].name,
                    dataIndex: fList[i].name,
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        store: combVals,
                        allowBlank: aBlank,
                        sourceColumn: fList[i],
                        displayField: 'item',
                        readOnly: disabled,
                        valueField: 'value',
                        mode: 'local',
                        width: 'auto',
                        emptyText:'Please select...',
                        forceSelection: true,
                        typeAhead: true,
                        triggerAction: 'all',
                        id: inFormKey+'mwfControl_'+inField.formCell.replace(",","")+'_'+mwfUtils_cleanId(fList[i].name) + '_id',
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'beforequery': function(qp, eopts)
                            {
                              //requery the current cell
                              //set it's combo list to the children of the selected parent...
                                //requery the current cell
                                var sCol = this.sourceColumn;
                                if(sCol.constraints["cLevel"]==1) return;
                                if(!sCol.constraints.setValues) return;
                                //must set the cValues for this row...
                                var thisGridRow = qp.combo.ownerCt.grid.getSelection()[0];
                                sCol.constraints.setValues(thisGridRow);
                                var tArray = new Array();
                                var cKeys = new Array();
                                if(sCol.constraints.setKeys)
                                {
                                    sCol.constraints.setKeys(cKeys,sCol.constraints);
                                }
                                var cVal = "";
                                if(cKeys.length>1)
                                {
                                    //pop the last value
                                    cVal = cKeys[0];
                                    cKeys = cKeys.slice(1);
                                    mwfUtils_getComboList(tArray, sCol.constraints["comboRef"],cKeys);
                                    var tStore = sCol.constraints["comboStore"];
                                    tStore.proxy.data=tArray;
                                    tStore.load();
                                }
                                if(cVal) qp.combo.setValue(cVal);
                            },
                            'select':  function(field,nval,oval){
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                                var sCol = this.sourceColumn;
                                if(sCol.constraints["cLevels"]==sCol.constraints["cLevel"]) return;
                                sCol.constraints["cValue"]=nval.data.value;
                                var tArray = new Array();
                                var cKeys = new Array();
                                if(sCol.constraints.setKeys)
                                {
                                    sCol.constraints.setKeys(cKeys,sCol.constraints);
                                    //cKeys.push(nval.data.value);
                                    mwfUtils_getComboList(tArray, sCol.constraints["comboRef"],cKeys);
                                    var tStore = sCol.constraints["boundStore"];
                                    tStore.proxy.data=tArray;
                                    tStore.load();
                                    //tStore.loadData(tArray);
                                    for(var depIds in sCol.constraints["dependentCols"])
                                    {
                                        if(sCol.constraints["dependentCols"].hasOwnProperty(depIds))
                                        {
                                            //clear the value
                                            var rw = grid.selModel.getSelection();
                                            var tcmp = Ext.getCmp(sCol.constraints["dependentCols"][depIds]);
                                            rw[0].set(tcmp.sourceColumn.name,"");
                                        }
                                    }
                                }
                            }}
                    })
                });
            }
            else if(fList[i].type=="TEXTAREA")
            {
                gridFieldArray.push({name: fList[i].name, type: "string"});
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                colSettingsArray.push({
                    header: headerName,//fList[i].name,
                    dataIndex: fList[i].name,
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    sortable: true,
                    allowBlank: false,
                    editor: {
                        xtype: 'textarea',
                        width: 'auto',
                        readOnly: disabled,
                        allowBlank: aBlank,
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'change': function() {
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);  }
                        },
                        validator: valFunction
                    }
                });
            }
            else
            {
                gridFieldArray.push({name: fList[i].name, type: "string"});
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                colSettingsArray.push({
                    header: headerName, //fList[i].name,
                    dataIndex: fList[i].name,
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    sortable: true,
                    editor: {
                        xtype: 'textfield',
                        width: 'auto',
                        readOnly: disabled,
                        allowBlank: aBlank,
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'change': function() {
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);  }
                        },
                        validator: valFunction
                    }
                });
            }
        }
        else
        {
            //this section is the Forms constraints
            if(tConst=="date")
            {
                gridFieldArray.push({name: fList[i].name, type: tConst});
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                colSettingsArray.push({
                    header: headerName,//fList[i].name,
                    dataIndex: fList[i].name,
                    xtype: 'datecolumn',
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    sortable: true,
                    format: 'm/d/y',
                    //renderer: mwfUtils_formatDateMDY,
                    editor: {
                        xtype: 'datefield',
                        invalidText: "Date must be in format mm/dd/yyyy",
                        allowBlank: true,
                        readOnly: disabled,
                        format: 'm/d/y',
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'change': function() {
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);  }
                        }
                    }
                });
            }
            else if(tConst.indexOf("combo:")>-1)
            {
                gridFieldArray.push({name: fList[i].name, type: "string"});
                var tComb = tConst.replace("combo:","");
                 var ref = JSON.parse(tComb);
                ref.filter.value = ijfUtils.replaceKeyValues(ref.filter.value);
                //special for versioned item numbers
                if(fw.includeAddByStructure.versioning)
                {
                    ref.filter.value=ref.filter.value.replace(new RegExp(" " +fw.includeAddByStructure.versioning + " .*","g"),"");
                }
                combVals = fw.getReferenceItemsAsSimpleArray(ref.entity,ref.field,ref.filter);
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                colSettingsArray.push({
                    header: headerName,//fList[i].name,
                    dataIndex: fList[i].name,
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        store: combVals,
                        allowBlank: true,
                        readOnly: disabled,
                        forceSelection: true,
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'change': function() {
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);   }
                        }
                    })
                });
            }
            else
            {
                gridFieldArray.push({name: fList[i].name, type: tConst});
                var headerName = (fList[i].name + "").replace("{itemname}", item.name);
                colSettingsArray.push({
                    header: headerName,//fList[i].name,
                    dataIndex: fList[i].name,
                    hidden: hideColumn,
                    css: cStyle,
                    width: cwidth,
                    flex:flexAmount,
                    sortable: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: true,
                        readOnly: disabled,
                        listeners: {
                            afterrender: function(f)
                            {
                                this.validate();
                            },
                            'change': function() {
                                controlChanged(inFormKey+'mwfControl_'+inField.formCell);   }
                        }
                    }
                });
            }
        }
    } // end for var i in fList
    //need a generic row object..
    //var gridRecord = Ext.data.Record.create(gridFieldArray);
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
    var lTempTableData = item.getSectionTableObjData(inField.dataSource);
    //format data for store...
    var tPack = new Array();
    for(var aRow in lTempTableData)
    {
        if(lTempTableData.hasOwnProperty(aRow))
        {
            var tObj = {};
            for(var aProp in lTempTableData[aRow])
            {
                if(lTempTableData[aRow].hasOwnProperty(aProp)) tObj[aProp]=lTempTableData[aRow][aProp];
            }
            tPack.push(tObj);
        }
    }
    store.proxy.data=tPack;
    //store.loadRawData(lTempTableData);
    store.load();
    var l_tbar=[];
    var lXtype="";
    if(!rOnly)
    {
        lXtype = "cell-editing"
        var showToolbar = inField.style.indexOf('toolbar_visible:false')==-1;
        if(showToolbar) {
          l_tbar.push({
            iconCls: 'icon-user-add',
            text: 'Add',
            align: 'center',
            handler: function () {
              var rec = Ext.create(inField.dataSource + inField.formCell.replace(",", ""));
              grid.getStore().insert(0, rec);
              grid.cellEditing.startEditByPosition({
                row: 0,
                column: 0
              });
              grid.getView().refresh();
              controlChanged(inFormKey + 'mwfControl_' + inField.formCell);
            }
          });
          l_tbar.push({
            ref: '../removeBtn',
            iconCls: 'icon-user-delete',
            text: 'Remove',
            handler: function () {
              //editor.stopEditing();
              var s = grid.getSelectionModel().getSelection();
              for (var i = 0, r; r = s[i]; i++) {
                grid.getStore().remove(r);
              }
              grid.getView().refresh();
              controlChanged(inFormKey + 'mwfControl_' + inField.formCell);
            }
          });
        }
    }
    var grid;
    var lFeatures = [];
    if(l_includeSums) lFeatures = [{ftype: 'summary'}];
    if(rOnly)
    {
        grid= new Ext.grid.GridPanel({
            store: store,
            width: tWidth,
            region:'center',
            margins: '0 5 5 5',
            features: lFeatures,
            columns: colSettingsArray,
            selModel: {selType: 'rowmodel', mode: 'SINGLE'},
            listeners: {
                'rowdblclick': function(grid,rowIndex,e) {
                    ocf(grid,rowIndex,e);
                }
            }
        });
    }
    else
    {
        var ce  = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        grid= new Ext.grid.Panel({
            xtype: lXtype,
            features: lFeatures,
            store: store,
            width: tWidth,
            region:'center',
            margins: '0 5 5 5',
            plugins: [ce],
            tbar: l_tbar,
            columns: colSettingsArray,
            selModel: {selType: 'rowmodel', mode: 'MULTI'},
            listeners: {
                'rowdblclick': function(grid,rowIndex,e) {
                    ocf(grid,rowIndex,e);
                }
            }
    });
        grid.cellEditing = ce;
    }
    var layout = new Ext.Panel({
        title: lCaption,
        layout: 'border',
        collapsible: collapsible,
        collapsed: collapsed,
        hidden: hideField,
        layoutConfig: {
            columns: 1
        },
        width:tWidth + 45,
        height: l_Height,
        items: [grid]
    });
    inField.dataSource = origDatasource;
    layout.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, layout, inContainer);
    thisControl.mappedSectionName =  mappedField;
    controlSet[thisControl.id]=thisControl;
}
,
 renderGantt:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var origDatasource = inField.dataSource;
    var mappedField=null;
    if(gSubformParams)
    {
        if(gSubformParams.hasOwnProperty(inField.dataSource))
        {
            inField.dataSource=gSubformParams[inField.dataSource];
            mappedField = inField.dataSource;
        }
    }
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
    }
    else
        var lCaption = inField.caption;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var lWidth = 'auto';
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var l_Height=mwfUtils_getNameValueFromStyleString(inField.style,"height");
    if(l_Height=="") l_Height=300;
    else l_Height = l_Height/1;
    var data = [];
    //need a generic row object..
//    var gridRecord = Ext.data.Record.create([{name:'Id'},
//        {name:'Name', type:'string'},
//        {name:'StartDate', type : 'date', dateFormat:'c'},
//        {name:'EndDate', type : 'date', dateFormat:'c'},
//        {name:'PercentDone'},
//        {name:'ParentId', type: 'auto'},
//        {name:'IsLeaf', type: 'bool'}]);
    var gMap = JSON.parse(inField.dataReference);
    var sDate = new Date();
    var eDate = new Date();
    var oLabel = "";
    var tDate = null;
    var i = 1;
    if(inField.dataSource=="explicit")
    {
        //this is explicit task naming with dates....
        //look for additional tasks in datareference 2....
        try
        {
            var gMap2 = JSON.parse(inField.dataReference2);
            for(var t2 in gMap2.tasks)
            {
                if(!gMap2.tasks.hasOwnProperty(t2)) continue;
                gMap.tasks.push(gMap2.tasks[t2]);
            }
        }
        catch(e)
        {}
        for(var t in gMap.tasks)
        {
            if(!gMap.tasks.hasOwnProperty(t)) continue;
            if(gMap.tasks[t].label===Object(gMap.tasks[t].label))
            {
                //get value from datasource
                oLabel = item.getSectionTextData(gMap.tasks[t].label.dataSource);
            }
            else
            {
                //it's a string, just set th evalue to it.
                oLabel =gMap.tasks[t].label;
            }
            var sDate2 = "";
            var eDate2 = "";
            if(gMap.tasks[t].start===Object(gMap.tasks[t].start))
            {
                //get value from datasource
                sDate2 = item.getSectionTextData(gMap.tasks[t].start.dataSource);
            }
            else
            {
                //it's a string, just set th evalue to it.
                sDate2 =gMap.tasks[t].start;
            }
            if(gMap.tasks[t].finish===Object(gMap.tasks[t].finish))
            {
                //get value from datasource
                eDate2 = item.getSectionTextData(gMap.tasks[t].finish.dataSource);
            }
            else
            {
                //it's a string, just set th evalue to it.
                eDate2 =gMap.tasks[t].finish;
            }
            if((sDate2==null) || (sDate2=="")) continue;
            try
            {
                sDate2 = new Date(sDate2);
            }
            catch(e)
            {
                sDate2 = null;
            }
            try
            {
                eDate2 = new Date(eDate2);
            }
            catch(e)
            {
                eDate2 = null;
            }
            if(sDate2==null) eDate2=null;
            else
            {
                //if end date isNaN, then set end date to start date.
                if(isNaN(eDate2.getTime())) eDate2=new Date(sDate2);
                if(eDate2 < sDate2)
                {
                    eDate2 = new Date(sDate2);
                }
            }
            if((isNaN(sDate2.getTime())==false) && (isNaN(eDate2.getTime())==false))
            {
                tDate = new Date(sDate2);
                if (tDate < sDate) sDate = new Date(tDate);
                tDate = new Date(eDate2);
                if(tDate > eDate) eDate = new Date(tDate);
                data.push({ParentId:"", Id:i,PercentDone:0,IsLeaf:true,Name:oLabel,StartDate:sDate2,EndDate:eDate2});
                i++;
            }
        }
    }
    else
    {
        //get the data from a table with field mappings
        //var fList = item.getSectionColDefs(inField.dataSource);
        var tData = item.getSectionTableObjData(inField.dataSource);
        var pArray = new Array();
        for(var dRow in tData)
        {
            if(!tData.hasOwnProperty(dRow)) continue;
            if((tData[dRow][gMap["Name"]]==null) || (tData[dRow][gMap["Name"]]=="")) continue;
            if(pArray.hasOwnProperty(tData[dRow][gMap["ParentName"]]))
            {
                pId = pArray[tData[dRow][gMap["ParentName"]]];
            }
            else
            {
                //add a row as a parent, and use it's parent ID.
                pId = i;
                i++;
                data.push({Id:pId,IsLeaf:false,Name:tData[dRow][gMap["ParentName"]]});
                pArray[tData[dRow][gMap["ParentName"]]]=pId;
            }
            //verify the start date is not null and not "" before setting sDate2
            if((tData[dRow][gMap["StartDate"]]==null) || (tData[dRow][gMap["StartDate"]]==""))
            {
                continue;
            }
            else
            {
                var sDate2 = new Date(tData[dRow][gMap["StartDate"]]);
                var eDate2 = new Date(tData[dRow][gMap["EndDate"]]);
                if(isNaN(eDate2.getTime())) eDate2 = new Date(sDate2);
                if((isNaN(sDate2.getTime())==false) && (isNaN(eDate2.getTime())==false))
                {
                    if(eDate2<sDate2) eDate2 = new Date(sDate2);
                    tDate = new Date(sDate2);
                    if (tDate < sDate) sDate = (tDate);
                    tDate = new Date(eDate2);
                    if(tDate > eDate) eDate = new Date(tDate);
                    data.push({ParentId:pId, Id:i,PercentDone:0,IsLeaf:true,Name:tData[dRow][gMap["Name"]],StartDate:sDate2,EndDate:eDate2});
                    i++;
                }
            }
        }
    }
    if(!Ext.ClassManager.isCreated('GanttTaskModel1'))
    {
        var tModel = Ext.define('GanttTaskModel1', {
            extend   : 'Gnt.model.Task',
            clsField : 'TaskType'
        });
    }
    var taskStore       = Ext.create("Gnt.data.TaskStore", {
        model       : 'GanttTaskModel1',
        dependencyStore : null,
        resourceStore: null,
        assignmentStore: null,
        autoSync : false,
        calendar    : new Gnt.data.Calendar({
            name        : 'General',
            calendarId  : 'General'
        }),
        proxy           : {
            type    : 'memory',
            data    : data
        }
    });
    taskStore.load();
    //hack the gantt does not like a single row in the grid
    if(data.length ==0)
    {
        var pnl = new Ext.FormPanel({
            labelAlign: 'left',
            border:false,
            width: lWidth,
            bodyStyle: l_Style,
            items: {
                html: "No tasks to display in Gantt.",
                frame: false,
                border: false,
                bodyStyle:  l_panelStyle,
                xtype: "panel"}
        });
        inField.dataSource = origDatasource;
        pnl.render(inContainer);
        var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, g, inContainer);
        thisControl.mappedSectionName =  mappedField;
    }
    else
    {
        //always move start date back one month incase first day of start date is milestone...
        sDate.setDate(sDate.getDate()-28);
        eDate.setDate(eDate.getDate()+28);
        var localeId    = 'en';
        var localeClass = 'En';
        var supportedLocales    = {
            en      : ['En', 'English']
        };
        var g  = Ext.create("Gnt.panel.Gantt", {
            alias                   : 'widget.gantt1',
            highlightWeekends       : true,
            showTodayLine           : true,
            //loadMask                : true,
            //enableProgressBarResize : true,
            //showRollupTasks         : true,
            eventBorderWidth        : 0,
            rowHeight               : 28,
            height                  : 400,
//            normalViewConfig : {
//                stripeRows              : true,
//                // Adds a CSS class to each row element
//                getRowClass : function (rec) {
//                    return rec === this.store.getRootNode().firstChild ? 'first-row' : '';
//                }
//            },
//            lockedGridConfig : {
//                width       : 950
//            },
            // Define the static columns
            columns       : [
                // Any regular Ext JS columns are ok
                {
                    xtype     : 'sequencecolumn',
                    width     : 40,
                    // This CSS class is added to each cell of this column
                    tdCls     : 'id'
                },
                {
                    xtype     : 'namecolumn',
                    width     : 250
                },
                {
                    xtype : 'startdatecolumn',
                    width : 80
                },
                {
                    //hidden : true,
                    xtype : 'enddatecolumn',
                    width : 80
                },
                {
                    xtype : 'durationcolumn',
                    width : 80
                }
            ],
            region              : 'center',
            taskStore           : taskStore,
            bufferedRenderer    : true,
            columnLines         : true,
            startDate           : sDate,
            endDate             : eDate,
            localeId            : localeId,
            supportedLocales    : supportedLocales,
            viewPreset          : 'monthAndYear'
        });
        var simple = new Ext.Panel({
            title: lCaption,
            layout: 'fit',
            collapsible: true,
            hidden: hideField,
            layoutConfig: {
                columns: 1
            },
            width:lWidth,
            height: l_Height,
            items: [g]
        });
        inField.dataSource = origDatasource;
        simple.render(inContainer);
        var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, g, inContainer);
        thisControl.mappedSectionName =  mappedField;
    }
    controlSet[thisControl.id]=thisControl;
}
,
 renderAttachments:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var origDatasource = inField.dataSource;
    var mappedField=null;
    if(gSubformParams)
    {
        if(gSubformParams.hasOwnProperty(inField.dataSource))
        {
            inField.dataSource=gSubformParams[inField.dataSource];
            mappedField = inField.dataSource;
        }
    }
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else
        var lCaption = inField.caption;
    var lWidth =650;
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var hasCopyAction = false;
    var copyTarget="";
    var copyTargetSectionId="";
    if(inField.dataReference.indexOf("copy")>-1)
    {
        try
        {
            copyTarget = inField.dataReference.split(":")[1];
            copyTarget = copyTarget.trim();
            hasCopyAction = true;
            copyTargetSectionId =item.getSectionIdByName(copyTarget);
            if(isNaN(copyTargetSectionId))
            {
                copyTarget="";
                copyTargetSectionId="";
                hasCopyAction = false;
                footLog("Failed to get copy target section id");
            }
        }
        catch(e){}
    }
    var hideField = ijfUtils.renderIfShowField("",inField);
    var gridFieldArray = Ext.data.Record.create([{
        name: 'id',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'stimestamp',
        type: 'date'
    }, {
        name: 'suser',
        type: 'string'
    }, {
        name: 'mimetype',
        type: 'string'
    }]);
    if(!Ext.ClassManager.isCreated(inField.dataSource + inField.formCell.replace(",","")))
    {
        Ext.define(inField.dataSource + inField.formCell.replace(",",""), {
            extend: 'Ext.data.Model',
            fields: gridFieldArray
        });
    }
    var store = new Ext.data.Store({
        model: inField.dataSource + inField.formCell.replace(",",""),
        sortOnLoad: true,
        sorters: { property: 'stimestamp', direction : 'DESC' }
    });
    var attData =item.getSectionAttachmentArray(inField.dataSource);
    var attObjData = [];
    for(var a in attData)
    {
        if(attData.hasOwnProperty(a))
        {
            attObjData.push({'id':attData[a][0],'name':attData[a][1],'description':attData[a][2],'stimestamp':attData[a][3],'suser':attData[a][4],'mimetype':attData[a][5]})
        }
    }
    store.loadData(attObjData);
    var copyAction = {};
    if(hasCopyAction)
        copyAction = {icon   : 'javascripts/cwf/images/arrow_right.png',
            tooltip: 'Copy this file to ' + copyTarget,
            handler: function(grid, rowIndex, colIndex) {
                var rec = store.getAt(rowIndex);
                //alert("Delete " + rec.get('id'));
                var lAtt = allFormAttachments[rec.get('id')];
                if (lAtt==null)
                {
                    footLog("Failed to find the local attachment settings");
                }
                else
                {
                    var fun = function(){
                        window.onbeforeunload==null;
                        showProgress();
                        $.ajax(g_root + '/copyAttachment?fileDescription=' + rec.get('description') +  '&itemId=' + item.id + '&fileType=' + lAtt.mimetype + '&sectionId=' + copyTargetSectionId + '&attachmentId='+lAtt.id, {
                            success: function(data) {
                                footLog("Copy response, checking...");
                                if(data.results.status==0)
                                {
                                    //reload the item.....
                                    footLog("File Copied, reloading item");
                                    hideProgress();
                                    mwf_resetForm();
                                }
                                else
                                {
                                    footLog("Failed to copy file  ");
                                    hideProgress();
                                    modalDialogMessage("Error","Failed to copy file.  Please reload to ensure it did not complete before trying again.");
                                }
                            },
                            error: function() {
                                footLog("Failed to copy file  ");
                                hideProgress();
                                modalDialogMessage("Error","Failed to copy file.  Please reload to ensure it did not complete before trying again.");
                            }
                        });
                    };
                    if(window.onbeforeunload==null)
                    {
                        modalDialog("File Copy","Are you sure you want to copy this file to " + copyTarget + "?",fun);
                    }
                    else
                    {
                        modalDialog("Warning","You have unsaved changes on this page, copying the file will refresh the page and lose these files.<br><br>  Hit Cancel to stop, OK to continue.",fun);
                    }
                }
            }
        };
    var attGridHeight = 150;
    if((inField.controlType == 'attachmentsOneRow') || (inField.controlType == 'attachmentsOneRowNoUpload'))   attGridHeight=62;
    var delOption = {
        icon   : 'javascripts/cwf/images/delete.gif',  // Use a URL in the icon config
        tooltip: 'Delete File',
        handler: function(grid, rowIndex, colIndex) {
            var rec = store.getAt(rowIndex);
            //alert("Delete " + rec.get('id'));
            var lAtt = allFormAttachments[rec.get('id')];
            if (lAtt==null)
            {
                //no att found in current set
                footLog("Failed to find the local attachment settings");
                //hideProgress();
            }
            else
            {
                var fun = function(){
                    showProgress();
                    $.ajax(g_root + '/deleteAttachment?gridId=' + inFormKey+'mwfControl_'+inField.formCell + '&attachmentId='+lAtt.id, {
                        success: function(data) {
                            //$('#main').html($(data).find('#main *'));
                            footLog("Delete response, checking...");
                            //var res = JSON.parse(data.results.data);
                            if(data.results.status==0)
                            {
                                //I need the section and control...I need the itemDetail.....
                                //controlSet...what is it keyed by....
                                var c = controlSet[data.results.gridId];
                                //verify result, and remove the file from the grid....
                                var s = c.item.getSectionByName(c.field.dataSource);
                                s.deleteAttachment(data.results.attachmentId);
                                c.control.items.items[0].getStore().removeAt(rowIndex);
                                c.control.items.items[0].getView().refresh();
                                hideProgress();
                            }
                            else
                            {
                                footLog("Failed to delete file  ");
                                hideProgress();
                            }
                        },
                        error: function() {
                            footLog("Failed to delete file  ");
                            hideProgress();
                        }
                    });
                };
                modalDialog("File Deletion","Are you sure you want to delete this file?<br>  This action is permanent and immediate.",fun);
            }
        }
    };
    if((inField.controlType=="attachmentsNoUpload") || (inField.controlType=="attachmentsOneRowNoUpload")) delOption = {'text':""};
    var nameWidth = inField.getWidth(0, 200);
    var descriptionWidth = inField.getWidth(1, 200);
    var savedWidth = inField.getWidth(2, 100);
    var userWidth = inField.getWidth(3, 100);
    var actionsWidth = inField.getWidth(4, 65);
    var scrollbarWidth = 18;
    var gridWidth = nameWidth + descriptionWidth + savedWidth + userWidth + actionsWidth + scrollbarWidth;
    var layoutPanelWidth = gridWidth + 12;
    var grid = new Ext.grid.GridPanel({
        store: store,
        width: gridWidth,
        id: inFormKey+'mwfControl_'+inField.formCell.replace(",","_"),
        layout: 'fit',
        anchor: 'form',
        region:'center',
        margins: '0 5 5 5',
        markDirty: false,
        height: attGridHeight,
        cls:'attachmentsGrid',
        columns: [
            {
                header   : 'ID',
                hidden: true,
                width    : 60,
                sortable : true,
                dataIndex: "id"
            },
            {
                header   : 'Name',
                width    : nameWidth,
                sortable : true,
                dataIndex: "name"
            },
            {
                header   : 'Description',
                width    : descriptionWidth,
                sortable : true,
                dataIndex: "description",
                cls:'attachmentsGridDescriptionColumn'
            },
            {
                header   : 'Saved',
                width    : savedWidth,
                sortable : true,
                dataIndex: "stimestamp",
                xtype: 'datecolumn',
                format: 'm/d/y h:i:s'
            },
            {
                header   : 'User',
                width    : userWidth,
                sortable : true,
                dataIndex: "suser"
            },
            {
                header   : 'Type',
                width    : 100,
                sortable : true,
                hidden: true,
                dataIndex: "mimetype"
            },
            {
                header: 'Actions',
                xtype: 'actioncolumn',
                width: actionsWidth,
                items: [delOption,
                    {icon   : 'javascripts/cwf/images/arrow_down.png',  // Use a URL in the icon config
                        tooltip: 'Download File',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = store.getAt(rowIndex);
                            //showProgress();
                            //download the file.....
                            //need the local attachment object to get the keys...
                            var lAtt = allFormAttachments[rec.get('id')];
                            if (lAtt==null)
                            {
                                //no att found in current set
                                footLog("Failed to find the local attachment settings");
                                //hideProgress();
                            }
                            else
                            {
                                var url =g_root + '/getAttachment?itemId='+lAtt.itemId+'&sectionName='+lAtt.sectionName+'&attachmentId='+lAtt.id;
                                window.open(url);
                            }
                        }
                    },copyAction]
            }
        ]
    });
    if(!Ext.ClassManager.isCreated('multifilefield'))
    {
        Ext.define('Ext.ux.form.MultiFile', {
            extend: 'Ext.form.field.File',
            alias: 'widget.multifilefield',
            initComponent: function () {
                var me = this;
                me.on('render', function () {
                    me.fileInputEl.set({ multiple: true });
                });
                me.callParent(arguments);
            },
            onFileChange: function (button, e, value) {
                this.duringFileSelect = true;
                var me = this,
                    upload = me.fileInputEl.dom,
                    files = upload.files,
                    names = [];
                if (files) {
                    for (var i = 0; i < files.length; i++)
                        names.push(files[i].name);
                    value = names.join(', ');
                }
                Ext.form.field.File.superclass.setValue.call(this, value);
                //CWF-278 Bulk uploads requires automatic save when upload files
                mwf_saveForm();
                delete this.duringFileSelect;
            }
        });
    }
    var lAttItems =[
            grid,
            {
                xtype       : 'multifilefield',
                multiple    : true,
                acceptSize  : 2048,
                //id          : 'file_' + inFormKey+'mwfControl_'+inField.formCell.replace(",","_"), //commented out this line for cwf278, it conflicted with multifile uploads but seemed to work well without this line
                name        : 'file[]',
                //layout      : 'fit',
                listeners: {
                    change: function(){
                        controlChanged(inFormKey+'mwfControl_'+inField.formCell);
                    }
                },
                width:  500
            },
            {
                html: "Please provide an upload comment:",
                frame: false,
                border: false,
                xtype: "panel",
                cls:'uploadCommentInstructions',
                width:500},
            {
                xtype: 'textfield',
                //layout: 'fit',
                labelAlign: 'left',
                emptyText: 'Optional file description',
                id: 'filedesc_' + inFormKey+'mwfControl_'+inField.formCell.replace(",","_"),
                width: 400,
                name: 'descriptionField',
                value: ''
            }, {
            xtype: 'textfield',
            name: 'controlId',
            hidden: true,
            value: inFormKey+'mwfControl_'+inField.formCell
        },{
            xtype: 'textfield',
            name: 'sectionId',
            hidden: true,
            value: item.getSectionIdByName(inField.dataSource)
        },{
            xtype: 'textfield',
            name: 'sectionName',
            hidden: true,
            value: inField.dataSource
        }, {
            xtype: 'textfield',
            name: 'itemId',
            hidden: true,
            value: item.id
        }];
    var aPheight = 130 + attGridHeight;
    if ((inField.controlType=="attachmentsNoUpload") || (inField.controlType=="attachmentsOneRowNoUpload"))
    {
        lAttItems = [grid];
        aPheight = 50 + attGridHeight;
    }
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
    var layout = new Ext.FormPanel({
        title: lCaption,
        layout: 'vbox',
        fileUpload: true,
        isUpload: true,
        collapsible: collapsible,
        collapsed: collapsed,
        width:layoutPanelWidth,
        hidden: hideField,
        bodyStyle:'padding:5px 5px 0',
        labelAlign: 'right',
        url: g_root + '/fileUpload',
        height: aPheight,
        items:lAttItems
    });
    inField.dataSource = origDatasource;
    layout.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, layout, inContainer);
    thisControl.mappedSectionName =  mappedField;
    controlSet[thisControl.id]=thisControl;
}
,
 renderHtmleditor:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    var origDatasource = inField.dataSource;
    var mappedField=null;
    if(gSubformParams)
    {
        if(gSubformParams.hasOwnProperty(inField.dataSource))
        {
            inField.dataSource=gSubformParams[inField.dataSource];
            mappedField = inField.dataSource;
        }
    }
    var data = item.getSectionTextData(inField.dataSource);
    var lAllowBlank = true
    if(item.getSectionRequired(inField.dataSource)) lAllowBlank=false;
    var hideField = ijfUtils.renderIfShowField(data,inField);
    var hideLabel = false;
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if (inField.caption=="none")
    {
        hideLabel=true;
        lCaption ="";
    }
    else
        var lCaption = inField.caption;
    var lWidth = 300;
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var lHeight = mwfUtils_getNameValueFromStyleString(l_Style,'height');
    if(!lHeight) lHeight= 300;
    var thisHtml = new Ext.form.HtmlEditor ({
        labelAlign: 'left',
        labelStyle: l_labelStyle,
        enableSourceEdit: false,
        fieldLabel: lCaption,
        name: "field_"+inField.formCell,
        value: data,
        allowBlank:lAllowBlank,
        hideLabel:hideLabel,
        width: lWidth/1-10,
        height: lHeight/1-6,
        enableColors: true,
        listeners: {
            sync: function(src, html){
                controlChanged(inFormKey+'mwfControl_'+inField.formCell);
            }
        }
    });
    var simple = new Ext.FormPanel({
        labelAlign: 'left',
        hidden:hideField,
        width:lWidth,
        height:lHeight/1,
        border:false,
        bodyStyle: l_Style,
        items:[thisHtml]
    });
    inField.dataSource = origDatasource;
    simple.render(inContainer);
    //now, unhighlight the modified bar.... because it set on render if there was text...
    inContainer.style.borderRight = "none";
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, simple, inContainer);
    thisControl.mappedSectionName =  mappedField;
    controlSet[thisControl.id]=thisControl;
}
/*************************
 *****************PM utility
 *
 *******************************/
,
 renderGantt2:function(inFormKey,item, inField, inContainer)
{
    inContainer.title = inField.toolTip;
    //hack to fix EXTJS intermittent synch error
    if(!Ext.ClassManager.isCreated('MyTaskModel'))
    {
        Ext.define('ExtPatch.grid.ColumnComponentLayout', {
            override: 'Ext.grid.ColumnComponentLayout',
            beginLayoutCycle: function(ownerContext) {
                var me = this,
                    owner = me.owner,
                    shrinkWrap = ownerContext.widthModel.shrinkWrap;
                me.callSuper(arguments);
                // If shrinkwrapping, allow content width to stretch the element
                if (shrinkWrap) {
                    owner.el.setWidth('');
                }
                // owner.textContainerEl[shrinkWrap ? 'addCls' : 'removeCls'](me.columnAutoCls);
                owner.titleEl.setStyle(me._paddingReset);
            }
        });
    }
    //major project dates are startDate and endDate from the Item...
    var pStartDate = null;
    try
    {
        var itemStartDate = item.getSectionTextData(mwfUtils_ConvertDb2Date("startDate"));
        var tics = Date.parse(itemStartDate);
        if (!isNaN(tics))
        {
            pStartDate = new Date(tics);
        }
    }
    catch(e)
    {}
    var pStopDate = null;
    try
    {
        var itemStopDate = item.getSectionTextData(mwfUtils_ConvertDb2Date("stopDate"));
        var tics = Date.parse(itemStopDate);
        if (!isNaN(tics))
        {
            pStopDate = new Date(tics);
        }
    }
    catch(e)
    {}
    if (inField.caption=="")
        var lCaption = inField.dataSource;
    else if(inField.caption=="none")
    {
        var lCaption = "";
    }
    else
        var lCaption = inField.caption;
    var hideField = ijfUtils.renderIfShowField("",inField);
    var lWidth = 1000;
    if (inField.width!="")
    {
        lWidth= inField.width/1;
    }
    var l_labelStyle = mwfUtils_getStyle(inField.labelStyle);
    var l_panelStyle = mwfUtils_getStyle(inField.panelStyle);
    var l_Style = mwfUtils_getStyle(inField.style);
    var l_Height=mwfUtils_getNameValueFromStyleString(inField.style,"height");
    if(l_Height=="") l_Height=800;
    else l_Height = l_Height/1;
    if(!Ext.ClassManager.isCreated('MyTaskModel'))
    {
        var tModel = Ext.define('MyTaskModel', {
            extend   : 'Gnt.model.Task',
            // A field in the dataset that will be added as a CSS class to each rendered task element
            clsField : 'TaskType',
            fields   : [
                { name : 'TaskType', type : 'string' },
                { name : 'Color', type : 'string'}
            ]
        });
    }
    var projectRaw= item.getSectionTextData(inField.dataSource);
    if(!projectRaw.trim())
    {
        var tProjData='{"tasks": {"tasks": [{}]},"resources": {"resources": [{}]},"dependencies": {"dependencies": [{}, {}]},"assignments": {"assignments": [{}]}}';
    }
    else
    {
        var tProjData = mwfUtil_xmlDecode(projectRaw);
        tProjData = tProjData.replace(/<p>/g,"");
        tProjData = tProjData.replace(/<\/p>/g,"");
    }
    var projectData = JSON.parse(tProjData);
    var tasksData = projectData.tasks;
    var dependenciesData =  projectData.dependencies;
    var resourcesData =  projectData.resources;
    var assignmentsData =  projectData.assignments;
    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        data : dependenciesData.dependencies
    });
    var resourceStore = Ext.create("Gnt.data.ResourceStore", {
        data : resourcesData.resources
    });
    var assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
        resourceStore: resourceStore,
        //data: assignmentsData.assignments
        proxy: {
            type: 'memory',
            reader: {
                type: 'json'
            }
        }
    });
    assignmentStore.loadData(assignmentsData.assignments);
    var taskStore       = Ext.create("Gnt.data.TaskStore", {
        model       : 'MyTaskModel',
       dependencyStore : dependencyStore,
       resourceStore: resourceStore,
       assignmentStore: assignmentStore,
       // autoSync : false,
        //sortOnLoad      : true,
        calendar    : new Gnt.data.Calendar({
            name        : 'General',
            calendarId  : 'General'
        })
        ,proxy           : {
            type    : 'memory',
            data    : tasksData.tasks,
            reader  : {type:'json'}
        }
    });
    taskStore.load();
    var supportedLocales    = {
        en      : ['En', 'English']
    };
// get requested locale from URL hash
    var localeId    = 'en';
    var localeClass = 'En';
    var tCid=null;
    if(Ext.getCmp('secondaryToolbarId'))
    {
        tCid = Ext.getCmp('secondaryToolbarId');
        Ext.destroy(tCid);
    }
    tCid=null;
    var lGantt  = Ext.create("Gnt.panel.Gantt", {
        alias                   : 'widget.demogantt',
        highlightWeekends       : true,
        showTodayLine           : true,
        loadMask                : true,
        enableProgressBarResize : true,
        showRollupTasks         : true,
        eventBorderWidth        : 0,
        rowHeight               : 28,
        // Define a custom HTML template for regular tasks
        taskBodyTemplate : '<div class="sch-gantt-progress-bar" style="width:{progressBarWidth}px;{progressBarStyle}" unselectable="on"><span class="sch-gantt-progress-bar-label">{[Math.round(values.percentDone)]}%<span></span></div>',
        // Define properties for the left 'locked' and scrollable tree grid
        lockedGridConfig : {
            width       : 950
        },
        // Define properties for the left 'locked' and scrollable tree view
        lockedViewConfig : {
            stripeRows              : true,
            // Enable node reordering in the locked grid
            plugins     : {
                ptype           : 'treeviewdragdrop',
                containerScroll : true
            }
        },
        normalViewConfig : {
            stripeRows              : true,
            // Adds a CSS class to each row element
            getRowClass : function (rec) {
                return rec === this.store.getRootNode().firstChild ? 'first-row' : '';
            }
        },
        //leadingBufferZone : 1, // HACK: temp fix for Ext JS 5 buffered renderer issue
        // Define properties for the schedule section
        schedulerConfig  : {
        },
        // Define what should be shown in the left label field, along with the type of editor
        leftLabelField : {
            dataIndex : 'Name',
            editor    : { xtype : 'textfield' }
        },
        //editingInterface: Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit : 2 }),
        // Add some extra functionality
        plugins        : [
            this.editingInterface = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit : 2 }),
            Ext.create("MyApp.TaskArea"),
            Ext.create("MyApp.TaskContextMenu"),
            Ext.create("Sch.plugin.Pan"),
            Ext.create('Gnt.plugin.TaskEditor'),
            {
                ptype               : 'scheduler_lines',
                innerTpl            : '<span class="line-text">{Text}</span>',
                showHeaderElements  : true,
                store               : new Ext.data.JsonStore({
                    fields: [ 'Date', 'Text', 'Cls' ],
                    data : [
                        {
                            Date : pStartDate,
                            Text : 'Project kickoff',
                            Cls  : 'kickoff' // A CSS class
                        }
                    ]
                })
            }
        ],
        // Define an HTML template for the tooltip
        tooltipTpl     : new Ext.XTemplate(
            '<strong class="tipHeader">{Name}</strong>',
            '<table cellpadding="0" cellspacing="0" class="taskTip">',
            '<tr><td>Start:</td> <td align="right">{[values._record.getDisplayStartDate("y-m-d")]}</td></tr>',
            '<tr><td>End:</td> <td align="right">{[values._record.getDisplayEndDate("y-m-d")]}</td></tr>',
            '<tr><td>Progress:</td><td align="right">{[ Math.round(values.PercentDone)]}%</td></tr>',
            '</table>'
        ),
        eventRenderer : function (task, tplData) {
            if (task.get('Color')) {
                var style = Ext.String.format('background-color: #{0};border-color:#{0}', task.get('Color'));
                if (!tplData.segments) {
                    return {
                        // Here you can add custom per-task styles
                        style : style
                    };
                    // if task is segmented we cannot use above code
                    // since it will set color of background visible between segments
                    // in this case instead we need to provide "style" for each individual segment
                } else {
                    var segments    = tplData.segments;
                    for (var i = 0; i < segments.length; i++) {
                        segments[i].style = style;
                    }
                }
            }
        },
        // Define the static columns
        columns       : this.columns || [
            // Any regular Ext JS columns are ok
            {
                xtype     : 'sequencecolumn',
                width     : 40,
                // This CSS class is added to each cell of this column
                tdCls     : 'id'
            },
            {
                xtype     : 'namecolumn',
                width     : 300,
                renderer  : function (v, meta, r) {
                    if (!r.data.leaf) meta.tdCls = 'sch-gantt-parent-cell';
                    return Ext.util.Format.htmlEncode(v);
                }
//                ,items : new MyApp.FilterField({
//                store : this.taskStore,
//                        // In case of a keypress ExtJS thinks that we pressing key on a column, it calls
//                        // getFocusableForEvent() method to obtain focusable column which is the source of a key event
//                        // but the method returns this editor instead of a column and things start to break apart.
//                        // Thanks there's a check if returned component (presuming column) is sortable, thus we
//                        // mark our editor as non-sortable, thus keeping Ext happy.
//                sortable : false
//            })
            },
            {
                xtype : 'startdatecolumn',
                width : 80
            },
            {
                //hidden : true,
                xtype : 'enddatecolumn',
                width : 80
            },
            {
                xtype : 'durationcolumn',
                width : 80
            },
            {
                xtype : 'percentdonecolumn',
                width : 60
            },
            {
                xtype : 'resourceassignmentcolumn'
            },
            {
                xtype               : 'predecessorcolumn',
                useSequenceNumber   : true,
                width : 80
            },
            {
                xtype : 'addnewcolumn'
            }
        ],
        // Define the buttons that are available for user interaction
        dockedItems          : [
            {
                xtype : 'toolbar',
                cls    : 'my-toolbar',
                alias  : 'widget.primarytoolbar',
                scale : 'medium',
                //height: 40,
                //gantt:  this,
                //taskStore: taskStore,
                items : [
                    {
                        tooltip : 'Previous timespan',
                        iconCls : 'icon icon-left',
                        handler : function () {
                            gGantt.shiftPrevious();
                        }
                    },
                    {
                        tooltip : 'Next timespan',
                        iconCls : 'icon icon-right',
                        handler : function () {
                            gGantt.shiftNext();
                        }
                    },
                    {
                        tooltip : 'Collapse all',
                        iconCls : 'icon icon-collapseall',
                        handler : function () {
                            gGantt.collapseAll();
                        }
                    },
                    {
                        tooltip : 'Expand all',
                        iconCls : 'icon icon-expandall',
                        handler : function () {
                            gGantt.expandAll();
                        }
                    },
                    {
                        tooltip : 'Zoom out',
                        iconCls : 'icon icon-zoomout',
                        handler : function () {
                            gGantt.zoomOut();
                        }
                    },
                    {
                        tooltip : 'Zoom in',
                        iconCls : 'icon icon-zoomin',
                        handler : function () {
                            gGantt.zoomIn();
                        }
                    },
                    {
                        tooltip : 'Zoom to fit',
                        iconCls : 'icon icon-zoomfit',
                        handler : function () {
                            gGantt.zoomToFit(null, { leftMargin : 100, rightMargin : 100 });
                        }
                    },
                    {
                        tooltip      : 'Highlight critical path',
                        iconCls      : 'icon icon-criticalpath',
                        enableToggle : true,
                        handler      : function (btn) {
                            var v = gGantt.getSchedulingView();
                            if (btn.pressed) {
                                v.highlightCriticalPaths(true);
                            } else {
                                v.unhighlightCriticalPaths(true);
                            }
                        }
                    },
                    {
                        tooltip : 'Add new task',
                        iconCls : 'icon icon-add',
                        handler : function (btn) {
                            var task = gGantt.taskStore.getRootNode().appendChild({
                                Name : 'New Task',
                                leaf : true
                            });
                            //gGantt.getSchedulingView().scrollEventIntoView(task);
                            //gGantt.editingInterface.startEdit(task, 1);
                        }
                    },
                    {
                        tooltip : 'Remove selected task(s)',
                        iconCls : 'icon icon-delete',
                        handler : function (btn) {
                            gGantt.getSelectionModel().selected.each(function (task) {
                                task.remove();
                            });
                        }
                    },
                    {
                        tooltip : 'Indent',
                        iconCls : 'icon icon-indent',
                        handler : function (btn) {
                            gGantt.taskStore.indent(gGantt.getSelectionModel().getSelection());
                        }
                    },
                    {
                        tooltip : 'Outdent',
                        iconCls : 'icon icon-outdent',
                        handler : function (btn) {
                            gGantt.taskStore.outdent(gGantt.getSelectionModel().getSelection());
                        }
                    },
                    {
                        tooltip : 'Save changes',
                        iconCls : 'icon icon-save',
                        itemId  : 'save-button',
                        handler : function () {
                            //gantt.crudManager.sync();
                            mwf_saveForm();
                        }
                    },
                    {
                        text : 'Done',
                        //iconCls : 'icon icon-down',
                        //itemId  : 'done-button',
                        //buttons:[{text: 'Done'}],
                        handler : function () {
                            //gantt.crudManager.sync();
                            if(window.onbeforeunload==null)
                            {
                                g_formId="Form_Project";
                                //delete(controlSet);
                                //gGantt.removeAll(true);
                                Ext.destroy(gGantt);
                                Ext.destroy(gViewport);
                                gGantt=null;
                                gViewport=null;
                                mwfUtils_clearExt();
                                renderForm("mwfContent", "Form_Project", false, item);
                                //mwf_closeForm();
                            }
                            else
                            {
                                //Ext.Msg.prompt("Warning",ijf.main.gNavigateOnChange,function());
                                Ext.Msg.show({
                                    title:'Warning',
                                    message: "You have unsaved changes on this page.  Click Yes to navigate away, No to remain.",
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function(btn) {
                                        if (btn === 'yes') {
                                            mwf_setAllClean();
                                            g_formId="";
                                            delete(controlSet);
                                            gGantt.removeAll(true);
                                            Ext.destroy(gGantt);
                                            Ext.destroy(gViewport);
                                            gGantt=null;
                                            gViewport=null;
                                            mwfUtils_clearExt();
                                            renderForm("mwfContent", "Form_Project", false, item);
                                            //mwf_closeForm();
                                        }
                                    }
                                });
                            }
                        }
                    },
                    {
                        text    : 'More options...',
                        handler : function () {
                            var secondary = Ext.getCmp('secondaryToolbarId');
                            secondary.animate({
                                to : { height : secondary.getHeight() < 10 ? 30 : 0 }
                            });
                        }
                    }
                ]
            },
            { xtype : 'toolbar',
                id     : 'secondaryToolbarId',
                cls       : 'secondary-toolbar',
                alias     : 'widget.secondarytoolbar',
                defaults : { scale : 'medium' },
                height    : 0,
                //taskStore: taskStore,
                items : [
                    {
                        text         : 'Toggle child tasks grouping on/off',
                        enableToggle : true,
                        handler      : function () {
                            gGantt.el.toggleCls("enable-taskarea");
                        }
                    },
                    {
                        text    : 'Toggle rollup tasks',
                        handler : function (btn) {
                            var showRollup = !gGantt.showRollupTasks;
                            gGantt.setShowRollupTasks(showRollup);
                        }
                    },
                    {
                        text    : 'Highlight tasks longer than 8 days',
                        handler : function (btn) {
                            gGantt.taskStore.queryBy(function (task) {
                                if (task.data.leaf && task.getDuration() > 8) {
                                    var el = gGantt.getSchedulingView().getElementFromEventRecord(task);
                                    el && el.frame('lime');
                                }
                            }, this);
                        }
                    },
                    {
                        text    : 'Filter: Tasks with progress < 30%',
                        handler : function (btn) {
                            gGantt.taskStore.filterTreeBy(function (task) {
                                return task.getPercentDone() <= 0.3;
                            });
                        }
                    },
                    {
                        text    : 'Clear Filter',
                        handler : function (btn) {
                            gGantt.taskStore.clearTreeFilter();
                        }
                    },
                    {
                        text    : 'Scroll to last task',
                        handler : function (btn) {
                            var latestEndDate = new Date(0),
                                latest;
                            gGantt.taskStore.getRootNode().cascadeBy(function (task) {
                                if (task.get('EndDate') >= latestEndDate) {
                                    latestEndDate = task.get('EndDate');
                                    latest = task;
                                }
                            });
                            gGantt.getSchedulingView().scrollEventIntoView(latest, true);
                        }
                    }
                ]
            }
        ],
        allowParentTaskMove : true,
        //crudManager         : cm,
        region              : 'center',
        //rowHeight           : Ext.supports.Touch ? 43 : 28,
        selModel            : new Ext.selection.TreeModel({
            ignoreRightMouseSelection : false,
            mode                      : 'MULTI'
        }),
        taskStore           : taskStore,
      //  dependencyStore : dependencyStore,
      //  resourceStore: resourceStore,
      //  assignmentStore: assignmentStore,
        // Set this to false, in case any rendering glitches will have appear, to possible trade
        // perforamance for correctness, ExtJS' buffered rendering sometimes might be flaky
        bufferedRenderer    : true,
//            uncomment to enable showing exact drop position for the task
        enableTaskDragDrop: true,
        dragDropConfig                : { showExactDropPosition : true },
        resizeConfig                  : { showExactResizePosition : true },
        snapRelativeToEventStartDate  : true,
//            uncomment this line to get snapping behavior for resizing/dragging.
//        snapToIncrement : true,
        columnLines         : true,
        startDate           : pStartDate,
        endDate             : Sch.util.Date.add(pStopDate, Sch.util.Date.WEEK, 20),
        localeId            : localeId,
        supportedLocales    : supportedLocales,
        //autoFitOnLoad       : true,
        viewPreset          : 'weekAndDayLetter'
    });
    //lGantt.plugins.push( lGantt.editingInterface = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit : 2 }));
    taskStore.on({
        add: function(){
            controlChanged(inFormKey+'mwfControl_'+inField.formCell);
        },
        remove: function(){
            controlChanged(inFormKey+'mwfControl_'+inField.formCell);
        },
        update: function(){
            controlChanged(inFormKey+'mwfControl_'+inField.formCell);
        }
    });
    lGantt.on({
        dependencydblclick : function (ga, rec) {
            var from = taskStore.getNodeById(rec.get('From')).get('Name'),
                to = taskStore.getNodeById(rec.get('To')).get('Name');
            Ext.Msg.alert('Hey', Ext.String.format('You clicked the link between "{0}" and "{1}"', from, to));
        },
        timeheaderdblclick : function (col, start, end) {
            Ext.Msg.alert('Hey', 'You clicked header cell : ' + Ext.Date.format(start, 'Y-m-d') + ' - ' + Ext.Date.format(end, 'Y-m-d'));
        }
    });
    gViewport = Ext.create("Ext.Viewport", {
        layout : 'fit',
        items  : lGantt
    });
    gGantt = lGantt;
//    var simple = new Ext.Panel({
//        title: lCaption,
//        layout: 'border',
//        collapsible: true,
//        hidden: hideField,
//        layoutConfig: {
//            columns: 1
//        },
//        width:lWidth,
//        height: l_Height,
//        items: [lGantt]
//    });
//    simple.render(inContainer);
    var thisControl = new itemControl(inFormKey+'mwfControl_'+inField.formCell, inField, item, lGantt, inContainer);
    controlSet[thisControl.id]=thisControl;
}
}
