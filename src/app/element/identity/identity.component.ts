import { Component } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { Password } from '../../shared/models/password';
import { PasswordService } from '../../core/password.service';
import { UserService } from '../../core/user.service';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-identity',
  imports: [TableComponent],
  templateUrl: './identity.component.html'
})
export class IdentityComponent {
  passwords: Password[] = [];
  idUser: number = 0;

  constructor(
    private passwordService: PasswordService,
    private userService: UserService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 50);
  }

  ngOnInit(): void {
    this.userService.getByToken().subscribe({
      next: (user) => {
        this.idUser = user.id;
        this.loadIdentityPasswords(user.id);
      },
      error: (err) => {
        console.error('Error getting user by token:', err);
      }
    });
  }

  loadIdentityPasswords(userId: number): void {
    this.passwordService.getPasswordsByUserId(userId).subscribe({
      next: (data) => {
        this.passwords = data.filter(p => p.typeElement.name === 'Identity');
      },
      error: (error) => {
        console.error('Error loading passwords:', error);
      }
    });
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

            this.loadIdentityPasswords(this.idUser);
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
}
