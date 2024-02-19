import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tarea } from 'src/app/interfaces/tareas';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private http: HttpClient) { }

  getAllTareas(){
    return this.http.get(`${environment.API}/api/tareas`)
  }
  getById(id:string){
    return this.http.get(`${environment.API}/api/tareas/`+id)
  }
  deleteById(id: string){
    return this.http.delete(`${environment.API}/api/tareas/`+id)
  }
  postNewTarea(tarea: tarea){
    return this.http.post(`${environment.API}/api/tareas/`,tarea);
  }
  putEditUser(tarea: tarea){
    return this.http.put(`${environment.API}/api/tareas/`,tarea);
  }
  getTareasByIdUser(id:string){
    return this.http.get(`${environment.API}/api/tareas/user/`+id);
  }

}
