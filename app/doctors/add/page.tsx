import React from 'react';

export default function NewPatientForm() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Add New Patient</h2>
          <p className="text-sm text-slate-500 mt-1">Fill in the patient details below</p>
        </div>
        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          ← Back to Patients
        </button>
      </div>

      <form className="space-y-8">
        {/* Personal Information Section */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="First Name" placeholder="e.g. Sarah" />
            <InputField label="Last Name" placeholder="e.g. Mitchell" />
            <InputField label="Date of Birth" type="date" />
            <SelectField label="Gender" options={["Male", "Female", "Other"]} />
            <InputField label="Phone Number" placeholder="+1 (555) 000-0000" />
            <InputField label="Email Address" type="email" placeholder="patient@email.com" />
            <div className="md:col-span-2">
              <InputField label="Address" placeholder="Street address, city, state, ZIP" />
            </div>
          </div>
        </section>

        {/* Medical Information Section */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Blood Group" options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
            <SelectField label="Assigned Doctor" options={["Dr. Patel", "Dr. Chen", "Dr. Wong"]} />
            <div className="md:col-span-2">
              <InputField label="Known Allergies" placeholder="e.g. Penicillin, Latex (separate with commas)" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Chief Complaint / Notes</label>
              <textarea 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                placeholder="Describe the patient's primary complaint or any relevant medical history..."
              />
            </div>
          </div>
        </section>

        {/* Footer Buttons */}
        <div className="pt-6 border-t border-slate-100">
          <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
            Register Patient
          </button>
          <button type="button" className="w-full mt-4 text-slate-500 font-medium py-3 rounded-lg hover:bg-slate-100 transition-colors">
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Helper Components for cleaner code ---

const InputField = ({ label, type = "text", placeholder = "" }: { label: string, type?: string, placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
  </div>
);

const SelectField = ({ label, options }: { label: string, options: string[] }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
      <option>Select</option>
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);