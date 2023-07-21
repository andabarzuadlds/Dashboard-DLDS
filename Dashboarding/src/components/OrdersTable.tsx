import { useState, useEffect } from "react";
import { Order, Status } from '../types';
import { Button } from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";

interface Props {
  orders: Order[];
  [key: string]: number | string | any;
}

export function OrdersList({ orders: ordersProp }: Props) {
  const statusColors: Record<number, string>  = {
    1: 'bg-blue-500/50',
    2: 'bg-green-500',
    3: 'bg-pink-500',
    4: 'bg-yellow-500',
    5: 'bg-green-900',
    6: 'bg-red-500',
    7: 'bg-orange-500',
    8: 'bg-red-500',
    9: 'bg-pinl-800',
    10: 'bg-blue-500',
    11: 'bg-green-500',
    12: 'bg-pink-800',
    13: 'bg-blue-500',
    14: 'bg-orange-900',
    15: 'bg-orange-100',
    16: 'bg-brown-500',
    17: 'bg-purple-500',
    18: 'bg-yellow-500',
    19: 'bg-rose-900',
    20: 'bg-orange-200',
    21: 'bg-orange-400',

    22: 'bg-orange-300',
    23: 'bg-purple-800',
    24: 'bg-sky-400',
    25: 'bg-orange-900',
    26: 'bg-red-500',
    27: 'bg-orange-500',
    28: 'bg-pink-600',
    29: 'bg-sky-400',
    30: 'bg-sky-400',
    31: 'bg-sky-400',
    34: 'bg-sky-400',
    35: 'bg-orange-100',
    36: 'bg-yellow-500',
    37: 'bg-gray-100',
    38: 'bg-pink-500',
    39: 'bg-red-500',
    40: 'bg-rose-100',
    41: 'bg-green-400',
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [sumaTotal, setSumaTotal] = useState(0);
  const [uniqueCustomers, setUniqueCustomers] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSeller, setFilterSeller] = useState("");
  const [statusOptions, setStatusOptions] = useState<Status[]>([]);
  const [sellerOptions, setSellerOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/states/all')
      .then(response => response.json())
      .then(data => setStatusOptions(data))
      .catch(error => console.error('Error fetching order states:', error));
  }, []);

  useEffect(() => {
    setOrders(ordersProp ?? []);
    const sellers = Array.from(new Set(ordersProp?.map(order => order.vendedor)));
    setSellerOptions(sellers);
  }, [ordersProp]);

  useEffect(() => {
    let total = 0;
    let customers = new Set();
    let filtered = [...(ordersProp ?? [])];

    if (filterStatus !== "") {
      filtered = filtered.filter(order => order.status === Number(filterStatus));
    }

    if (filterSeller !== "") {
      filtered = filtered.filter(order => order.vendedor === filterSeller);
    }

    for (let order of filtered) {
      if (order && 'total' in order && 'customer_id' in order) {
        total += order.total;
        customers.add(order.customer_id);
      }
    }

    setUniqueCustomers(customers.size);
    setSumaTotal(total);
    setOrders(filtered);
  }, [ordersProp, filterStatus, filterSeller]);  

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/fetch_prestashop_orders');
      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }
      window.location.reload();
      <Alert>Insercion Correcta</Alert>;
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };
  

  useEffect(() => {
    let sortedOrders = [...orders];
    if (sortConfig.key !== "") {
      sortedOrders.sort((a, b) => {
        const key = sortConfig.key as keyof Order;
        if (key in a && key in b) {
          const aValue = a[key] as any;
          const bValue = b[key] as any;
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return aValue < bValue ? (sortConfig.direction === 'ascending' ? -1 : 1)
                                  : (sortConfig.direction === 'ascending' ? 1 : -1);
          }
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) 
                                                        : bValue.localeCompare(aValue);
          }
        }
        return 0;
      });
    }
    setOrders(sortedOrders);
  }, [sortConfig]);

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  });

  const formattedSumTotal = formatter.format(sumaTotal);

  const stats = [
    { id: 1, name: 'Ventas del Día', value: 'Por definir' },
    { id: 2, name: 'Total de Ventas', value: formattedSumTotal },
    { id: 3, name: 'Clientes', value: uniqueCustomers.toString() },
  ];

  return (
    <div className="flex flex-col">
      <br />
      <div className="mx-auto px-6 lg:px-8 py-6 bg-white border-4 rounded-lg border-indigo-600">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {(stats ?? []).map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 font-bold text-black">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-black sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="px-6 py-4 ">
        <div className="flex justify-between">
          <Button color="green" onClick={handleButtonClick} ><a>Recargar Listado</a></Button>
          <Button className="text-black" color="green"><a href="http://127.0.0.1:8000/api/customers/fetch_customers" target="blank" className="text-black" >Recargar Customers</a></Button>
        </div>
        <div className="flex justify-between">
          <label className="block text-sm font-bold px-80 font-medium text-black" htmlFor="statusFilter">
              Filtro  por Estado
            </label>
          <label className="block text-sm font-bold px-80 font-medium text-black" htmlFor="sellerFilter">
              Filtro por Vendedor
            </label>

        </div>
        <div className="flex justify-between">
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-4 rounded-lg border-indigo-600 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Todos</option>
            {(statusOptions ?? []).map((status, index) => (
              <option key={index} value={status.prestashop_status_id}>
                {status.name_state}
              </option>
            ))}
          </select>

          <select
            id="sellerFilter"
            value={filterSeller}
            onChange={(e) => setFilterSeller(e.target.value)}
            className="border-4 rounded-lg border-indigo-600 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Todos</option>
            {sellerOptions.map((seller, index) => (
              <option key={index} value={seller}>
                {seller}
              </option>
            ))}
          </select>
        </div>


      </div>

      <div className="-my-2  sm:-mx-6 lg:-mx-8 ">
        <div className="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
          <div className="shadow  border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 border-4 rounded-lg ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider cursor-pointer" onClick={() => requestSort('prestashop_order_id')}>ID PEDIDO</th>
                  <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider cursor-pointer" onClick={() => requestSort('vendedor')}>Vendedor</th>
                  <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider cursor-pointer" onClick={() => requestSort('email')}>Cliente</th>
                  <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider cursor-pointer" onClick={() => requestSort('status')}>Estado</th>
                  <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider cursor-pointer" onClick={() => requestSort('date_add')}>Fecha</th>
                  <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider cursor-pointer" onClick={() => requestSort('total')}>Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(orders ?? []).map(order => (
                  <tr
                    key={order.prestashop_order_id}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm   rounded-lg text-black">{order.prestashop_order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm   rounded-lg text-black">{order.vendedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm   rounded-lg text-black">{order.company}</td>
                    <td className={`${statusColors[order.status] ?? 'bg-white'} px-6 py-4 rounded-lg whitespace-nowrap text-sm text-black `}>{order.name_state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm   rounded-lg text-black">{order.date_add}</td>
                    <td className="px-6 py-4 bg-green-500 whitespace-nowrap text-sm rounded-lg text-black">{formatter.format(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
