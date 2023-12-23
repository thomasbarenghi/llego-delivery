import { ProductGrid } from '@/components'
import { getShop } from '@/services/shops/getShop.service'
import { type FunctionComponent } from 'react'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tienda | LleGo!'
}

interface Props {
  params: {
    shopId: string
  }
}

const ShopPage: FunctionComponent<Props> = async ({ params }) => {
  const { data: shop } = await getShop(params.shopId)
  if (!shop) return null
  return (
    <>
      <h2 className='text-2xl font-semibold'>Productos</h2>
      <ProductGrid products={shop.products ?? []} />
    </>
  )
}

export default ShopPage
