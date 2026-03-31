import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  Popconfirm,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { fetchProductos } from "../../../api/pos/axios_productos";
import axiosInstance from "../../../api/core/axios_base";
import { uploadImage } from "../../../api/admin/axios_upload";
import { notifySuccess, notifyError } from "../../common/components/notifications";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [isCombo, setIsCombo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      form.setFieldsValue({ imagen: result.path });
      notifySuccess({ message: "Imagen subida correctamente" });
    } catch (error) {
      notifyError({ message: "Error al subir imagen", description: error.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      notifyError({ message: "Error al cargar productos" });
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsCombo(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setIsCombo(record.es_combo);
    
    let combo_items = [];
    if (record.combo_items) {
      if (typeof record.combo_items === "string") {
        try { combo_items = JSON.parse(record.combo_items); } catch(e){}
      } else {
        combo_items = record.combo_items;
      }
    }
    
    form.setFieldsValue({
      nombre: record.nombre,
      precio: record.precio,
      precio_delivery: record.precio_delivery,
      imagen: record.imagen,
      es_combo: record.es_combo,
      combo_items: combo_items,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/productos/${id}`);
      notifySuccess({ message: "Producto eliminado" });
      loadData();
    } catch (error) {
      notifyError({ message: "Error al eliminar producto" });
    }
  };

  const handleSave = async (values) => {
    try {
      const payload = {
        ...values,
        precio_delivery: values.precio_delivery || null,
        combo_items: values.es_combo ? (values.combo_items || []) : []
      };

      if (editingId) {
        await axiosInstance.put(`/productos/${editingId}`, payload);
        notifySuccess({ message: "Producto actualizado" });
      } else {
        await axiosInstance.post(`/productos/`, payload);
        notifySuccess({ message: "Producto creado" });
      }
      setIsModalVisible(false);
      loadData();
    } catch (error) {
      notifyError({ message: "Error al guardar producto" });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    {
      title: "Imagen",
      dataIndex: "imagen",
      key: "imagen",
      width: 100,
      render: (img) =>
        img ? <img src={img} alt="prod" style={{ width: 50, height: 50, objectFit: "cover" }} /> : "N/A",
    },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    {
      title: "Precio Local",
      dataIndex: "precio",
      key: "precio",
      render: (val) => `$${Number(val).toFixed(2)}`,
    },
    {
      title: "Precio Delivery",
      dataIndex: "precio_delivery",
      key: "precio_delivery",
      render: (val) => val != null ? `$${Number(val).toFixed(2)}` : "—",
    },
    {
      title: "Tipo",
      dataIndex: "es_combo",
      key: "es_combo",
      render: (isCombo) => (isCombo ? "Combo / Caja" : "Producto Individual"),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="¿Eliminar producto?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Gestión de Productos y Combos</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Nuevo Producto
        </Button>
      </div>

      <Table
        dataSource={productos}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? "Editar Producto" : "Nuevo Producto"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ es_combo: false }}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="precio" label="Precio Local" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} precision={2} />
          </Form.Item>

          <Form.Item name="precio_delivery" label="Precio Delivery (PedidosYa)">
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} precision={2} placeholder="Dejar vacío si no aplica" />
          </Form.Item>

          <Form.Item name="imagen" label="Imagen del Producto">
            <Input placeholder="Ruta de imagen (se completa automáticamente)" />
          </Form.Item>
          <div style={{ marginBottom: 24 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload(e.target.files[0]);
                }
                e.target.value = '';
              }}
              disabled={uploadingImage}
              style={{
                padding: '8px 12px',
                border: '1px dashed #d9d9d9',
                borderRadius: '6px',
                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                width: '100%',
                marginBottom: 8
              }}
            />
            {uploadingImage && <span style={{ color: '#1890ff' }}>Subiendo imagen...</span>}
          </div>

          <Form.Item name="es_combo" label="¿Es un Combo o Caja?" valuePropName="checked">
            <Switch onChange={setIsCombo} />
          </Form.Item>

          {isCombo && (
            <Form.List name="combo_items">
              {(fields, { add, remove }) => (
                <div style={{ padding: 10, border: '1px dashed #d9d9d9', borderRadius: 8, marginBottom: 24 }}>
                  <div style={{ marginBottom: 16, fontWeight: 'bold' }}>Productos que conforman esta caja:</div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, "id"]}
                        rules={[{ required: true, message: "Falta producto" }]}
                        style={{ margin: 0 }}
                      >
                        <Select
                          placeholder="Seleccionar producto"
                          style={{ width: 220 }}
                          options={productos.filter(p => !p.es_combo).map(p => ({
                            label: p.nombre,
                            value: p.id
                          }))}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "cantidad"]}
                        rules={[{ required: true, message: "Falta cantidad" }]}
                        style={{ margin: 0 }}
                      >
                        <InputNumber placeholder="Cantidad" min={1} />
                      </Form.Item>
                      <Button onClick={() => remove(name)} icon={<DeleteOutlined />} danger type="text" />
                    </Space>
                  ))}
                  <Form.Item style={{ margin: 0, marginTop: 10 }}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Añadir Producto a la Caja
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>
          )}

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Guardar</Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GestionProductos;
