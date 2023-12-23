'use client'
import { type Product } from '@/interfaces'
import Image from 'next/image'
import { type FunctionComponent } from 'react'
import ModalProduct from './Modal'
import { useDisclosure } from '@nextui-org/react'

interface Props {
  product: Product
  classname?: string
}

const ProductItem: FunctionComponent<Props> = ({ product, classname }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleOpen = (): void => {
    onOpen()
  }

  return (
    <>
      <div className={`flex basis-52 cursor-pointer flex-col gap-3 ${classname}`} onClick={handleOpen}>
        <div className='relative aspect-square w-full'>
          <Image
            src={product.thumbnail || '/image/placeholder.png'}
            alt={product.name}
            fill
            className='aspect-square rounded-2xl object-cover'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <div>
            <h3 className='text-base font-semibold'>{product.name}</h3>
            <p className='text-sm '>{product.shop.name}</p>
          </div>
          <p className='text-base font-semibold text-primary '>${product.price}</p>
        </div>
      </div>
      <ModalProduct product={product} isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default ProductItem
