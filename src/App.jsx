import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './HomePage/Home';
import AllPostalCodes from './PostalCodePages/AllPostalCodes';
import AddPostalCode from './PostalCodePages/AddPostalCode';
import EditPostalCode from './PostalCodePages/EditPostalCode';
import DeletePostalCode from './PostalCodePages/DeletePostalCode';
import SearchPostalCode from './PostalCodePages/SearchPostalCode';
import AllFacilities from './FacilityPages/AllFacilities';
import EditFacility from './FacilityPages/EditFacility';
import DeleteFacility from './FacilityPages/DeleteFacility';
import AddFacility from './FacilityPages/AddFacility';
import SearchFacility from './FacilityPages/SearchFacility';
import AllEmployees from './EmployeePages/AllEmployees';
import AddEmployee from './EmployeePages/AddEmployee';
import DeleteEmployee from './EmployeePages/DeleteEmployee';
import EditEmployee from './EmployeePages/EditEmployee';
import SearchEmployee from './EmployeePages/SearchEmployee';
import AllEmployments from './EmploymentPages/AllEmployment';
import AddEmployment from './EmploymentPages/AddEmployment';
import EditEmployment from './EmploymentPages/EditEmployment';
import DeleteEmployment from './EmploymentPages/DeleteEmployment';
import SearchEmployment from './EmploymentPages/SearchEmployment';
import AllManagers from './ManagerPages/AllManagers';
import AddManager from './ManagerPages/AddManager';
import DeleteManager from './ManagerPages/DeleteManager';
import EditManager from './ManagerPages/EditManager';
import SearchManager from './ManagerPages/SearchManager';
import AllVaccines from './VaccinePages/AllVaccines';
import AddVaccine from './VaccinePages/AddVaccine';
import DeleteVaccine from './VaccinePages/DeleteVaccine';
import EditVaccine from './VaccinePages/EditVaccine';
import SearchVaccine from './VaccinePages/SearchVaccine';
import AllInfections from './InfectionPages/AllInfections';
import AddInfection from './InfectionPages/AddInfection';
import EditInfection from './InfectionPages/EditInfection';
import DeleteInfection from './InfectionPages/DeleteInfection';
import SearchInfection from './InfectionPages/SearchInfection';
import AllSchedules from './SchedulePages/AllSchedules';
import AddSchedule from './SchedulePages/AddSchedule';
import DeleteSchedule from './SchedulePages/DeleteSchedule';
import EditSchedule from './SchedulePages/EditSchedule';
import SearchSchedule from './SchedulePages/SearchSchedule';
import AllEmailLogs from './EmailLogPages/AllEmailLogs';
import AddEmailLog from './EmailLogPages/AddEmailLog';
import EditEmailLog from './EmailLogPages/EditEmailLog';
import DeleteEmailLog from './EmailLogPages/DeleteEmailLog';
import SearchEmailLog from './EmailLogPages/SearchEmailLog';
import Query1 from './QueryPages/Query1';
import Query2 from './QueryPages/Query2';
import Query3 from './QueryPages/Query3';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/getAllPostalCodes" element={<AllPostalCodes />} />
        <Route path="/addPostalCode" element={<AddPostalCode />} />
        <Route path="/deletePostalCode/:id" element={<DeletePostalCode/>} />
        <Route path="/editPostalCode/:id" element={<EditPostalCode/>} />
        <Route path="/searchPostalCode/:searchQuery" element={<SearchPostalCode />} />
        <Route path="/searchPostalCode/" element={<SearchPostalCode />} />

        <Route path="/getAllFacilities" element={<AllFacilities />} />
        <Route path="/editFacility/:id" element={<EditFacility/>} />
        <Route path="/deleteFacility/:id" element={<DeleteFacility/>} />
        <Route path="/addFacility" element={<AddFacility/>} />
        <Route path="/searchFacility/:searchQuery" element={<SearchFacility />} />
        <Route path="/searchFacility/" element={<SearchFacility />} />

        <Route path="/getAllEmployees" element={<AllEmployees />} />
        <Route path="/editEmployee/:id" element={<EditEmployee/>} />
        <Route path="/deleteEmployee/:id" element={<DeleteEmployee/>} />
        <Route path="/addEmployee" element={<AddEmployee/>} />
        <Route path="/searchEmployee/:searchQuery" element={<SearchEmployee />} />
        <Route path="/searchEmployee/" element={<SearchEmployee />} />

        <Route path="/getAllEmployments" element={<AllEmployments />} />
        <Route path="/addEmployment" element={<AddEmployment />} />
        <Route path="/deleteEmployment/:id" element={<DeleteEmployment/>} />
        <Route path="/editEmployment/:id" element={<EditEmployment/>} />
        <Route path="/searchEmployment/:searchQuery" element={<SearchEmployment />} />
        <Route path="/searchEmployment/" element={<SearchEmployment />} />

        <Route path="/getAllManagers" element={<AllManagers />} />
        <Route path="/addManager" element={<AddManager />} />
        <Route path="/deleteManager/:id" element={<DeleteManager/>} />
        <Route path="/editManager/:id" element={<EditManager/>} />
        <Route path="/searchManager/:searchQuery" element={<SearchManager />} />
        <Route path="/searchManager/" element={<SearchManager />} />

        <Route path="/getAllVaccines" element={<AllVaccines />} />
        <Route path="/addVaccine" element={<AddVaccine />} />
        <Route path="/deleteVaccine/:id" element={<DeleteVaccine/>} />
        <Route path="/editVaccine/:id" element={<EditVaccine/>} />
        <Route path="/searchVaccine/:searchQuery" element={<SearchVaccine />} />
        <Route path="/searchVaccine/" element={<SearchManager />} />

        <Route path="/getAllInfections" element={<AllInfections />} />
        <Route path="/addInfection" element={<AddInfection />} />
        <Route path="/deleteInfection/:id" element={<DeleteInfection/>} />
        <Route path="/editInfection/:id" element={<EditInfection/>} />
        <Route path="/searchInfection/:searchQuery" element={<SearchInfection />} />
        <Route path="/searchInfection/" element={<SearchInfection />} />

        <Route path="/getAllSchedules" element={<AllSchedules />} />
        <Route path="/addSchedule" element={<AddSchedule />} />
        <Route path="/deleteSchedule/:id" element={<DeleteSchedule/>} />
        <Route path="/editSchedule/:id" element={<EditSchedule/>} />
        <Route path="/searchSchedule/:searchQuery" element={<SearchSchedule />} />
        <Route path="/searchSchedule/" element={<SearchSchedule />} />

        <Route path="/getAllEmailLogs" element={<AllEmailLogs />} />
        <Route path="/addEmailLog" element={<AddEmailLog />} />
        <Route path="/deleteEmailLog/:id" element={<DeleteEmailLog/>} />
        <Route path="/editEmailLog/:id" element={<EditEmailLog/>} />
        <Route path="/searchEmailLog/:searchQuery" element={<SearchEmailLog />} />
        <Route path="/searchEmailLog/" element={<SearchEmailLog />} />

        <Route path="/getQuery1" element={<Query1 />} />
        <Route path="/getQuery2" element={<Query2 />} />
        <Route path="/getQuery3" element={<Query3 />} />


      </Routes>
    </Router>
  );
};

export default App;


