import { useEffect, useState } from 'react'
import { Col, Input } from 'reactstrap'

const DataTableSearch = ({ defaultSearchText, onSearch }) => {
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        setSearchText(defaultSearchText)
    }, [defaultSearchText])

    useEffect(() => {
        const delayTyping = setTimeout(() => {
            onSearch(searchText)
        }, 500)
        return () => clearTimeout(delayTyping)
    }, [searchText])

    const onChange = e => {
        setSearchText(e.target.value)
    }

    return (
        <Col lg={12} className='filter-wrapper'>
            <div>
                <Input placeholder='برای جستجو کلمه یا جمله ای تایپ کنید و کمی منتظر بمانید . . .' invalid={ false } value={searchText} onChange={e => onChange(e)} />
            </div>
        </Col>
    )
}

export default DataTableSearch