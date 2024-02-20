import { compileNgModule } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { _countGroupLabelsBeforeOption } from '@angular/material/core';
import { finalize } from 'rxjs';
import { TareasService } from 'src/app/core/services/tareas.service';
import { UsersService } from 'src/app/core/services/users.service';
import { tarea } from 'src/app/interfaces/tareas';
import { User } from 'src/app/interfaces/user';
import {MatDialog} from '@angular/material/dialog';
import { TareasModal } from './modal/tareas/tareas-modal.component';
import { ChangeDetectorRef } from '@angular/core';






@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public userForm!: FormGroup;
  public tareaForm!: FormGroup;
  public updateUserForm!: FormGroup;
  public users: User[] = [];
  public tareas: tarea[] = [];
  public submittingForm: boolean = false;
  public showSuccessAlert: boolean = false;
  public messageSent: string | null = null;
  public errorMessage: string | null = null;
  public viewNewUser: boolean = false;
  public viewTareas: boolean = false;
  public viewNewTarea: boolean = false;
  public username: string | null = null;
  public id: string | null = null;
  public viewUpdate: boolean = false;
  
 

  displayedColumns: string[] = ['_id', 'name', 'tasks', 'edit' ,  'delete'];
 
  public user = {
    name: '',
    _id: ''
  }

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private tareasService: TareasService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
   
  ) { }


  openModal(id:string): void {
    const dialogRef = this.dialog.open(TareasModal, {
      width: '90%',
      data: { id: id } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se ha cerrado');
    });
  }


  ngOnInit(): void {
    this.getAllUsers();
    this.userForm = this.fb.group({
      name: ["", Validators.required]
    });
    this.updateUserForm = this.fb.group({
      _id: [""],
      name: ["", Validators.required]
    });
    this.tareaForm = this.fb.group({
      name: ["", Validators.required],
      userId: ["", Validators.required],
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (res: any) => {
        this.users = res.data;
        console.log(this.users)
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  getbyIdUser(id: string) {
    this.viewUpdate = true;

    this.userService.getById(id).subscribe((res: any) => {
      this.user = res.data;
      console.log(this.user)
    });
  }
  deleteUser(id: string, index: number) {
    this.userService.deleteById(id).subscribe(res => {
      this.users.splice(index, 1);
      this.users = [...this.users];
      this.messageSent = "Usuario Eliminado con Exito";
      this.successAlert();
    });
  }
  
  
  PostNewUSer() {
    this.submittingForm = true;
    if (this.userForm.valid) {
      this.userService.postNewUser(this.userForm.value).pipe(
        finalize(() => {
          this.getAllUsers();
          this.submittingForm = false;

        })
      ).subscribe((res) => {
        this.messageSent = "Usuario Creado con éxito";
        this.successAlert();
        this.viewNewUser = false;
        this.userForm.reset();
      });
    } else {
      this.submittingForm = false;
      this.handerError();
    }

  }
  AgregarUsuario() {
    this.viewNewUser = !this.viewNewUser
  }
  getAllTareasById(id: string) {
    this.viewTareas = true;
    this.tareasService.getTareasByIdUser(id).subscribe((res: any) => {
      this.username = res.data.name;
      this.id = res.data._id;
      this.tareas = res.data.tareas;
    })
  }
  deleteTarea(id: string, index: number) {
    this.tareas.splice(index, 1);
    this.tareasService.deleteById(id).subscribe((res) => {
      this.messageSent = "Tarea Eliminada con exito";
      this.successAlert();
    });
  }
  returnToTable() {
    this.viewTareas = !this.viewTareas;
  }
  newTarea() {
    this.submittingForm = true;
    if (this.tareaForm.valid) {
      this.tareasService.postNewTarea(this.tareaForm.value).pipe(
        finalize(() => {
          this.submittingForm = false;
        })
      ).subscribe((res) => {
        this.messageSent = "Tarea Asignada con éxito";
        this.successAlert();
        this.viewNewTarea = false;
        this.tareaForm.reset();
      });

    } else {
      this.submittingForm = false;
      this.handerError();
    }



  }
  AgregarTarea() {
    this.viewNewTarea = !this.viewNewTarea;
  }
  sendUpdateUser() {
    if (this.updateUserForm.valid) {
      this.userService.putEditUser(this.updateUserForm.value).pipe(
        finalize(() => {
          this.getAllUsers();
          this.submittingForm = false;
          this.viewUpdate = false;
        })
      ).subscribe((res: any) => {
        if (res.data !== null) {
          this.messageSent = "Usuario Actualizado con éxito";
          this.successAlert();
          this.viewNewUser = false;
          this.updateUserForm.reset();
        } else {
          this.handerError();
        }


      });
    } else {
      this.submittingForm = false;
      this.handerError();
    }
  }
  handerError() {
    this.errorMessage = "Por favor complete correctamente el formulario";
    this.messageSent = null;
    setTimeout(() => {
      this.errorMessage = null;
    }, 10000);
  }
  successAlert() {
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 10000);
  }
}
