'use client'
import { type FunctionComponent } from 'react'
import { type OrderInterface } from '@/interfaces'
import { Image } from '@nextui-org/react'

interface Props {
  order: OrderInterface
}

const TopBarClient: FunctionComponent<Props> = ({ order }) => (
  <section className='fixed inset-x-0 top-0 z-10 mx-auto w-full max-w-[800px] py-4'>
    <div className='flex w-full max-w-[800px] flex-col items-start 2xl:container'>
      <div className='flex w-full justify-between rounded-lg bg-black px-10 py-4'>
        <div className='flex flex-row  items-center gap-3 text-slate-200'>
          <Image
            alt='logo'
            height={40}
            radius='full'
            src={order?.shop?.thumbnail || '/image/placeholder.png'}
            width={40}
          />

          <p className='font-semibold'>{order?.shop?.name}</p>
        </div>
        <div className='flex items-center justify-center rounded-md bg-orange-400 px-10'>
          <p className='font-semibold'>Llega en 25min</p>
        </div>
      </div>
    </div>
  </section>
)

export default TopBarClient
