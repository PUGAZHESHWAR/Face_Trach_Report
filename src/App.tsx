import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AttendanceDashboard from './components/AttendanceDashboard';
import FaceRecognition from './components/FaceRecognition';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<FaceRecognition />} />
          <Route path="start" element={<AttendanceDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
