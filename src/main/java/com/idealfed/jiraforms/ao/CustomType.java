package com.idealfed.jiraforms.ao;

import java.util.Date;

import net.java.ao.Entity;

import net.java.ao.Preload;
import net.java.ao.schema.StringLength;

@Preload
public interface CustomType extends Entity
{

    String getName();
    void setName(String name);

    String getDescription();
    void setDescription(String description);

    String getFieldName();
    void setFieldName(String fieldName);

    String getCustomType();
    void setCustomType(String customType);


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
