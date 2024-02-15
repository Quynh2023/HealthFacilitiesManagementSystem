import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavEmailLog=() => {
  return (
    <div>
      <Nav />
      <SubNav title='EmailLog' titles='EmailLogs' allTitleLink='getAllEmailLogs' addNewTitleLink='addEmailLog' searchTitle='searchEmailLog' searchContent='EmailLog Id'/>
    </div>
  )
}

export default NavEmailLog;