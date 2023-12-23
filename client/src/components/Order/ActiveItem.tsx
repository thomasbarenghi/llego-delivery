'use client'
import { type OrderInterface, type Product, type TSteps } from '@/interfaces'

import Image from 'next/image'
import { type FunctionComponent } from 'react'
import { ProductOrderItem } from '..'

interface Props {
  order: OrderInterface
}

const formatStatus = (status: TSteps): string => {
  switch (status) {
    case 1:
      return 'Buscando repartidor'
    case 2:
      return 'Repartidor en camino'
    case 3:
      return 'Repartidor en tienda'
    case 4:
      return 'Repartidor en camino al cliente'
    case 5:
      return 'En el domicilio'
    case 6:
      return 'Entregado'
    default:
      return 'Algo salió mal'
  }
}

const OrderActiveItem: FunctionComponent<Props> = ({ order }) => (
  <div key={order.id} className='flex flex-col gap-4 rounded-xl border p-5 '>
    <div className='flex flex-col gap-2 sm:gap-0 items-start sm:items-center justify-between sm:flex-row'>
      <div className='flex items-center gap-2'>
        <Image
          alt='profile image'
          src={order.client?.profileImage || '/image/placeholder.png'}
          width={40}
          height={40}
          className='aspect-square rounded-full object-cover'
        />
        <p className='text-lg font-semibold'>Orden de {order?.client?.firstName}</p>
      </div>
      <div>
        <p className='text-xs'>Id: {order.id.slice(0, 5)}</p>
        <p className='text-xs'>Creación: {new Date(order.createdAt).toLocaleString()}</p>
        <p className='text-xs font-semibold'>Estado: {formatStatus(order.step)}</p>
      </div>
    </div>
    <div className='flex w-full flex-col gap-2'>
      {order.products.map((product: Product) => (
        <ProductOrderItem key={product.id} product={product} />
      ))}
    </div>
  </div>
)

export default OrderActiveItem
