'use client';
import React, { useState } from 'react';
import axios from 'axios';

// Define the types for the field structure
interface Field {
  name: string;
  type: string;
}

// List of field types with labels for dropdown
const fieldTypes = [
  { label: 'Email', value: 'internet.email' },
  { label: 'Username', value: 'internet.userName' },
  { label: 'Name', value: 'name.findName' },
  { label: 'Boolean', value: 'datatype.boolean' },
  { label: 'Price', value: 'commerce.price' },
  { label: 'City', value: 'address.city' },
  { label: 'Word', value: 'random.word' },
  { label: 'Phone', value: 'phone.phoneNumber' }, // Added Phone type
];

export default function Home() {
  const [modelName, setModelName] = useState('');
  const [fields, setFields] = useState<Field[]>([{ name: '', type: '' }]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mockData, setMockData] = useState<any[]>([]); // Store the fetched mock data
  const [isModelCreated, setIsModelCreated] = useState(false); // Track if model is created

  const handleAddField = () => {
    setFields([...fields, { name: '', type: '' }]);
  };

  const handleChangeField = (index: number, key: keyof Field, value: string) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleSubmit = async () => {
    // Add validation
    if (!modelName.trim()) {
      setMessage('Model name is required');
      return;
    }

    // Check if any field has empty name or type
    const hasEmptyFields = fields.some(field => !field.name.trim() || !field.type);
    if (hasEmptyFields) {
      setMessage('All fields must have a name and type');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/createModel', {
        modelName,
        fields,
      });
      setMessage(response.data.message);
      setIsModelCreated(true);
      setShowModal(true);
      await fetchMockData();
    } catch (err) {
      setMessage('Error creating model');
    }
  };

  const fetchMockData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${modelName}`);
      setMockData(response.data); // Store the fetched mock data
    } catch (err) {
      console.error('Error fetching mock data:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${modelName}_mock_data.json`;
    link.click();
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>

<h1 className="app-title">mAPI</h1>      
      <h2>Create Mock API Model</h2>
      
      <input
        placeholder="Model Name"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      
      {fields.map((field, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          <input
            placeholder="Field Name"
            value={field.name}
            onChange={(e) => handleChangeField(idx, 'name', e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <select
            value={field.type || 'Select Type'} // Default value for the dropdown
            onChange={(e) => handleChangeField(idx, 'type', e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              color: '#000',
            }}
          >
            <option value="Select Type" disabled>Select Type</option> {/* Default placeholder */}
            {fieldTypes.map((type, i) => (
              <option key={i} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={handleAddField}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            flex: 1, // Ensures the button stretches to match the others
          }}
        >
          Add Field
        </button>

        <button
          onClick={handleSubmit}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            flex: 1, // Ensures the button stretches to match the others
          }}
        >
          Create Model
        </button>
      </div>

      {showModal && (
  <div style={modalStyles}>
    <div style={modalContentStyles}>
      <button 
        onClick={handleCloseModal}
        style={closeButtonStyles}
        aria-label="Close modal"
      >
        ×
      </button>
      <h3>Model Created</h3>
      <p>{message}</p>
      {isModelCreated && (
        <button
          onClick={handleDownload}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            marginTop: '1rem',
            width: '100%',
          }}
        >
          Download
        </button>
      )}
    </div>
  </div>
)}


      <p>{message}</p>
    </main>
  );
}

// Modal Styles
const modalStyles: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const closeButtonStyles: React.CSSProperties = {
  position: 'absolute',
  right: '1rem',
  top: '1rem',
  fontSize: '1.5rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#666',
  padding: '0.5rem',
  lineHeight: '1',
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  textAlign: 'center',
  position: 'relative', // Add this line
  minWidth: '300px', // Add this to ensure modal has minimum width
};

const modalCloseButtonStyles: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  marginTop: '1rem',
};
