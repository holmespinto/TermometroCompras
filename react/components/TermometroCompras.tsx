import React, { useEffect, useState } from 'react'
// se importa el useOrderForm para traerse el valor de los totales en el carrito de compras
import { useOrderForm } from 'vtex.order-manager/OrderForm'

// se trae el css que permite darle formato al termometro
import styles from './TermometroCompras.css'

// se desarrollo una  clase para optener el valor de la "Promo Envio Gratis"
class APICore {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  getDatos = () => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'Promotion',
      },
    }
    //Endpoint donde se consulta el valor de la promo
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
  // Inicializamos los estados de las variables porcentaje , resultado y totalpromo
  const [porcentaje, setPorcentaje] = useState(0)
  const [resultado, setResultado] = useState(0)
  const [totalpromo, setTotalPromo] = useState(0)

  // OrderForm es el  conjunto principal de dados del  processo de minicar de donde se estrae el valor total de la compra.
  const {
    orderForm: { totalizers },
  } = useOrderForm()

  const orderFormTotalizers = { totalizers }
  const orderFormValue = orderFormTotalizers.totalizers[0].value / 100
// se optiene el valor de la promo con la APICore
  const respuesta = api.getDatos()

  respuesta.then(function (response: any) {
    if (response) {
      //la consulta actualiza el esta do de la variable TotalPromo
      setTotalPromo(response.totalValueFloor / 100)
    }
  })
//Este hook se ejecuta al cambiar el valor de la variable orderFormValue
  useEffect(() => {
    //se realiza la validacion si el valor del minicart es menor a la promoción
    if (orderFormValue < totalpromo)
    //se actuaiza la variable resultado con la diferencia de la variable orderFormValue
    setResultado(totalpromo - orderFormValue)
    //se asigna el porcentaje
    setPorcentaje((orderFormValue * 100) / totalpromo)
  }, [orderFormValue, totalpromo])

  //se asigna a la variable value el valor del porcentaje
  const value: string = porcentaje > 100 ? `100` : `${porcentaje.toFixed(0)}`
  // se toman los valores del ancho que no se pase del 100% para aplicarcelo al css
  const width = {
    width: porcentaje > 100 ? `100%` : `${porcentaje.toFixed(0)}%`,
  }
//se configura el background para aplicar los colores respectivo al css del circulo
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
