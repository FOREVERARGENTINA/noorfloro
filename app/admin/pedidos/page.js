'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/products'

// Mock orders data
const mockOrders = []

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Procesando' },
  completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completado' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter)

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-2">Gestiona los pedidos de tu tienda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Procesando</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Completados</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label htmlFor="statusFilter" className="label">Filtrar por estado</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input max-w-xs"
        >
          <option value="all">Todos los pedidos</option>
          <option value="pending">Pendientes</option>
          <option value="processing">Procesando</option>
          <option value="completed">Completados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusColors[order.status]
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.items.length} productos</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {order.createdAt}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium ${status.bg} ${status.text} rounded-full`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-sky-600 hover:text-sky-700 font-medium"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Pedido</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order Info */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">{selectedOrder.orderNumber}</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.createdAt}</p>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold mb-2">Información del Cliente</h4>
                  <div className="bg-gray-50 rounded p-4 space-y-1">
                    <p className="text-sm"><span className="font-medium">Nombre:</span> {selectedOrder.customer.name}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p className="text-sm"><span className="font-medium">Teléfono:</span> {selectedOrder.customer.phone}</p>
                    <p className="text-sm"><span className="font-medium">Dirección:</span> {selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-2">Productos</h4>
                  <div className="border rounded overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Producto</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Cantidad</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Precio</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatPrice(item.price)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-right">
                              {formatPrice(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-right font-semibold">Total:</td>
                          <td className="px-4 py-3 text-right font-bold text-lg">
                            {formatPrice(selectedOrder.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="font-semibold mb-2">Estado del Pedido</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="input"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">Procesando</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cerrar
                  </button>
                  <button className="btn btn-primary">
                    Enviar actualización al cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
