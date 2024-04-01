
import express from 'express';
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(cors());
import {google} from 'googleapis';
import dotenv from 'dotenv'
dotenv.config()

import {addDoc, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc} from 'firebase/firestore';

import { calendarRef, clientsRef } from "./firebaseConfig.mjs";
// import { environment } from "../.environment.mjs";
// const admin = require('firevase-admin');
// const serviceAccount=require(environment.firebaseConfig.serviceKey);
// admin.initializeApp({credential:admin.credential.cert(serviceAccount)});

// app.get("/", async (req, res) => {
//     try {
//         const snapshot = await getDocs(clientsRef);
//         let clientList =  snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         res.send(clientList);
//     } catch (error) {
//         console.error('Could not get clients: ', error);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// });

app.get("/search-clients", async (req, res) => {
    try {
        const snapshot = await getDocs(clientsRef);
        let clientList =  snapshot.docs.map(async (doc) => {
            let startDates=[];
            const clientData = { id: doc.id, ...doc.data() };
            // Fetch start from calendar collection
            const calendarSnapshot = await getDocs(calendarRef);
            if (!calendarSnapshot.empty) {
                calendarSnapshot.forEach(calendarDoc => {
                    const clientInCalendar = calendarDoc.data().client;
                    if (clientInCalendar && clientInCalendar.id === doc.id) {
                        const starts = calendarDoc.data().start;
                        startDates.push(starts);
                    }
                });
            }
            clientData.start = startDates;
            return clientData;
        });
        // Resolve all promises in the clientList array
        clientList = await Promise.all(clientList);
        res.send(clientList);
    } catch (error) {
        console.error('Could not get clients: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get("/getclient", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).send({ error: 'Client ID is required' });
        }

        const clientRefFull = doc(clientsRef, id);
        const snapshot = await getDoc(clientRefFull);

        if (!snapshot.exists()) {
            return res.status(404).send({ error: 'Client not found' });
        }

        let client = { id: snapshot.id, ...snapshot.data() };
        let startDates = [];


        const calendarSnapshot = await getDocs(calendarRef);
        if (!calendarSnapshot.empty) {
            calendarSnapshot.forEach(calendarDoc => {
                const clientInCalendar = calendarDoc.data().client;
                if (clientInCalendar && clientInCalendar.id === client.id) {
                    const starts = calendarDoc.data().start;
                    startDates.push(starts); // Push each start date individually
                }
            });
        }
        client.start = startDates;
        res.send(client);
    } catch (error) {
        console.error('Could not get client: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get("/clients/searchbyname", async (req, res) => {
    try {
        const firstName = req.query.firstName;
        const lastName = req.query.lastName;

        if (!firstName || !lastName) {
            return res.status(400).send({ error: 'First Name and Last Name are required' });
        }

        // const clientsRef = collection(db, 'clients');
        const q = query(clientsRef,
          where('firstName', '==', firstName),
          where('lastName', '==', lastName));
        const clientSnapshot = await getDocs(q);

        if (!clientSnapshot.empty) {
            const clientId = clientSnapshot.docs[0].id;
            res.send({ id: clientId });
        } else {
            res.status(404).send({ error: 'Client not found' });
        }
    } catch (error) {
        console.error('Could not get client ID: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post("/addclient", async (req, res) => {
    try {
        const data = req.body;
        console.log("Data of Client", data);
        const newClient = await addDoc(clientsRef, data);
        console.log('Document written with ID:', newClient.id);
        res.send({ msg: "Client Added." });
    } catch (error) {
        console.error('Could not add client: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post("/update", async (req, res) => {
    try {
        const id = req.body.id;
        const clientRefFull = doc(clientsRef, id);
        delete req.body.id;
        const data = req.body;
        await updateDoc(clientRefFull, data);
        res.send({ msg: "Updated" });
    } catch (error) {
        console.error('Could not update client: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.delete("/delete", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            res.status(400).send({ error: 'Missing or invalid id parameter' });
            return;
        }

        await deleteDoc(doc(clientsRef, id));
        res.send({ msg: "Deleted" });
    } catch (error) {
        console.error('Could not delete client: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('/events', async (req, res) => {
    try {
        const eventsSnapshot =await getDocs(calendarRef);
        const events = eventsSnapshot.docs.map(doc => doc.data()) || [];
        res.send(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
});

app.post('/events', async (req, res) => {
    try {
        const eventData = req.body;
        const docRef = await addDoc(calendarRef,eventData);
        res.send({ id: docRef.id });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Error adding event' });
    }
});

app.delete('/events/:startStr', async (req, res) => {
    try {
        const { startStr } = req.params;
        const q = query(calendarRef, where('start', '==', startStr));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const document = querySnapshot.docs[0];
            const docId = document.id;
            await deleteDoc(doc(calendarRef, docId));
            res.send({ msg: "Deleted" });
            // res.send(docId)
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Error deleting event' });
    }
});


// google config are repeated and can to extract to reusable functions

app.post("/add-calendar-event", async (req, res) => {
    const data = req.body;
    const CREDENTIALS = JSON.parse(process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT)
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
    const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID
    const GOOGLE_CALENDAR_VERSION = process.env.GOOGLE_CALENDAR_VERSION
    const GOOGLE_API_SCOPES = process.env.GOOGLE_API_SCOPES
    const GOOGLE_CALENDAR_APPOINTMENT_DURATION = process.env.GOOGLE_CALENDAR_APPOINTMENT_DURATION
    const GOOGLE_CALENDAR_TIMEZONE = process.env.GOOGLE_CALENDAR_TIMEZONE
    const SCOPES = [GOOGLE_API_SCOPES];

    const auth = new google.auth.JWT(
        CREDENTIALS.client_email,
        null,
        CREDENTIALS.private_key,
        SCOPES
    )

    const calendarEventRequest = {
        summary: "Appointment for "+data.name,
        description: data.additionalMessage,
        start: {
          dateTime: data.startDate,
          timeZone: GOOGLE_CALENDAR_TIMEZONE,
        },
        end: {
          dateTime: data.endDate,
          timeZone: GOOGLE_CALENDAR_TIMEZONE,
        },
        attendees: [],
        reminders: {},
    };

    const calendar = google.calendar({
        version: GOOGLE_CALENDAR_VERSION,
        project: GOOGLE_PROJECT_ID,
        auth: auth,
    });

    const response = calendar.events.insert({
        auth: auth,
        calendarId: CALENDAR_ID,
        resource: calendarEventRequest
     })

    res.send({ msg: "Appointment set" });
})


app.get("/get-calendar-events", async (req, res) => {
    const data = req.body;
    const CREDENTIALS = JSON.parse(process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT)
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
    const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID
    const GOOGLE_CALENDAR_VERSION = process.env.GOOGLE_CALENDAR_VERSION
    const GOOGLE_API_SCOPES = process.env.GOOGLE_API_SCOPES
    const GOOGLE_CALENDAR_APPOINTMENT_DURATION = process.env.GOOGLE_CALENDAR_APPOINTMENT_DURATION
    const GOOGLE_CALENDAR_TIMEZONE = process.env.GOOGLE_CALENDAR_TIMEZONE
    const SCOPES = [GOOGLE_API_SCOPES];

    const auth = new google.auth.JWT(
        CREDENTIALS.client_email,
        null,
        CREDENTIALS.private_key,
        SCOPES
    )

    const calendar = google.calendar({
        version: GOOGLE_CALENDAR_VERSION,
        project: GOOGLE_PROJECT_ID,
        auth: auth,
    });

    const appointmentPromise = new Promise((resolve, reject) => {
        calendar.events.list(
          {
            calendarId: CALENDAR_ID,
            timeMin: new Date().toISOString(),
            maxResults: 120,
            singleEvents: true,
            orderBy: "startTime",
          },
          (error, result) => {
            if (error) {
              reject('Internal Server Error');
            } else {
              resolve(result.data.items);
            }
          }
        );
      });
      appointmentPromise.then((appointments) => {
        console.log(appointments);
        res.send(appointments);
        // Process appointments here
      })
      .catch((error) => {
        res.send({}); // can render error in thje future
      });
})

app.delete("/delete-calendar-event", async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            res.status(400).send({ error: 'Missing or invalid id parameter' });
            return;
        }
        const CREDENTIALS = JSON.parse(process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT)
        const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
        const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID
        const GOOGLE_CALENDAR_VERSION = process.env.GOOGLE_CALENDAR_VERSION
        const GOOGLE_API_SCOPES = process.env.GOOGLE_API_SCOPES
        const SCOPES = [GOOGLE_API_SCOPES];

        const auth = new google.auth.JWT(
            CREDENTIALS.client_email,
            null,
            CREDENTIALS.private_key,
            SCOPES
        )

        const calendar = google.calendar({
            version: GOOGLE_CALENDAR_VERSION,
            project: GOOGLE_PROJECT_ID,
            auth: auth,
        });

        const response = calendar.events.delete({
            auth: auth,
            calendarId: CALENDAR_ID,
            eventId: id
         })

        res.send({ msg: "Event Deleted" });
    } catch (error) {
        console.error('Could not delete event: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(9000, () => console.log("Up & running port " + 9000));
