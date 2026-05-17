import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-directory-pic',
  imports: [],
  templateUrl: './upload-directory-pic.component.html'
})
export class UploadDirectoryPicComponent {
  @Output() fileSelected = new EventEmitter<File>();
  selectedFile?: File;

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.fileSelected.emit(file);
    }
  }
}
