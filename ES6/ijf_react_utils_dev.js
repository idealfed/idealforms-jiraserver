//manual imports
var MuiTextField = window['material-ui']["TextField"];
var MuiThemeProvider = window['material-ui']["MuiThemeProvider"];
var MuiButton = window['material-ui']["Button"];

var Icon = window['material-ui']['Icon'];
var IconButton = window['material-ui']['IconButton'];
var Card = window['material-ui']['Card'];
var CardActions =  window['material-ui']['CardActions'];
var CardContent =  window['material-ui']['CardContent'];
var CardHeader =  window['material-ui']['CardHeader'];

var Typography =  window['material-ui']['Typography'];
var withStyles =  window['material-ui']['withStyles'];
var withTheme = window['material-ui']['withTheme']
var Menu =  window['material-ui']['Menu'];
var MenuItem =  window['material-ui']['MenuItem'];
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

var MuiRadio = window['material-ui']['Radio'];
var MuiRadioGroup = window['material-ui']['RadioGroup'];
var MuiFormControlLabel = window['material-ui']['FormControlLabel'];

var MuiPaper = window['material-ui']['Paper'];
var MuiTable = window['material-ui']['Table'];
var MuiTableBody = window['material-ui']['TableBody'];
var MuiTableCell = window['material-ui']['TableCell'];
var MuiTableHead = window['material-ui']['TableHead'];
var MuiTableRow = window['material-ui']['TableRow'];


