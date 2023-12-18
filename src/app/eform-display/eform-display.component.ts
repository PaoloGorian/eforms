import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import eformJson from '../json/eform-38.json';

@Component({
  selector: 'app-eform-display',
  templateUrl: './eform-display.component.html',
  styleUrls: ['./eform-display.component.css']
})
export class EformDisplayComponent implements OnInit {

  dynamicForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Your JSON data
    const jsonData = eformJson;

    // Create the form group
    this.dynamicForm = this.formBuilder.group({});

    // Iterate through metadata and content sections to generate form controls
    jsonData.metadata.forEach(field => {
      if (field.contentType === 'field') {
        // Create FormControl based on displayType (COMBOBOX, TEXTBOX, TEXTAREA, etc.)
        const formControl = new FormControl('');

        // Add the control to the form group using the field id
        this.dynamicForm.addControl(field.id, formControl);
      } else if (field.contentType === 'group') {
        // Create a FormGroup for nested groups
        const group = this.createFormGroupFromContent(field.content);

        // Add the nested FormGroup to the dynamicForm
        this.dynamicForm.addControl(field.id, group);
      }
    });
  }

  // Helper method to create FormGroup for nested groups
  private createFormGroupFromContent(content: any[]): FormGroup {
    const group: any = {};

    content.forEach(subField => {
      if (subField.contentType === 'field') {
        const formControl = new FormControl('');
        group[subField.id] = formControl;
      } else if (subField.contentType === 'group') {
        const subGroup = this.createFormGroupFromContent(subField.content);
        group[subField.id] = subGroup;
      }
    });

    return this.formBuilder.group(group);
  }

  // Submit form method
  onSubmit(): void{
    console.log(this.dynamicForm.value); // Use the form value as needed
  }
}
