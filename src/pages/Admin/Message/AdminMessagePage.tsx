import { useEffect, useState } from 'react';
import { Table, Button, Input, Popconfirm, Row, Col, Checkbox, Modal as AntdModal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLayout from 'layouts/AdminLayout/AdminLayout';
import Toast from 'components/Toast/Toast';
import { apiDelete, apiGet } from 'ajax/apiServices';
import { UrlAdminMessages, UrlAdminDeleteMessage, UrlAdminBulkDeleteMessages } from 'ajax/apiUrls';
import { useNavigate } from "react-router-dom";
import { showEditMessageModal } from './EditMessageModal/ShowEditMessageModal';

const AdminMessagePage = ({ history }: any) => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('currentUserId') || '';
  const currentUserRole = localStorage.getItem('currentUserRole') || '';
  // console.log("Current User ID:", currentUserId);
  // console.log("Current User Role:", currentUserRole);
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
  const [viewModal, setViewModal] = useState({ visible: false, title: '', description: '' });

  const columns = [
    ...(currentUserRole === 'admin' ? [{
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
    }] : []),
    {
      title: 'No',
      dataIndex: 'no',
      width: '20px',
      render: (_: any, __: any, index: any) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text: any) => {
        return <span>{text}</span>
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text: any) => {
        return (
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px',
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '140px',
      render: (_: any, record: any) => {
        return (
          <>
            {currentUserRole !== 'admin' && (
              <Button type="link" onClick={() => setViewModal({ visible: true, title: record.title, description: record.description })}>
                View
              </Button>
            )}
            {currentUserRole === 'admin' && (
              <>
                <Button type="link" onClick={() => editRow(record)}>
                  <EditOutlined style={{ fontSize: '20px', color: 'blue' }} />
                </Button>
                <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record.key)}>
                  <Button type="link">
                    <DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
                  </Button>
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];

  const fetchData = async () => {
    apiGet(UrlAdminMessages)
      .then((res: any) => {
        // console.log("Fetched Messages:", res);
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
      Toast('No messages selected for deletion.', "error");
      return;
    }
    const idsToDelete = selectedRowKeys;
    const formData = new FormData();
    formData.append('ids', JSON.stringify(idsToDelete));
    apiDelete(UrlAdminBulkDeleteMessages, formData)
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
    let dlgRes = await showEditMessageModal({
      data: record,
      method: "edit",
      show: true,
      onSuccess: fetchData,
      currentUserId,
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

    apiDelete(`${UrlAdminDeleteMessage}/${key}`)
      .then(() => {
        Toast('Message deleted successfully!', "success");
      })
      .catch((err) => {
        Toast(err, "error");
      });
  };

  const handleSearch = (value: any) => {
    const filtered = dataSource.filter(item =>
      Object.entries(item)
        .filter(([key]) => key === 'title' || key === 'description')
        .some(([, val]) => String(val).toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  };

  async function handleAdd(): Promise<void> {
    let dlgRes = await showEditMessageModal({
      data: {},
      method: "add",
      show: true,
      onSuccess: fetchData,
      currentUserId,
    })

    if (dlgRes == null) return
  }

  return (
    <AdminLayout>
      <Row className="table-nav">
        <Col className="d-flex">
          {currentUserRole === 'admin' && selectedRowKeys.length > 0 && (
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
        {currentUserRole === 'admin' && (
          <Col><Button type="primary" onClick={() => {
            handleAdd()
          }} style={{ height: '38px' }}>
            Add
          </Button></Col>
        )}
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
        <AntdModal
          open={viewModal.visible}
          title={<div style={{ marginBottom: 16 }}>{viewModal.title}</div>}
          footer={<Button onClick={() => setViewModal({ ...viewModal, visible: false })}>Close</Button>}
          onCancel={() => setViewModal({ ...viewModal, visible: false })}
        >
          <div style={{ whiteSpace: 'pre-wrap', marginTop: 16 }} dangerouslySetInnerHTML={{ __html: viewModal.description }} />
        </AntdModal>
      </div>
    </AdminLayout>
    
  );
};

export default AdminMessagePage;