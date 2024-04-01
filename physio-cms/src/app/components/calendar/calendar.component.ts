import { Component, ChangeDetectorRef, OnInit, ViewChild } from "@angular/core";

import { environment} from "../../../../.environment.app";
import { HttpClient } from "@angular/common/http";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventRemoveArg } from "@fullcalendar/core";
import { map, Observable, throwError } from "rxjs";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { catchError } from "rxjs/operators";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'physio-cms-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;
  calendarVisible = true;
  events: any[] = [];
  // clientIDtag: string = '';
  // eventObject = {};
  eventGuid = 0;
  generateUUID(): string {
    return uuidv4();
  }

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    initialEvents: [],
    events: (fetchInfo, successCallback, failureCallback) => {
      this.fetchEvents().subscribe(
        (events) => {
          successCallback(events);
        },
        (error) => {
          console.error('Error fetching events:', error);
          failureCallback(error);
        }
      );
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    // eventAdd: this.addEvent.bind(this),
    // eventChange:
    // eventRemove: this.deleteEvent.bind(this),
  };
  currentEvents: EventApi[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    console.log('ngOnInit called');
    this.fetchEvents();
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
    this.calendarOptions.initialEvents = this.events;
    this.changeDetector.detectChanges();
    console.log('initial events', this.calendarOptions.initialEvents);
  }

  createEventId() {
    this.eventGuid += 1;
    return String(this.eventGuid);
  }
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  async handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
    let clientFirstName: string = '';
    let clientLastName: string = '';
    let clientId: Observable<{ id: string }> | null = null;
    // let eventObject = {};

    if (title) {
      while (!clientId) {
        clientFirstName = <string>prompt('Enter client first name:');
        clientLastName = <string>prompt('Enter client last name:');
        clientId = await this.getClientId(clientFirstName, clientLastName);
        if (clientId) {
          clientId.subscribe({
            next: (clientIdData) => {
              console.log('returned obs', clientIdData);
              const clientIDtag = String(clientIdData.id);
              console.log('assigned id', clientIDtag);
              console.log(
                'calendar selection',
                selectInfo.startStr,
                selectInfo.endStr
              );
              const eventObject = {
                id: String(this.generateUUID()),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                // allDay: selectInfo.allDay,
                client: {
                  firstName: clientFirstName,
                  lastName: clientLastName,
                  clientID: clientIDtag,
                },
              };
              console.log('eventObject', eventObject);
              calendarApi.addEvent(eventObject);
              this.addEvent(eventObject);
            },
            error: (error) => {
              console.error('Error fetching client ID:', error);
            },
          });
        } else {
          console.error('No client ID returned');
        }
        if (!clientId) {
          alert(
            'Client not found. Please try again or enter a different name.'
          );
        }
      }
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
      this.deleteEvent(clickInfo.event.startStr);
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  fetchEvents(): Observable<any[]> {
    console.log('fetchEvents called');
    return this.http.get<any[]>(environment.localhost + '/events').pipe(
      map((events) => {
        console.log('Events received:', events);
        return events.map((event) => ({
          id: event.id,
          title: `${event.title} - ${event.client.firstName} ${event.client.lastName}`,
          start: event.start,
          end: event.end,
        }));
      }),
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(error);
      })
    );
    // console.log('Transformed events:', this.events);
    //
    // this.calendarOptions.initialEvents = this.events;
    // this.changeDetector.detectChanges(); // Trigger change detection
    // this.calendarComponent?.getApi().refetchEvents();
    // console.log('Initial events set:', this.calendarOptions.initialEvents);
  }

  addEvent(eventData: any): void {
    this.http
      .post<any>(environment.localhost + '/events', { ...eventData })
      .subscribe(
        (response) => {
          console.log('Event added:', response);
          // Fetch events again to update calendar
          // this.fetchEvents();
          // this.changeDetector.detectChanges(); // Trigger change detection
          // this.calendarComponent?.getApi().refetchEvents();
        },
        (error) => {
          console.error('Error adding event:', error);
        }
      );
  }

  deleteEvent(startStr: string): void {
    // const eventTitle = eventFullTitle.split(" - ")[0].trim();
    this.http.delete(environment.localhost + `/events/${startStr}`).subscribe(
      () => {
        console.log('Event deleted:', startStr);
        // Fetch events again to update calendar
        this.fetchEvents();
      },
      (error) => {
        console.error('Error deleting event:', error);
      }
    );
  }

  async getClientId(
    firstName: string,
    lastName: string
  ): Promise<Observable<{ id: string }> | null> {
    const url = environment.localhost + '/clients/searchbyname';

    const params = {
      firstName,
      lastName,
    };

    try {
      const response: Observable<{ id: string }> = this.http.get<{
        id: string;
      }>(url, { params });
      if (response) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching client ID:', error);
      return null;
    }
  }
}
