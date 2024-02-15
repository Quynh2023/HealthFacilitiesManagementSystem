import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavInfection=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Infection' titles='Infections' allTitleLink='getAllInfections' addNewTitleLink='addInfection' searchTitle='searchInfection' searchContent='Infection Id'/>
    </div>
  )
}

export default NavInfection;