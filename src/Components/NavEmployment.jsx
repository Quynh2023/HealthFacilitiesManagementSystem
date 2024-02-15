import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavEmployment=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Employment' titles='Employments' allTitleLink='getAllEmployments' addNewTitleLink='addEmployment' searchTitle='searchEmployment' searchContent='Employment Id'/>
    </div>
  )
}

export default NavEmployment;