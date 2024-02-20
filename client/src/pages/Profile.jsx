import { useState, useRef, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserFaliure, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserSuccess, signOutUserFailure, signOutUserStart, deleteUserEnd, updateUserEnd } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const {id} = useParams();
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [users, setUsers] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] =useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/read`, {
          method: 'GET',    
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(res.ok){
          const data = await res.json();
          const user = data.users.find((item) => item._id === id);
          if (user) {
            setUsers(user); 
          }
        }
      } catch (error) {
          console.error(error); 
      }
    };

    fetchUser();

   
  },[id])
  
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
        (error) => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
                setFormData({...formData, avatar: downloadUrl});
            });
        }
      );
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    setUpdateSuccess(false);
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      if(id){
        const res = await fetch(`/api/user/update/${id}`, {
          method:'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body:JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFaliure(data.message));
          return;
        };
        dispatch(updateUserEnd());
      }else{
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method:'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body:JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFaliure(data.message));
          return;
        };
        dispatch(updateUserSuccess(data));
      }
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFaliure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      if(id){
        const res = await fetch(`/api/user/delete/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if(data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
        }
        dispatch(deleteUserEnd());
      }else{
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if(data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
        }
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
        dispatch(deleteUserFailure(error.message));
    }
  }

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
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className = 'text-3xl font-semibold text-center my-7'> Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 boject-cover cursor-pointer self-center mt-2" />
        <p className='text-sm self-center'>
          {fileUploadError ?
            (<span className='text-red-700'>Error Image Upload</span>) :
            (filePerc > 0 && filePerc < 100 ?  <span className='text-slate-700'>{`Uploading ${filePerc}%`} </span> 
                : (filePerc === 100 ? 
              <span className='text-green-700'>Image successfully uploaded!</span>: "")
            )
          }
        </p>
        <input onChange={handleChange} type="text" defaultValue={ currentUser.username } placeholder='username' id='username' className='boder p-3 rounded-lg' />
        <input onChange={handleChange} type="text" defaultValue={currentUser.email} placeholder='email' id='email' className='boder p-3 rounded-lg' />
        <input onChange={handleChange} type="password" placeholder='password' id='password' className='boder p-3 rounded-lg' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loding...': 'Update'}
          </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick = {handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <div>
        <p className='text-red-700'> {error? error : ""}</p>
        <p className='text-green-700 text-sm self-center mt-3'> {updateSuccess? "User is updated successfully!" : ""}</p>
      </div>
    </div>
  )
}
