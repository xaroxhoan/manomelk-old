import { useEffect, useState } from 'react'
import { Filter, Trash, X } from 'react-feather'
import Select from 'react-select'
import { Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap'

const DataTableSearch = ({ defaultSearchText, filters, defaultFilters, onSearch, onAdvancedSearch }) => {
    const [searchText, setSearchText] = useState('')
    const [defaultFilter, setDefaultFilter] = useState([])
    const [showModalFilter, setShowModalFilter] = useState(false)
    const [filterValues, setFilterValues] = useState([{ field: null, operator: null, value: ''}])

    useEffect(() => {
        setSearchText(defaultSearchText)
    }, [defaultSearchText])

    useEffect(() => {
        setDefaultFilter(defaultFilters)
    }, [defaultFilters])

    useEffect(() => {
        const delayTyping = setTimeout(() => {
            onSearch(searchText)
        }, 500)
        return () => clearTimeout(delayTyping)
    }, [searchText])

    const onChange = e => {
        setSearchText(e.target.value)
    }

    const onDeleteAdvancedSearchTag = index => {
        const data = [...filterValues]
        data.splice(index, 1)
        setFilterValues(data)
        onAdvancedSearch(data)
    }

    return (
        <Col lg={12} className='filter-wrapper'>
            <div>
                <Button.Ripple onClick={e => setShowModalFilter(true)} className='btn-icon' outline color='primary'>
                    <Filter size={16} />
                </Button.Ripple>
                <Input placeholder='Enter a keyword and wait couple of seconds . . .' invalid={ false } value={searchText} onChange={e => onChange(e)} />
            </div>
            <div className='advanced-filter-labels'>
                {defaultFilter.map((item, index) => {
                    return <label key={`advanced-search${item.field.label}-${index}`}>
                        {item.field.label} {item.operator.label} {item.value}
                        <X size={12} onClick={() => onDeleteAdvancedSearchTag(index)} />
                    </label>
                })}
            </div>
            <Modal isOpen={showModalFilter} toggle={() => setShowModalFilter(false)} className='modal-dialog-centered'>
              <ModalHeader toggle={() => setShowModalFilter(false)}>Advanced Filters</ModalHeader>
              <ModalBody>
                <Table className='table-advanced-filter'>
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Operator</th>
                            <th>Value</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { filterValues.map((filterValue, index) => <tr key={filterValue + '' + index}>
                            <td>
                                <Select
                                    cacheOptions
                                    defaultOptions
                                    value={filterValue.field}
                                    options={filters.map(item => {
                                        const obj = {}
                                        obj['label'] = item.title.charAt(0).toUpperCase() + item.title.slice(1)
                                        obj['value'] = item.title
                                        return obj
                                    })}
                                    onChange={ selected => {
                                        const data = [...filterValues]
                                        data[index] = {...data[index], field: selected}
                                        console.log(data[index])
                                        setFilterValues(data)
                                    } }
                                />
                            </td>
                            <td>
                                <Select
                                    cacheOptions
                                    defaultOptions
                                    value={filterValue.operator}
                                    options={(() => {
                                        if (filterValues[index] === null || filterValues[index].field === null) {
                                            return []
                                        }
                                        const filter = filters.find(item => item.title === filterValues[index].field.value)
                                        if (filter === undefined || filter === null) {
                                            return []
                                        }
                                        return filter.operators.map(item => {
                                            const obj = {}
                                            obj['label'] = item.charAt(0).toUpperCase() + item.slice(1)
                                            obj['value'] = item
                                            return obj
                                        })
                                    })()}
                                    onChange={ selected => {
                                        const data = [...filterValues]
                                        data[index] = {...data[index],  operator: selected}
                                        setFilterValues(data)
                                    } }
                                />
                            </td>
                            <td>
                                <Input placeholder='value . . .' invalid={ false } value={filterValues[index].value} onChange={e => {
                                    const data = [...filterValues]
                                    data[index] = {
                                        ...data[index],
                                        value: e.target.value
                                    }
                                    setFilterValues(data)
                                }} />
                            </td>
                            <td>
                                <Button.Ripple onClick={e => {
                                    const data = [...filterValues]
                                    data.splice(index, 1)
                                    setFilterValues(data)
                                }} className='btn-icon' outline color='danger'>
                                    <Trash size={16} />
                                </Button.Ripple>
                            </td>
                        </tr>) }
                    </tbody>
                </Table>
                <Button color='primary' onClick={() => setFilterValues([...filterValues, { field: null, operator: null, value: ''}])}>Add Filter</Button>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onClick={() => {
                    onAdvancedSearch(filterValues)
                    setShowModalFilter(false)
                }}>Search</Button>
                <Button color='danger' onClick={() => setShowModalFilter(false)}>Cancel</Button>
              </ModalFooter>
            </Modal>
        </Col>
    )
}

export default DataTableSearch