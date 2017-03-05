package com.idealfed.poc.craft;
import static com.google.common.base.Preconditions.checkNotNull;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.util.Date;
import java.util.Map;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.atlassian.activeobjects.external.ActiveObjects;
import com.atlassian.jira.util.json.JSONArray;
import com.atlassian.jira.util.json.JSONException;
import com.atlassian.jira.util.json.JSONObject;
import com.atlassian.jira.util.json.JSONEscaper;
import com.atlassian.sal.api.auth.LoginUriProvider;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.templaterenderer.TemplateRenderer;
import com.google.common.collect.Maps;
import com.idealfed.jiraforms.ao.*;

import net.java.ao.Query;

public class Craft extends HttpServlet
{
	private final UserManager userManager;
	private final LoginUriProvider loginUriProvider;
	private final TemplateRenderer templateRenderer;
	private final PluginSettingsFactory pluginSettingsFactory;
    private static final Logger plog = LogManager.getLogger("atlassian.plugin");

    private final ActiveObjects ao;

	public Craft(ActiveObjects ao, UserManager userManager, LoginUriProvider loginUriProvider, TemplateRenderer templateRenderer, PluginSettingsFactory pluginSettingsFactory) {
		this.userManager = userManager;
		this.loginUriProvider = loginUriProvider;
		this.templateRenderer = templateRenderer;
		this.pluginSettingsFactory = pluginSettingsFactory;
		this.ao = checkNotNull(ao);
	}

	@Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
    	String username = userManager.getRemoteUsername(request);
    	if (username == null)
    	{
    		redirectToLogin(request, response);
    		return;
    	}    	
    	
    	String iwfAction = request.getParameter("ijfAction");
    	if(iwfAction==null) iwfAction="noAction";

    	String itemId = request.getParameter("itemId");
    	if(itemId==null) itemId="";
    	String formId = request.getParameter("formId");
    	if(formId==null) formId="";
    	String craftFlag = request.getParameter("craft");
    	if(craftFlag==null) craftFlag="";
    	String debugFlag = request.getParameter("debug");
    	if(debugFlag==null) debugFlag="";
    	String decorator = request.getParameter("decorator");
    	if(decorator==null) decorator="";    	
    	String gVersionNum = request.getParameter("version");
    	if(gVersionNum==null) gVersionNum="0";

    	if ((craftFlag.equals("true")) && (!userManager.isSystemAdmin(username)))
    	{    		
    		templateRenderer.render("nopermission.vm", null, response.getWriter());
    		return;
    	}    	
    	String outTemplate = "main.vm";
    	if (craftFlag.equals("true"))
    	{    	
    		outTemplate="craft.vm";
    	} 
    	if (decorator.equals("true"))
    	{    	
    		outTemplate="main_general.vm";
    	} 
    	