var ijf = ijf || {};
ijf.reactUtils ={



renderTextbox(inFormKey,item, inField, inContainer)
{

		inContainer.title = inField.toolTip;
		var lAllowBlank = true;
		//adding concept of session vars.
		if(inField.dataSource=="session")
		{
			var data = ijf.session[inFormKey+'_fld_'+inField.formCell];
			if((!data) && (inField.style.indexOf('query:true')<0)) data=inField.dataReference2;
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


		var ocf =  ijfUtils.getEvent(inField);


		try
		{
			var style = JSON.parse(inField.style);
		}
		catch(e)
		{
			var style = {}
		}
		try
		{
			var panelStyle = JSON.parse(inField.panelStyle);
		}
		catch(e)
		{
			var panelStyle = {}
		}
		try
		{
			var fieldStyle = JSON.parse(inField.fieldStyle);
		}
		catch(e)
		{
			var fieldStyle = {}
		}
		if(!lAllowBlank) fieldStyle.required = true;

		var lValidator = function(v){
			if((fieldStyle.required) && ((v==null)||(v==""))) return false;
			return true
			};
		var lRegex =  inField.regEx;
		if((lRegex!=null) && (lRegex!=""))
		{
			lValidator = function(v)
			{
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				if((fieldStyle.required) && ((v==null)||(v==""))) return false;
				return true;
			}
		}

		class LocalMuiTextField extends React.Component {

		  constructor(props) {
			super(props);
			this.state = {
			  value: data,
			  errored: false
			};
		  }
		  handleChange = (event) => {
			//add OCF call here..
			if(inField.dataSource=="session")
			{
				ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
			}
			else
			{
				ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
			}
			if(lValidator(event.target.value))
			{
				this.state.errored=false;
				ocf(event);
			}
			else this.state.errored=true;
			this.setState({
			  value: event.target.value,
			});
		  };
			  getTip()
			  {
				  if(inField.toolTip) return (<MuiFormHelperText>{inField.toolTip}</MuiFormHelperText>)
				  return
			  }
		  render() {
			return (
			  <div style={style}>
			   <MuiThemeProvider style={panelStyle}>
				<MuiTextField
				  error={this.state.errored}
				  style={fieldStyle}
				  fullWidth={true}
				  label={lCaption}
				  disabled={rOnly}
				  required={fieldStyle.required}
				  multiline={false}
				  id={inFormKey+'_ctr_'+inField.formCell.replace(",","_")}
				  value={this.state.value}
				  onChange={this.handleChange}
				/>
				</MuiThemeProvider>
				{this.getTip()}
			  </div>
			);
		  }
		}

		//before render....
		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiTextField,inFormKey,item, inField, inContainer);

		var controlReference = ReactDOM.render(<LocalMuiTextField />, inContainer);

		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);

		ijf.main.controlSet[thisControl.id]=thisControl;
		//after render....
		if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	},

	renderTextarea(inFormKey,item, inField, inContainer)
	{

			inContainer.title = inField.toolTip;
			var lAllowBlank = true;
			//adding concept of session vars.
			if(inField.dataSource=="session")
			{
				var data = ijf.session[inFormKey+'_fld_'+inField.formCell];
				if((!data) && (inField.style.indexOf('query:true')<0)) data=inField.dataReference2;
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


		try
		{
			var style = JSON.parse(inField.style);
		}
		catch(e)
		{
			var style = {}
		}
		try
		{
			var panelStyle = JSON.parse(inField.panelStyle);
		}
		catch(e)
		{
			var panelStyle = {}
		}
		try
		{
			var fieldStyle = JSON.parse(inField.fieldStyle);
		}
		catch(e)
		{
			var fieldStyle = {}
		}
		if(!lAllowBlank) fieldStyle.required = true;


		var lValidator = function(v){
			if((fieldStyle.required) && ((v==null)||(v==""))) return false;
			return true
			};
		var lRegex =  inField.regEx;
		if((lRegex!=null) && (lRegex!=""))
		{
			lValidator = function(v)
			{
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				if((fieldStyle.required) && ((v==null)||(v==""))) return false;
				return true;
			}
		}

			class LocalMuiTextField extends React.Component {

			  constructor(props) {
				super(props);
				this.state = {
				  value: data,
				  errored: false
				};
			  }
			  handleChange = (event) => {
				//add OCF call here..
				if(inField.dataSource=="session")
				{
					ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
				}
				else
				{
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
				}
				var ocf =  ijfUtils.getEvent(inField);
				if(lValidator(event.target.value))
				{
					this.state.errored=false;
					ocf(event);
				}
				else this.state.errored=true;
				this.setState({
				  value: event.target.value,
				});
			  };
			  getTip()
			  {
				  if(inField.toolTip) return (<MuiFormHelperText>{inField.toolTip}</MuiFormHelperText>)
				  return
			  }
			  render() {
				return (
				  <div style={style}>
					<MuiTextField style={fieldStyle}
					  error={this.state.errored}
					  fullWidth={true}
					  label={lCaption}
					  disabled={rOnly}
					  required={fieldStyle.required}
					  multiline={true}
					  id={inFormKey+'_ctr_'+inField.formCell.replace(",","_")}
					  value={this.state.value}
					  onChange={this.handleChange}
					/>
					{this.getTip()}
				  </div>
				);
			  }
			}

			//before render....
			if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiTextField,inFormKey,item, inField, inContainer);

			var controlReference = ReactDOM.render(<LocalMuiTextField />, inContainer);

			var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);

			ijf.main.controlSet[thisControl.id]=thisControl;
			//after render....
			if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
		},

	 renderButton:function(inFormKey,item, inField, inContainer)
	{
		inContainer.title = inField.toolTip;

		var hideField = ijfUtils.renderIfShowField(null,inField);
        var readOnly = false;
		var lCaption = inField.caption;

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
		try
		{
			var style = JSON.parse(inField.style);
		}
		catch(e)
		{
			var style = {}
		}
		try
		{
			var fieldSettings = JSON.parse(inField.fieldStyle);
		}
		catch(e)
		{
			var fieldSettings = {}
		}

		var disabled = false;
		if(hideField) style.visibility = "hidden";
		if(fieldSettings.readonly) disabled = true;
		if(!fieldSettings.size) fieldSettings.size = "medium";

        var getIcon=function()
        {
			if(fieldSettings.icon) return (<Icon>{fieldSettings.icon}</Icon>);
			else return;
		}

		const LocalMuiButton = () => (
		  <div>
			  <MuiButton onClick={ocf} disabled={disabled} size={fieldSettings.size} color={fieldSettings.color} variant={fieldSettings.variant} style={style}>
				{getIcon()}{lCaption}
			  </MuiButton>
		  </div>
		);


		//before render....
		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiButton, item, inField, inContainer);

		var controlReference = ReactDOM.render(<LocalMuiButton />, inContainer);
		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id]=thisControl;
		//after render....
		if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	  },

	 renderIcon:function(inFormKey,item, inField, inContainer)
	{


		try
		{
			var style = JSON.parse(inField.style);
		}
		catch(e)
		{
			var style = {}
		}
		try
		{
			var panelStyle = JSON.parse(inField.panelStyle);
		}
		catch(e)
		{
			var panelStyle = {}
		}
		try
		{
			var fieldStyle = JSON.parse(inField.fieldStyle);
		}
		catch(e)
		{
			var fieldStyle = {}
		}
        var getIcon=function()
        {
			if(inField.dataSource) return (<Icon style={panelStyle}>{inField.dataSource}</Icon>);
			else return;
		}
		const LocalMuiIcon = () => (
		  <div style={style}>
				{getIcon()}
		  </div>
		);


		//before render....
		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiIcon, item, inField, inContainer);

		var controlReference = ReactDOM.render(<LocalMuiIcon />, inContainer);
		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id]=thisControl;
		//after render....
		if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	  },
	renderHistoryList:function(inFormKey,item, inField, inContainer)
	{
		inField.dataReference = "author,change,date,time";
		if(!item.changelog)
		{
			var tItem = ijfUtils.jiraApiSync("GET","/rest/api/2/issue/" + item.key + "?expand=changelog",null);
			item.changelog = tItem.changelog;
		}
		var sortedLogs = [];
		if(item.changelog.histories)
		{
			//sort desc
			sortedLogs = item.changelog.histories.sort(function(a, b)
			{
				a = new Date(a.created);
				b = new Date(b.created);
				return a>b ? -1 : a<b ? 1 : 0;
			});

			sortedLogs = sortedLogs.map(function(a){

				var chng = a.items.reduce(function(oStr,i){
					oStr += "<b>Field:</b> " + i.field;
					oStr += "<br>&nbsp;&nbsp;&nbsp;<b>From Value:</b> " + i.fromString;
					oStr += "<br>&nbsp;&nbsp;&nbsp;<b>To Value:</b> " + i.toString;
					oStr += "<br><br>";
					return oStr;
				},"");

				a.change = chng.replace(/\n/g,"<br>");
				a.author = a.author.displayName;
				a.date = moment(a.created).format('ll');
				a.time = moment(a.created).format('LT');

				return a;
			});

		}
		this.renderCardList(inFormKey,item, inField, inContainer, sortedLogs)
	},
	renderCommentList:function(inFormKey,item, inField, inContainer)
	{
		inField.dataReference = "author,body,date,time";
		var sortedLogs = [];
		if(item.fields.comment.comments)
		{
			//sort desc
			var sortedLogs = item.fields.comment.comments.sort(function(a, b)
			{
				a = new Date(a.created);
				b = new Date(b.created);
				return a>b ? -1 : a<b ? 1 : 0;
			});

			sortedLogs = sortedLogs.map(function(a){
				a.body = a.body.replace(/\n/g,"<br>");
				if(a.author) a.author = a.author.displayName;
				if(a.updateAuthor) a.author = a.updateAuthor.displayName;
				a.date = moment(a.created).format('ll');
				a.time = moment(a.created).format('LT');
				return a;
			});
		}
		this.renderCardList(inFormKey,item, inField, inContainer, sortedLogs)
	},
	renderCardList:function(inFormKey,item, inField, inContainer, inData)
	{
		inContainer.title = inField.toolTip;

		var hideField = ijfUtils.renderIfShowField(null,inField);
        var readOnly = false;
		var lCaption = inField.caption;

		var ocf =  ijfUtils.getEvent(inField);

        var translateFields = ijfUtils.translateJiraFieldsToIds(inField.dataReference);

	    var lds = inField.dataSource;

        var tSearch = "jql="+lds+"&fields="+translateFields;
 	    tSearch = ijfUtils.replaceKeyValues(tSearch,item);
		var aUrl = '/rest/api/2/search?'+tSearch;

        if(inData)
        {
			var dataItems = inData;
		}
		else
		{
			if(inField.form.formProxy=="true")
			{
				aUrl=aUrl.replace(/ /g,"%20");
				var rawList = ijfUtils.getProxyApiCallSync(aUrl, inField.form.formSet.id);
			}
			else
			{
				var rawList = ijfUtils.jiraApiSync('GET',aUrl, null);
			}
			var dataItems = rawList.issues.map(function(i){
				var retObj ={};
				translateFields.split(",").forEach(function(f){
					var thisField = f.trim();
					var dVal = "";
					var jField = ijfUtils.getJiraFieldById(thisField);
					if(i.fields.hasOwnProperty(jField.id))
					{
						dVal = ijfUtils.handleJiraFieldType(jField,i.fields[jField.id],true);
					}
					if(!dVal) dVal="";
					if(jField.name) retObj[jField.name]= dVal;
						else retObj[thisField]= dVal;
				});
				//retObj.iid=i.id;
				retObj.iid=i.key;
				retObj.key=i.key;
				return retObj;
			});
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
		try
		{
			var style = JSON.parse(inField.style);
		}
		catch(e)
		{
			var style = {}
		}
		try
		{
			var panelStyle = JSON.parse(inField.panelStyle);
		}
		catch(e)
		{
			var panelStyle = {}
		}
		try
		{
			var fieldStyle = JSON.parse(inField.fieldStyle);
		}
		catch(e)
		{
			var fieldStyle = {}
		}


		var disabled = false;
		if(hideField) style.visibility = "hidden";

       //REACT section
       	class DynamicMenuRow extends React.Component {
	   			  constructor(props) {
	   				super(props);
	   				this.state = {
	   				  menuRow: props.menuRow,
	   				  owningClass: props.owningClass,
	   				};
	   			  }

	   			  handleClick(inOwner){
					  this.state.owningClass.handleClose();
					  ijf.snippets[this.state.menuRow.snippet](inOwner);
				  }
	   			  render()
	   			  {
	   				return (
	   				    <MenuItem onClick={() => this.handleClick(this.state.owningClass)}>{this.state.menuRow.label}</MenuItem>
	   		  		);
	   		      }
	     }

		class DynamicHtml extends React.Component {
			  constructor(props) {
				super(props);
				//need to do replaces here...

				var tempHtml = ijfUtils.switchAttsGeneric(props.htmlContent,props.dataRow);
				this.state = {
				  template: { __html: tempHtml },
				  dataRow: props.dataRow
				};
			  }
			  render()
			  {
				return (
				<div dangerouslySetInnerHTML={this.state.template} />
		  		);
		      }
	     }

		class MuiCard extends React.Component {
			  constructor(props) {
				super(props);
				this.state = {
				  row: props.dataRow,
  				  owningClass:props.owningClass,
				  title:props.title,
				  subHeader:props.subHeader,
				  contentOut:props.contentOut,
				  cardMenu:props.cardMenu,
				  actionMenu:props.actionMenu,
  			      anchorEl: null
				};
			  }


			  handleClick = event => {
				this.setState({ anchorEl: event.currentTarget });
			  };

			  handleClose = () => {
				this.setState({ anchorEl: null });
			  };

			  getMenuRow(r, owningClass)
			  {
				  return (<DynamicMenuRow menuRow={r} owningClass={owningClass}/>)
			  }

			  handleDblClick = event => {
				console.log(event.type);
				debugger;
				ocf(event,this);
			  };

			  getMenu(menuRows,owningClass)
			  {
				  if(!menuRows) return;
				  return (
					  <Menu
							id={"card_menu_id_"+owningClass.state.row.key}
							anchorEl={owningClass.state.anchorEl}
							open={Boolean(owningClass.state.anchorEl)}
							onClose={owningClass.handleClose}
						  >
						   {menuRows.map(function(r){return owningClass.getMenuRow(r,owningClass)})}
					  </Menu>

				  );
			  }

			  getIcon(r)
			  {
				if(r.icon) return (<Icon>{r.icon}</Icon>);
				else return;
			  }

			  getCardActions()
			  {
				  if(this.state.actionMenu)
				  {
					  var lThis=this;
					  return (<CardActions disableActionSpacing>{this.state.actionMenu.map(function(r)
					  {
						    if(!r.style)r.style={};
							if(!r.style.size) r.style.size="medium";
						    return (<MuiButton  onClick={() => ijf.snippets[r.snippet](lThis)} color={r.color} variant={r.variant} disabled={r.disabled} size={r.size} style={r.style}>{lThis.getIcon(r)}{r.label}</MuiButton>);
				  	  })}  </CardActions>);
				  }
				  return;
			  }


			  render()
			  {
				return (<div>
						  <Card style={style} onDblClick={this.handleDblClick}>
							<CardHeader style={panelStyle}
									  avatar = {<Icon color="primary">{fieldStyle.avatar}</Icon>}
									  action={
										  <IconButton onClick={this.handleClick}
											  aria-owns={this.state.anchorEl ? 'simple-menu' : null}
											  aria-haspopup="true">
											<Icon>{fieldStyle.actionIcon}</Icon>
										  </IconButton>
										}
										title={
											<DynamicHtml htmlContent={this.state.title} dataRow={this.state.row} />
										}
										subheader={<DynamicHtml htmlContent={this.state.subHeader} dataRow={this.state.row} />}
							/>
							<CardContent>
							   <Typography  component="p">
								<DynamicHtml htmlContent={this.state.contentOut} dataRow={this.state.row} />
								</Typography>
							</CardContent>
							{this.getCardActions()}
						  </Card>
							 {this.getMenu(this.state.cardMenu, this)}
						</div>
				  );
		  	}
		}

		class CardList extends React.Component {
			  constructor(props) {
				super(props);
				this.state = {
				  value: dataItems
				};
			  }

			   getCard(row,owningClass)
			   {
				    //must transform content using field Style
				    //row has the fields...must translate content into values using replaceKeyValues
				    var title = fieldStyle.title
				    var subHeader = fieldStyle.subHeader
				    var contentOut = fieldStyle.content
				    var cardMenu = fieldStyle.menu
				    var actionMenu = fieldStyle.actionMenu
				    var lRow = row

					return (
						<div>
						  <MuiCard dataRow={row}
							  owningClass={owningClass}
							  title={title}
							  subHeader={subHeader}
							  contentOut={contentOut}
							  cardMenu={cardMenu}
							  actionMenu={actionMenu}/>
						</div>
					  );
			   }

			   getCards(inData, owningClass)
			   {
				   return inData.map(function(r){return owningClass.getCard(r,owningClass)});
			   }

		  render()
		  {
		    return (
			<div style={style}>
				{this.getCards(this.state.value, this)}
			</div>
		  );
	  	}
	  }

		//before render....
		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](CardList, item, inField, inContainer);

		var controlReference = ReactDOM.render(<CardList />, inContainer);
		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);
		ijf.main.controlSet[thisControl.id]=thisControl;
		//after render....
		if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	  },

  	 renderDrawer:function(inFormKey,item, inField, inContainer)
	  	{
	  		inContainer.title = inField.toolTip;

	  		var hideField = ijfUtils.renderIfShowField(null,inField);
	          var readOnly = false;
	  		var lCaption = inField.caption;

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
	  		try
	  		{
	  			var style = JSON.parse(inField.style);
	  		}
	  		catch(e)
	  		{
	  			var style = {}
	  		}
	  		try
	  		{
	  			var fieldSettings = JSON.parse(inField.fieldStyle);
	  		}
	  		catch(e)
	  		{
	  			var fieldSettings = {}
	  		}

	  		var buttonStyle = {}
	  		if(hideField) buttonStyle.visibility = "hidden";

		    var variant = "persistent";
		    if(fieldSettings.variant) variant=fieldSettings.variant;

			if(!style.width) style.width="20px";
			var originalWidth = inContainer.style.width;

			class MuiDrawer extends React.Component {
			  state = {
				open: false,
				top: false,
				left: false,
				bottom: false,
				right: false,
			  };

			  toggleDrawer = (side, open) => () => {

				if((!open) && (variant=="persistent"))
				{
					inContainer.style.width=originalWidth;
				}

				this.setState({
				  [side]: open
				});
				this.setState({
					"open" : open
				});
			  };

			  openFromChevron = (side, open) => () => {

				//if this is persistent, alter underlying div width to width of this animal...
				if(variant=="persistent")
				{
					inContainer.style.width=style.width;
				}
				this.setState({
				  [side]: open
				});
				this.setState({
					"open" : open
				});
			  };

			  getMenu(menuRows,owningClass)
			  {
				  if(!menuRows) return;

				  return menuRows.map(function(m)
				  {
					  if(m.type=="button")
					  {
						  var snip = function(){};
						  if(ijf.snippets.hasOwnProperty(m.snippet)) snip = function(){ijf.snippets[m.snippet](m)};
						  return(
							  <List component="nav">
								<ListItem button onClick={snip}>
									<Icon>{m.icon}</Icon>
									<ListItemText primary={m.text} />
								</ListItem>
							  </List> );
					   }
					   else
					   {
						   //assume divider
						   return(<Divider />);
					   }
				  });
			   }

			  render() {
				return (
				  <div>
					<Icon style={buttonStyle} onClick={this.openFromChevron(fieldSettings.direction, true)}>{fieldSettings.icon}</Icon>
					<Drawer variant={variant} anchor={fieldSettings.direction} open={this.state.open} onClose={this.toggleDrawer(fieldSettings.direction, false)}>
						<div style={{display: 'flex', alignItems: 'center',justifyContent: 'flex-end', padding: '0 8px'}}>
						  <IconButton onClick={this.toggleDrawer(fieldSettings.direction,false)}>
							<Icon>chevron_left</Icon>
						  </IconButton>
						</div>
						<Divider />

					  <div
						tabIndex={0}
						role="button"
						onClick={this.openFromChevron(fieldSettings.direction, true)}
						onKeyDown={this.openFromChevron(fieldSettings.direction, true)}
					  >
					   <div style={style}>
						 {this.getMenu(fieldSettings.menu, this)}
						</div>
					  </div>
					</Drawer>
				  </div>
				);
			  }
			}


	  		//before render....
	  		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](MuiDrawer, item, inField, inContainer);

	  		var controlReference = ReactDOM.render(<MuiDrawer />, inContainer);
	  		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);
	  		ijf.main.controlSet[thisControl.id]=thisControl;
	  		//after render....
	  		if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	  	  },

