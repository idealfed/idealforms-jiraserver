package com.idealfed.api.rest;

import com.atlassian.jira.bc.user.search.UserSearchService;
import com.atlassian.jira.issue.IssueManager;
import com.atlassian.jira.security.PermissionManager;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.jira.util.json.JSONArray;
import com.atlassian.jira.util.json.JSONObject;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.jira.security.groups.GroupManager;
import com.atlassian.jira.bc.user.search.UserSearchService;
import com.atlassian.jira.bc.user.search.UserSearchParams;
import com.google.gson.JsonArray;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;

@Path("/idm")
@Named
public class IdmEmulator {
    @Context
    private HttpServletRequest request;

    @ComponentImport
    private final UserSearchService userSearchService;

    @ComponentImport
    private final UserManager userManager;

    @ComponentImport
    private final GroupManager groupManager;

    @ComponentImport
    private final PermissionManager permissionManager;

    @ComponentImport
    private final IssueManager issueManager;

    @ComponentImport
    private final UserUtil userUtil;

    @ComponentImport
    private final PluginSettingsFactory pluginSettingsFactory;

    @Inject
    public IdmEmulator(UserSearchService userSearchService, GroupManager groupManager, PermissionManager permissionManager, UserManager userManager, IssueManager issueManager, UserUtil userUtil, PluginSettingsFactory pluginSettingsFactory) {
        this.userSearchService = userSearchService;
        this.groupManager = groupManager;
        this.userManager = userManager;
        this.permissionManager = permissionManager;
        this.issueManager = issueManager;
        this.userUtil = userUtil;
        this.pluginSettingsFactory = pluginSettingsFactory;
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("/getTicket")
    public Response getTicket() {
        try {
            UUID uuid = UUID.randomUUID();
            Ticket t = new Ticket(uuid.toString());
            return Response.ok(t).build();
        }
        catch(Exception e)
        {
            return Response.ok(e).build();
        }
    }
//async def read_item(startIndex: int=0,numItems: int=1000, sortOrder: str="name", ascOrder: str="true", ticket:str="xyz",
//userId: str="", firstName: str="", firstNameStartsWith: str="", lastName: str="", lastNameStartsWith: str="", email: str="",
// emailStartsWith: str="", agencyCode: str="", bureauCode: str="",groupId: str="", showInactive: str="false")


    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("/user/search/restricted")
    public Response doSearch(@QueryParam("startIndex") @DefaultValue("0") int startIndex,
                                @QueryParam("numItems") @DefaultValue("1000") int numItems,
                                @QueryParam("sortOrder") @DefaultValue("name") String sortOrder,
                                @QueryParam("ascOrder") @DefaultValue("true") String ascOrder,
                                @QueryParam("ticket") @DefaultValue("xyz") String ticket,
                                @QueryParam("userId") @DefaultValue("") String userId,
                                @QueryParam("firstName") @DefaultValue("") String firstName,
                                @QueryParam("firstNameStartsWith") @DefaultValue("") String firstNameStartsWith,
                                @QueryParam("lastName") @DefaultValue("") String lastName,
                                @QueryParam("lastNameStartsWith") @DefaultValue("") String lastNameStartsWith,
                                @QueryParam("email") @DefaultValue("") String email,
                                @QueryParam("emailStartsWith") @DefaultValue("") String emailStartsWith,
                                @QueryParam("agencyCode") @DefaultValue("") String agencyCode,
                                @QueryParam("bureauCode") @DefaultValue("") String bureauCode,
                                @QueryParam("groupId") @DefaultValue("") String groupId,
                                @QueryParam("showInactive") @DefaultValue("false") String showInactive) {
        try {
            Results r = new Results();
            String querySuffix="";
            String lEmail=email;
            String lEmailStartsWith=emailStartsWith;
            String lLastName=lastName;
            String lLastNameStartsWith=lastNameStartsWith;

            if (lEmailStartsWith.length() == 0) lEmailStartsWith=lEmail;
            if (lLastNameStartsWith.length() == 0) lLastNameStartsWith = lLastName;


            JSONObject ju = null;
            JSONArray ja = new JSONArray();
            ju = new JSONObject();
            ju.put("groupId", groupId);
            ju.put("lLastName",lLastName);
            ju.put("lLastNameStartsWith",lLastNameStartsWith);
            ju.put("lEmail",lEmail);
            ju.put("lEmailStartsWith",lEmailStartsWith);
            //ja.put(ju);

            if(groupId.length()<3)
            {
                UserSearchParams userSearchParams = new UserSearchParams(true, true,false);
                List<ApplicationUser> userResults = userSearchService.findUsers(lLastNameStartsWith,lEmailStartsWith,userSearchParams);
                Iterator<ApplicationUser> it = userResults.iterator();
                while(it.hasNext())
                {
                    ApplicationUser u = it.next();
                    ju = new JSONObject();
                    ju.put("name", u.getName());
                    ju.put("email",u.getEmailAddress());
                    ju.put("displayName",u.getDisplayName());
                    ju.put("key",u.getKey());
                    ju.put("username",u.getUsername());
                    ja.put(ju);
                }
            }
            else
            {
                if(groupManager.groupExists(groupId)==true) {
                    Collection<ApplicationUser> groupUsers = groupManager.getUsersInGroup(groupId, false);
                    Iterator<ApplicationUser> it = groupUsers.iterator();
                    while(it.hasNext())
                    {
                        ApplicationUser u = it.next();
                        ju = new JSONObject();
                        ju.put("name", u.getName());
                        ju.put("email",u.getEmailAddress());
                        ju.put("displayName",u.getDisplayName());
                        ju.put("key",u.getKey());
                        ju.put("username",u.getUsername());
                        ja.put(ju);
                    }
                }
            }

            ju = new JSONObject();
            JSONObject maxUserList = new JSONObject();
            maxUserList.put("maxUserList",ja);
            ju.put("results",maxUserList);
            r.setResults(ju.toString());
            return Response.ok(r).build();
        }
        catch(Exception e)
        {
            return Response.ok(e).build();
        }
    }


}