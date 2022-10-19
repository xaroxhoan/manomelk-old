import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { Button, Col, Row, Spinner, Table } from 'reactstrap'
import useService from '../../hooks/service'
import { jwtAxios } from '../../utility/Utils'
import UploaderUploadForm from './UploaderUploadForm'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const UploaderItems = ({ selectedTag, updateCounter, onChoose, onEdit }) => {
    const {uploader} = useService()
    const [state, setState] = useState({
        images: [],
        loading: true,
        page: 1,
        perPage: 21,
        totalPages: 0,
        totalRows: 0,
        skip: 0
    })

    const fetchAll = async currentPage => {
        setState({ ...state, loading: true })
        const response = await uploader.fetchList({
            selectedTag: selectedTag === null ? null : selectedTag.value,
            page: currentPage,
            perPage: state.perPage
        })
        if (response.status === 200) {
            const data = response.data.data
            setState({
                ...state,
                images: data.items,
                loading: false,
                page: data.page,
                perPage: data.perPage,
                totalPages: Math.ceil(data.totalRows / data.perPage),
                totalRows: data.totalRows,
                skip: data.skip
            })
        }
    }

    useEffect(async () => {
        await fetchAll(state.page)
    }, [updateCounter, selectedTag])

    const onClickChoose = item => {
        onChoose(item)
    }

    const onClickEdit = item => {
        onEdit(item)
    }

    const onUploadSuccess = async _ => {
        await fetchAll(1)
    }

    const onChangePage = async (e, newPage) => {
        e.preventDefault()
        await fetchAll(newPage)
    }

    return <>
        <Row className='igw-tables-wrapper'>
            <Col lg={10} md={10}>
                <Table>
                    <thead>
                        <tr>
                            <th className='igw-image-list'>
                                <div>
                                    <span>List of images</span>
                                    <div>
                                        {(state.totalPages > 1) ? <ul className='pagination'>
                                            <li><a href="#" title="" onClick={e => onChangePage(e, 1)}><ChevronLeft size={11} /></a></li>
                                            {[...Array(3)].map((_, index) => {
                                                const newPage = state.page - (3 - index)
                                                if (newPage < 1) {
                                                    return
                                                }
                                                return <li className={`${newPage === state.page ? 'active' : ''}`}>
                                                    <a href="#" title="" onClick={e => onChangePage(e, newPage)}>{newPage}</a>
                                                </li>
                                            })}
                                            {[...Array(3)].map((_, index) => {
                                                const newPage = state.page + index
                                                if (newPage > state.totalPages) {
                                                    return
                                                }
                                                return <li className={`${newPage === state.page ? 'active' : ''}`}>
                                                    <a href="#" title="" onClick={e => onChangePage(e, newPage)}>{newPage}</a>
                                                </li>
                                            })}
                                            <li><a href="#" title="" onClick={e => onChangePage(e, state.totalPages)}><ChevronRight size={11} /></a></li>
                                        </ul> : ''}
                                        <span>page {state.page} of {state.totalPages}</span>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {!state.loading && <>
                                    {state.images.length > -1 && <div className='image-gallery-wrapper'>
                                        {state.images.map((item, index) => <div key={item._id}>
                                                <LazyLoadImage src={ item.isExternalUrl ? item.file : `${jwtAxios.defaults.baseURL}${item.destination}${item.file}?timestamp=${+new Date()}` } width={'80px'} effect={'blur'} alt="" />
                                                <div className='igw-actions'>
                                                    <Button color='transparent' onClick={_ => onClickChoose(item)}>Choose</Button>
                                                    <Button color='transparent' onClick={_ => onClickEdit(item)}>Edit</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>}
                                    {state.images.length <= 0 && <div className='igw-noimage'>
                                        There is no image uploaded yet.
                                    </div>}
                                </>}
                                {state.loading && <div className='igw-loading'><Spinner color='primary' /></div>}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <Col lg={2} md={2}>
                <UploaderUploadForm
                    onUploadSuccess={onUploadSuccess}
                />
            </Col>
        </Row>
    </>
}

export default UploaderItems