import {useState, useEffect} from 'react'
import Pagination from '../components/Pagination';


export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(15);
    const [totalPages, setTotalPages] = useState(null);
    const [order, setOrder] = useState(null);
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await fetch(`/api/company/read?page=${currentPage}&limit=${perPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                setTotalPages(data.totalPages);
                setCompanies(data.companies);
            } catch (error) {
                console.error(error); 
            }
        };
        setOrder(perPage*(currentPage-1)+1);
        fetchCompanies();

    }, [currentPage]);
    // Change page
    const paginate = (pageNumber, totalItems) => {
        if(pageNumber === 0 || pageNumber > totalItems ){
            return;
        }else{
            setCurrentPage(pageNumber);
        }
    }
  return (
    <div className='pr-12 pl-12'>
    <h2 className="flex justify-between text-xl font-semibold leading-tight text-gray-800 mt-5 mb-5 pr-10 pl-10">
        <p className='text-slate-500 text-3xl'>Company List</p>

    </h2>
    <div className="mx-auto overflow-hidden p-3 bg-white shadow-xl sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 mt-10 table-fixed border-solid border-2 border-slate-200">
            <thead className="bg-gray-100">
            <tr>
                <th scope="col" className=" px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    No
                </th>
                <th scope="col" className=" px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    Company
                </th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    Name
                </th>
               
                <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    Title
                </th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    Email
                </th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    No of Employee
                </th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    Website
                </th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    Colocation Center
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    Address
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-solid border-2 border-slate-200">
                    status
                </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {
                    companies.map((item, index) => (
                        <tr key={item._id}>
                            <td className=" border-solid border-2 border-slate-200 px-2 py-3 w-1/12  text-center text-sm text-gray-500">{order+index}</td>
                            <td className=" border-solid border-2 border-slate-200 px-2 py-3 w-1/12  text-center text-sm text-gray-500">{item.company}</td>
                            <td className=" border-solid border-2 border-slate-200 px-2 py-3 w-1/12  text-center text-sm text-gray-500">{item.companyname}</td>
                            <td className=" border-solid border-2 border-slate-200 px-0 py-3 w-2/12  text-center text-sm text-gray-500">{item.title}</td>
                            <td className=" border-solid border-2 border-slate-200 px-0 py-3 w-1/12  text-center text-sm text-gray-500">{item.email}</td>
                            <td className=" border-solid border-2 border-slate-200 px-2 py-3 w-1/12  text-center text-sm text-gray-500">{item.employeecount}</td>
                            <td className=" border-solid border-2 border-slate-200 px-1 py-3 w-1/12  text-center text-sm text-gray-500">{item.website}</td>
                            <td className=" border-solid border-2 border-slate-200 px-1 py-3 w-1/12  text-center text-sm text-gray-500">{item.colocation}</td>
                            <td className=" border-solid border-2 border-slate-200 px-2 py-3 w-4/12  text-center text-sm text-gray-500">{item.address}</td>
                            {/* <td className=" border-solid border-2 border-slate-200 px-2 py-3 w-4/12  text-center text-sm text-gray-500">{item.hub}</td> */}
                            <td className={ item.status === "Unadd" ? " border-solid border-2 border-slate-200 w-1/12 text-slate-800 py-4 text-center text-sm" : "border-solid border-2 border-slate-200 w-1/12 text-slate-400 py-4 whitespace-nowrap text-center text-sm"}>{item.status}</td>
                            {/* <td  className="flex  py-4 whitespace-nowrap text-center text-sm font-medium text-slate-500 duration-100 rounded ">
                                <svg onClick ={() => handleFileDelete(item._id)}  xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 hover:text-red-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </td> */}
                        </tr>
                    ))
                }
            </tbody>
        </table>    
    </div>
    {
        companies ? 
        <Pagination
            totalPages={totalPages}
            paginate={paginate}
            currentPage={currentPage}
        /> : ""
    }
    </div>
  )
}
