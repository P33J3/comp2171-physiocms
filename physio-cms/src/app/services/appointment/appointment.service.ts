import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as environment  from '../../../../environment.app';
import { Observable } from "rxjs";
import { Appointment } from 'src/app/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private http: HttpClient
  ) { }

  addAppointment(data:Appointment) {
    const startDateObject = new Date(data.dateTime)
    data.startDate = this.getDateFomat(new Date(data.dateTime))
    data.endDate = this.getDateFomat(new Date(startDateObject.getTime() + 3600000)) // add one hour for the appoitment slot
    return this.http.post(environment.localhost + '/add-calendar-event', { ...data });
  }

  getDateFomat(date: Date) : string{
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours() - 5).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const offsetHours = String(Math.floor(date.getTimezoneOffset() / 60)).padStart(2, '0');
    const offsetMinutes = String(date.getTimezoneOffset() % 60).padStart(2, '0');
    const offsetSign = date.getTimezoneOffset() > 0 ? '-' : '+';
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
  }

  getAllAppointments(): Observable<any[]> {
    return this.http.get<any[]>(environment.localhost + `/get-calendar-events`);
  }

  deleteAppointment(id:string) {
    return this.http.delete(environment.localhost + `/delete-calendar-event?id=${id}`);
  }


}
