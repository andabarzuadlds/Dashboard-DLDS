import { Customer } from '../types';

interface Props {
  customers: Customer[];
}

export function CustomersTable({ customers }: Props) {
  return (
    <div className="flex flex-col">
      <br />
      <div className="table-container mx-auto px-6 lg:px-8 py-6 bg-white border-4 rounded-lg border-indigo-600">
        <div className="shadow border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 border-4 rounded-lg ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider">ID CLIENTE</th>
                <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider">NOMBRE</th>
                <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-3 text-xs font-bold font-medium text-black uppercase tracking-wider">Vendedor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(customers ?? []).map(customer => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm rounded-lg text-black">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm rounded-lg text-black">{customer.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm rounded-lg text-black">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm rounded-lg text-black">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm rounded-lg text-black">{customer.vendedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
