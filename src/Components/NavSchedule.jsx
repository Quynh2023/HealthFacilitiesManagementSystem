import Nav from '../Components/Nav';
import SubNav from '../Components/SubNav';

const NavSchedule=() => {
  return (
    <div>
      <Nav />
      <SubNav title='Schedule' titles='Schedules' allTitleLink='getAllSchedules' addNewTitleLink='addSchedule' searchTitle='searchSchedule' searchContent='Schedule Id'/>
    </div>
  )
}

export default NavSchedule;