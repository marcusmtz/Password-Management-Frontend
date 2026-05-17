import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Directory } from '../shared/models/directory';
import { TypeElement } from '../shared/models/type-element';
import { DirectoryService } from '../core/directory.service';
import { TypeElementService } from '../core/type-element.service';
import { PasswordDto } from '../shared/dto/Password-dto';
import { PasswordService } from '../core/password.service';
import { UserService } from '../core/user.service';
import { User } from '../shared/models/User';
import Swal from 'sweetalert2';
import { Password } from '../shared/models/password';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
// @ts-ignore
import zxcvbn from 'zxcvbn';


@Component({
  selector: 'app-vault',
  imports: [NgIf,FormsModule,NgFor,CommonModule,RouterLink],
  templateUrl: './vault.component.html'
})
export class VaultComponent implements OnInit, AfterViewInit  {
    directories: Directory[] = [];
    typesElement:TypeElement[]= [];
    User: User[]= [];
    showPassword = false;
    view= '';
    selectedTypeId: string = '';
    selectedDirectoryId: string = '';
    passwords:Password[]= [];
    passwordStrength: number = 0;
    passwordFeedback: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 3;
    searchTerm: string = '';
    currentUserId: number | null = null;


    password: PasswordDto = {
      nombrePsw: '',
      usuario: '',
      password: '',
      urlWebSite: '',
      description: '',
      isFavorite: false,
      idUser: undefined, // Inicialmente null, se asignará después
      idTypeElement: null,
      idDirectory: null
    };

    constructor(private directoryService: DirectoryService,
      private typeElementService: TypeElementService, 
      private passwordService:PasswordService,
      private userService:UserService ) {}

    evaluatePasswordStrength(password: string): void {
        const result = zxcvbn(password);
        this.passwordStrength = result.score; // score de 0 (débil) a 4 (fuerte)
      
        const feedbackMessages = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];
        this.passwordFeedback = feedbackMessages[result.score] || '';
    }
      

    trackById(index: number, item: any): number {
      return item.id;
    }
    

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        initFlowbite();
      }, 100);
    }

    ngOnInit(): void {
      this.userService.getByToken().subscribe({
        next: (user) => {
          this.currentUserId = user.id;
          this.password.idUser = user.id;
          const idUser = user.id;
    
          this.directoryService.getByUserId(idUser).subscribe({
            next: (dirs) => {
              this.directories = dirs;
            },
            error: (err) => console.error('Error al obtener directorios del usuario', err)
          });
    
          this.loadPasswords(idUser);
        },
        error: (err) => console.error('Error al obtener usuario desde token', err)
      });
    
      this.typeElementService.getAll().subscribe({
        next: (data) => this.typesElement = data, 
        error: (err) => console.error('Error al obtener tipos de elementos', err)
      });
    }
    

    loadPasswords(userId: number): void {
      this.passwordService.getPasswordsByUserId(userId).subscribe({
        next: (passwords) => {
          this.passwords = passwords.sort((a, b) => 
            a.nombrePsw.localeCompare(b.nombrePsw)
          );
        },
        error: (error) => {
          console.error('Error al obtener contraseñas:', error);
        }
      });
    }

    get filteredPasswords(): Password[] {
      if (!this.searchTerm.trim()) {
        return this.passwords;
      }
    
      const term = this.searchTerm.toLowerCase();
    
      return this.passwords.filter(p =>
        p.nombrePsw.toLowerCase().includes(term) ||
        p.directory.name.toLowerCase().includes(term) ||
        (p.urlWebSite && p.urlWebSite.toLowerCase().includes(term))
      );
    }
    
    onSubmit() {
      if (this.password.idTypeElement === -1) {
        alert("Please select a valid type.");
        return;
      }
      
      if (this.password.idDirectory === -1) {
        alert("Please select a valid directory.");
        return;
      }

      const passwordDto: PasswordDto = this.buildPasswordDto();
    
      this.passwordService.createPassword(passwordDto).subscribe({
        next: (createdPassword) => {
          this.passwords.push(createdPassword);
          console.log(createdPassword);
          this.resetForm();
          Swal.fire({
            title: '¡Contraseña guardada!',
            text: 'Tu nueva contraseña ha sido registrada correctamente.',
            icon: 'success',
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (err) => {
          console.error('Error al crear contraseña:', err);
          console.log(passwordDto)
          Swal.fire({
            title: 'Error',
            text: 'No se pudo guardar la contraseña. Intenta nuevamente.',
            icon: 'error',
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Entendido'
          });
        }
      });
    }
    
    private buildPasswordDto(): PasswordDto {
      if (!this.password.idTypeElement || !this.password.idDirectory) {
        throw new Error('Debe seleccionar un tipo de elemento y un directorio antes de guardar.');
      }
    
      if (!this.currentUserId) {
        throw new Error('El usuario no está disponible.');
      }
    
      return {
        nombrePsw: this.password.nombrePsw,
        usuario: this.password.usuario,
        password: this.password.password,
        urlWebSite: this.password.urlWebSite,
        description: this.password.description,
        isFavorite: this.password.isFavorite,
        idUser: this.currentUserId,
        idTypeElement: this.password.idTypeElement,
        idDirectory: this.password.idDirectory,
      };
    }
    

    resetForm() {
      this.password = {
        nombrePsw: '',
        usuario: '',
        password: '',
        urlWebSite: '',
        description: '',
        isFavorite: false,
        idUser: this.currentUserId ?? undefined,
        idTypeElement: 0,
        idDirectory: 0
      };
    }
    

    deletePassword(passwordId: number) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.passwordService.deletePassword(passwordId).subscribe({
            next: () => {
              Swal.fire({
                title: "Deleted!",
                text: "Your password has been deleted.",
                icon: "success"
              });
    
              // ✅ Recargar contraseñas
              if (this.password.idUser) {
                this.loadPasswords(this.password.idUser);
              }
            },
            error: () => {
              Swal.fire({
                title: "Error",
                text: "There was an error deleting the password.",
                icon: "error"
              });
            }
          });
        }
      });
    }

    copyToClipboard(text: string, label: string): void {
      navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `${label} copiado`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
      }).catch(err => {
        console.error(`Error al copiar ${label}:`, err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo copiar el ${label.toLowerCase()}.`
        });
      });
    }
    
    copyUsername(username: string): void {
      this.copyToClipboard(username, 'Usuario');
    }
    
    copyPassword(password: string): void {
      this.copyToClipboard(password, 'Contraseña');
    }
    
    get paginatedPasswords() {
      const filtered = this.filteredPasswords;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    }
    
    
    get totalPages(): number {
      return Math.ceil(this.filteredPasswords.length / this.itemsPerPage);
    }
    
    
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
    
}
