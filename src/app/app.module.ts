import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DirUploadModule } from './dir-upload/dir-upload.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileListComponent } from 'src/app/file-list/file-list.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DirUploadModule,
    BrowserAnimationsModule,
    FileListComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
