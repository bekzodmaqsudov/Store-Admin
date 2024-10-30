import { Avatar, Button, Flex, Form, Input, List, message, Modal, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import Api from '../api'
import { urls } from '../constants/urls'

function CatigoriesPage() {
  const [catigories, setCatigories] = useState([])
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [isDelete, setIsDelete] = useState(null)

  function handleDeleteOpen(item){
    setDeleteModal(true)
    setIsDelete(item)
  }

  function handleDeleteClose(item){
    setDeleteModal(false)
    setIsDelete(null)
  }

  function handleDeleteOk(){
    Api.delete(urls.catigories.delete(isDelete.id)).then(res => {
      if (res.status === 200 || res.status === 201) {
        handleDeleteClose()
        getCatigories()
        message.success("Katigoriya muvofaqiyatli o'chirildi!")
      }
    })
  }
  
  function handleClose(){
    setOpen(false)
    setIsEdit(null)
    form.resetFields()
  }

  function handleOpen(){
    setOpen(true)
  }
  function handleOk(){
    form.submit()
  }

  function handleEdit(item){
    handleOpen()
    setIsEdit(item)
    form.setFieldsValue(item)
  }

  function onFinish(values){
    let obj = {...values, image: values.image ? values.image : ''}
    if (isEdit === null) {
      Api.post(urls.catigories.post, obj).then(res =>{
        if (res.data.id) {
          message.success('Katigoriya muvofaqiyatli qo\'shildi!')
          handleClose()
          getCatigories()
          }
        }).catch(err => console.log(err, "Error"))
      }else{
        Api.patch(urls.catigories.patch(isEdit.id), obj).then(res =>{
          if (res.data.id) {
            message.success('Katigoriya muvofaqiyatli yangilandi!')
            handleClose()
            getCatigories()
            }
          }).catch(err => console.log(err, "Error"))
      }
    }


  function getCatigories(){
    Api.get(urls.catigories.get).then(res => {
        setCatigories(res.data)
    }).catch(err => {
        console.log(err, 'Error is not a catigories-admin');
      })
  }

  useEffect(() =>{
    getCatigories()
  }, [])

  return (
    <>
      <Space direction={'vertical'} style={{width: '100%'}} size={'large'}>
        <Flex align='center' justify='space-between'>
          <h1>Katigoriyalar ro'yxati</h1>
          <Button onClick={handleOpen}>+ Katigoriya qo'shish</Button>
        </Flex>
        <List
            dataSource={catigories}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={!!item.image?.length ? <Avatar src={item.image} /> : null}
                  title={item.name}
                />
                <Flex gap={20}>
                  <Button onClick={() => handleEdit(item)}>Edit</Button>
                  <Button danger onClick={() => handleDeleteOpen(item)}>Delete</Button>
                </Flex>
              </List.Item>
            )}
          />
      </Space> 
      <Modal 
        title={`Katigoriyani ${isEdit !== null ? 'yangilash' : 'qoshish'}`}
        open={open} 
        onOk={handleOk} 
        okText={isEdit !== null ? 'Yangilash' : 'Qo\'shish'} 
        cancelText="Bekor qilish" 
        onCancel={handleClose}>
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <Form.Item
            label="Katigoriya nomi"
            name="name"
            rules={[
              {
                required: true,
                message: 'Iltimos katigoriya nomini kiriting!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Katigoriya rasmi"
            name="image"
          >
            <Input type='url'/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
        title="Katigoriyani o'chirmoqchimisiz?" 
        open={deleteModal} 
        onCancel={handleDeleteClose} cancelText="Yo'q"
        onOk={handleDeleteOk} okText="Ha"
      >
        <p>{isDelete?.name} nomli Katigoriyani o'chirmoqchimisiz?</p>
      </Modal>
    </>
  )
}

export default CatigoriesPage