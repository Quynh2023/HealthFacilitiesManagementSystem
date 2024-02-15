import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavEmployee=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Employee' titles='Employees' allTitleLink='getAllEmployees' addNewTitleLink='addEmployee' searchTitle='searchEmployee' searchContent='Id, MedicareNumber, or PhoneNumber'/>
    </div>
  )
}

export default NavEmployee;