import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserProfileDto } from '../shared/dto/UserProfileDto';
import { UserService } from '../core/user.service';
import { NgIf } from '@angular/common';
import { UploadProfilePicComponent } from './upload-profile-pic/upload-profile-pic.component';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-perfil',
  imports: [NgIf,UploadProfilePicComponent],
  templateUrl: './vista-perfil.component.html'
})
export class VistaPerfilComponent implements OnInit, AfterViewInit {
  userProfile: UserProfileDto | null = null;
  isUploading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('Error loading user profile', err);
      }
    });
  }

  onImageUploaded(imageUrl: string): void {
    this.isUploading = true;

    this.userService.updateProfilePicture({ profilePic: imageUrl }).subscribe({
      next: (updatedUser) => {
        this.userProfile!.profilePic = imageUrl;
        this.isUploading = false;
        window.location.reload();
      },
      error: (err) => {
        console.error('Error updating profile pic', err);
        this.isUploading = false;
      }
    });
  }

  removeProfilePicture(): void {
    if (!this.userProfile?.profilePic) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin foto de perfil',
        text: 'No hay ninguna foto de perfil para eliminar.',
      });
      return;
    }
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar tu foto de perfil?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.removeProfilePicture().subscribe({
          next: () => {
            if (this.userProfile) {
              this.userProfile.profilePic = null;
            }
  
            Swal.fire({
              icon: 'success',
              title: 'Foto eliminada',
              text: 'Tu foto de perfil ha sido eliminada exitosamente.',
            }).then(() => {
              window.location.reload();
            });
  
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al intentar eliminar la foto de perfil.',
            });
          }
        });
      }
    });
  }
  
}
