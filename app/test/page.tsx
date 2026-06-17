'use client';

export default function TestPage() {
  async function testAPI() {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello CarePulse AI',
      }),
    });

    const data = await res.json();

    console.log(data);
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-10">
      <button
        onClick={testAPI}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Test OpenAI API
      </button>
    </div>
  );
}