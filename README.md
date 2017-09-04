# jFormsFull
JIRA Custom Forms
Ideal Federal LLC
paul.malone@idealfed.com


This repository contains an Atlassian JIRA plugin that implements EXTJS 6 GPL for use within the JIRA system.


Please see the ideal forms site for details:  http://wwww.idealforms.com


The plugin runs as a servlet on the JIRA Tomcat instance and the plugin uses the JIRA API for its interaction.

Forms configuration and management works similarly to Microsoft Access "Forms".  The concept is the JIRA Project becomes the datastore and data model and one uses the EXTJS forms to create custom user interfaces.

Using this package you can effectively customize most any workflow automation.


Additional plugins that enhance this one are:

SQL to JQL BIRT - this allows you to create and run BIRT reports within JIRA

GoEdit - this allows you to use click to edit on attachments


Go Edit works with Ideal Forms in that the "managed attachment" control includes an edit option.


We continue to work on documentation for the plugin.  Please feel free to contact Ideal Federal LLC with questions.



#Installation

To use please install from the Atlassian Marketplace from within your JIRA system.

To compile and alter or branch:  You need to set up an Atlassian development environment with the Atlassian SDK.  This is not hard and once done you should be able to:  "atlas-package" this project.

(Self compiled and installed implementations are not supported by Ideal Federal LLC.)





