import { useState, useRef, useEffect } from "react";
import { useDispatch } from 'react-redux';


export default function Users() {
    const [files, setFiles] = useState([]);
    const fileRef = useRef(null);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await fetch(`/api/file/read`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                setFiles(data.files);
            } catch (error) {
                console.error(error); // Handling the error
            }
        };

        fetchFiles();

    }, [data, loading]);

    const handleFileDelete = async (id) => {
        try {
            const res = await fetch(`/api/file/delete/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            setData([data]);
        } catch (error) {
            
        }
    }
    const handleFileUpload = async (e) => {
        e.preventDefault();
        const uploadedFile = fileRef.current.files[0];

        if (!uploadedFile) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);
        try {
            const res = await fetch(`/api/file/upload`, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });
            setData([]);
        } catch (error) {
            
        }
        
        }
    const handleFileAdd = async (id) => {
        try {
            setLoading(true);
            await fetch(`/api/company/add/${id}`, {
                method: "POST",
            });
        } catch (error) {
            
        }
    }
        
    return (
        <div className='pr-12 pl-12'>
        <h2 className="flex justify-between text-xl font-semibold leading-tight text-gray-800 mt-5 mb-5 pr-10 pl-10">
			<p className='text-slate-500 text-3xl'>Files</p>
            <label  htmlFor="file-uploader"
					className="hidden sm:inline-block px-4 py-2 mr-3 text-sm text-slate-600 transition border-2 border-slate-500 rounded-full hover:bg-slate-600 hover:text-white hover:border-transparent cursor-pointer">Upload Excel File</label>
			<input className="hidden" id="file-uploader" type="file"  ref={fileRef} onChange={handleFileUpload}  accept=".xlsx, .xls" />

		</h2>
        <div className="mx-auto overflow-hidden bg-white shadow-xl sm:rounded-lg p-3">

            <table className="min-w-full divide-y divide-gray-200 mt-10 border-solid border-2 border-slate-200">
                <thead className="bg-gray-100">
                <tr>
                <th scope="col" className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No
                    </th>
                    <th scope="col" className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File Name
                    </th>
                    <th scope="col" className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                    </th>
                   
                    <th scope="col" className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th scope="col" className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="sr-only">Edit</span>
                    </th>
                    <th></th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {
                        files.map((item, index) => (
                            <tr key={item._id}>
                                <td className=" py-4 whitespace-nowrap text-center text-sm text-gray-500">{index+1}</td>
                                <td className=" py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.originalname}</td>
                                <td className=" py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.updatedAt}</td>
                                <td className={ item.status === "Unread" ? "text-slate-800 py-4 whitespace-nowrap text-center text-sm" : "text-slate-400 py-4 whitespace-nowrap text-center text-sm"}>{item.status}</td>
                                <td  className="flex  py-4 whitespace-nowrap text-center text-sm font-medium text-slate-500 duration-100 rounded ">
                                    <svg onClick ={() => handleFileDelete(item._id)}  xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 hover:text-red-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <button disabled={loading} onClick = {() => handleFileAdd(item._id)} className="ml-10 mt-1/2 text-slate-900 hover:text-blue-500">{item.status === "Unread" ? "Add" : ""}</button>
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
