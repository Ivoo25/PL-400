this.formOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.ui.setFormNotification("Hello from Ivo v6", "INFO", "IDUnique20230303");
    if (formContext.getAttribute("fax").getValue() == null) {
        formContext.getAttribute("fax").setValue("123456789");
        formContext.getControl("fax").addNotification({
            messages: ["Fax is empty, setting it to default"],
            notificationLevel: "RECOMMENDATION", //RECOMMENDATION, ERROR, if recommendation, then the user can ignore it, if error, then the user cannot save the record
            uniqueId: "IDUnique20230302-5"
            // actions: // this is optional, recommendations for the user
        })
    }; // if fax is empty
    // setFormNotification(message, level, uniqueId)
    // level: INFO, WARNING, ERROR
}

function ButtonPress(primaryControl){
    var formContext = primaryControl;
    Xrm.Navigation.openAlertDialog(
        {
            text: "Hello World",
            confirmButtonLabel: "Button Label confirmation",
            title: "Title of the dialog ".concat(formContext.getAttribute("name").getValue())
        }
        ).then(
            function(success){
                Xrm.Navigation.openConfirmDialog({
                    text: "you have succesfully clicked the button"
                })
            }
        );
        formContext.getControl("name").setLabel("name");
}