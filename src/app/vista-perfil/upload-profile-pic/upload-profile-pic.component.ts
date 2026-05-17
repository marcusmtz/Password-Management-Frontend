import { NgIf } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-profile-pic',
  imports: [NgIf],
  templateUrl: './upload-profile-pic.component.html'
})
export class UploadProfilePicComponent {
  previewUrl: string | null = null;
  @Output() imageUploaded = new EventEmitter<string>();

  private httpNoInterceptor: HttpClient;

  CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dbqfw5na3/upload';
  UPLOAD_PRESET = 'profile-pics-psw';

  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private http: HttpClient,
    private handler: HttpBackend
  ) {
    this.httpNoInterceptor = new HttpClient(handler);
  }

onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) {
      Swal.fire('Archivo inválido', 'Por favor selecciona una imagen.', 'error');
      return;
    }
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


  upload(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', this.UPLOAD_PRESET);

    this.uploading = true;

    this.httpNoInterceptor.post<any>(this.CLOUDINARY_URL, formData).subscribe({
      next: (res) => {
        this.uploading = false;
        this.imageUploaded.emit(res.secure_url);
      },
      error: (err) => {
        this.uploading = false;
        console.error('Error uploading image:', err);
        alert('Error uploading image.');
      }
    });
  }
}
