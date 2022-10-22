import StatsVertical from '@components/widgets/stats/StatsVertical'
import StatsWithLineChart from '@components/widgets/stats/StatsWithLineChart'
import { useEffect, useState } from 'react'
import { Grid, Layers, Monitor, Users } from 'react-feather'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { Line } from 'react-chartjs-2'
import useService from '../../hooks/service'
import TransactionsDataTable from '../transactions/TransactionsDataTable'

const AdminHome = () => {
    const {dashboard} = useService()
    const [stats, setStats] = useState({
        brands: '0',
        categories: '0',
        products: '0',
        users: '0'
    })

    useEffect(async () => {
        try {
            // const response = await dashboard.fetchStatistics()
            // setStats({
            //     brands: response.data.data.brands.toString(),
            //     categories: response.data.data.categories.toString(),
            //     products: response.data.data.products.toString(),
            //     users: response.data.data.users.toString()
            // })
        } catch (e) {}
    }, [])

    return <>
        <div>
            <Row>
                <Col lg='3' md='12'>
                    <Row>
                        <Col lg='12' md='12'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>خرید تعرفه (تومان)</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg='12' md='12'>
                                            <StatsWithLineChart
                                                icon={<Monitor size={21} />}
                                                color='primary'
                                                stats='0 تومان'
                                                statTitle='خرید تعرفه'
                                                series={[
                                                {
                                                    name: 'Orders',
                                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                                                }
                                                ]}
                                                type='line'
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col lg='9' md='12'>
                    <Row>
                        <Col lg='12' md='12'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>آمار کلی</CardTitle>
                                </CardHeader>
                                <CardBody className='pt-26'>
                                    <Row>
                                        <Col lg='3' md='12'>
                                            <StatsVertical icon={<Users size={21} />} color='primary' stats={ stats.users } statTitle='آگهی دهنده ها' />
                                        </Col>
                                        <Col lg='3' md='12'>
                                            <StatsVertical icon={<Grid size={21} />} color='primary' stats={ stats.categories } statTitle='سازنده ها' />
                                        </Col>
                                        <Col lg='3' md='12'>
                                            <StatsVertical icon={<Grid size={21} />} color='primary' stats={ stats.categories } statTitle='مشاور املاک ها' />
                                        </Col>
                                        <Col lg='3' md='12'>
                                            <StatsVertical icon={<Layers size={21} />} color='primary' stats={ stats.brands } statTitle='آگهی ها' />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col lg='12' md='12'>
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardBody className='pt-26'>
                            <Row>
                                <Col lg='4' md='12'>
                                    <Line 
                                        options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                            position: 'top'
                                            },
                                            title: {
                                            display: true,
                                            text: ''
                                            }
                                        }
                                        }} data={{
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [
                                            {
                                            label: 'فروش ماهانه',
                                            data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(() => 0),
                                            borderColor: '#7367f0',
                                            backgroundColor: 'rgba(115, 103, 240, 0.12)'
                                            }
                                        ]
                                        }} 
                                        height={150}
                                    />
                                </Col>
                                <Col lg='4' md='12'>
                                    <Line 
                                        options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                            position: 'top'
                                            },
                                            title: {
                                            display: true,
                                            text: ''
                                            }
                                        }
                                        }} data={{
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [
                                            {
                                            label: 'بیشترین فروش',
                                            data: ['Product1', 'Product2', 'Product3', 'Product4', 'Product5', 'Product6', 'Product7'].map(() => 0),
                                            borderColor: '#7367f0',
                                            backgroundColor: 'rgba(115, 103, 240, 0.12)'
                                            }
                                        ]
                                        }} 
                                        height={150}
                                    />
                                </Col>
                                <Col lg='4' md='12'>
                                    <Line 
                                        options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                            position: 'top'
                                            },
                                            title: {
                                            display: true,
                                            text: ''
                                            }
                                        }
                                        }} data={{
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [
                                            {
                                            label: 'کاربران',
                                            data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(() => 0),
                                            borderColor: '#7367f0',
                                            backgroundColor: 'rgba(115, 103, 240, 0.12)'
                                            }
                                        ]
                                        }} 
                                        height={150}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg='12' md='12'>
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardBody className='pt-26'>
                            <TransactionsDataTable type="all" />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    </>
}

export default AdminHome