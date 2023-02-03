this.formOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.ui.setFormNotification("Hello from Ivo v3", "INFO", "IDUnique20230302");
    if (formContext.getAttribute("fax").getValue() == null) {
        formContext.getAttribute("fax").setValue("123456789");
        formContext.getControl("fax").addNotification({
            messages: ["Fax is empty, setting it to default"],
            notificationLevel: "RECOMMENDATION", //RECOMMENDATION, ERROR, if recommendation, then the user can ignore it, if error, then the user cannot save the record
            uniqueId: "IDUnique20230302-2"
            // actions: // this is optional, recommendations for the user
        })
    } // if fax is empty
    // setFormNotification(message, level, uniqueId)
    // level: INFO, WARNING, ERROR
   /* if (formContext.getAttribute("telephone1").getValue() == null) {
        formContext.getControl("telephone1").addNotification({
            messages: ["telephone cannot be empty!"],
            notificationLevel: "ERROR", //RECOMMENDATION, ERROR, if recommendation, then the user can ignore it, if error, then the user cannot save the record
            uniqueId: "IDUnique20230302-3"
            // actions: // this is optional, recommendations for the user
        })
    }*/
}

//If loaded correctly, you should see the recommendation as a lightbulb icon in the selected field