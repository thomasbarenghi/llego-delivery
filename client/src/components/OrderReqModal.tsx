/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect, useMemo, useContext, useRef } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CircularProgress
} from '@nextui-org/react'
import { debounce } from 'lodash'
import { handleOrder } from '@/services/socket/handlers'
import { SocketContext } from '@/context/providers/socket.provider'
import { type OrderInterface } from '@/interfaces'
import { useRouter } from 'next/navigation'
import { routes } from '@/utils/constants/routes.const'
import { Howl } from 'howler'
import { clientUrl } from '@/utils/constants/env.const'

const sound = new Howl({
  src: [clientUrl + '/sound/incomingOrder.mp3'],
  loop: true,
  html5: true
})

const OrderReqModal: React.FunctionComponent = () => {
  const router = useRouter()
  const [remainingTime, setRemainingTime] = useState(30)
  const [loading, setLoading] = useState(false)
  const [reqOrder, setReqOrder] = useState<OrderInterface | null>(null)
  const callbackRef = useRef<(accepted: boolean) => void>()
  const intervalRef = useRef<NodeJS.Timeout>()
  const { isOpen, onOpenChange, onClose } = useDisclosure()
  const socket = useContext(SocketContext)
  const soundRef = useRef<Howl>()

  const handleReject = (): void => {
    callbackRef.current?.(false)
    toInitialStatus()
  }

  const handleAccept = (): void => {
    callbackRef.current?.(true)
    setLoading(true)
    toInitialStatus()
  }

  const toInitialStatus = (): void => {
    onClose()
    setRemainingTime(30)
    setReqOrder(null)
    callbackRef.current = undefined
    soundRef?.current?.stop()
    soundRef?.current?.unload()
    soundRef.current = undefined
    clearInterval(intervalRef.current)
  }

  const handleInterval = (): (() => void) | undefined => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          handleReject()
          clearInterval(interval)
        }

        return prev - 1
      })
    }, 1000)

    intervalRef.current = interval

    return () => {
      clearInterval(interval)
    }
  }

  const incomingOrder = useMemo(
    () =>
      debounce((data: OrderInterface, callback: (accepted: boolean) => void) => {
        soundRef.current = sound
        soundRef?.current?.load()
        soundRef?.current?.play()
        handleInterval()
        callbackRef.current = callback
        setReqOrder(data)
        onOpenChange()
      }, 2000),
    []
  )

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    // Evita la acción predeterminada cuando se presiona la tecla "Play"
    if (event.key === 'Play') {
      event.preventDefault()
    }
  }

  useEffect(() => {
    handleOrder(socket, incomingOrder)
    socket.on('orderAssigned', (data: OrderInterface) => {
      setTimeout(() => {
        setLoading(false)
        router.push(routes.dealer.ORDER(data?.id))
      }, 2500)
    })

    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current.unload()
      }
    }
  }, [socket])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        isDismissable={false}
        placement='center'
        onKeyDown={handleKeyDown}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Pedido Entrante</ModalHeader>
          <ModalBody>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Cliente: {reqOrder?.client.firstName + ' ' + reqOrder?.client.lastName}</p>
              <p className='text-sm'>Tienda: {reqOrder?.shop?.name}</p>
              <p className='text-sm'>Distancia: {reqOrder?.distance}km</p>
            </div>
          </ModalBody>
          <ModalFooter className='flex items-center justify-between'>
            <p className='text-sm'>{remainingTime}s</p>
            <div className='flex gap-2'>
              <Button color='danger' variant='flat' onPress={handleReject}>
                Rechazar
              </Button>
              <Button
                color='primary'
                onPress={() => {
                  handleAccept()
                }}
              >
                Aceptar
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {loading && (
        <div className='fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-white'>
          <CircularProgress color='primary' aria-label='Loading...' />
        </div>
      )}
    </>
  )
}

export default OrderReqModal
