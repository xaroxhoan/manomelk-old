import { useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button, Col, Input, Label, Row, Spinner } from 'reactstrap'
import AsyncCreatableSelect from 'react-select/async-creatable'
import useService from '../../hooks/service'
import { jwtAxios } from '../../utility/Utils'

const UploaderEditor = ({ selectedRow, onSave }) => {
    const {uploader} = useService()
    const [crop, setCrop] = useState()
    const [alt, setAlt] = useState('')
    const [loading, setLoading] = useState({
        copy: false,
        self: false
    })
    const [tagState, setTagState] = useState({
      isLoading: false,
      options: [],
      value: undefined
    })

    const onChangeCrop = croppedData => {
        setCrop(croppedData)
    }

    const loadTagOptions = async inputValue => {
        const response = await uploader.tags.fetchAll()
        let options = response.data.data.map(item => {
          return {
            value: item._id,
            label: item.name
          }
        })
        if (inputValue !== '') {
            options = options.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))
        }
        return options
    }
    
    const handleTagCreate = async name => {
        setTagState({ ...tagState, isLoading: true })
        const response = await uploader.tags.store({ name })
        const createdTag = response.data.data
        const newOption = {
          value: createdTag._id,
          label: createdTag.name
        }
        setTagState({
          ...tagState, 
          isLoading: false,
          options: [
            ...tagState.options, 
            newOption
          ],
          value: newOption
        })
    }
    
    const handleTagChange = newValue => {
        setTagState({
          ...tagState, 
          value: newValue
        })
    }

    const onClickSave = async type => {
        if (type === 'copy') setLoading({ ...loading, copy: true })
        if (type === 'self') setLoading({ ...loading, self: true })
        const response = await uploader.save(selectedRow._id, {
            crop,
            type,
            tag: tagState.value === undefined ? null : tagState.value.value,
            alt: alt === '' ? null : alt
        })
        if (type === 'copy') setLoading({ ...loading, copy: false })
        if (type === 'self') setLoading({ ...loading, self: false })
        if (response.status === 200) {
            onSave()
        }
    }

    useEffect(() => {
        if (selectedRow.tag !== undefined && selectedRow.tag !== null) {
            setTagState({
                ...tagState, 
                value: {
                    label: selectedRow.tag.name,
                    value: selectedRow.tag._id
                }
            })
        }
        if (selectedRow.alt !== null) {
            setAlt(selectedRow.alt)
        }
    }, [selectedRow])

    return <div>
        <Row>
            <Col lg={10} md={10} className='igw-preview-wrapper'>
                <div className='igw-crop-info'>
                    <ul>
                        <li>X: { crop !== undefined ? parseInt(crop.x) : '0' }px</li>
                        <li>Y: { crop !== undefined ? parseInt(crop.y) : '0' }px</li>
                        <li>Width: { crop !== undefined ? parseInt(crop.width) : '0' }px</li>
                        <li>Height: { crop !== undefined ? parseInt(crop.height) : '0' }px</li>
                    </ul>
                </div>
                <ReactCrop className='igw-crop-wrapper' crop={crop} onChange={onChangeCrop}>
                    <img src={selectedRow.isExternalUrl ? selectedRow.file : `${jwtAxios.defaults.baseURL}${selectedRow.destination}${selectedRow.file}?timestamp=${+new Date()}`} />
                </ReactCrop>
            </Col>
            <Col lg={2} md={2} className='igw-info-wrapper'>
                <div>
                    <div className='mb-2'>
                        <Label>Tag</Label>
                        <AsyncCreatableSelect
                            key={tagState.options.length}
                            cacheOptions
                            defaultOptions
                            isClearable
                            loadOptions={loadTagOptions}
                            isDisabled={tagState.isLoading}
                            isLoading={tagState.isLoading}
                            onChange={handleTagChange}
                            onCreateOption={handleTagCreate}
                            value={tagState.value}
                        />
                        <div className="invalid-feedback"></div>
                    </div>
                    <div className='mb-2'>
                        <Label>Alt</Label>
                        <Input placeholder='Alt...' value={alt} onChange={e => setAlt(e.target.value)} invalid={false} />
                        <div className="invalid-feedback"></div>
                    </div>
                </div>
                <div className='igw-buttons-wrapper'>
                    <Button color={'outline-primary'} onClick={_ => onClickSave('self')} disabled={loading.self}>
                        {loading.self && <>
                            <Spinner color='primary' size='sm' />
                            <span className='ms-50'>Loading...</span>
                        </>}
                        {!loading.self && <span>Save</span>}
                    </Button>
                    <Button color={'outline-primary'} onClick={_ => onClickSave('copy')} disabled={loading.copy}>
                        {loading.copy && <>
                            <Spinner color='primary' size='sm' />
                            <span className='ms-50'>Loading...</span>
                        </>}
                        {!loading.copy && <span>Save as a copy</span>}
                    </Button>
                </div>
            </Col>
        </Row>
    </div>
}

export default UploaderEditor