import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Form, InputNumber, Select, Space, Table, Typography, message, Popconfirm } from "antd";
import axios from "../../../api/core/axios_base";

export default function Materiales() {
  const [data, setData] = useState({ materiales: [], productos: [], pedido: [] });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([axios.get("/materiales"), axios.get("/productos")]);
      setData(m.data); setProductos(p.data);
    } catch { message.error("No se pudieron cargar los materiales"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const save = async (values) => {
    try {
      await axios.put(`/materiales/productos/${values.producto_id}/${values.insumo_id}`, { cantidad: values.cantidad });
      form.resetFields(); await load(); message.success("Asignación guardada");
    } catch (e) { message.error(e.response?.data?.error || "No se pudo guardar"); }
  };
  const remove = async (r) => {
    try { await axios.delete(`/materiales/productos/${r.producto_id}/${r.insumo_id}`); await load(); }
    catch (e) { message.error(e.response?.data?.error || "No se pudo eliminar"); }
  };
  const saveDefault = async (codigo, cantidad) => {
    try { await axios.put(`/materiales/pedido/${codigo}`, { cantidad }); await load(); message.success("Cantidad guardada"); }
    catch (e) { message.error(e.response?.data?.error || "No se pudo guardar"); }
  };
  return <Space direction="vertical" style={{width: "100%"}} size="large">
    <Typography.Title level={2}>Materiales</Typography.Title>
    <Alert type="info" showIcon message="Los materiales suman al costo y descuentan inventario. No aparecen en la receta pública. Los combos heredan los materiales de sus componentes." />
    <Card title="Por producto">
      <Form form={form} layout="inline" onFinish={save} initialValues={{cantidad: 1}}>
        <Form.Item name="producto_id" rules={[{required: true}]}><Select style={{width: 240}} placeholder="Producto" showSearch optionFilterProp="label" options={productos.filter(p => !p.es_combo).map(p => ({value: p.id, label: p.nombre}))} /></Form.Item>
        <Form.Item name="insumo_id" rules={[{required: true}]}><Select style={{width: 220}} placeholder="Material" options={data.materiales.filter(m => !data.pedido.some(p => p.insumo_id === m.id)).map(m => ({value: m.id, label: m.nombre}))} /></Form.Item>
        <Form.Item name="cantidad" rules={[{required: true}]}><InputNumber min={0.001} aria-label="Cantidad por producto" /></Form.Item>
        <Button htmlType="submit" type="primary">Guardar</Button>
      </Form>
      <Table loading={loading} style={{marginTop: 20}} dataSource={data.productos} rowKey={r => `${r.producto_id}-${r.insumo_id}`} columns={[
        {title: "Producto", dataIndex: "producto"}, {title: "Material", dataIndex: "material"}, {title: "Cantidad", dataIndex: "cantidad"},
        {title: "Acciones", render: (_, r) => <Space><Button onClick={() => form.setFieldsValue({...r, cantidad: Number(r.cantidad)})}>Editar</Button><Popconfirm title="¿Retirar este material del producto?" onConfirm={() => remove(r)}><Button danger>Retirar</Button></Popconfirm></Space>}
      ]} />
    </Card>
    <Card title="Por pedido">
      <Typography.Paragraph>Se añaden una sola vez por pedido. En el POS puedes ajustar la cantidad utilizada antes de confirmar.</Typography.Paragraph>
      {data.pedido.map(r => <Form key={`${r.codigo}-${r.cantidad}`} layout="inline" initialValues={{cantidad: Number(r.cantidad)}} onFinish={v => saveDefault(r.codigo, v.cantidad)}>
        <Form.Item label={r.nombre} name="cantidad" rules={[{required: true}]}><InputNumber min={0} precision={0} /></Form.Item><Button htmlType="submit">Guardar cantidad predeterminada</Button>
      </Form>)}
    </Card>
  </Space>;
}
