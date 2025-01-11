package com.idealfed.jiraforms.ao;

import java.util.Date;

import net.java.ao.Entity;
import net.java.ao.Preload;
import net.java.ao.schema.StringLength;

@Preload
public interface Snippet extends Entity
{

	public FormSet getFormSet();
    public void setFormSet(FormSet formSet);
	
    String getName();
    void setName(String name);

    @StringLength(value=StringLength.UNLIMITED)
    String getSnippet();
    void setSnippet(String snippet);      

    String getComment();
    void setComment(String comment);     
    
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
