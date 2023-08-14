import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { UploadFile } from 'src/app/dir-upload/dir-upload/dir-upload.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatListModule, MatDividerModule, MatButtonModule],
})
export class FileListComponent {
  @Input() files: UploadFile[] = [];

  @Output() uploadComplete: EventEmitter<void> = new EventEmitter();

  public uploadFiles() {
    const formData = new FormData();
    this.files.forEach((f) => formData.append(f.path, f.file));

    for (let key of formData.entries()) {
      console.log(key);
    }
  }
}
