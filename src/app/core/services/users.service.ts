import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAllUsers(){
    return this.http.get(`${environment.API}/api/users`)
  }
  getById(id:string){
    return this.http.get(`${environment.API}/api/users/`+id)
  }
  deleteById(id: string){
    return this.http.delete(`${environment.API}/api/users/`+id)
  }
  postNewUser(user:User){
    return this.http.post(`${environment.API}/api/users/`,user);
  }
  putEditUser(user:User){
    return this.http.put(`${environment.API}/api/users/`,user);
  }

}
