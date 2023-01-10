import React from 'react';
import { Button, Form, Input, Card } from 'antd';
import { toast } from 'react-toastify';
import backendUrl from './BackendUrl';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = (props) => {
    const history = useHistory();
    const cookie = new Cookies();
    const onFinish = async (values) => {
        console.log('Success:', values);

        await axios.post(`/api/v1/logincustomer`, values)
            .then((res) => {

                console.log("Login Result:-> ", res);
                if (res.data.code === 206) {
                    toast.error(res.data.msg, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                } else {
                    const { data, token, msg } = res.data;
                    let expires = new Date(Date.now() + 9999999);
                    cookie.set('token', token, { path: '/', expires,secure:true });
                    localStorage.setItem("userId", data._id);
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("userFirstName", data.firstname);
                    localStorage.setItem("userLastName", data.lastname);
                    localStorage.setItem("userEmail", data.email);
                    localStorage.setItem("userPhone", data.phone);
                    toast.success(msg, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    props.setUserData(data.username);
                    history.push('/');
                }
            })

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            <div className='login_div'>
                <Card hoverable title="Login"
                    style={{
                        marginTop: "100px",
                    }}
                >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input type='email' />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
};
export default Login;