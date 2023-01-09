import React, { useState } from 'react';
import { Layout, Input, Space, Button, Tooltip, Checkbox, Col, Row, Divider, Modal } from 'antd';
import { collapseToast, toast } from 'react-toastify';
import axios from 'axios';
import backendUrl from './BackendUrl';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Footer } from 'antd/es/layout/layout';


const { Content } = Layout;

var score = 0;

const Home = () => {
    const cookie = new Cookies();
    const [testLink, setTestLink] = useState('');
    const [questions, setQuestions] = useState([]);
    // const [score, setScore] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ans = {
        0: new Set(),
        1: new Set(),
        2: new Set(),
        3: new Set(),
        4: new Set(),
        5: new Set(),
        6: new Set(),
        7: new Set(),
        8: new Set(),
        9: new Set(),
    };
    const history = useHistory();

    const submitTestLink = async () => {
        let splitLink = testLink.split('/');
        let ln = splitLink.length;
        console.log("Test id is :-> ", splitLink[ln - 1]);
        let testId = splitLink[ln - 1];
        if (!testId || !testLink) {
            toast.error("Please enter a valid test link", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        let data = {
            _id: testId
        }

        try {
            await axios.post(`${backendUrl}/getTest`, data, {
                headers: {
                    authorization: cookie.get('token', { path: '/' }),
                }
            }).then((res) => {
                if (res && res.data.code == 206) {
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
                    return;
                }

                toast.success("Successfull! best of luck", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setQuestions(res.data.data.questions);
                console.log("test data :-> ", res.data);
                return;
            }).catch((err) => {
                localStorage.clear();
                cookie.remove('token');
                history.push('/login');
            })
        } catch (error) {
            console.log(error);
        }

    }

    const onChange = (checkedValues) => {
        if (checkedValues.length)
            ans[[checkedValues[0].split('-')[0]]].clear();
        checkedValues.forEach(element => {
            ans[element.split('-')[0]].add(element.split('-')[1]);
        });
        // console.log('checked = ', checkedValues);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const submitTest = () => {
        console.log("ans---->", ans);
        for (let i = 0; i < 10; i++) {
            let ansArray = Array.from(ans[i]);
            console.log("AnsArray for check ", ansArray);
            console.log("Realans for check ", questions[i].correct);
            if(ansArray.length === questions[i].correct.length){
                ansArray.sort();
                questions[i].correct.sort();
                let flag = true;
                for(let j = 0 ;j < ansArray.length ;j++){
                    if(ansArray[j] != questions[i].correct[j]){
                        flag = false;
                        break;
                    }
                }
                if(flag) score += 1;
            }
            // if (ansArray == questions[i].correct) {
            //     // setScore(score + 1);
            //     score += 1;
            // }
        }
        showModal();
    }


    return (
        <>
            <Layout>
                <Content className='container cntr'>
                    <Space.Compact block size="large" className='mt-4' >
                        <Tooltip title="Please enter test link">
                            <Input style={{ width: 'calc(100% - 200px)' }} value={testLink} placeholder="https://google.com/createQuestion/sldkfj3rw543954sdkf0" onChange={(e) => setTestLink(e.target.value)} />
                        </Tooltip>
                        <Button type="primary" onClick={submitTestLink}>Submit</Button>
                    </Space.Compact>

                    <Modal title="Total Score" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <h1>{score}/10</h1>

                    </Modal>

                    <Divider />
                    <ol>
                        {
                            questions && questions.map((item, key) => {
                                return (
                                    <>
                                        <li>
                                            <h5>{item.title}</h5>

                                            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                                                <Row>
                                                    <Col span={24}>
                                                        <Checkbox value={`${key}-option1`}>{item.option1}</Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value={`${key}-option2`}>{item.option2}</Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value={`${key}-option3`}>{item.option3}</Checkbox>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Checkbox value={`${key}-option4`}>{item.option4}</Checkbox>
                                                    </Col>
                                                </Row>
                                            </Checkbox.Group>
                                            <br /><br />
                                        </li>
                                    </>
                                )
                            })
                        }
                    </ol>
                </Content>
                <Footer>
                    <Button type="primary" onClick={submitTest}>Submit</Button>
                </Footer>
            </Layout>
        </>
    )
}

export default Home;