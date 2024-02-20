import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function Header() {
    const { currentUser} = useSelector((state)=>state.user);
  const dispatch = useDispatch();

    const handleSignOut = async () => {
        try {
          dispatch(signOutUserStart());
          const res = await fetch(`/api/auth/signout`);
          const data = await res.json();
          if (data.success === false ){
            dispatch(signOutUserFailure(data.message));
            return;
          }
          dispatch(signOutUserSuccess(data));
        } catch (error) {
          dispatch(signOutUserFailure(error.message));
        }
      }
  return (
    <header className='bg-slate-200 shadow-md border-b-2 border-white border-solid'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-1 '>
            <Link to="/map">
                <div className='flex'>
                    <div style={{
                        backgroundImage: 'url("https://cdn-icons-png.flaticon.com/128/82/82269.png")',
                        height: '50px',
                        width: '50px',
                        backgroundSize: 'contain',
                        backgroundposition: 'center',
                        }} className='flex items-center bg-no-repeat rounded-full border-solid border-2 border-slate-300' />
                    <div className='font-bold text-sm sm:text-xl flex flex-wrap items-center ml-2'>
                        <span className='text-slate-500'>J.S &nbsp; </span>
                        <span className='text-slate-700'>MAP</span>
                    </div>

                </div>
            </Link>
            
            {/* <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type="text" placeholder = "Search..." className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                <FaSearch className='text-slate-600' />
            </form> */}
            <ul className='flex gap-4'>
                {/* <Link to="/">
                    <li className='hidden sm:inline text-slate-700 hover:text-blue-300'>Home</li>
                </Link> */}
                {/* <Link to='/about'>
                    <li className='hidden sm:inline text-slate-700 hover:text-blue-300'>About</li>
                </Link> */}
                {currentUser && currentUser.role === "admin" ? (
                    <ul className='flex gap-4'>
                        <Link to='/map'>
                            <li className='hidden md:inline text-slate-700 hover:text-blue-300'>Map</li>
                        </Link>
                        <Link to='/companies'>
                        <li className='hidden sm:inline text-slate-700 hover:text-blue-300'>Companies</li>
                        </Link>
                        <Link to='/file-list'>
                            <li className='hidden sm:inline text-slate-700 hover:text-blue-300'>File List</li>
                        </Link>
                        <Link to='/users'>
                            <li className='hidden sm:inline text-slate-700 hover:text-blue-300'>Users</li>
                        </Link>
                        <li onClick = {handleSignOut} className='hidden sm:inline text-slate-700 hover:text-blue-300'>Sign Out</li>
                        <Link to='/profile'>
                            <img className= 'rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                        </Link>
                    </ul>
                ): ( currentUser && currentUser.role === "user" ? (
                    <ul className='flex gap-4'>
                        <Link to='/map'>
                            <li className='hidden sm:inline text-slate-700 hover:text-blue-300'>Map</li>
                        </Link>
                        <li onClick = {handleSignOut} className='hidden sm:inline text-slate-700 hover:text-blue-300'>Sign Out</li>
                        <Link to='/profile'>
                            <img className= 'rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                        </Link>
                    </ul>
                    ):(
                        <ul className='flex gap-4'>
                            <Link to='/sign-in'>
                                <li className='hidden sm:inline text-slate-700 hover:text-blue-300'>Sign in</li>
                            </Link>
                        </ul>
                    )
                )}
            </ul>
        </div>
    </header>
  )
}
