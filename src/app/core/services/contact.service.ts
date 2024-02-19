import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from 'src/app/interfaces/contact';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  addContact(contact: Contact)
  {

    return this.http.post(`${environment.API}/api/contact`,contact)
  }


}
