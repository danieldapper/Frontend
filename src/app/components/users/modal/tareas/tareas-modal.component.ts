import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { TareasService } from 'src/app/core/services/tareas.service';
import { tarea } from 'src/app/interfaces/tareas';







@Component({
  selector: 'app-tareas-modal',
  templateUrl: 'tareas-modal.html',
})
export class TareasModal {
  displayedColumns: string[] = ['_id', 'name', 'tasks', 'delete'];
  idRecibido: string;
  public tareas: tarea[] = [];
  public user!: string;
  public messageSent: string | null = null;
  public errorMessage: string | null = null;
  public showSuccessAlert: boolean = false;
  public tareaForm!: FormGroup;
  public submittingForm: boolean = false;
  

  constructor(
    public dialogRef: MatDialogRef<TareasModal>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private tareasService: TareasService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.idRecibido = data.id;
    this.getAllTareasById(data.id)

    this.tareaForm = this.fb.group({
      name: ["", Validators.required],
      userId: this.idRecibido,
    });

  }

  onClose(): void {
    this.dialogRef.close();
  }
  getAllTareasById(id: string) {
    this.tareasService.getTareasByIdUser(id).subscribe((res: any) => {
      this.tareas = res.data.tareas;
      this.user = res.data.name;
    })
  }

  deleteTarea(id: string, index: number) {
    this.tareasService.deleteById(id).subscribe((res) => {
      this.tareas.splice(index, 1);
      this.tareas = [...this.tareas];
      this.messageSent = "Tarea Eliminada con exito";
      this.successAlert();
    });
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

  sendTarea(){
   
    this.submittingForm = true;
    if (this.tareaForm.valid) {
      this.tareasService.postNewTarea(this.tareaForm.value).pipe(
        finalize(() => {
          this.submittingForm = false;
        })
      ).subscribe((res) => {
        this.messageSent = "Tarea Asignada con éxito";
        this.successAlert();
        this.tareaForm.reset();
        this.getAllTareasById(this.idRecibido)
      });

    } else {
      this.submittingForm = false;
      this.handerError();
    }

  }


}
