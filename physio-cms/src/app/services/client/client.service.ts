import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor() { }

  clientData = [
    {
      "name": "Alice Johnson",
      "age": 28,
      "gender": "female",
      "condition": "Back pain",
      "patient_status": "active",
      "weight": 140,
      "goals": "heal injury",
      "treatments": 5
    },
    {
      "name": "Bob Smith",
      "age": 35,
      "gender": "male",
      "condition": "Knee injury",
      "patient_status": "suspended",
      "weight": 180,
      "goals": "increase mobility",
      "treatments": 3
    },
    {
      "name": "Catherine Davis",
      "age": 45,
      "gender": "female",
      "condition": "Shoulder pain",
      "patient_status": "discharged",
      "weight": 160,
      "goals": "heal injury",
      "treatments": 8
    },
    {
      "name": "David Miller",
      "age": 32,
      "gender": "male",
      "condition": "Neck stiffness",
      "patient_status": "active",
      "weight": 150,
      "goals": "increase mobility",
      "treatments": 6
    },
    {
      "name": "Eva Wilson",
      "age": 50,
      "gender": "female",
      "condition": "Ankle sprain",
      "patient_status": "active",
      "weight": 140,
      "goals": "heal injury",
      "treatments": 4
    },
    {
      "name": "Frank Brown",
      "age": 40,
      "gender": "male",
      "condition": "Hip pain",
      "patient_status": "suspended",
      "weight": 200,
      "goals": "increase mobility",
      "treatments": 2
    },
    {
      "name": "Grace Taylor",
      "age": 28,
      "gender": "female",
      "condition": "Elbow injury",
      "patient_status": "active",
      "weight": 130,
      "goals": "heal injury",
      "treatments": 7
    },
    {
      "name": "Henry Clark",
      "age": 55,
      "gender": "male",
      "condition": "Lower back pain",
      "patient_status": "discharged",
      "weight": 170,
      "goals": "lose weight",
      "treatments": 10
    },
    {
      "name": "Ivy White",
      "age": 33,
      "gender": "female",
      "condition": "Wrist pain",
      "patient_status": "active",
      "weight": 120,
      "goals": "increase mobility",
      "treatments": 9
    },
    {
      "name": "Jack Turner",
      "age": 42,
      "gender": "male",
      "condition": "Shoulder impingement",
      "patient_status": "active",
      "weight": 175,
      "goals": "heal injury",
      "treatments": 1
    }
  ]

}
