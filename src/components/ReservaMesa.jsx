import { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/contacto.css';

function ReservaMesa() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    fecha: '',
    cantidad: '',
    mensaje: ''
  });

  const dominiosValidos = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'aol.com', 'protonmail.com', 'live.com', 'msn.com', 'zoho.com',
    'mail.com', 'yandex.com', 'gmx.com', 'mail.ru', 'fastmail.com',
    'tutanota.com', 'hushmail.com', 'inbox.com', 'webmail.com', 'mailbox.org',
    'inbox.lv', 'rediffmail.com', 'seznam.cz', 'rocketmail.com', 'naver.com',
    'btinternet.com', 'cox.net', 'shaw.ca', 'bell.net', 'orange.fr',
    'wanadoo.fr', 'free.fr', 'laposte.net', 'libero.it', 'virgilio.it',
    'alice.it', 'tiscali.it', 'interia.pl', 'onet.pl', 'o2.pl',
    'op.pl', 'wp.pl', 'gazeta.pl', 'net.pl', 'home.pl',
    'daum.net', 'hanmail.net', 'nate.com', 'sina.com', 'qq.com',
    '163.com', '126.com', 'sohu.com', 'tom.com', 'yeah.net',
    'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'bellsouth.net',
    'earthlink.net', 'juno.com', 'netzero.com', 'charter.net', 'mac.com',
    'me.com', 'ymail.com', 'outlook.es', 'hotmail.es', 'live.es',
    'telefonica.net', 'terra.es', 'wanadoo.es', 'ono.com', 'euskalnet.net',
    'ya.com', 'web.de', 'gmx.de', 't-online.de', 'freenet.de',
    'bluewin.ch', 'sunrise.ch', 'chello.at', 'a1.net', 'ziggo.nl',
    'kpnmail.nl', 'planet.nl', 'xs4all.nl', 'telenet.be', 'skynet.be',
    'videotron.ca', 'rogers.com', 'sympatico.ca', 'telus.net', 'canada.com'
  ];

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      fecha: '',
      cantidad: '',
      mensaje: ''
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Aquí podrías enviar la info a una API real
    // Ejemplo con fetch si tuvieras un endpoint:
    /*
    await fetch('https://tu-api.com/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    */

    // Validación de nombre y apellido (solo letras y espacios)
    const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    if (!soloLetras.test(formData.nombre)) {
      return Swal.fire('Error', 'El nombre solo puede contener letras y espacios.', 'error');
    }
    if (!soloLetras.test(formData.apellido)) {
      return Swal.fire('Error', 'El apellido solo puede contener letras y espacios.', 'error');
    }

    // Validación de teléfono
    const soloNumeros = /^\d+$/;
    if (!soloNumeros.test(formData.telefono) || formData.telefono.length > 15) {
      return Swal.fire('Error', 'El teléfono debe contener solo números y tener máximo 15 dígitos.', 'error');
    }

    // Validación de cantidad de personas
    if (!soloNumeros.test(formData.cantidad)) {
      return Swal.fire('Error', 'La cantidad de personas debe ser un número válido.', 'error');
    }

    // Validación de email
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return Swal.fire('Error', 'El correo electrónico no es válido.', 'error');
    }
    const dominio = formData.email.split('@')[1];
    if (!dominiosValidos.includes(dominio)) {
      return Swal.fire('Error', `El dominio "${dominio}" no está permitido.`, 'error');
    }

    // Validación de fecha
    const hoy = new Date();
    const fechaReserva = new Date(formData.fecha);
    const dosMesesAdelante = new Date();
    dosMesesAdelante.setMonth(hoy.getMonth() + 2);

    if (fechaReserva < hoy || fechaReserva > dosMesesAdelante) {
      return Swal.fire('Error', 'La fecha debe estar entre hoy y dentro de los próximos 2 meses.', 'error');
    }

    // Si todo está OK:
    Swal.fire({
      title: '¡Reserva enviada!',
      text: `Gracias por tu reserva, ${formData.nombre}. Nos pondremos en contacto pronto.`,
      icon: 'success',
      confirmButtonText: 'OK'
    });

    handleReset();
  };

  return (
    <Container className="mt-5 p-4 bg-dark text-white rounded shadow-lg">
      <h2 className="text-center kalam-bold mb-4">Reservá tu mesa</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Juan"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                placeholder="Ej: 1122334455"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de reserva</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de personas</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                min="1"
                placeholder="Ej: 4"
                value={formData.cantidad}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Mensaje adicional (opcional)</Form.Label>
          <Form.Control
            as="textarea"
            name="mensaje"
            rows={3}
            placeholder="¿Algo que debamos saber?"
            value={formData.mensaje}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="botonera mt-4 text-center">
          <Button variant="secondary" type="button" onClick={handleReset} className="me-3">
            Borrar
          </Button>
          <Button variant="success" type="submit">
            Reservar mesa
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default ReservaMesa;