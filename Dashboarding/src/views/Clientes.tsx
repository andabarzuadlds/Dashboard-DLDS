import { useEffect, useState } from 'react'
import '../assets/css/App.css'
import '../assets/css/Index.css'
import { type Customer } from '../types'
import {CustomersTable}  from '../components/CustomersTable';
import NavBarTailwind from '../components/NavBarTailwind';
import { Pagination } from '../components/Pagination';
import { Input } from '@material-tailwind/react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Clientes() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');  // Nuevo estado para el término de búsqueda
  const [searchResults, setSearchResults] = useState<Customer[]>([]);  // Nuevo estado para los resultados de búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async (page: number) => {
    const response = await fetch(`http://127.0.0.1:8000/api/customers/search?page=${page}&search=${searchTerm}`);
    const data = await response.json();
    setCustomers(data.data);
    setTotalPages(data.last_page);
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage, searchTerm]);

  const [visiblePages, setVisiblePages] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page > visiblePages) {
      setVisiblePages(visiblePages + 1);
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {  // Nuevo manejador de eventos para la búsqueda
    setSearchTerm(event.target.value);

    if (event.target.value === '') {
      setSearchResults([]);
    } else {
      const results = customers.filter(customer => 
        customer.email.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  return (
    <div className='App'>
      <NavBarTailwind />
      <br />
      <div className="w-72 container grid grid-cols-3 gap-80">
          <div className="w-full md:w-72">
            <Input label="Buscar Cliente por ID" 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange} icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
          </div>
          <div className="w-full md:w-72">
            <Input label="Buscar Cliente por Email" 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange} icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
          </div>
          <div className="w-full md:w-72">
            <Input label="Buscar Cliente por Empresa" 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange} icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
          </div>

      </div>

      <CustomersTable customers={searchResults.length > 0 ? searchResults : customers}/> 
      <br />
      <center>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          visiblePages={visiblePages}
          onPageChange={handlePageChange}
        />
      </center>
    </div>
  )
}

export default Clientes;
