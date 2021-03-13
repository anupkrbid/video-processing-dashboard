import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatDividerModule} from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select'
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    // MatDialogModule,
    // MatDividerModule,
    MatFormFieldModule,
    // MatIconModule,
    MatInputModule,
    // MatListModule,
    // MatRippleModule,
    MatSelectModule,
    // MatSidenavModule,
    // MatSlideToggleModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    // MatDialogModule,
    // MatDividerModule,
    MatFormFieldModule,
    // MatIconModule,
    MatInputModule,
    // MatListModule,
    // MatRippleModule,
    MatSelectModule,
    // MatSidenavModule,
    // MatSlideToggleModule
  ]
})
export class SharedMaterialModule { }
