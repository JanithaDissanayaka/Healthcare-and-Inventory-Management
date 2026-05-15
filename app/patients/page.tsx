'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import {
  Users,
  Phone,
  MapPin,
  CalendarDays,
  Eye,
  UserRound,
} from 'lucide-react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
  DOB: string;
  GENDER: string;
  PHONE: string;
  ADDRESS: string;
};

type GenderStat = {
  GENDER: string;
  TOTAL: number;
};

type ActivePatient = {
  NAME: string;
};

export default function PatientsPage() {

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [genderStats, setGenderStats] =
    useState<GenderStat[]>([]);

  const [activePatients, setActivePatients] =
    useState<ActivePatient[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');



  // LOAD PATIENTS
  useEffect(() => {
    fetchPatients();
  }, []);



  const fetchPatients = async () => {

    try {

      const res = await fetch('/api/patients');

      const data = await res.json();



      // FIXED FOR NEW API RESPONSE
      setPatients(
        data.patients || []
      );

      setGenderStats(
        data.genderStats || []
      );

      setActivePatients(
        data.activePatients || []
      );

    } catch (error) {

      console.error(error);

      setPatients([]);

    } finally {

      setLoading(false);

    }
  };



  // FILTER
  const filteredPatients = useMemo(() => {

    return patients.filter(
      (patient) =>

        patient.NAME?.toLowerCase().includes(
          search.toLowerCase()
        ) ||

        patient.PHONE?.includes(search) ||

        patient.ADDRESS?.toLowerCase().includes(
          search.toLowerCase()
        )
    );

  }, [patients, search]);



  // GET GENDER COUNT
  const getGenderTotal = (
    gender: string
  ) => {

    const item = genderStats.find(
      (g) =>
        g.GENDER?.toLowerCase() ===
        gender.toLowerCase()
    );

    return item?.TOTAL || 0;
  };



  // LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 p-8">

        <div
          className="
            bg-white
            rounded-3xl
            border border-slate-200
            p-10
            text-center
            shadow-sm
          "
        >

          <div
            className="
              h-14 w-14
              rounded-full
              border-4 border-emerald-500
              border-t-transparent
              animate-spin
              mx-auto
            "
          ></div>

          <p className="mt-6 text-slate-600 font-medium">
            Loading patients...
          </p>

        </div>

      </div>
    );
  }



  return (

    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* TOP SECTION */}
      <div
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-sm
          p-6 lg:p-8
          mb-8
        "
      >

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

          {/* TOTAL */}
          <div
            className="
              rounded-3xl
              bg-slate-50
              border border-slate-200
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Patients
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {patients.length}
                </h2>

              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-emerald-100
                  flex items-center justify-center
                "
              >

                <Users
                  className="text-emerald-600"
                  size={24}
                />

              </div>

            </div>

          </div>



          {/* MALE */}
          <div
            className="
              rounded-3xl
              bg-slate-50
              border border-slate-200
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Male Patients
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {getGenderTotal('male')}
                </h2>

              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-cyan-100
                  flex items-center justify-center
                "
              >

                <UserRound
                  className="text-cyan-600"
                  size={24}
                />

              </div>

            </div>

          </div>



          {/* FEMALE */}
          <div
            className="
              rounded-3xl
              bg-slate-50
              border border-slate-200
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Female Patients
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {getGenderTotal('female')}
                </h2>

              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-pink-100
                  flex items-center justify-center
                "
              >

                <UserRound
                  className="text-pink-600"
                  size={24}
                />

              </div>

            </div>

          </div>

        </div>



        {/* SUBQUERY RESULTS */}
        <div className="mt-8">

          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Patients With Appointments
          </h2>

          <div className="flex flex-wrap gap-3">

            {activePatients.map((patient, index) => (

              <div
                key={index}
                className="
                  px-4 py-2
                  rounded-2xl
                  bg-emerald-100
                  text-emerald-700
                  text-sm
                  font-semibold
                "
              >
                {patient.NAME}
              </div>

            ))}

          </div>

        </div>

      </div>



      {/* TABLE CARD */}
      <div
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-sm
          overflow-hidden
        "
      >

        {/* TABLE HEADER */}
        <div
          className="
            flex items-center justify-between
            p-6
            border-b border-slate-200
          "
        >

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Patient Records
            </h2>

            <p className="text-slate-500 mt-1">
              Complete healthcare patient list
            </p>

          </div>

          <div
            className="
              px-4 py-2
              rounded-2xl
              bg-emerald-100
              text-emerald-700
              text-sm
              font-semibold
            "
          >
            {filteredPatients.length} Records
          </div>

        </div>



        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            {/* HEAD */}
            <thead className="bg-slate-50">

              <tr>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Patient
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  DOB
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Gender
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Phone
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Address
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Action
                </th>

              </tr>

            </thead>



            {/* BODY */}
            <tbody>

              {filteredPatients.length > 0 ? (

                filteredPatients.map((patient) => (

                  <tr
                    key={patient.PATIENT_ID}
                    className="
                      border-t border-slate-100
                      hover:bg-slate-50
                      transition-all
                    "
                  >

                    {/* PATIENT */}
                    <td className="p-5">

                      <div className="flex items-center gap-4">

                        {/* AVATAR */}
                        <div
                          className="
                            h-12 w-12
                            rounded-2xl
                            bg-gradient-to-br
                            from-emerald-500
                            to-cyan-500
                            flex items-center justify-center
                            text-white
                            font-bold
                          "
                        >
                          {patient.NAME?.charAt(0)}
                        </div>



                        {/* INFO */}
                        <div>

                          <h3 className="font-semibold text-slate-900">
                            {patient.NAME}
                          </h3>

                          <p className="text-sm text-slate-500">
                            ID #{patient.PATIENT_ID}
                          </p>

                        </div>

                      </div>

                    </td>



                    {/* DOB */}
                    <td className="p-5">

                      <div className="flex items-center gap-2 text-slate-700">

                        <CalendarDays
                          size={16}
                          className="text-slate-400"
                        />

                        {patient.DOB?.split('T')[0]}

                      </div>

                    </td>



                    {/* GENDER */}
                    <td className="p-5">

                      <span
                        className={`
                          px-3 py-1
                          rounded-full
                          text-xs font-semibold

                          ${
                            patient.GENDER?.toLowerCase() ===
                            'male'
                              ? 'bg-cyan-100 text-cyan-700'
                              : 'bg-pink-100 text-pink-700'
                          }
                        `}
                      >
                        {patient.GENDER}
                      </span>

                    </td>



                    {/* PHONE */}
                    <td className="p-5">

                      <div className="flex items-center gap-2 text-slate-700">

                        <Phone
                          size={16}
                          className="text-slate-400"
                        />

                        {patient.PHONE}

                      </div>

                    </td>



                    {/* ADDRESS */}
                    <td className="p-5">

                      <div className="flex items-center gap-2 text-slate-700 max-w-[250px]">

                        <MapPin
                          size={16}
                          className="text-slate-400 min-w-[16px]"
                        />

                        <span className="truncate">
                          {patient.ADDRESS}
                        </span>

                      </div>

                    </td>



                    {/* ACTION */}
                    <td className="p-5">

                      <Link
                        href={`/patients/${patient.PATIENT_ID}`}
                        className="
                          inline-flex items-center gap-2
                          px-4 py-2
                          rounded-xl
                          bg-emerald-50
                          hover:bg-emerald-100
                          text-emerald-700
                          text-sm
                          font-semibold
                          transition
                        "
                      >

                        <Eye size={16} />

                        View

                      </Link>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center p-16"
                  >

                    <div
                      className="
                        h-20 w-20
                        rounded-full
                        bg-slate-100
                        flex items-center justify-center
                        mx-auto mb-5
                      "
                    >

                      <Users
                        className="text-slate-400"
                        size={36}
                      />

                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      No Patients Found
                    </h3>

                    <p className="text-slate-500 mt-2">
                      No patient records available.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}