import {Component, forwardRef, input, OnInit, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgClass} from '@angular/common';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-custom-form-input',
  imports: [
    NgClass
  ],
  templateUrl: './custom-form-input.component.html',
  styleUrl: './custom-form-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomFormInputComponent),
    multi: true
  }]
})
export class CustomFormInputComponent implements ControlValueAccessor, OnInit {
  ngOnInit(): void {
    this.passwordVisible.set(this.type() == "text")
  }
  // Holds the internal value
  value: string = '';
  id = uuidv4();

  type = input<"text" | "password">("text");
  label = input<string>("Input Label");
  // Track password visibility if type is password
  passwordVisible = signal(false);

  // Callback functions for ControlValueAccessor
  onChange = (value: any) => {};
  onTouched = () => {};

  // Called when the form wants to write a value to the component
  writeValue(obj: any): void {
    this.value = obj;
  }

  // Register the change callback
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register the touched callback
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Optional: set disabled state if needed
  setDisabledState?(isDisabled: boolean): void {
    // You could add logic here to disable the input element.
  }

  // Update the value and notify Angular forms
  onInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
  }

  // Toggle the visibility of a password field
  togglePasswordVisibility(): void {
    this.passwordVisible.update(v => !v);
  }
}
