import { Component, OnInit } from '@angular/core';
import { Password } from '../../shared/models/password';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PasswordService } from '../../core/password.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Directory } from '../../shared/models/directory';
import { TypeElement } from '../../shared/models/type-element';
import { DirectoryService } from '../../core/directory.service';
import { TypeElementService } from '../../core/type-element.service';
import { PasswordDto } from '../../shared/dto/Password-dto';
import Swal from 'sweetalert2';
// @ts-ignore
import zxcvbn from 'zxcvbn';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-edit-psw',
  imports: [FormsModule,NgIf,RouterModule,CommonModule],
  templateUrl: './edit-psw.component.html'
})
export class EditPswComponent implements OnInit {
  returnUrl: string = '/vault';
  directories: Directory[] = [];
  typesElement:TypeElement[]= [];
  passwordId!: string;
  showPassword = false;
  passwordData: Password = {
    id:0,
    nombrePsw: '',
    usuario: '',
    password: '',
    urlWebSite: '',
    description: '',
    favorite: false,
    typeElement: { id: 0, name: '' },
    directory: { id: 0, name: '' }
  };
  passwordStrength: number = 0;  
  passwordFeedback: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private passwordService: PasswordService,
    private directoryService: DirectoryService,
    private typeElementService: TypeElementService,
    private router: Router,
    private userService: UserService 
  ) {}

  ngOnInit(): void {
    this.passwordId = this.route.snapshot.paramMap.get('id')!;
    this.route.queryParamMap.subscribe(params => {
      this.returnUrl = params.get('returnUrl') || '/vault';
    });
  
    this.userService.getByToken().subscribe({
      next: (user) => {
        const userId = user.id;
  
        this.directoryService.getByUserId(userId).subscribe({
          next: (dirs) => this.directories = dirs,
          error: (err) => console.error('Error al obtener directorios del usuario', err)
        });
      },
      error: (err) => console.error('Error al obtener usuario', err)
    });
  
    this.typeElementService.getAll().subscribe({
      next: (data) => this.typesElement = data, 
      error: (err) => console.error('Error al obtener tipos de elementos', err)
    });
  
    this.passwordService.getPasswordById(Number(this.passwordId)).subscribe(data => {
      this.passwordData = data;
      this.evaluatePasswordStrength(this.passwordData.password);
    });
  }
  

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private buildPasswordDto(password: Password): PasswordDto {
    return {
      nombrePsw: password.nombrePsw,
      usuario: password.usuario,
      password: password.password,
      urlWebSite: password.urlWebSite,
      description: password.description,
      isFavorite: password.favorite,
      idTypeElement: password.typeElement?.id ?? 0,
      idDirectory: password.directory?.id ?? 0,
    };
  }
  

  updatePassword(): void {
    Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Estás a punto de actualizar esta contraseña.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dto = this.buildPasswordDto(this.passwordData);
        this.passwordService.updatePassword(this.passwordData.id, dto).subscribe({
          next: (updated) => {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: 'La contraseña fue actualizada correctamente.'
            }).then(() => {
              this.router.navigateByUrl(this.returnUrl);
            });
          },
          error: (err) => {
            console.error('Error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar',
              text: 'No se pudo actualizar la contraseña.'
            });
          }
        });
      }
    });
  }
  
  resetForm() {
    this.passwordData= {
      id: 0,
      nombrePsw: '',
      usuario: '',
      password: '',
      urlWebSite: '',
      description: '',
      favorite: false,
      typeElement: { id: 0, name: '' },
      directory: { id: 0, name: '' }
    };
  }

  cancelEdit(){
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Los cambios no guardados se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Seguir editando'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }

  evaluatePasswordStrength(password: string): void {
    const result = zxcvbn(password);
    this.passwordStrength = result.score; // score de 0 (débil) a 4 (fuerte)
  
    const feedbackMessages = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    this.passwordFeedback = feedbackMessages[result.score] || '';
}
}