renderSelect(inFormKey,item, inField, inContainer)
{

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


    //get lookuips

	    //two forms:  JIRA references or IJF references
	    var combo = {};
	    var lookup = [];
	    var rawLookup = [];
	    var selectParents = null;
	    var selectChildren = null;
	    var myRefIndex=null;
		switch (inField.dataReference)
		{
			case "ijfReference":

			   //The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells

				var refCheck = 	ijf.fw.CustomTypes.reduce(function(inObj,t){if(t.name==inField.referenceFilter) inObj=t; return inObj;},null);

				if(refCheck)
				{
					rawLookup = ijfUtils.getReferenceDataByName(inField.referenceFilter,"0",true);
					myRefIndex=0;
					lookup = rawLookup.map(function(r){return [r[cLookupDef.index],r[cLookupDef.index]]});
				}
				else
				{
					//complex cascade...
					try
					{
						var cLookupDef = JSON.parse(inField.referenceFilter);
						myRefIndex=cLookupDef.index;
						rawLookup = ijfUtils.getReferenceDataByName(cLookupDef.name,cLookupDef.index,true);
						lookup = rawLookup.map(function(r){return [r[cLookupDef.index],r[cLookupDef.index]]});
						//establish a listener for this combo if necessary
						if(cLookupDef.parents)
						{
							var parentIds = cLookupDef.parents;
							selectParents = parentIds.reduce(function(inFilter,p){
									inFilter.push({"property":p.dataIndex.toString(), "value":"tbd", "fieldName":p.fieldName});
									return inFilter;
								},[]);

						}
						//for each child, you need to clear it's value
						if(cLookupDef.children)
						{
							selectChildren = cLookupDef.children;
						}
					}
					catch(le)
					{
						ijfUtils.footLog("failed to handle complex lookup: " + le.message);
						lookups[col.columnName] = [];
					}
				}

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

				break;
    }


		var lMaxsize =  Number.MAX_VALUE;

		try
		{
			var style = JSON.parse(inField.style);
		}
		catch(e)
		{
			var style = {}
		}
		try
		{
			var panelStyle = JSON.parse(inField.panelStyle);
		}
		catch(e)
		{
			var panelStyle = {}
		}
		try
		{
			var fieldStyle = JSON.parse(inField.fieldStyle);
		}
		catch(e)
		{
			var fieldStyle = {}
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

		if (style.hidden)
		{
			hideLabel=true;
			hideField=true;
		}
		var rOnly = false;
		if (fieldStyle.readonly)
		{
			rOnly=true;
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

        if(hideField) style.visibility = "hidden";
		if(!lAllowBlank) fieldStyle.required = true;
		var ocf =  ijfUtils.getEvent(inField);

		var lValidator = function(v){
			if((fieldStyle.required) && ((v==null)||(v==""))) return false;
			return true
			};
		var lRegex =  inField.regEx;
		if((lRegex!=null) && (lRegex!=""))
		{
			lValidator = function(v)
			{
				var rgx = new RegExp(lRegex);
				if (!rgx.exec(v)) {
					return inField.regExMessage;
				}
				if((fieldStyle.required) && ((v==null)||(v==""))) return false;
				return true;
			}
		}

		class LocalMuiMenuItem extends React.Component  {
		  constructor(props) {
			super(props);
			this.state = {
			  style: props.style,
			};
		  }

		  handleVisibility = () => {
		  		this.setState({ style: this.props.style });
		  };

		  render() {
					return (
					  <MenuItem style={this.state.style} value={this.props.value}>{this.props.display}</MenuItem>
					);
		  }
	    }

		class LocalMuiSelectField extends React.Component {

		  constructor(props) {
			super(props);
			this.state = {
			  value: data,
			  lookup: lookup,
			  rawlookup: rawLookup,
			  parents: selectParents,
			  errored: false,
			  open: false
			};
		  }


		  handleOpen = (event) => {
				//if parents, then the getMenu has to change to filter the values...
 				this.setState({ open: true });
		  };

		  handleChange = (event) => {
			//add OCF call here..
			if(inField.dataSource=="session")
			{
				ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
			}
			else
			{
				ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
			}
			if(lValidator(event.target.value))
			{
				this.state.errored=false;
				ocf(event);
			}
			else this.state.errored=true;


			//now look for children...for each one you need to set the value to null....
			if(this.props.selectChildren)
			{
				this.props.selectChildren.forEach(function(c)
				{
					var ctl = ijfUtils.getControlByDataSource(c);
					if(!ctl) ctl = ijfUtils.getControlByKey(c);
					if(ctl)
					{
						ctl.control.clearValue();
					}
				});
		    }

			this.setState({ [event.target.name]: event.target.value });
		  };

		  handleClose = () => {
			this.setState({ open: false });
		  };

		  clearValue = () => {
			this.setState({ value: null });
		  };

		  getMenu()
		  {
			  if(!this.state.lookup) return;
			  //var menuItems = this.state.lookup.map(function(r){return (<MenuItem style={{"visibility":"visible"}} value={r[0]}>{r[1]}</MenuItem>)});
  			  if(this.state.parents)
			  {
					var parent = this.state.parents.reduce(function(inObj,f){inObj=f; return inObj},null);

					var cValue = 'novaluetofilterwith';
					var ctl = ijfUtils.getControlByDataSource(parent.fieldName);
					if(!ctl) ctl = ijfUtils.getControlByKey(parent.fieldName);
					if(ctl)
					{
						cValue = ctl.control.state.value;
						console.log(cValue);
						var lState = this.state;
						var menuItems = this.state.lookup.map(function(m){

							var showIt = lState.rawlookup.reduce(function(inChk,r){
								if((r[parent.property]==cValue) && (r[myRefIndex] == m[1])) inChk=true;
								return inChk;
								},false);
								if(showIt) return (<MenuItem value={m[0]}>{m[1]}</MenuItem>)
								else return

						});

						return menuItems;

					 }
					 else return;

			   }
			   else
		       {
				   return this.state.lookup.map(function(r){return (<MenuItem value={r[0]}>{r[1]}</MenuItem>)});
  		       }
		  }

			  getTip()
			  {
				  if(inField.toolTip) return (<MuiFormHelperText>{inField.toolTip}</MuiFormHelperText>)
				  return
			  }
			  getCaption()
			  {
				  //<MuiInputLabel htmlFor={"value-helper"+inField.formCell}>{lCaption}</MuiInputLabel>
				  if(lCaption) return (<MuiInputLabel>{lCaption}</MuiInputLabel>)
				  return
			  }
		  render() {
			return (
			  <div style={style}>
					<MuiFormControl style={panelStyle} error={this.state.errored} required={fieldStyle.required} disabled={rOnly}>
					  {this.getCaption()}
					  <MuiSelect
						value={this.state.value}
						open={this.state.open}
						onClose={this.handleClose}
						onOpen={this.handleOpen}
						onChange={this.handleChange}
						input={<MuiInput style={fieldStyle} name="value" id={"value-helper"+inField.formCell} readOnly={rOnly}/>}
					  >
						{this.getMenu()}
					  </MuiSelect>
					  {this.getTip()}
					</MuiFormControl>
			  </div>
			);
		  }
		}

		//before render....
		if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiSelectField,inFormKey,item, inField, inContainer);

		var controlReference = ReactDOM.render(<LocalMuiSelectField selectChildren={selectChildren}/>, inContainer);

		var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);

		ijf.main.controlSet[thisControl.id]=thisControl;
		//after render....
		if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	},
	renderRadio(inFormKey,item, inField, inContainer)
	{

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


		//get lookuips

			//two forms:  JIRA references or IJF references
			var combo = {};
			var lookup = [];
			var rawLookup = [];
			var selectParents = null;
			var selectChildren = null;
			var myRefIndex=null;
			switch (inField.dataReference)
			{
				case "ijfReference":

				   //The lookup may be simple 1D array or part of a complex cascade.  The syntax of co.reference tells

					var refCheck = 	ijf.fw.CustomTypes.reduce(function(inObj,t){if(t.name==inField.referenceFilter) inObj=t; return inObj;},null);

					if(refCheck)
					{
						rawLookup = ijfUtils.getReferenceDataByName(inField.referenceFilter,"0",true);
						myRefIndex=0;
						lookup = rawLookup.map(function(r){return [r[cLookupDef.index],r[cLookupDef.index]]});
					}
					else
					{
						//complex cascade...
						try
						{
							var cLookupDef = JSON.parse(inField.referenceFilter);
							myRefIndex=cLookupDef.index;
							rawLookup = ijfUtils.getReferenceDataByName(cLookupDef.name,cLookupDef.index,true);
							lookup = rawLookup.map(function(r){return [r[cLookupDef.index],r[cLookupDef.index]]});
							//establish a listener for this combo if necessary

						}
						catch(le)
						{
							ijfUtils.footLog("failed to handle complex lookup: " + le.message);
							lookups[col.columnName] = [];
						}
					}

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

					break;
		}


			var lMaxsize =  Number.MAX_VALUE;

			try
			{
				var style = JSON.parse(inField.style);
			}
			catch(e)
			{
				var style = {}
			}
			try
			{
				var panelStyle = JSON.parse(inField.panelStyle);
			}
			catch(e)
			{
				var panelStyle = {}
			}
			try
			{
				var fieldStyle = JSON.parse(inField.fieldStyle);
			}
			catch(e)
			{
				var fieldStyle = {}
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

			if (style.hidden)
			{
				hideLabel=true;
				hideField=true;
			}
			var rOnly = false;
			if (fieldStyle.readonly)
			{
				rOnly=true;
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

			if(hideField) style.visibility = "hidden";
			if(!lAllowBlank) fieldStyle.required = true;
			var ocf =  ijfUtils.getEvent(inField);

			var lValidator = function(v){
				if((fieldStyle.required) && ((v==null)||(v==""))) return false;
				return true
				};
			var lRegex =  inField.regEx;
			if((lRegex!=null) && (lRegex!=""))
			{
				lValidator = function(v)
				{
					var rgx = new RegExp(lRegex);
					if (!rgx.exec(v)) {
						return inField.regExMessage;
					}
					if((fieldStyle.required) && ((v==null)||(v==""))) return false;
					return true;
				}
			}



			class LocalMuiRadioField extends React.Component {

			  constructor(props) {
				super(props);
				this.state = {
				  value: data,
				  lookup: lookup,
				  errored: false
				};
			  }

			  handleChange = (event) => {
				//add OCF call here..
				if(inField.dataSource=="session")
				{
					ijf.session[inFormKey+'_fld_'+inField.formCell]=n;
				}
				else
				{
					ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
				}
				if(lValidator(event.target.value))
				{
					this.state.errored=false;
					ocf(event);
				}
				else this.state.errored=true;

				this.setState({ value: event.target.value });
			  };


			  clearValue = () => {
				this.setState({ value: null });
			  };

			  getMenu()
			  {
				  if(!this.state.lookup) return;
				  return this.state.lookup.map(function(r){return (<MuiFormControlLabel value={r[0]} control={<MuiRadio  color="primary" />} label={r[1]} />)});
			  }

			  getTip()
			  {
				  if(inField.toolTip) return (<MuiFormHelperText>{inField.toolTip}</MuiFormHelperText>)
				  return
			  }
			  getCaption()
			  {
				  //if(lCaption) return (<MuiInputLabel component="legend">{lCaption}</MuiInputLabel>)
				  if(lCaption) return (<MuiInputLabel>{lCaption}</MuiInputLabel>)
				  return
			  }


			  render() {
				return (
				  <div style={style}>
					<MuiFormControl style={panelStyle} component="fieldset" required={fieldStyle.required}>
					  {this.getCaption()}
					  <MuiRadioGroup style={fieldStyle}
						name={"radioGroup_name_"+inField.formCell}
						value={this.state.value}
						onChange={this.handleChange}
					  >
						{this.getMenu()}
					  </MuiRadioGroup>
					    {this.getTip()}
					</MuiFormControl>
				  </div>
				);
			  }
			}

			//before render....
			if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiRadioField,inFormKey,item, inField, inContainer);

			var controlReference = ReactDOM.render(<LocalMuiRadioField />, inContainer);

			var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);

			ijf.main.controlSet[thisControl.id]=thisControl;
			//after render....
			if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	},
	renderGrid:function(inFormKey,item, inField, inContainer)
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

			try
			{
				var style = JSON.parse(inField.style);
			}
			catch(e)
			{
				var style = {}
			}
			try
			{
				var panelStyle = JSON.parse(inField.panelStyle);
			}
			catch(e)
			{
				var panelStyle = {}
			}
			try
			{
				var fieldStyle = JSON.parse(inField.fieldStyle);
			}
			catch(e)
			{
				var fieldStyle = {}
			}


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
	if (!perms.canEdit)	rOnly=true;
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

	var features = null;
	if (l_fieldStyle.indexOf('sums:true')>-1)
	{
		features=[{
				ftype: 'summary'
				}];
	}


		var colWidths=[];
		var colHeaders = [];
		try
		{
			colHeaders = JSON.parse(inField.tableHeaders);

			colHeaders=colHeaders.reduce(function(inA,h){
				inA[h.column]=h;
				return inA;
			},[]);
		}
		catch(e)
		{
			colHeaders=[];
			if(inField.colHeaders)
			{
				var tempColWidths=inField.tableHeaders.split(",");
				var colInd = 0;
				tempColWidths.forEach(function(c){
					if(c) var w=c;
					else var w = "tbd";
					colWidths[colInd]={"caption":w,"cellStyle":null};
				})
			}
		}
		try
		{
			colWidths = JSON.parse(inField.tableWidths);
			colWidths=colWidths.reduce(function(inA,h){
				inA[h.column]=h;
				return inA;
			},[]);
		}
		catch(e)
		{
			colWidths=[];
			if(inField.tableWidths)
			{
				var tempColWidths=inField.tableWidths.split(",");
				var colInd = 0;
				tempColWidths.forEach(function(c){
					if(c) var w=c;
					else var w = "100px";
					colWidths[colInd]={"width":w,"cellStyle":null,"numeric":false,"rowStyle":null};
				});
			}
		}



	    //The grid setup....
	    var listColumns = [];
	    var tFields = [];
	    var lookups = [];

	    var gCols = JSON.parse(thisT.settings);
	    //order by order
	    gCols = gCols.sort(function(a,b){return (a.order-b.order);});
	    var cIndex = 0;
	    var lookups = [];
	    var colObj = {};
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
						if(col.format==null) col.format = 'm/d/Y';
						if(col.format=="") col.format = 'm/d/Y';
						return Ext.util.Format.dateRenderer(col.format)(val); //moment(val).format(col.format);
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

			var thisColHeader = col.columnName;
			if((colHeaders[cIndex]) && (colHeaders[cIndex].caption)) thisColHeader=colHeaders[cIndex].caption;

			switch(col.controlType)
			{
				case "datefield":
							if(col.format==null) col.format = 'm/d/Y';
							if(col.format=="") col.format = 'm/d/Y';
						colObj={
								header: thisColHeader,
								renderer: validRenderer,
								ijfColumn: col,
								headerObj: colHeaders[cIndex],
								widthObj: colWidths[cIndex],
								dataIndex: col.columnName,
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
				};
				break;
				case "numberfield":
						tFields.push({name: col.columnName, type: 'number'});
						colObj={
								header: thisColHeader,
								renderer: validRenderer,
								dataIndex: col.columnName,
								ijfColumn: col,
								headerObj: colHeaders[cIndex],
								widthObj: colWidths[cIndex],
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
				};
				break;
				case "checkbox":
					tFields.push({name: col.columnName, type: 'boolean'});
					colObj={
							header: thisColHeader,
							ijfColumn: col,
							headerObj: colHeaders[cIndex],
							widthObj: colWidths[cIndex],
							dataIndex: col.columnName,
							listeners: {
								checkchange: function(n,o,f)
								{
									ijf.main.controlChanged(inFormKey+'_fld_'+inField.formCell);
								}
							}
				};
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
						colObj={
								header: thisColHeader,
								ijfColumn: col,
								headerObj: colHeaders[cIndex],
								widthObj: colWidths[cIndex],
								dataIndex: col.columnName,
								renderer: validRenderer,
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
										listeners: cListener
									}
								}
				};
				break;
				default:
					tFields.push({name: col.columnName, type: 'string'});

					colObj={
							header: thisColHeader,
							ijfColumn: col,
							headerObj: colHeaders[cIndex],
							widthObj: colWidths[cIndex],
							dataIndex: col.columnName,
							renderer: validRenderer,
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
				};
			}
			listColumns.push(colObj);
			cIndex++;
		});



	    //thisT.settings...
	    if(data)
	    {
			try
			{
				var cts = JSON.parse(data);
				//cts = cts.map(function(r){ delete r.id; return r;});
				data=cts;
			}
			catch(e)
			{
				throw('Failed to parse the grid json');
			}
		}


