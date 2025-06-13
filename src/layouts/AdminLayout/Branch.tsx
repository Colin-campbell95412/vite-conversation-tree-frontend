import { useState } from 'react';
import { Table, Button, Input, Popconfirm, Form } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';

const Branch = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      no: 1,
      image_path: 'path/to/image1.jpg',
      title: 'Sample Title 1',
      logo_path: 'path/to/logo1.png'
    },
    {
      key: '2',
      no: 2,
      image_path: 'path/to/image2.jpg',
      title: 'Sample Title 2',
      logo_path: 'path/to/logo2.png'
    }
  ]);

  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(dataSource);

  const isEditing = (record: any) => record.key === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        newData.splice(index, 1, { ...row, key });
        setDataSource(newData);
        setFilteredData(newData);
        setEditingKey('');
      }
    } catch (err) {
      console.error('Validation Failed:', err);
    }
  };

  const deleteRow = (key: any) => {
    const newData = dataSource.filter((item: any) => item.key !== key);
    setDataSource(newData);
    setFilteredData(newData);
  };

  const addItem = () => {
    const newItem = {
      key: String(dataSource.length + 1),
      no: dataSource.length + 1,
      image_path: '',
      title: '',
      logo_path: ''
    };
    setDataSource((prev) => [...prev, newItem]);
    setFilteredData((prev) => [...prev, newItem]);
    setEditingKey(newItem.key);
    form.resetFields();
  };

  const handleSearch = (value: any) => {
    setSearchText(value);
    const filtered = dataSource.filter(item =>
      Object.values(item).some(val => String(val).toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  };

  const columns = [
    { title: 'No', dataIndex: 'no', render: (text: any, record: any) => renderEditableField('no', text, record) },
    { title: 'Image Path', dataIndex: 'image_path', render: (text: any, record: any) => renderEditableField('image_path', text, record) },
    { title: 'Title', dataIndex: 'title', render: (text: any, record: any) => renderEditableField('title', text, record) },
    { title: 'Logo Path', dataIndex: 'logo_path', render: (text: any, record: any) => renderEditableField('logo_path', text, record) },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button onClick={() => save(record.key)} type="link"   className="btn-admin-edit"><SaveOutlined /></Button>
            <Button onClick={cancel} type="link" className="btn-admin-delete"><ReloadOutlined /></Button>
          </>
        ) : (
          <>
            <Button onClick={() => edit(record)} type="link"  className="btn-admin-edit"><EditOutlined /></Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record.key)}>
              <Button type="link" className="btn-admin-delete"><DeleteOutlined /></Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const renderEditableField = (field: any, text: any, record: any) => {
    const editable = isEditing(record);
    return editable ? (
      <Form.Item name={field} style={{ margin: 0 }} rules={[{ required: true, message: `${field.replace('_', ' ')} is required.` }]}>
        <Input />
      </Form.Item>
    ) : (
      text
    );
  };

  return (
    <>
      <div className="d-flex justify-between">
        <Input
          placeholder="Search by any field"
          value={searchText}
          onChange={(e: any) => handleSearch(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button type="primary" onClick={addItem} style={{ height: '44px', marginLeft: '10px' }}>
          Add Item
        </Button>
      </div>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={filteredData}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (page) => setPagination({ ...pagination, current: page }),
            total: filteredData.length,
          }}
        />
      </Form>
    </>
  );
};

export default Branch;
