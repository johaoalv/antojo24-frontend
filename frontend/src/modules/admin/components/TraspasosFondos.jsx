import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, InputNumber, Modal, Space, Table, Typography, message } from 'antd';
import { obtenerTesoreria } from '../../../api/admin/axios_dashboard';
import { crearTraspaso, obtenerTraspasos } from '../../../api/admin/axios_finanzas';

const cuentas = ['efectivo', 'yappy'];
const nombre = { efectivo: 'Efectivo', yappy: 'Yappy' };
const centavos = (n) => Math.round(Number(n) * 100);
const moneda = (n) => `$${Number(n).toFixed(2)}`;

export default function TraspasosFondos({ sucursalId, onConfirmado }) {
  const [visible, setVisible] = useState(false);
  const [historialVisible, setHistorialVisible] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [saldos, setSaldos] = useState(null);
  const [conservar, setConservar] = useState({});
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [pendiente, setPendiente] = useState(null);
  const [error, setError] = useState('');
  const enviando = useRef(false);
  const sucursalActual = useRef(sucursalId);
  sucursalActual.current = sucursalId;

  useEffect(() => {
    setVisible(false);
    setHistorialVisible(false);
    setSaldos(null);
    setPendiente(null);
    setError('');
  }, [sucursalId]);

  const cargarSaldos = async () => {
    setCargando(true);
    setSaldos(null);
    const sucursal = sucursalId;
    try {
      const data = await obtenerTesoreria(sucursal);
      if (sucursalActual.current !== sucursal) return;
      setSaldos(data.saldos_operativos);
      setConservar({ ...data.saldos_operativos });
    } catch {
      if (sucursalActual.current === sucursal) setError('No se pudieron cargar los saldos. Cierra y vuelve a abrir para reintentar.');
    } finally {
      setCargando(false);
    }
  };

  const abrir = async () => {
    setVisible(true);
    if (pendiente) return;
    setError('');
    await cargarSaldos();
  };

  const verHistorial = async () => {
    setHistorialVisible(true);
    setCargando(true);
    const sucursal = sucursalId;
    try {
      const rows = await obtenerTraspasos(sucursal);
      if (sucursalActual.current === sucursal) setHistorial(rows);
    } catch {
      message.error('No se pudo cargar el historial de traspasos');
      setHistorialVisible(false);
    } finally {
      setCargando(false);
    }
  };

  const valido = saldos && cuentas.every((m) => {
    if (conservar[m] === null || conservar[m] === undefined) return false;
    const saldo = centavos(saldos[m]);
    const restante = centavos(conservar[m]);
    return Number.isFinite(restante) && (saldo < 0 ? restante === saldo : restante >= 0 && restante <= saldo);
  });
  const total = saldos && valido ? cuentas.reduce((sum, m) => sum + centavos(saldos[m]) - centavos(conservar[m]), 0) / 100 : 0;

  const confirmar = async () => {
    if (enviando.current || (!pendiente && (!valido || total <= 0))) return;
    enviando.current = true;
    setGuardando(true);
    setError('');
    const solicitud = pendiente || {
      id: crypto.randomUUID(), sucursal_id: sucursalId,
      saldos_esperados: { ...saldos }, conservar: { ...conservar },
    };
    setPendiente(solicitud);
    try {
      await crearTraspaso(solicitud);
      if (sucursalActual.current !== solicitud.sucursal_id) return;
      setPendiente(null);
      setVisible(false);
      message.success('Traspaso registrado en Fondos Antojo24');
      onConfirmado();
    } catch (err) {
      if (sucursalActual.current !== solicitud.sucursal_id) return;
      if (err.response && [400, 409].includes(err.response.status)) {
        setPendiente(null);
        await cargarSaldos();
        setError(err.response.data?.error || 'Revisa los saldos antes de confirmar nuevamente.');
      } else {
        setError('No se pudo confirmar la respuesta. Reintenta para consultar o completar el mismo traspaso sin duplicarlo.');
      }
    } finally {
      enviando.current = false;
      setGuardando(false);
    }
  };

  return <>
    <Space wrap style={{ marginTop: 16 }}>
      <Button type="primary" onClick={abrir} disabled={!sucursalId || sucursalId === 'global'}>Traspasar a fondos</Button>
      <Button onClick={verHistorial}>Ver historial de traspasos</Button>
      {sucursalId === 'global' && <Typography.Text type="secondary">Selecciona una sucursal para traspasar.</Typography.Text>}
    </Space>
    <Modal title="Traspasar a Fondos Antojo24" open={visible} onCancel={() => !guardando && setVisible(false)}
      width={720} maskClosable={false} confirmLoading={guardando} onOk={confirmar}
      cancelButtonProps={{ disabled: guardando }}
      okButtonProps={{ disabled: cargando || (!pendiente && (!valido || total <= 0)) }}
      okText={pendiente ? 'Reintentar confirmación' : `Confirmar traspaso de ${moneda(total)}`}>
      <Typography.Paragraph>Indica cuánto quieres conservar para operar. El resto pasará a Fondos Antojo24.</Typography.Paragraph>
      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}
      <Table pagination={false} loading={cargando} rowKey="cuenta" scroll={{ x: 540 }}
        dataSource={saldos ? cuentas.map((cuenta) => ({ cuenta })) : []}
        columns={[
          { title: 'Cuenta', dataIndex: 'cuenta', render: (m) => nombre[m] },
          { title: 'Saldo actual', render: (_, r) => moneda(saldos[r.cuenta]) },
          { title: 'Quiero conservar', render: (_, r) => <InputNumber aria-label={`Conservar ${nombre[r.cuenta]}`}
            value={conservar[r.cuenta]} min={Math.min(0, Number(saldos[r.cuenta]))} max={Number(saldos[r.cuenta])}
            precision={2} step={1} disabled={guardando || !!pendiente || Number(saldos[r.cuenta]) < 0}
            onChange={(v) => setConservar((prev) => ({ ...prev, [r.cuenta]: v }))} /> },
          { title: 'Se traspasa', render: (_, r) => conservar[r.cuenta] == null ? '—' : moneda((centavos(saldos[r.cuenta]) - centavos(conservar[r.cuenta])) / 100) },
        ]} />
      <Typography.Paragraph style={{ marginTop: 16 }}>La Tesorería total se mantiene. Este movimiento no es un gasto ni cambia la utilidad.</Typography.Paragraph>
    </Modal>
    <Modal title="Historial de traspasos a Fondos Antojo24" open={historialVisible}
      onCancel={() => setHistorialVisible(false)} footer={null} width={850}>
      <Table loading={cargando} dataSource={historial} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 650 }}
        columns={[
          { title: 'Fecha', dataIndex: 'fecha', render: (v) => v?.replace('T', ' ').slice(0, 19) },
          { title: 'Sucursal', dataIndex: 'sucursal_id' },
          { title: 'Desde efectivo', dataIndex: 'efectivo', render: moneda },
          { title: 'Desde Yappy', dataIndex: 'yappy', render: moneda },
          { title: 'Total a fondos', dataIndex: 'total', render: moneda },
        ]} />
      <Typography.Text type="secondary">Últimos 50 traspasos. El libro de caja conserva todos los movimientos.</Typography.Text>
    </Modal>
  </>;
}
