'use client';

import React, { useEffect, useState } from 'react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
};

type Doctor = {
  DOCTOR_ID: number;
  NAME: string;
};

export default function NewAppointmentForm() {

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    clinicId: '',
    date: '',
    time: '',
    status: '',
  });

  useEffect(() => {

    fetchPatients();
    fetchDoctors();

  }, []);

  // FETCH PATIENTS
  const fetchPatients = async () => {

    try {

      const res = await fetch('/api/patients');

      const data = await res.json();

      setPatients(data);

    } catch (error) {

      console.error(error);

    }
  };

  // FETCH DOCTORS
  const fetchDoctors = async () => {

    try {

      const res = await fetch('/api/doctors');

      const data = await res.json();

      setDoctors(data);

    } catch (error) {

      console.error(error);

    }
  };

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const res = await fetch(
        '/api/appointments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert(data.message);

      } else {

        alert(data.error);

      }

    } catch (error) {

      console.error(error);

      alert('Error creating appointment');

    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">

      {/* Header */}
      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Add Appointment
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Fill appointment details
        </p>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Patient */}
        <div>

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Patient
          </label>

          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >

            <option value="">
              Select Patient
            </option>

            {patients.map((patient) => (

              <option
                key={patient.PATIENT_ID}
                value={patient.PATIENT_ID}
              >
                {patient.NAME}
              </option>

            ))}

          </select>

        </div>

        {/* Doctor */}
        <div>

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Doctor
          </label>

          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >

            <option value="">
              Select Doctor
            </option>

            {doctors.map((doctor) => (

              <option
                key={doctor.DOCTOR_ID}
                value={doctor.DOCTOR_ID}
              >
                {doctor.NAME}
              </option>

            ))}

          </select>

        </div>

        {/* Clinic ID */}
        <InputField
          label="Clinic ID"
          type="number"
          name="clinicId"
          value={formData.clinicId}
          onChange={handleChange}
          placeholder="101"
        />

        {/* Date */}
        <InputField
          label="Appointment Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder=""
        />

        {/* Time */}
        <InputField
          label="Appointment Time"
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder=""
        />

        {/* Status */}
        <div>

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >

            <option value="">
              Select Status
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

        </div>

        {/* Submit */}
        <div className="pt-4">

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
          >
            Create Appointment
          </button>

        </div>

      </form>

    </div>
  );
}


// INPUT FIELD
const InputField = ({
  label,
  type = "text",
  placeholder = "",
  name,
  value,
  onChange
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) => (
  <div>

    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
    />

  </div>
);