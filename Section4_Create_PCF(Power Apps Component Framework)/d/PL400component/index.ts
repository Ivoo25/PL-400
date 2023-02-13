import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class PL400component
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private myNotifyOutputChanged: () => void;
  private myMainDiv: HTMLDivElement;
  private myTextBox: HTMLTextAreaElement;
  private myIsUpperCaseOnly: boolean;
  private myLabel: HTMLLabelElement;
  private myButton: HTMLButtonElement;
  // eslint-disable-next-line no-undef
  private myButtonHandler: EventListener;
  // eslint-disable-next-line no-undef
  private myTextBoxHandler: EventListener;

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    // Add control initialization code
    this.myNotifyOutputChanged = notifyOutputChanged;
    this.myMainDiv = document.createElement("div");

    // This creates mytextbox as a textarea element, which is a type of HTML element
    this.myTextBox = document.createElement("textarea");
    this.myTextBox.value = context.parameters.textValue.raw || ""; // Set the value of the textbox to the value of the textValue parameter, or an empty string if it is null
    this.myMainDiv.appendChild(this.myTextBox); // Add the textbox to the main div, appendchild is a method of the HTMLDivElement class that adds a child element to the div
    this.myButtonHandler = this.myTextBoxHasChanged.bind(this); // Bind the function to the current instance of the class
    this.myTextBox.addEventListener("input", this.myTextBoxHandler); // Add an event listener to the textbox

    //This creates label
    this.myLabel = document.createElement("label");
    this.myMainDiv.appendChild(this.myLabel);
    //this.myIsUpperCaseOnly = context.parameters.isUpperCaseOnly.raw || false; // Set the value of the textbox to the value of the textValue parameter, or an empty string if it is null

    //This creates a button
    this.myButton = document.createElement("button");
    this.myButton.textContent = "Click me!";
    this.myButtonHandler = this.myButtonClicked.bind(this); // Bind the function to the current instance of the class
    this.myButton.addEventListener("click", this.myButtonHandler); // Add an event listener to the button
    this.myMainDiv.appendChild(this.myButton); // Add the button to the main div

    container.appendChild(this.myMainDiv); // Add the main div to the container
  }

  public myTextBoxHasChanged() {
    this.myNotifyOutputChanged(); // Notify the framework that the control has new outputs ready to be retrieved
  }

  /**
   * myButtonClicked is called when the button is clickedButtonClicked
   */
  public myButtonClicked() {
    //this.myTextBox.value = "You clicked!";
    this.myIsUpperCaseOnly = !this.myIsUpperCaseOnly; // Toggle the value of the isUpperCaseOnly variable
    if (this.myIsUpperCaseOnly) {
        this.myLabel.innerText = "UPPER CASE ONLY";
        this.myTextBox.value = this.myTextBox.value.toUpperCase(); // Convert the value of the textbox to upper case
      } else if (!this.myIsUpperCaseOnly) {
        this.myLabel.innerText = "Upper/ lower case";
        this.myTextBox.value = this.myTextBox.value.toLowerCase(); // Convert the value of the textbox to lower case
      }
    this.myNotifyOutputChanged(); // Notify the framework that the control has new outputs ready to be retrieved
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view
    // Update values
    this.myTextBox.value = context.parameters.textValue.raw || ""; // Set the value of the textbox to the value of the textValue parameter, or an empty string if it is null
   // this.myIsUpperCaseOnly = context.parameters.isUpperCaseOnly.raw || false; // Set the value of the textbox to the value of the textValue parameter, or an empty string if it is null

    if (this.myIsUpperCaseOnly) {
      this.myLabel.innerText = "UPPER CASE ONLY";
      this.myTextBox.value = this.myTextBox.value.toUpperCase(); // Convert the value of the textbox to upper case
    } else if (!this.myIsUpperCaseOnly) {
      this.myLabel.innerText = "UPPER/ lower case";
      this.myTextBox.value = this.myTextBox.value.toLowerCase(); // Convert the value of the textbox to lower case
    }

    this.myNotifyOutputChanged(); // Notify the framework that the control has new outputs ready to be retrieved
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {
      textValue: this.myTextBox.value
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
