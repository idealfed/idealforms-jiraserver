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
	 renderCardList:function(inFormKey,item, inField, inContainer)
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
						    return (<MuiButton  onClick={() => ijf.snippets[r.snippet]()} color={r.color} variant={r.variant} disabled={r.disabled} size={r.size} style={r.style}>{lThis.getIcon(r)}{r.label}</MuiButton>);
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
										title={<Typography variant="headline" component="h2">
													<DynamicHtml htmlContent={this.state.title} dataRow={this.state.row} />
												</Typography>}
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


			class MuiDrawer extends React.Component {
			  state = {
				top: false,
				left: false,
				bottom: false,
				right: false,
			  };

			  toggleDrawer = (side, open) => () => {
				this.setState({
				  [side]: open,
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
					<Icon style={buttonStyle} onClick={this.toggleDrawer(fieldSettings.direction, true)}>{fieldSettings.icon}</Icon>
					<Drawer anchor={fieldSettings.direction} open={this.state[fieldSettings.direction]} onClose={this.toggleDrawer(fieldSettings.direction, false)}>
					  <div
						tabIndex={0}
						role="button"
						onClick={this.toggleDrawer(fieldSettings.direction, false)}
						onKeyDown={this.toggleDrawer(fieldSettings.direction, false)}
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
	}


}