/*	    var gridPanel = new Ext.grid.GridPanel({
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
	        id: inFormKey+'_ctr_'+inField.formCell.replace(/,/g,"_"),
	        //reserveScrollOffset: true,
	        columns: listColumns,
	        frame: true,
	        collapsible: collapsible,
	        collapsed: collapsed,
	        selModel: 'cellmodel',
	        disabled: rOnly,
	        features: features,
			plugins: ['gridfilters',{
				ptype: 'cellediting',
				clicksToEdit: 1
	        }]
	    });*/




		class LocalMuiTable extends React.Component {

		  constructor(props) {
			super(props);
		  }

		  getHeaders(){

			  return listColumns.map(function(h)
			  {
				if(h.headerObj)
				{
					var test=h.headerObj;

					return (<MuiTableCell style={h.headerObj.cellStyle}>{h["header"]}</MuiTableCell>);
				}
				else
				{
					return (<MuiTableCell>{h["header"]}</MuiTableCell>);
				}

			  });
		  };


		  getDataRows(){
				 return data.map(n => {

					return (
					  <MuiTableRow key={n.id}>
						{
						  listColumns.map(c => {

							var lNumeric = false;
							var lCellStyle = null;
							if(c.widthObj)
							{
								if (c.widthObj.numeric) lNumeric=c.widthObj.numeric;
								if (c.widthObj.cellStyle) lCellStyle=c.widthObj.cellStyle;
							}

							return(<MuiTableCell numeric={lNumeric} style={lCellStyle}>{n[c["dataIndex"]]}</MuiTableCell>);
							})
						}
					  </MuiTableRow>
					);
				  });
		  };

		  render() {
			if(style.paper)
			{
			    return (
				<MuiPaper>
				  <MuiTable style={style}>
					<MuiTableHead style={panelStyle}>
					  <MuiTableRow>
						{this.getHeaders()}
					  </MuiTableRow>
					</MuiTableHead>
					<MuiTableBody style={fieldStyle}>
					  {this.getDataRows()}
					</MuiTableBody>
				  </MuiTable>
				</MuiPaper>);
			}
			else
			{
				return (
				  <MuiTable style={style}>
					<MuiTableHead style={panelStyle}>
					  <MuiTableRow>
						{this.getHeaders()}
					  </MuiTableRow>
					</MuiTableHead>
					<MuiTableBody style={fieldStyle}>
					  {this.getDataRows()}
					</MuiTableBody>
				  </MuiTable>);
			}

		  }
		}


	    //before render....
	    if(ijf.snippets.hasOwnProperty(inField["beforeRender"])) ijf.snippets[inField["beforeRender"]](LocalMuiTable,inFormKey,item, inField, inContainer);

		var controlReference = ReactDOM.render(<LocalMuiTable />, inContainer);

	    var thisControl = new itemControl(inFormKey+'_fld_'+inField.formCell, inField, item, controlReference, inContainer);
	    ijf.main.controlSet[thisControl.id]=thisControl;
	    //after render....
	    if(ijf.snippets.hasOwnProperty(inField["afterRender"])) ijf.snippets[inField["afterRender"]](controlReference, inFormKey,item, inField, inContainer);
	}

}
