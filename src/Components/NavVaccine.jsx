import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavVaccine=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Vaccine' titles='Vaccines' allTitleLink='getAllVaccines' addNewTitleLink='addVaccine' searchTitle='searchVaccine' searchContent='Vaccine Id'/>
    </div>
  )
}

export default NavVaccine;