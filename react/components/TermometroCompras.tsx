import React, { useEffect, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import styles from './TermometroCompras.css'

class APICore {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  getDatos = () => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'Promotion',
      },
    }

    const url = `https://holmes--itgloberspartnercl.myvtex.com/api/rnb/pvt/calculatorconfiguration/31da3c11-b693-43fc-a41d-b42ac4b27062`
    const getconsultar = async () => {
      try {
        const res = await fetch(url, options)
        const datos = await res.json()

        return datos
      } catch (error) {
        console.log(error)
      }
    }

    return getconsultar()
  }
}

const api = new APICore()
const TermometroCompras = () => {
  // Inicializamos los estados de las variables resultado y porcentaje

  const [porcentaje, setPorcentaje] = useState(0)
  const [resultado, setResultado] = useState(0)
  const [totalpromo, setTotalPromo] = useState(0)
  const {
    orderForm: { totalizers },
  } = useOrderForm()

  const orderFormTotalizers = { totalizers }
  const orderFormValue = orderFormTotalizers.totalizers[0].value / 100

  const respuesta = api.getDatos()

  respuesta.then(function (response: any) {
    if (response) {
      setTotalPromo(response.totalValueFloor / 100)
    }
  })

  useEffect(() => {
    if (orderFormValue < totalpromo) setResultado(totalpromo - orderFormValue)
    setPorcentaje((orderFormValue * 100) / totalpromo)
  }, [orderFormValue, totalpromo])

  const value: string = porcentaje > 100 ? `100` : `${porcentaje.toFixed(0)}`
  const width = {
    width: porcentaje > 100 ? `100%` : `${porcentaje.toFixed(0)}%`,
  }

  const background = {
    background: porcentaje > 100 ? `rgb(142, 94, 143)` : `rgb(236, 229, 229)`,
  }

  return (
    <div>
      <h1>Bolsa de Compras</h1>
      <div className={styles.container}>
        <div style={width} className={styles.chart}>
          <div className={`${styles.part} ${`percent_${value}`}`}>
            <div className={`${styles.bar} ${styles.red}`}>
              <div className={styles.label} />
            </div>
          </div>
        </div>
      </div>
      <div style={background} className={styles.circulo}>
        <div className={styles.car} />
      </div>
      {porcentaje < 100
        ? `Solo te falta $ ${resultado.toFixed(
            0
          )} para disfrutar del envío gratis`
        : `¡Felicitaciones,alcanzaste el envío gratis!`}
    </div>
  )
}

export default TermometroCompras
