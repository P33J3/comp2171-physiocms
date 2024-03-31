import { Component, ChangeDetectorRef, OnInit } from "@angular/core";

import { environment} from "../../../../environment.app";
import { HttpClient } from "@angular/common/http";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventRemoveArg } from "@fullcalendar/core";
import { Observable } from "rxjs";

@Component({
  selector: 'physio-cms-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  calendarVisible = true;
  events: any[] = [];
  eventGuid = 0;
  createEventId() {
    return String(this.eventGuid++);
  }
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin,timeGridPlugin,
      listPlugin,],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    initialEvents: this.events, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventAdd: this.addEvent.bind(this),
    // eventChange:
    eventRemove: this.deleteEvent.bind(this)

  };
  currentEvents: EventApi[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchEvents();
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

    if (title) {


      while (!clientId) {
        clientFirstName = <string>prompt('Enter client first name:');
        clientLastName = <string>prompt('Enter client last name:');
        clientId = await this.getClientId(clientFirstName, clientLastName);
        if (!clientId) {
          alert('Client not found. Please try again or enter a different name.');
        }
      }

      calendarApi.addEvent({
        id: this.createEventId(),
        title,
        // start: selectInfo.startStr,
        // end: selectInfo.endStr,
        // allDay: selectInfo.allDay,
        client: {
          firstName: clientFirstName,
          lastName: clientLastName,
          id: clientId
        }
      });

      // Call function to save event to database with clientId
      this.addEvent({
        title,
        // start: selectInfo.startStr,
        // end: selectInfo.endStr,
        // allDay: selectInfo.allDay,
        client: {
          firstName: clientFirstName,
          lastName: clientLastName,
          id: clientId
        }
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  fetchEvents(): void {
    this.http.get<any[]>(environment.localhost + '/events').subscribe(
      (events) => {
        this.events = events.map((event) => ({
          id: event.id,
          title: `${event.title} - ${event.client.firstName} ${event.client.lastName}`,
          // start: event.start,
          // end: event.end,
        }));
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  addEvent(eventData: any): void {
    this.http.post<any>(environment.localhost + '/events', {...eventData}).subscribe(
      (response) => {
        console.log('Event added:', response);
        // Fetch events again to update calendar
        this.fetchEvents();
      },
      (error) => {
        console.error('Error adding event:', error);
      }
    );
  }

  deleteEvent(eventId: EventRemoveArg): void {
    this.http.delete(`http://localhost:3000/events/${eventId}`).subscribe(
      () => {
        console.log('Event deleted:', eventId);
        // Fetch events again to update calendar
        this.fetchEvents();
      },
      (error) => {
        console.error('Error deleting event:', error);
      }
    );
  }

  async getClientId(firstName: string, lastName: string): Promise<Observable<{ id: string }>| null> {
    const url = environment.localhost + "/clients/searchbyname";

    const params = {
      firstName,
      lastName
    };

    try {
      const response: Observable<{ id: string }> = this.http.get<{ id: string }>(url, { params });
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
