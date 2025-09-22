import { FormControl } from "@angular/forms";

export interface TextFieldInfo {
  control: FormControl<string>;
  $text: HTMLInputElement;
}
