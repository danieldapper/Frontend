import { NgModule } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
const Modules= [
  MatProgressBarModule
];



@NgModule({
  imports: [...Modules],
  exports: [...Modules],
})
export class MaterialModule { }