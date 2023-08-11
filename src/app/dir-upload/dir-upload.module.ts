import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirUploadComponent } from './dir-upload/dir-upload.component';

@NgModule({
  declarations: [DirUploadComponent],
  imports: [CommonModule],
  exports: [DirUploadComponent],
})
export class DirUploadModule {}
