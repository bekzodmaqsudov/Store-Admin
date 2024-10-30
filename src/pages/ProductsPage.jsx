import { Button, Col, Drawer, Flex, Form, Image, Input, InputNumber, message, Modal, Row, Select, Space, Switch, Table } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react'
import Api from '../api'
import { urls } from '../constants/urls'

function ProductsPage() {
  const [products, setproducts] = useState([])
  const [catigories, setCatigories] = useState([])
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [isDelete, setIsDelete] = useState(null)
  const [isEdit, setIsEdit] = useState(null)
  const [form] = Form.useForm()
  const isSale = Form.useWatch('isSale', form)

  function handleDrawerOpen(){
    setDrawerOpen(true)
  }
  function handleDrawerClose(){
    setDrawerOpen(false)
    setIsEdit(null)
    form.resetFields()
  }

  function handleAddClick(){
    form.submit()
  }

  function handleDeleteOpen(item){
    setDeleteModal(true)
    setIsDelete(item)
  }

  function handleDeleteClose(item){
    setDeleteModal(false)
    setIsDelete(null)
  }

  function handleEditClick(item){
    setIsEdit(item)
    handleDrawerOpen()
    form.setFieldsValue(item)
  }

  function onSwitchChange(id, value, type){
      Api.patch(urls.products.patch(id), { [type]: value}).then(res =>{
        getProducts()
      }).catch(err => console.log(err, 'Error is update product'))
  }

  function onSubmit(e){
    if (!!isEdit) {
      Api.patch(urls.products.patch(isEdit.id), e).then(res =>{
        getProducts()
        handleDrawerClose()
      }).catch(err => console.log(err, 'Error is update product'))
    }else{
      Api.post(urls.products.post, e).then(res => {
        getProducts()
        handleDrawerClose()
      }).catch(err => console.log(err, 'Error is add product'))
    }
  }

  const columns = [
    {
      dataIndex: 'images',
      title: 'Mahsulot rasmi',
      render: (image) => <Image src={image[0]} alt='rasm' width={100}/>
    },
    {
      dataIndex: 'name',
      title: 'Mahsulot nomi'
    },
    {
      dataIndex: 'price',
      title: 'Mahsulot narxi',
      render: (price) => <b>{`${price.toLocaleString()}  so'm`}</b>
    },
    {
      dataIndex: 'in_stock',
      title: 'Ombordagi soni',
      render: (price) => <b>{`${price}  ta`}</b>
    },
    {
      dataIndex: 'reviews',
      title: 'Sharhlar soni',
      render: (price) => <b>{`${price}  ta`}</b>
    },
    {
      title: 'Yangimi?',
      render: (product) => <Switch 
      onChange={(e) => onSwitchChange(product.id, e, 'isNew')} checkedChildren="Ha" unCheckedChildren="Yo'q" defaultValue={product.isNew}/>
    },
    {
      title: 'Mashhurmi?',
      render: (product) => <Switch 
      onChange={(e) => onSwitchChange(product.id, e, 'isPopular')} checkedChildren="Ha" unCheckedChildren="Yo'q" defaultValue={product.isPopular}/>
    },
    {
      title: "O'zgartirish",
      render: (item) => <Space>
        <Button onClick={() => handleEditClick(item)}>Yangilash</Button>
        <Button danger onClick={() => handleDeleteOpen(item)}>O'chirish</Button>
      </Space>
    },
  ]

  function getProducts(){
    setLoading(true)
    Api.get(urls.products.get)
      .then((res) => {
        setproducts(res.data)
      })
      .catch(err => console.log(err, "Error products"))
      .finally(() => setLoading(false))
  }

  function getCatigories(){
    Api.get(urls.catigories.get)
    .then((res) => {
      setCatigories(res.data)
    })
    .catch(err => console.log(err, "Error catigories"))
  }

  function handleDeleteOk(){
    Api.delete(urls.products.delete(isDelete.id)).then(res => {
      if (res.status === 200 || res.status === 201) {
        handleDeleteClose()
        getProducts()
        message.success("Mahsulot muvofaqiyatli o'chirildi!")
      }
    })
  }

  useEffect(() =>{
    getProducts()
    getCatigories()
  }, [])

  return (
    <Space direction={'vertical'} style={{width: '100%', height: '100%', overflowY: 'scroll'}} size={'large'}>
        <Flex align='center' justify='space-between'>
          <h1>Mahsulotlar ro'yxati</h1>
          <Button onClick={handleDrawerOpen}>+ Mahsulot qo'shish</Button>
        </Flex>
        <Table dataSource={products} loading={loading} columns={columns}/>
        <Drawer maskClosable={false} extra={<Button onClick={handleAddClick}>Qo'shish</Button>} title="Mahsulot qo'shish" width={600} open={drawerOpen} onClose={handleDrawerClose}>
          <Form form={form} layout='vertical' onFinish={onSubmit}>
            <Form.Item name='name' label="Mahsulot nomi" rules={[
              {
                required: true,
                message: 'Mahsulot nomini kiritink'
              }
            ]}>
              <Input/>
            </Form.Item>
            <Form.Item name='description' label="Mahsulot tavsifi">
              <Input.TextArea rows={6}/>
            </Form.Item>
            <Row gutter={[8, 0]}>
              <Col span={8}>
                <Form.Item name='price' label="Mahsulot narxi" rules={[
                  {
                    required: true,
                    message: 'Mahsulot narxini kiritink'
                  }
                ]}>
                  <InputNumber addonAfter="so'm" controls={false} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='month' label="Mahsulot oyi">
                  <InputNumber addonAfter="oy" controls={false} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='price_per_month' label="Mahsulot oylik tolovi">
                  <InputNumber addonAfter="so'm" controls={false} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 0]}>
              <Col span={8}>
                <Form.Item name='isNew' label="Mahsulot yangimi">
                  <Switch checkedChildren="Ha" unCheckedChildren="Yo'q" defaultValue={false}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='isSale' label="Mahsulot chegirmadami">
                   <Switch checkedChildren="Ha" unCheckedChildren="Yo'q" defaultValue={false}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='isPopular' label="Mahsulot mashhurmi">
                  <Switch checkedChildren="Ha" unCheckedChildren="Yo'q" defaultValue={false}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 0]}>
              {isSale && <Col span={8}>
                <Form.Item name='discount_price' label="Mahsulot chegirma narxi">
                  <InputNumber addonAfter={"so'm"} controls={false} style={{width: '100%'}}/>
                </Form.Item>
              </Col>}
              <Col span={8}>
                <Form.Item name='in_stock' label="Mahsulot ombordagi soni">
                  <InputNumber addonAfter="ta" controls={false} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='reviews' label="Mahsulot sharhlar soni">
                  <InputNumber addonAfter="ta" controls={false} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name='catigory_id' label="Mahsulot katigoriyasi">
                  <Select options={catigories.map(({id: value, name: label}) => ({value, label}))}/>
            </Form.Item>
              <Form.List name="images">
                    {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: 'flex',
                        marginBottom: 8,
                      }}
                      align="center"
                    >
                      <Form.Item label='Mahsulot rasmini kiriting'
                        {...restField}
                        name={[name]}
                        rules={[
                          {
                            required: true,
                            message: 'Mahsulot rasmini kiriting!',
                          },
                        ]}
                      >
                        <Input type='url' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Rasm qo'shish
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Drawer>
        <Modal
        title="Mahsulotni o'chirmoqchimisiz?" 
        open={deleteModal} 
        onCancel={handleDeleteClose} cancelText="Yo'q"
        onOk={handleDeleteOk} okText="Ha"
      >
        <p>{isDelete?.name} nomli Mahsulotni o'chirmoqchimisiz?</p>
      </Modal>
    </Space>
  )
}

export default ProductsPage