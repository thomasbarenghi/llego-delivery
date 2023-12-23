/* eslint-disable multiline-ternary */
import authOptions from '@/app/api/auth/[...nextauth]/auth.const'
import { EnumSteps } from '@/interfaces'
import { getOrder } from '@/services/orders/getOrder.service'
import { routes } from '@/utils/constants/routes.const'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { type FunctionComponent } from 'react'
import GoingPage from './_going/Going'
import ShopPage from './_shop/Shop'
import ResidencePage from './_residence/Residence'
import FinishedPage from './_finished/Finished'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orden activa | LleGo!'
}

interface Props {
  params: {
    orderId: string
  }
}

const MainPage: FunctionComponent<Props> = async ({ params }) => {
  const session = await getServerSession(authOptions)
  const { data: order } = await getOrder(params?.orderId ?? 'null')
  if (!order || !session?.user?.id) return

  if (order.dealerId !== session?.user?.id) {
    redirect(routes.dealer.WAITING_ORDER)
  }

  return (
    <>
      {order?.step === EnumSteps.GoingToShop ? (
        <GoingPage order={order} />
      ) : order?.step === EnumSteps.GettingOrder ? (
        <ShopPage order={order} />
      ) : order?.step === EnumSteps.GoingToCustomer ? (
        <GoingPage order={order} />
      ) : order?.step === EnumSteps.InCustomerPlace ? (
        <ResidencePage order={order} />
      ) : order?.step === EnumSteps.Delivered ? (
        <FinishedPage order={order} />
      ) : null}
    </>
  )
}

export default MainPage
