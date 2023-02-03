this.formOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.ui.setFormNotification("Hello from Ivo v5", "INFO", "IDUnique20230302");
    if (formContext.getAttribute("fax").getValue() == null) {
        formContext.getAttribute("fax").setValue("123456789");
        formContext.getControl("fax").addNotification({
            messages: ["Fax is empty, setting it to default"],
            notificationLevel: "RECOMMENDATION", //RECOMMENDATION, ERROR, if recommendation, then the user can ignore it, if error, then the user cannot save the record
            uniqueId: "IDUnique20230302-2"
            // actions: // this is optional, recommendations for the user
        })
    }; // if fax is empty
    // setFormNotification(message, level, uniqueId)
    // level: INFO, WARNING, ERROR
}

//If loaded correctly, you should see the recommendation as a lightbulb icon in the selected field

this.addressStreet3Hide = function (executionContext) {
    var formContext = executionContext.getFormContext();
    if(formContext.getAttribute("address1_line2").getValue() == null) {
        formContext.getControl("address1_composite_compositionLinkControl_address1_line3").setVisible(false);
    } else {
        formContext.getControl("address1_composite_compositionLinkControl_address1_line3").setVisible(true);
    } //hide the address line 3, since its a multiline text, I cant access just by using its logical name, I need the main control name as well, address1_composite_compositionLinkControl_....
}