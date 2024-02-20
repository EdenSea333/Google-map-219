import React from 'react';

const Pagination = ({totalPages, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-5 mb-10 ">
      <ul className="flex items-center justify-center" >
        <li className={` hover:cursor-pointer border-solid border-2 border-slate-400 px-3 py-1 ${currentPage === 1 ? 'disabled:true' : 'disabled:flase'}`} onClick={() => paginate(currentPage-1, totalPages)}>&lt;</li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={ ` border-solid border-r-2 border-t-2 border-b-2 border-slate-400 text-gray-500 text-md hover:bg-gray-300 hover:text-white px-3 py-1 cursor-pointer 
                ${currentPage === number ? 'bg-gray-400 text-white' : ''}`}
            onClick={() => paginate(number, totalPages)}
          >
            {number}
          </li>
        ))}
        <li className={` hover:cursor-pointer border-solid border-r-2 border-t-2 border-b-2 border-slate-400 px-3 py-1 ${currentPage === 1 ? 'disabled:true' : 'disabled:flase'}`} onClick={() => paginate(currentPage+1, totalPages)}>&gt;</li>
      </ul>
    </nav>
  );
};

export default Pagination;