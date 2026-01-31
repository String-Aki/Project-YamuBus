import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import Home from './pages/Home';
import Tracker from './pages/Tracker';

function App() {
  return (
    <>
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track/:busId" element={<Tracker />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;