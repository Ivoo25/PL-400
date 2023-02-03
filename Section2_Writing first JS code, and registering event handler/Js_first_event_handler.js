this.formOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.getAttribute("name").addOnChange(myFunction);
}