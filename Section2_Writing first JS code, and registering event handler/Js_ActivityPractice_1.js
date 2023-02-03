this.ActivityPractice_1 = function (executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.ui.setFormNotification("Activity Number 1", "INFO", "IDUnique20230302");
    if (formContext.getAttribute("address1_country").getValue() == "España") {
        formContext.getControl("address1_composite_compositionLinkControl_address1_postalcode").setLabel("Postal Code");
    } else if (formContext.getAttribute("address1_country").getValue() == null) {
        formContext.getControl("address1_composite_compositionLinkControl_address1_postalcode").setLabel("Zip/ Postal code");
    } else {
        formContext.getControl("address1_composite_compositionLinkControl_address1_postalcode").setLabel("Zip code");
    }
}