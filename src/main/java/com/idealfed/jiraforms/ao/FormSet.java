package com.idealfed.jiraforms.ao;

import java.util.Date;

import net.java.ao.Entity;
import net.java.ao.OneToMany;
import net.java.ao.Preload;
import net.java.ao.schema.StringLength;

@Preload
public interface FormSet extends Entity
{
	
	@OneToMany
    public Form[] getForms();   

	@OneToMany
    public Snippet[] getSnippets(); 
	
    String getName();
    void setName(String name);

    String getProjectId();
    void setProjectId(String projectId);

    String getProjectName();
    void setProjectName(String name);

    @StringLength(value=StringLength.UNLIMITED)
    String getSettings();
    void setSettings(String settings);

        //auditing
	Date getCreatedDate();
	void setCreatedDate(Date createdDate);
	
	String getCreatedBy();
	void setCreatedBy(String createdBy);

	Date getUpdatedDate();
	void setUpdatedDate(Date updatedDate);
	
	String getUpdatedBy();
	void setUpdatedBy(String updatedBy);
    
}
