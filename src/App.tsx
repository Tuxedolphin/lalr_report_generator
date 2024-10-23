import "./App.css"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddEntryPage from "./Pages/AddEntryPage";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/add_entry" element={<AddEntryPage/>}/>
      </Routes>
    </Router>
  )

}

export default App;
