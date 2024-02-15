import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavFacility=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Facility' titles='Facilities' allTitleLink='getAllFacilities' addNewTitleLink='addFacility' searchTitle='searchFacility' searchContent='Id, Name, or Phone Number'/>
    </div>
  )
}

export default NavFacility;