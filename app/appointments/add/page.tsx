'use client';

import React, { useEffect, useState } from 'react';

import {
  CalendarDays,
  User,
  Stethoscope,
  ClipboardCheck,
  Save,
} from 'lucide-react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
};

type Doctor = {
  DOCTOR_ID: number;
  NAME: string;
};

export default function NewAppointmentForm() {

  const [loading, setLoading] =
    useState(false);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [formData, setFormData] =
    useState({
      patientId: '',
      doctorId: '',
      date: '',
      status: '',
    });



  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);




  // FETCH PATIENTS
  const fetchPatients =
    async () => {

    try {

      const res =
        await fetch(
          '/api/patients'
        );

      const data =
        await res.json();

      setPatients(
        data.patients || []
      );

    } catch (error) {

      console.error(error);

      setPatients([]);

    }
  };



  // FETCH DOCTORS
  const fetchDoctors =
    async () => {

    try {

      const res =
        await fetch(
          '/api/doctors'
        );

      const data =
        await res.json();

      setDoctors(
        data || []
      );

    } catch (error) {

      console.error(error);

      setDoctors([]);

    }
  };



  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };



  // SUBMIT
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res =
        await fetch(
          '/api/appointments',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

      const data =
        await res.json();



      if (res.ok) {

        alert(data.message);

        setFormData({
          patientId: '',
          doctorId: '',
          date: '',
          status: '',
        });

      } else {

        alert(data.error);

      }

    } catch (error) {

      console.error(error);

      alert(
        'Error creating appointment'
      );

    } finally {

      setLoading(false);

    }
  };



  return (

    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      <div
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-sm
          hover:shadow-md
          transition
          overflow-hidden
        "
      >

        {/* TOP SECTION */}
        <div
          className="
            bg-white
            border-b border-slate-200
            px-8 py-7
            relative
          "
        >

          {/* LIGHT DECORATION */}
          <div
            className="
              absolute
              right-10 top-6
              h-24 w-24
              rounded-full
              bg-emerald-50
            "
          ></div>

          <div
            className="
              absolute
              right-24 top-14
              h-14 w-14
              rounded-full
              bg-cyan-50
            "
          ></div>

          <div className="relative flex items-center gap-5">

            {/* ICON */}
            <div
              className="
                h-16 w-16
                rounded-2xl
                bg-emerald-50
                border border-emerald-100
                flex items-center justify-center
              "
            >

              <CalendarDays
                className="text-emerald-600"
                size={28}
              />

            </div>

            {/* TEXT */}
            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Appointment Scheduling
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Create and manage patient appointments.
              </p>

            </div>

          </div>

        </div>



        {/* FORM */}
        <div className="p-6 lg:p-10">

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* PATIENT */}
              <SelectField
                label="Patient"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                icon={<User size={18} />}
              >

                <option value="">
                  Select Patient
                </option>

                {patients.map(
                  (patient) => (

                  <option
                    key={
                      patient.PATIENT_ID
                    }
                    value={
                      patient.PATIENT_ID
                    }
                  >
                    {patient.NAME}
                  </option>

                ))}

              </SelectField>



              {/* DOCTOR */}
              <SelectField
                label="Doctor"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                icon={
                  <Stethoscope
                    size={18}
                  />
                }
              >

                <option value="">
                  Select Doctor
                </option>

                {doctors.map(
                  (doctor) => (

                  <option
                    key={
                      doctor.DOCTOR_ID
                    }
                    value={
                      doctor.DOCTOR_ID
                    }
                  >
                    {doctor.NAME}
                  </option>

                ))}

              </SelectField>



              {/* DATE */}
              <InputField
                label="Appointment Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder=""
                icon={
                  <CalendarDays
                    size={18}
                  />
                }
              />



              {/* STATUS */}
              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                icon={
                  <ClipboardCheck
                    size={18}
                  />
                }
              >

                <option value="">
                  Select Status
                </option>

                <option value="PENDING">
                  PENDING
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

                <option value="CANCELLED">
                  CANCELLED
                </option>

              </SelectField>

            </div>



            {/* BUTTON */}
            <div className="pt-2">

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex items-center justify-center gap-3
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  transition-all duration-200
                  disabled:opacity-70
                "
              >

                <Save size={20} />

                {loading
                  ? 'Creating Appointment...'
                  : 'Create Appointment'}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}



/* INPUT FIELD */

const InputField = ({
  label,
  type = 'text',
  placeholder = '',
  name,
  value,
  onChange,
  icon,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  icon: React.ReactNode;
}) => (

  <div>

    <label className="block text-sm font-semibold text-slate-700 mb-3">
      {label}
    </label>

    <div className="relative">

      <div
        className="
          absolute
          left-4 top-1/2
          -translate-y-1/2
          text-slate-400
        "
      >
        {icon}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          w-full
          pl-12 pr-4 py-4
          rounded-2xl
          border border-slate-200
          bg-white
          text-slate-900
          outline-none
          transition-all
          focus:ring-2
          focus:ring-emerald-500
          focus:border-transparent
        "
      />

    </div>

  </div>
);



/* SELECT FIELD */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  icon,
  children,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (

  <div>

    <label className="block text-sm font-semibold text-slate-700 mb-3">
      {label}
    </label>

    <div className="relative">

      <div
        className="
          absolute
          left-4 top-1/2
          -translate-y-1/2
          text-slate-400
          z-10
        "
      >
        {icon}
      </div>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="
          w-full
          pl-12 pr-4 py-4
          rounded-2xl
          border border-slate-200
          bg-white
          text-slate-900
          outline-none
          appearance-none
          transition-all
          focus:ring-2
          focus:ring-emerald-500
          focus:border-transparent
        "
      >
        {children}
      </select>

    </div>

  </div>
);