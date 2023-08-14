import { Component } from '@angular/core';
import { UploadFile } from 'src/app/dir-upload/dir-upload/dir-upload.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngx-upload-dir';
  files: UploadFile[] = [];

  onUploadChange(files: UploadFile[]) {
    this.files = files;
    console.log(files);
  }

  onUploadComplete() {
    this.files = [];
  }
}
