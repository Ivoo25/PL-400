this.formOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.ui.setFormNotification("Hello from Ivo v2", "INFO", "IDUnique20230302");
    if (formContext.getAttribute("fax").getValue() == null) {
        formContext.getAttribute("fax").setValue("123456789");
    } // if fax is empty
    // setFormNotification(message, level, uniqueId)
    // level: INFO, WARNING, ERROR
}