    	if(iwfAction.equals("getConfig"))
    	{
    		//pull the config from AO and return...
    		if(gVersionNum.equals("0"))
    		{
	    		final PrintWriter w = response.getWriter();
	    		w.printf("{\"status\":\"OK\",\"resultSet\":[");
	    		for (FormSet fs : ao.find(FormSet.class))
	            {
	                w.printf(getAoFormSetJson(fs));
	            }
	    		w.printf("{}]}");
	    		w.close();
	    		return;
    		}
    		else
    		{
    			//pull the called version
    			int vId = new Integer(gVersionNum).intValue();
    				//formSet must exist by ID and we need it....
    				//OK, now get the object by ID
    			Version v = ao.get(Version.class, vId);
            	final PrintWriter w = response.getWriter();
            	w.printf(v.getConfig());
        		w.close();
        		return;

    		}
    	}
    	else if(iwfAction.equals("getVersions"))
    	{
    		//pull the config from AO and return...
    		final PrintWriter w = response.getWriter();
    		w.printf("{\"status\":\"OK\",\"resultSet\":[");
    		for (Version v : ao.find(Version.class))
            {
                w.printf("{\"id\":\""+v.getID()+"\",\"created\":\""+v.getDate()+"\",\"author\":\""+v.getAuthor()+"\"},");
            }
    		w.printf("{}]}");
    		w.close();
    		return;
    	}
    	else if(iwfAction.equals("getVersion"))
    	{
        	String versionId = request.getParameter("versionId");
			int vId = new Integer(versionId).intValue();
				//formSet must exist by ID and we need it....
				//OK, now get the object by ID
			Version v = ao.get(Version.class, vId);
        	final PrintWriter w = response.getWriter();
        	w.printf(v.getConfig());
    		w.close();
    		return;

    	}
    	else if(iwfAction.equals("clearConfig"))
    	{
    		for (FormSet fs : ao.find(FormSet.class))
            {
    			for(Form f : fs.getForms())
    			{
    				ao.delete(f);
    			}
    			for(Snippet s : fs.getSnippets())
    			{
    				ao.delete(s);
    			}
                ao.delete(fs);
            }
    	}
    	else
    	{
        	Map<String, Object> craft = Maps.newHashMap();
        	craft.put("ijfUsername",username);
        	craft.put("ijfExercise", "123");
        	craft.put("ijfVersion", "IJF Version 0.1");
        	craft.put("ijfFormId", formId);
        	craft.put("ijfItemId", itemId);
        	craft.put("ijfDebug", debugFlag);
        	craft.put("ijfCraft", craftFlag);
        	craft.put("ijfRoot", "http://idealfedsurface:2990/jira");

        	response.setContentType("text/html;charset=utf-8");

        	String snippets = "";
        	String styles = "";
        	String snippetPub = "";
        	if((!formId.equals("")) && (craftFlag.equals("")))
        	{
        		//we need to get the form -> formSet and render the javascript snippets it contains...
        		FormSet fs = null;
        		for (Form f : ao.find(Form.class))
                {
                    if(f.getName().equals(formId)) fs = f.getFormSet();
                }
        		if(fs != null)
        		{
        			try
        			{
	        			JSONObject sObject;
	        			StringBuilder snips = new StringBuilder();
	        			StringBuilder styls = new StringBuilder();
	        			StringBuilder sOut = new StringBuilder();
	        			for (Snippet s : fs.getSnippets())
	        			{
	        				if(s.getName().equals("style"))
	        				{
	        					String outStyle = "{\"snippet\":" + s.getSnippet() + "}";

	        					sObject = new JSONObject(outStyle);
	        					outStyle = sObject.getString("snippet");
	        					outStyle=outStyle.replace("~pct~", "%");
	        					styls.append(outStyle);
	        				}
	        				else
	        				{
	        					sOut.append("," + s.getName() + ":" + s.getName());

	        					String outSnip = "{\"snippet\":" + s.getSnippet() + "}";
	        					sObject = new JSONObject(outSnip);
	        					outSnip = sObject.getString("snippet");
	        					outSnip=outSnip.replace("~pct~", "%");
	        					snips.append(outSnip);
	        				}
	        			}
	        			snippets = snips.toString();
	        			styles = styls.toString();
	        			snippetPub = sOut.toString();
        			}
        			catch(JSONException e)
        			{
        				snippets = "//Failed to gen snippets: " + e.getMessage();
            			styles = "";
            			snippetPub = "";
        			}
        		}
        	}
         	craft.put("ijfSnippetPub", snippetPub);
        	craft.put("ijfScript", snippets);
        	craft.put("ijfStyle", styles);

        	templateRenderer.render(outTemplate, craft, response.getWriter());
    	}

    }

	private String getAoFormSetJson(FormSet fs)
	{
		StringBuilder sb = new StringBuilder();
		sb.append("{\"id\":\"" + fs.getID() + "\",");
		sb.append("\"name\":\"" + fs.getName() + "\",");
		sb.append("\"projectName\":\"" + fs.getProjectName() + "\",");
		sb.append("\"projectId\":\"" + fs.getProjectId() + "\",");
		sb.append("\"settings\":\"" + fs.getSettings() + "\",");
		sb.append("\"forms\":[");
        for (Form f : fs.getForms()) // (2)
        {
        	 sb.append(getAoFormJson(f));
        }
		sb.append("{}],");

		sb.append("\"snippets\":[");
        for (Snippet s : fs.getSnippets()) // (2)
        {
        	 sb.append(getAoSnippetJson(s));
        }
		sb.append("{}]},");

		return sb.toString();
	}
	private String getAoFormJson(Form f)
	{
		if(f.getTestIssue().equals("")) f.setTestIssue("~");
		StringBuilder sb = new StringBuilder();
		sb.append("{\"id\":\"" + f.getID() + "\",");
		sb.append("\"name\":\"" + f.getName() + "\",");
		sb.append("\"testIssue\":\"" + f.getTestIssue() + "\",");
		sb.append("\"formType\":\"" + f.getFormType() + "\",");
		sb.append("\"settings\":\"" + f.getSettings() + "\",");
		sb.append("\"fields\":\"" + f.getFields() + "\"},");
		return sb.toString();
	}
	private String getAoSnippetJson(Snippet s)
	{
	  try
	  {
		if(s.getName().equals("")) s.setName("~");
		if(s.getSnippet().equals("")) s.setSnippet("~");
		StringBuilder sb = new StringBuilder();
		sb.append("{\"id\":\"" + s.getID() + "\",");
		sb.append("\"name\":\"" + s.getName() + "\",");
		sb.append("\"snippet\":\"" + s.getSnippet() + "\"},");
		return sb.toString();
	  }
	  catch(Exception e)
	  {
		  plog.error("Failed to get snippet: " + e.getMessage());
		  return "{}";
	  }
	}

    private void cleanVersions(int keepNum)
    {
    	int ctr=0;
		for (Version v : ao.find(Version.class, Query.select().order("id DESC")))
        {
			ctr++;
			if(ctr > keepNum)
			{
				ao.delete(v);
			}
        }

    }


	@Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
    {
		String iwfAction = req.getParameter("action");
		String inJson = req.getParameter("jsonConfig");
		if(iwfAction==null) iwfAction="noAction";

    	if(iwfAction.equals("saveFormBasic"))
    	{

    		//formset exists.  And, form exists...so, use the get by ID and update the values....
    		try
    		{
	    		JSONObject inForm = new JSONObject(inJson);
	    		//JSONObject formSettings = inForm.getJSONObject("settings");
	    		//JSONObject formFields = inForm.getJSONObject("fields");
	    		FormSet fs = ao.get(FormSet.class, new Integer(inForm.getString("formSetId")).intValue());
				if(fs==null) throw new JSONException("Failed to get formset");
				//this may be a new add or a save...if Form ID == 0 it's a new add, look for that first...
				Form f;
				int formId = new Integer(inForm.getString("formId")).intValue();
				if(formId==0)
				{
					//formSet must exist by ID and we need it....
					//OK, now get the object by ID
					f = ao.create(Form.class);
		        	f.setFormSet(fs);
				}
				else
				{
					//OK, now get the object by ID
					f = ao.get(Form.class, formId);
					f.setFormSet(fs);
				}

	    		f.setName(inForm.getString("formName"));
        		f.setTestIssue(inForm.getString("testIssue"));
        		f.setFormType(inForm.getString("formType"));
	    		f.save();

	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save forms config" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"FAIL\",message:\""+e.getMessage()+"\"}");
	    		w.close();
	    		return;
    		}
    	}
    	else if(iwfAction.equals("saveFormConfig"))
    	{

			//backup the existing configuration first
			StringBuffer cConfig = new StringBuffer();
			cConfig.append("{\"status\":\"OK\",\"resultSet\":[");
    		for (FormSet fs : ao.find(FormSet.class))
            {
    			cConfig.append(getAoFormSetJson(fs));
            }
    		cConfig.append("{}]}");
    		Version v = ao.create(Version.class);
    		v.setDate(new Date());
    		v.setAuthor(userManager.getRemoteUsername(req));
    		v.setConfig(cConfig.toString());
    		v.save();
    		cleanVersions(20);

    		//formset exists.  And, form exists...so, use the get by ID and update the values....
    		try
    		{
	    		JSONObject inForm = new JSONObject(inJson);
	    		//JSONObject formSettings = inForm.getJSONObject("settings");
	    		//JSONObject formFields = inForm.getJSONObject("fields");

				//this may be a new add or a save...if Form ID == 0 it's a new add, look for that first...
				Form f;
				int formId = new Integer(inForm.getString("formId")).intValue();
				if(formId==0)
				{
					//formSet must exist by ID and we need it....
					//OK, now get the object by ID
					FormSet fs = ao.get(FormSet.class, new Integer(inForm.getString("formSetId")).intValue());
					if(fs==null) throw new JSONException("Failed to get formset");
					f = ao.create(Form.class);
		        	f.setFormSet(fs);
				}
				else
				{
					//OK, now get the object by ID
					f = ao.get(Form.class, formId);
				}

	    		f.setName(inForm.getString("formName"));
        		f.setTestIssue(inForm.getString("testIssue"));
        		f.setFormType(inForm.getString("formType"));
	    		f.setSettings(inForm.getString("formSettings"));
	    		f.setFields(inForm.getString("fields"));
	    		f.save();
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save forms config" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"FAIL\",message:\""+e.getMessage()+"\"}");
	    		w.close();
	    		return;
    		}
    	}
    	else if(iwfAction.equals("deleteFormConfig"))
    	{
    		//formset exists.  And, form exists...so, use the get by ID and update the values....
    		try
    		{
	    		JSONObject inForm = new JSONObject(inJson);
				Form f;
				int formId = new Integer(inForm.getString("formId")).intValue();

					//OK, now get the object by ID
				f = ao.get(Form.class, formId);
				ao.delete(f);

	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save forms config" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"FAIL\",message:\""+e.getMessage()+"\"}");
	    		w.close();
	    		return;
    		}
    	}
    	else if(iwfAction.equals("saveFormSet"))
    	{
    		//formset exists.  And, form exists...so, use the get by ID and update the values....
    		try
    		{
	    		JSONObject inForm = new JSONObject(inJson);

	    		FormSet f=null;
				int fsId = new Integer(inForm.getString("formSetId")).intValue();
				if(fsId==0)
				{
					//formSet must exist by ID and we need it....
					//OK, now get the object by ID
					f = ao.create(FormSet.class);
				}
				else
				{
					//OK, now get the object by ID
					f = ao.get(FormSet.class, fsId);
				}
	    		f.setName(inForm.getString("name"));
        		f.setProjectId(inForm.getString("projectId"));
        		f.setProjectName(inForm.getString("projectName"));
	    		f.setSettings(inForm.getString("settings"));
	    		f.save();
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save form set config" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"FAIL\",message:\""+e.getMessage()+"\"}");
	    		w.close();
	    		return;
    		}
    	}
    	else if(iwfAction.equals("deleteFormSet"))
    	{
    		//formset exists.  And, form exists...so, use the get by ID and update the values....
    		try
    		{
	    		JSONObject inForm = new JSONObject(inJson);

	    		FormSet f=null;
				int fsId = new Integer(inForm.getString("formSetId")).intValue();

				f = ao.get(FormSet.class, fsId);
		        for (Snippet s : f.getSnippets())
		        {
		        	 ao.delete(s);
		        }
				ao.delete(f);

	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save form set config" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"FAIL\",message:\""+e.getMessage()+"\"}");
	    		w.close();
	    		return;
    		}
    	}
    	else if(iwfAction.equals("saveSnippet"))
    	{
    		//formset exists.  And, form exists...so, use the get by ID and update the values....
    		try
    		{
	    		JSONObject inForm = new JSONObject(inJson);

				Snippet s;
				int snippetId = new Integer(inForm.getString("snippetId")).intValue();
				if(snippetId==0)
				{
					//formSet must exist by ID and we need it....
					//OK, now get the object by ID
					FormSet fs = ao.get(FormSet.class, new Integer(inForm.getString("formSetId")).intValue());
					if(fs==null) throw new JSONException("Failed to get formset");
					s = ao.create(Snippet.class);
		        	s.setFormSet(fs);
				}
				else
				{
					//OK, now get the object by ID
					s = ao.get(Snippet.class, snippetId);
				}

	    		s.setName(inForm.getString("name"));
        		s.setSnippet(inForm.getString("snippet"));
	    		s.save();
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\",\"result\":\""+s.getID()+"\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save forms config" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"FAIL\",message:\""+e.getMessage()+"\"}");
	    		w.close();
	    		return;
    		}
    	}
    	else if(iwfAction.equals("deleteSnippet"))
    	{
    		//formset exists.  And, form exists...so, use the get by ID and update the values....
    		try
    		{
	    		JSONObject inForm = new JSONObject(inJson);
				Snippet s;
				int snippetId = new Integer(inForm.getString("snippetId")).intValue();

					//OK, now get the object by ID
				s = ao.get(Snippet.class, snippetId);
				ao.delete(s);

	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save forms config" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"FAIL\",message:\""+e.getMessage()+"\"}");
	    		w.close();
	    		return;
    		}
    	}
    	else if(iwfAction.equals("setConfig"))
    	{
    		try
    		{

    			//backup the existing configuration first
    			StringBuffer cConfig = new StringBuffer();
    			cConfig.append("{\"status\":\"OK\",\"resultSet\":[");
        		for (FormSet fs : ao.find(FormSet.class))
                {
        			cConfig.append(getAoFormSetJson(fs));
                }
        		cConfig.append("{}]}");
        		Version v = ao.create(Version.class);
        		v.setDate(new Date());
        		v.setAuthor(userManager.getRemoteUsername(req));
        		v.setConfig(cConfig.toString());
        		v.save();
        		cleanVersions(20);

        		///todo:  add clear function to remove versions > some count...

    			//clear current configuration
    			boolean loaded = false;
        		for (FormSet fs : ao.find(FormSet.class))
                {
        			for(Form f : fs.getForms())
        			{
        				ao.delete(f);
        			}
        			for(Snippet s : fs.getSnippets())
        			{
        				ao.delete(s);
        			}
                    ao.delete(fs);
                }

	    		JSONObject jo = new JSONObject(inJson);
	    		JSONArray rs = jo.getJSONArray("ijfConfig");
	    		JSONObject jsonFs;
	    		JSONArray jsonForms;
	    		JSONObject jsonForm;
	    		JSONObject jsonSnippet;
	    		for(int i = 0; i<rs.length();i++)
	    		{
	    			jsonFs = rs.getJSONObject(i);
	    			//this is one form set...
	        		if(!jsonFs.has("name")) break;
	        		final FormSet fs  = ao.create(FormSet.class);
	        		fs.setName(jsonFs.getString("name"));
	        		fs.setSettings(jsonFs.getString("settings"));
	        		fs.setProjectName(jsonFs.getString("projectName"));
	        		fs.setProjectId(jsonFs.getString("projectId"));
	        		fs.save();

		    		jsonForms = jsonFs.getJSONArray("forms");
		    		for(int k = 0; k<jsonForms.length();k++)
		    		{
		    			jsonForm = jsonForms.getJSONObject(k);
		    			if(!jsonForm.has("name")) break;
		        		Form frm = ao.create(Form.class);
		        		frm.setFormSet(fs);
		        		frm.setName(jsonForm.getString("name"));
		        		frm.setTestIssue(jsonForm.getString("testIssue"));
		        		frm.setFormType(jsonForm.getString("formType"));
		        		frm.setFields(jsonForm.getString("fields"));
		        		frm.setSettings(jsonForm.getString("formSettings"));
		        		frm.save();
		    		}

		    		jsonForms = jsonFs.getJSONArray("snippets");
		    		for(int k = 0; k<jsonForms.length();k++)
		    		{
		    			jsonSnippet = jsonForms.getJSONObject(k);
		    			if(!jsonSnippet.has("name")) break;
		    			Snippet s = ao.create(Snippet.class);
		    			s.setFormSet(fs);
		    			s.setName(jsonSnippet.getString("name"));
		    			s.setSnippet(jsonSnippet.getString("snippet"));
		        		s.save();
		    		}
	    		}

	    		final PrintWriter w = res.getWriter();
	    		w.printf("{\"status\":\"OK\"}");
	    		w.close();
	    		return;

    		}
    		catch(JSONException e)
    		{
    			//failed json read
    			plog.error("Failed to save forms config see error" + e.getMessage());
	    		final PrintWriter w = res.getWriter();
	    		w.printf("{status:\"FAIL\"}");
	    		w.close();
	    		return;

    		}
    	}
    	else
    	{

    		final PrintWriter w = res.getWriter();
    		w.printf("{status:\"NA\"}");
    		w.close();
    		return;

    	}


    }

	private void redirectToLogin(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.sendRedirect(loginUriProvider.getLoginUri(getUri(request)).toASCIIString());
	}
	private URI getUri(HttpServletRequest request)
	{
		StringBuffer builder = request.getRequestURL();
		if (request.getQueryString() != null)
		{
			builder.append("?");
			builder.append(request.getQueryString());
		}
		return URI.create(builder.toString());
	}

	// This is what your MyPluginServlet.java should look like in its final stages.

}