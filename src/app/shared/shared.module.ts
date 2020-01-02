import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';

@NgModule({
    imports: [
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        CommonModule
    ],
    exports: [
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        CommonModule
    ]
})
export class SharedModule {

}
