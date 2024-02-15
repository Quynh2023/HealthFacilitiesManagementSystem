import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavPostalCode=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Postal Code' titles='Postal Codes' allTitleLink='getAllPostalCodes' addNewTitleLink='addPostalCode' searchTitle='searchPostalCode' searchContent='Id, or Postal Code'/>
    </div>
  )
}

export default NavPostalCode;