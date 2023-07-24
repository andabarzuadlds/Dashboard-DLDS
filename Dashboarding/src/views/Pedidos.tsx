import { useEffect, useState } from 'react'
import '../assets/css/App.css'
import '../assets/css/Index.css'
import { type Order } from '../types'
import { OrdersList } from '../components/OrdersTable';
import NavBarTailwind from '../components/NavBarTailwind';
import { Pagination } from '../components/Pagination';


function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page: number) => {
    const response = await fetch(`http://127.0.0.1:8000/api/orders/all?page=${page}`);
    const data = await response.json();
    setOrders(data.data);
    setTotalPages(data.last_page); // Assuming the API returns this information
  }

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const [visiblePages, setVisiblePages] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page > visiblePages) {
      setVisiblePages(visiblePages + 1);
    }
  }
  return (
    <div className='App'>
      <NavBarTailwind />
      <br />
      <br />
      <OrdersList orders={orders}/>
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

export default App;
