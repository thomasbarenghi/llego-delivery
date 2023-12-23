/* eslint-disable @typescript-eslint/indent */
'use client'
import { routes } from '@/utils/constants/routes.const'
import { Switch } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useContext, type FunctionComponent } from 'react'
import BaseTopBar from './Base'
import { Button } from '@/components'
import Link from 'next/link'
import { SocketContext } from '@/context/providers/socket.provider'

export enum Title {
  DISCONNECTED = 'Actualmente estás desconectado',
  CONNECTED = 'Ya estás conectado',
  ON_SHOP = 'Retira el pedido',
  GOING_CUSTOMER = 'Dirigete al cliente',
  GOING_SHOP = 'Dirigete al comercio',
  ON_RESIDENCE = 'Entrega el pedido'
}

export enum Description {
  DISCONNECTED = 'Cambia tu estado a activo para comenzar a recibir pedidos',
  WAITING_ORDER = '¡Prepárate para recibir pedidos!',
  IN_ORDER = 'Orden en curso',
  ON_SHOP = 'Verifica que el pedido sea correcto',
  GOING_CUSTOMER = 'Ve a entregar el pedido',
  GOING_SHOP = 'Ve a buscar el pedido',
  ON_RESIDENCE = 'Toca el timbre y espera'
}

interface Props {
  title: 'CONNECTED' | 'DISCONNECTED' | 'ON_SHOP' | 'GOING_CUSTOMER' | 'GOING_SHOP' | 'ON_RESIDENCE'
  description:
    | 'DISCONNECTED'
    | 'WAITING_ORDER'
    | 'IN_ORDER'
    | 'ON_SHOP'
    | 'GOING_CUSTOMER'
    | 'GOING_SHOP'
    | 'ON_RESIDENCE'
  switch?: boolean
  button?: boolean
  buttonAction?: () => Promise<void> | void
  buttonTitle?: string
  mapButton?: boolean
  mapButtonLink?: URL
  isSwitchActive: boolean
}

const TopBarDealer: FunctionComponent<Props> = ({
  title,
  description,
  button = false,
  buttonTitle = '',
  switch: switch_ = false,
  isSwitchActive,
  buttonAction,
  mapButton = false,
  mapButtonLink = ''
}) => {
  const router = useRouter()
  const socket = useContext(SocketContext)

  const handleSwitch = (val: boolean): void => {
    if (val) {
      if (description === 'DISCONNECTED') {
        router.push(routes.dealer.WAITING_ORDER)
      } else {
        router.push(routes.dealer.AVAILABILITY)
      }
    } else {
      router.push(routes.dealer.AVAILABILITY)
      socket.disconnect()
    }
  }

  return (
    <BaseTopBar>
      <div className='flex w-full flex-col items-start justify-between gap-3 2xl:container sm:flex-row sm:gap-0'>
        <div className={'flex w-full flex-col items-start gap-y-1'}>
          <div className='flex w-full items-start gap-10 md:gap-3'>
            <h1 className='text-2xl'>{Title[title]}</h1>
            {switch_ && (
              <Switch
                isSelected={isSwitchActive}
                onValueChange={(e) => {
                  handleSwitch(e)
                }}
                size='sm'
              />
            )}
          </div>
          <p>{Description[description]}</p>
        </div>
        <div className='flex flex-row gap-2'>
          {button && <Button title={buttonTitle} onClick={buttonAction} />}
          {mapButton && (
            <Link target='_blank' href={mapButtonLink.toString() ?? ''}>
              <Button title='Ver en Google Maps' variant='flat' />
            </Link>
          )}
        </div>
      </div>
    </BaseTopBar>
  )
}

export default TopBarDealer
