import { AfterViewInit, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Directory } from '../shared/models/directory';
import { DirectoryService } from '../core/directory.service';
import { UserService } from '../core/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadDirectoryPicComponent } from './upload-directory-pic/upload-directory-pic.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-directory',
  imports: [CommonModule,FormsModule,UploadDirectoryPicComponent],
  templateUrl: './directory.component.html'
})
export class DirectoryComponent implements AfterViewInit, OnInit {
  userDirectories: Directory[] = [];
  editingId: number | null = null;


  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  directory: Directory = {
    id: null, 
    name: '',
    urlPic: '',
    user: undefined
  };
  

  ngOnInit(): void {
    this.loadUserDirectories();
  }
  
  loadUserDirectories(): void {
    this.userService.getByToken().subscribe(user => {
      this.directory.user = { id: user.id };
      this.directoryService.getByUserId(user.id).subscribe({
        next: (dirs) => this.userDirectories = dirs,
        error: (err) => console.error('Error al obtener directorios del usuario', err)
      });
    });
  }

  selectedFile?: File;
  isCreating = false;

  constructor(
    private directoryService: DirectoryService,
    private userService: UserService
  ) {}

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  async createDirectory() {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Select an image',
        text: 'You must select an image before creating a directory.'
      });
      return;
    }

    this.isCreating = true;

    try {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', 'directory-pics'); 
      formData.append('folder', 'directory-pics-psw');

      const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dbqfw5na3/image/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) throw new Error('Falló la subida');

      this.directory.urlPic = uploadData.secure_url;

      this.userService.getByToken().subscribe(user => {
        this.directory.user = { id: user.id };

        this.directoryService.create(this.directory).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Directory created',
              text: 'Your directory have been successfully created.'
            });

            // Reset
            // Reset
            this.directory = { id: null, name: '', urlPic: '', user: undefined };
            this.selectedFile = undefined;
            this.loadUserDirectories();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error saving',
              text: 'The directory could not be saved. Please try again.'
            });
          }
        });
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error uploading image',
        text: 'Check your connection or try again.'
      });
    } finally {
      this.isCreating = false;
    }
  }

  saveEdit(dir: Directory) {
    if (!dir.name.trim()) {
      Swal.fire('Name required', 'The input name cannot be empty', 'warning');
      return;
    }
  
    this.directoryService.update(dir.id!, dir).subscribe({  // <- usa dir.id!
      next: () => {
        Swal.fire('Updated', 'The name was updated correctly.', 'success');
        this.editingId = null;
      },
      error: () => {
        Swal.fire('Error', 'The name could not be updated.', 'error');
      }
    });
  }
  
  deleteDirectory(id: number | undefined | null) {
    if (id == null) return; 
  
    Swal.fire({
      title: 'Delete?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        this.directoryService.delete(id).subscribe({
          next: () => {
            this.userDirectories = this.userDirectories.filter(d => d.id !== id);
            Swal.fire('Deleted', 'The directory has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'It could not be eliminated.', 'error');
          }
        });
      }
    });
  }
  
}
