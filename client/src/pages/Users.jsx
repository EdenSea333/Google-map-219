import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        // Define the async function inside the effect
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/read`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                setUsers(data.users);
            } catch (error) {
                console.error(error); // Handling the error
            }
        };

        // Call the async function
        fetchUsers();

        // If you have a cleanup function, you return it here
        // return () => { /* cleanup logic */ };

    }, [deleteUserId]);


    const handleDeleteUser = async (id) => {
        try {
            const res = await fetch(`/api/user/delete/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if(data.success === false) {
                return;
            }
            setDeleteUserId(id);
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
      }
  return (
    <div className='pr-12 pl-12'>
        <h2 className="flex justify-between text-xl font-semibold leading-tight text-gray-800 mt-5 mb-5 pr-10 pl-10">
			<p className='text-slate-500 text-3xl'>Users</p>
		</h2>
        <div className="mx-auto overflow-hidden bg-white shadow-xl sm:rounded-lg p-3">
            <table className="min-w-full divide-y divide-gray-200 mt-10 border-solid border-2 border-slate-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                    
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created at
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span className="sr-only">Edit</span>
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span className="sr-only">Delete</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {
                    users.map((item, index) => (
                    <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <img className= 'rounded-full h-7 w-7 object-cover' src={item.avatar} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{index+1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {item.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.createdAt}</td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-500 duration-100 rounded hover:text-slate-600">
                                <Link to={`/profile/${item._id}`}>
                                    <svg  xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 hover:text-green-500" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </Link>
                            </td> */}
                        <td onClick={()=>handleDeleteUser(item._id)}className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium  text-slate-500 duration-100 rounded hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </td>
                    </tr>
                    ))
                }
                </tbody>
            </table>    
        </div>
    </div>
  )
}