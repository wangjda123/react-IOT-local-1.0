import React,{Component} from "react";
import {Table, Button, Card, Modal, message, Form} from 'antd';
import { Resizable } from 'react-resizable';

import {reqShowUser, reqDeleteUser, reqAddRole} from "../../api";

import AddForm from "./addForm";
import './userTable.less'
import Input from "antd/es/input";
import Select from "antd/es/select";
import Search from "antd/es/input/Search";

const { Option } = Select;

const ResizableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};


class Demo extends Component {
    constructor() {
        super();
        this.delete = this.delete.bind(this)
        this.upDate = this.upDate.bind(this)
        this.search = this.search.bind(this)

        this.formItemLayout = {
            labelCol:{ span: 5,offset:0 },
            wrapperCol:{ span: 15,offset:0 }
        }
        this.state = {
            columns: [
                {
                    title: '登陆名',
                    dataIndex: 'username',
                    width: 350,
                },
                {
                    title: '角色名称',
                    dataIndex: 'role',
                    width: 350,
                },

                {
                    title: '操作',
                    key: 'action',
                    render: (text, record, index) => {
                        // console.log('record',text,record,index)
                        return (
                            <div>
                                <Button style={{float: "left", marginRight: '20px'}}
                                        onClick={this.upDate.bind(this, record)}>配置修改</Button>
                                <Button style={{float: "left"}} onClick={this.delete.bind(this, record)}>删除</Button>


                                <Modal
                                    title='管理用户'
                                    visible={this.state.upDate}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    cancelText="取消"
                                    okText="确定">
                                    <Form {...this.formItemLayout}>
                                        <Form.Item
                                            label="用户名"
                                            name="username"
                                            rules={[{required: true, whitespace: true, message: '用户名必须输入'},
                                                {min: 4, message: '用户名至少4位'},
                                                {max: 12, message: '用户名最多12位'},
                                            ]}
                                        >
                                            <Input size={"large"} defaultValue={record.username}/>
                                        </Form.Item>

                                        <Form.Item
                                            label="密&nbsp;&nbsp;&nbsp;&nbsp;码"
                                            name="password"
                                            rules={[{required: true, whitespace: true, message: '密码必须输入'},
                                                {min: 4, message: '密码至少4位'},
                                                {max: 12, message: '密码最多12位'},
                                            ]}
                                        >
                                            <Input
                                                size={"large"}
                                                defaultValue={record.password}
                                            />
                                        </Form.Item>
                                        <Form.Item label='角&nbsp;&nbsp;&nbsp;&nbsp;色'>

                                            <Select size={'large'} defaultValue={record.role}>
                                                <Option value='管理员'>管理员</Option>
                                                <Option value='业务员'>业务员</Option>
                                                <Option value='数据分析员'>数据分析员</Option>
                                            </Select>

                                        </Form.Item>
                                    </Form>
                                </Modal>


                            </div>
                        )
                    }

                },
            ],
            data: [],
            isShow: false,
            upDate: false,
            delete: false,
            all: [],
        };

        this.components = {
            header: {
                cell: ResizableTitle,
            },
        };
    }

    // 删除方法
    delete(record){
        this.setState({
            delete: true,
            record: record,
        })
         Modal.confirm({
            content: '确定删除吗？',
            onOk: async () => {
                const data = await reqDeleteUser(record.username)
                for (let i = 0; i < data.length; i++) {
                    let data1 = data[i]
                    data1.key = i + 1
                }
                this.setState({
                    data: data,
                    all:data
                })
                this.setState({
                    delete: false
                })
                console.log('this.data', this.state.data)
            },
            onCancel: () => {
                this.setState({
                    delete: false
                })
            }
        })
    }


    async upDate(record) {
        console.log('管理', record)
        this.setState({
            upDate: true,
        })
    }

    async componentDidMount() {
        const data = await reqShowUser()
        // console.log('data', data)
        for (let i = 0; i < data.length; i++) {
            let data1 = data[i]
            data1.key = i + 1
        }
        this.setState({
            all: data,
            data: data
        })
        // console.log('this.data', this.data)
    }

    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };



    //【3】Modal弹窗点ok
     handleOk= async ()=>{
        // let form = document.querySelector('.ant-form-horizontal')
        let username = document.querySelector('#username').value
        let password = document.querySelector('#password').value
        let role = document.querySelector('.ant-select-selection-item').innerHTML
        console.log('username',username,'password',password,role)
        let form = {}
         form.username = username
         form.password = password
         form.role = role
         console.log('form', form)
        // const values = this.form.getFieldsValue()
        // console.log('this.values', values)
        this.setState({
            isShow:false,
            upDate: false,}) //关闭弹窗
        // // this.form.resetFields() //清空表单方便下次使用
         //2.提交表单
        const result = await reqAddRole(form)
        //3.更新列表
        for (let i = 0; i < result.length; i++) {
            let data1 = result[i]
            data1.key = i + 1
        }
        this.setState({
            data: result,
            all:result
        })

    }

    //【4】Modal弹窗点cancel
    handleCancel=()=>{
        this.setState({
            isShow:false,
            upDate: false,})
        // this.form.resetFields() //清空表单方便下次使用
    }

    search(value) {
        let all = this.state.all
        if(!value) {
            this.setState({
                data: all
            })
        } else {
            let data = this.state.data
            let arr = []
            for (let i = 0; i < data.length; i++) {
                let username = data[i].username
                if(username.indexOf(value) >= 0) {
                    arr.push(data[i])
                }
            }
            this.setState({
                data: arr
            })
        }

    }



    render() {
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));
        const formItemLayout = {
            labelCol:{ span: 5,offset:0 },
            wrapperCol:{ span: 15,offset:0 }
        }
        const title1=
            <Button type='primary' onClick={()=>this.setState({isShow:true})}>创建用户</Button>
        const title2=
            <Search placeholder="请输入用户名进行搜索" style={{ width: 400}} onSearch={value => this.search(value)} enterButton />
        return (
                <Card title={title1} extra={title2}>
                    <Table bordered components={this.components} columns={columns} dataSource={this.state.data} />
                    <Modal
                        title='添加用户'
                        visible={this.state.isShow}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        cancelText="取消"
                        okText="确定">
                        <Form

                            {...formItemLayout}>
                            <Form.Item
                                label="用户名"
                                name="username"
                                rules={[{ required: true, whitespace: true, message: '用户名必须输入' },
                                    { min: 4, message: '用户名至少4位' },
                                    { max: 12, message: '用户名最多12位' },
                                ]}
                            >
                                <Input size={"large"} placeholder="请输入用户名" />
                            </Form.Item>

                            <Form.Item
                                label="密&nbsp;&nbsp;&nbsp;&nbsp;码"
                                name="password"
                                rules={[{ required: true, whitespace: true, message: '密码必须输入' },
                                    { min: 4, message: '密码至少4位' },
                                    { max: 12, message: '密码最多12位' },
                                ]}
                            >
                                <Input
                                    size={"large"}
                                    type="password"
                                    placeholder="请输入密码"
                                />
                            </Form.Item>
                            <Form.Item label='角&nbsp;&nbsp;&nbsp;&nbsp;色'>

                                <Select size={'large'}>
                                    <Option value='管理员'>管理员</Option>
                                    <Option value='业务员'>业务员</Option>
                                    <Option value='数据分析员'>数据分析员</Option>
                                </Select>

                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            )
    }
}

export default class UserTable extends Component{
    constructor() {
        super();

    }

    render() {
        return <Demo />
    }
}