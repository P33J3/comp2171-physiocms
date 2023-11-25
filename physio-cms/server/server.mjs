

// const express = require('express');
import express from 'express';
import cors from 'cors'
// const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

import {addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore';
import { clientsRef } from './firebaseConfig.mjs';
app.get("/", async (req, res) => {
    try {
        const snapshot = await getDocs(clientsRef);
        const clientList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.send(clientList);
    } catch (error) {
        console.error('Could not get clients: ', error);
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
        // console.log('clientRef', clientsRef);
        // console.log('id', id);
        delete req.body.id;
        const data = req.body;
        await updateDoc(clientRefFull, data);
        res.send({ msg: "Updated" });
    } catch (error) {
        console.error('Could not update client: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post("/delete", async (req, res) => {
    try {
        const id = req.body.id;
        await deleteDoc(doc(clientsRef, id));
        res.send({ msg: "Deleted" });
    } catch (error) {
        console.error('Could not delete client: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(9000, () => console.log("Up & running port " + 9000));
