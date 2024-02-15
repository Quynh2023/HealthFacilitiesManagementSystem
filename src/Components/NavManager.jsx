import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavManager=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Manager' titles='Managers' allTitleLink='getAllManagers' addNewTitleLink='addManager' searchTitle='searchManager' searchContent='Manager Id'/>
    </div>
  )
}

export default NavManager;