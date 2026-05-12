'use client';

import React, {
  useEffect,
  useState
} from 'react';

type Treatment = {
  TREATMENT_ID: number;
  TREATMENT_TYPE: string;
};

export default function AddPrescriptionPage() {

  const [treatments, setTreatments] =
    useState<Treatment[]>([]);

  const [formData, setFormData] = useState({
    treatmentId: '',
    medicineName: '',
    dosage: '',
    duration: '',
  });

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {

    try {

      const res = await fetch(
        '/api/treatments'
      );

      const data = await res.json();

      setTreatments(data);

    } catch (error) {

      console.error(error);

    }
  };

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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const res = await fetch(
        '/api/prescriptions',
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

      alert('Error adding prescription');

    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Add Prescription
        </h1>

        <p className="text-slate-500 mb-8">
          Create medicine prescription
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Treatment */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Treatment
            </label>

            <select
              name="treatmentId"
              value={formData.treatmentId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >

              <option value="">
                Select Treatment
              </option>

              {treatments.map((item) => (

                <option
                  key={item.TREATMENT_ID}
                  value={item.TREATMENT_ID}
                >
                  {item.TREATMENT_TYPE}
                </option>

              ))}

            </select>

          </div>

          <InputField
            label="Medicine Name"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleChange}
            placeholder="e.g. Amoxicillin"
          />

          <InputField
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g. 500mg Twice Daily"
          />

          <InputField
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 7 Days"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold"
          >
            Add Prescription
          </button>

        </form>

      </div>

    </div>
  );
}


const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder: string;
}) => (

  <div>

    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
    </label>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
    />

  </div>
);