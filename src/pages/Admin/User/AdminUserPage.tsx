import { useEffect, useState } from 'react';
import { Table, Button, Input, Popconfirm, Row, Col, Checkbox } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLayout from 'layouts/AdminLayout/AdminLayout';
import Toast from 'components/Toast/Toast';
import { apiDelete, apiGet } from 'ajax/apiServices';
import { UrlAdminUsers, UrlAdminDeleteUser, UrlAdminBulkDeleteUsers } from 'ajax/apiUrls';
import { useNavigate } from "react-router-dom";
import { showEditUserModal } from './EditUserModal/ShowEditUserModal';

const AdminUserPage = ({ history }: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, [history]);

  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length}
          checked={selectedRowKeys.length === dataSource.length}
          onChange={(e) => {
            const checked = e.target.checked;
            const newSelectedKeys = checked ? dataSource.map((item: any) => item.key) : [];
            setSelectedRowKeys(newSelectedKeys as never[]);
          }}
        />
      ),
      width: '20px',
      dataIndex: 'checkbox',
      render: (_: any, record: { key: any }) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            const checked = e.target.checked;
            let tmpList: string[] = [];
            tmpList = [...selectedRowKeys] as any[];
            if (checked) {
              setSelectedRowKeys([...tmpList, record.key])
            } else {
              setSelectedRowKeys(tmpList.filter(key => key !== record.key))
            }
          }}
        />
      ),
    },
    {
      title: 'No',
      dataIndex: 'no',
      width: '20px',
      render: (_: any, __: any, index: any) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      render: (text: any) => {
        return <span>{text}</span>
      },
    },
   
    {
      title: 'Action',
      dataIndex: 'action',
      width: '100px',
      render: (_: any, record: any) => {
        return <>

          <Button type="link" onClick={() => editRow(record)}>
            <EditOutlined style={{ fontSize: '20px', color: 'blue' }} />
          </Button>

          <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record.key)}>
            <Button type="link">
              <DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
            </Button>
          </Popconfirm>
        </>;
      },
    },
  ];

  const fetchData = async () => {
    apiGet(UrlAdminUsers)
      .then((res: any) => {
        const fetchedData = res
          .map((item: any) => ({
            ...item,
            key: String(item.id),
          }));
        setDataSource(fetchedData);
        setFilteredData(fetchedData);
      })
      .catch(() => {
        console.log('Error fetching data');
      });

  };
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      Toast('No users selected for deletion.', "error");
      return;
    }
    const idsToDelete = selectedRowKeys;
    const formData = new FormData();
    formData.append('ids', JSON.stringify(idsToDelete));
    apiDelete(UrlAdminBulkDeleteUsers, formData)
      .then(() => {
        const updatedData = dataSource.filter((item: any) => !idsToDelete.includes(item.key));
        setDataSource(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);

        Toast('Selected contacts deleted successfully!', "success");
      })
      .catch((err) => {
        Toast(err, "error");
      });
  };
  const editRow = async (record: any) => {

    let dlgRes = await showEditUserModal({
      data: record,
      method: "edit",
      show: true,
      onSuccess: fetchData,
    })

    if (dlgRes == null) return

  };

  const deleteRow = async (key: any) => {
    const newData = dataSource.filter((item: any) => item.key !== key);
    setDataSource(newData);
    setFilteredData(newData);

    setPagination({ 
      ...pagination,
      current: pagination.current > Math.ceil(newData.length / pagination.pageSize) ? Math.ceil(newData.length / pagination.pageSize) : pagination.current,
      pageSize: pagination.pageSize
    });

    apiDelete(`${UrlAdminDeleteUser}/${key}`)
      .then(() => {
        Toast('User deleted successfully!', "success");
      })
      .catch((err) => {
        Toast(err, "error");
      });
  };

  const handleSearch = (value: any) => {
    const filtered = dataSource.filter(item =>
      Object.entries(item)
        .filter(([key]) => key === 'username')
        .some(([, val]) => String(val).toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  };

  async function handleAdd(): Promise<void> {
    let dlgRes = await showEditUserModal({
      data: {},
      method: "add",
      show: true,
      onSuccess: fetchData,
    })

    if (dlgRes == null) return
  }

  return (
    <AdminLayout>
      <Row className="table-nav">
        <Col className="d-flex">
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              danger
              onClick={handleBulkDelete}
              icon={<DeleteOutlined />}
              style={{ marginRight: '16px', marginTop: '10px', height: '33px' }}
            >
              Delete {selectedRowKeys.length} {selectedRowKeys.length > 1 ? 'Contacts' : 'Contact'}
            </Button>
          )}
          <Input
            className="mt-10"
            placeholder="Search..."
            allowClear={true}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        </Col>
        <Col><Button type="primary" onClick={() => {
          handleAdd()
        }} style={{ height: '38px' }}>
          Add
        </Button></Col>

      </Row>
      <div className="admin-contact">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
          }}
          rowClassName="editable-row"
          rowKey="key"
          style={{ width: "100%" }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </AdminLayout>
    
  );
};

export default AdminUserPage;