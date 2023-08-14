import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-dir-upload',
  templateUrl: './dir-upload.component.html',
  styleUrls: ['./dir-upload.component.scss'],
})
export class DirUploadComponent {
  @ViewChild('fileInputEl') fileInput!: ElementRef;

  @Output() change: EventEmitter<UploadFile[]> = new EventEmitter();

  public tree: Tree | null = null;
  public isDragging = false;
  public uploadFiles: UploadFile[] = [];

  public onDragStart(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  public onDragStop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }

  public onDrop(e: DragEvent) {
    this.onDragStop(e);
    this.handleDrop(e.dataTransfer?.items);
  }

  public onClick() {
    this.fileInput?.nativeElement.click();
  }

  public onChange(ev: Event) {
    ev.stopPropagation();
    const fileList: FileList | null = (ev.target as HTMLInputElement).files;
    console.log(fileList, this.convertToArray(fileList));
    const files: File[] = this.convertToArray(fileList);

    this.uploadFiles = files.map((file) => ({
      path: file.webkitRelativePath,
      file,
    }));

    this.change.emit(this.uploadFiles);

    // clear it so change is triggered if same file is selected again
    (ev.target as HTMLInputElement).value = '';
  }

  private handleDrop(items: DataTransferItemList | undefined) {
    if (items) {
      const entries = Array.from(items)
        .filter((f) => f.kind === 'file')
        .map((m) => m.webkitGetAsEntry()) as FileSystemEntry[];

      this.createTree(entries, '').then((tree) => {
        this.uploadFiles = [];
        this.parseToUploadFiles(tree, '');
        this.change.emit(this.uploadFiles);
      });
    }
  }

  private parseFileEnty(entry: FileSystemFileEntry): Promise<File> {
    return new Promise((res, rej) => {
      entry.file(
        (file) => res(file),
        (err) => rej(err)
      );
    });
  }

  private parseDirectoryEntry(entry: FileSystemDirectoryEntry): Promise<Tree> {
    const reader = entry.createReader();
    return new Promise((res, rej) => {
      reader.readEntries(
        (entries) => res(this.createTree(entries, entry.name)),
        (err) => rej(err)
      );
    });
  }

  private createTree(entries: FileSystemEntry[], name: string): Promise<Tree> {
    const tree: Tree = {
      name,
      files: [],
      directories: [],
    };
    const promises: Promise<void>[] = [];

    entries.forEach((entry) => {
      if (entry.isFile) {
        const promise = this.parseFileEnty(entry as FileSystemFileEntry).then(
          (file) => {
            tree.files.push(file);
          }
        );
        promises.push(promise);
      } else if (entry.isDirectory) {
        const promise = this.parseDirectoryEntry(
          entry as FileSystemDirectoryEntry
        ).then((dir) => {
          tree.directories.push(dir);
        });
        promises.push(promise);
      }
    });

    return Promise.all(promises).then(() => tree);
  }

  private convertToArray(
    files: FileList | File[] | File | null | undefined
  ): File[] {
    if (files) {
      if (files instanceof File) {
        return [files];
      } else if (Array.isArray(files)) {
        return files;
      } else {
        return Array.prototype.slice.call(files);
      }
    }
    return [];
  }

  private parseToUploadFiles(tree: Tree, path: string) {
    tree.files.forEach((file) => {
      const uf: UploadFile = {
        file,
        path: path + file.name,
      };
      this.uploadFiles.push(uf);
    });

    tree.directories.forEach((dir) => {
      const newPath = path + dir.name + '/';
      this.parseToUploadFiles(dir, newPath);
    });
  }
}

export interface Tree {
  name: string;
  files: File[];
  directories: Tree[];
}

export interface UploadFile {
  file: File;
  path: string;
}
