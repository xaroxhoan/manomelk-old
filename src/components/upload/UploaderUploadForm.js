import { useState } from 'react'
import { Plus } from 'react-feather'
import { Button, Input, Label, Spinner, Table } from 'reactstrap'
import AsyncCreatableSelect from 'react-select/async-creatable'
import useService from '../../hooks/service'
import { Upload } from 'antd'

const { Dragger } = Upload

const UploaderUploadForm = ({ onUploadSuccess }) => {
    const {uploader} = useService()
    const [alt, setAlt] = useState('')
    const [state, setState] = useState({
        file: null,
        loadingUpload: false,
        updateCounter: 0
    })
    const [tagState, setTagState] = useState({
      isLoading: false,
      options: [],
      value: undefined
    })

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

    const onChangeInputFile = e => {
        const files = e.target.files
        if (files.length <= 0) {
            return
        }
        setState({
            ...state,
            file: files[0]
        })
    }

    const onClickUpload = async _ => {
        setState({ ...state, loadingUpload: true })
        const formData = new FormData()
        formData.append('file', state.file)
        formData.append('tag', tagState.value === undefined ? null : tagState.value.value)
        formData.append('alt', alt)
        const response = await uploader.upload(formData)
        setState({ ...state, file: null, loadingUpload: false, updateCounter: state.updateCounter + 1 })
        setTagState({...{ isLoading: false, options: [], value: null }})
        setAlt('')
        onUploadSuccess(response)
    }

    const uploadProps = {
        beforeUpload: file => {
            const isImg = file.type.startsWith('image')
            if (isImg) {
                setState({
                    ...state,
                    file
                })
            }
            return false
        },
        
        onRemove: () => {
            setState({
                ...state,
                file: null
            })
        }

    }

    return <Table>
        <thead>
            <tr>
                <th>Upload Image</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div className='mb-2'>
                        <Dragger 
                            {...uploadProps}
                            // showUploadList={false}
                            maxCount={1} 
                        >
                            <Label className="image-selector">
                                {state.file === null && <Plus size={16} />}
                                {state.file !== null && <img src={window.URL.createObjectURL(state.file)} />}
                                {/* <Input type={'file'} accept='image/png,image/jpeg' onChange={onChangeInputFile} /> */}

                            </Label>
                        </Dragger>
                    </div>
                    <div className='mb-2'>
                        <Label>Tag</Label>
                        <AsyncCreatableSelect
                            key={tagState.options.length + state.updateCounter}
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
                    <div className='mb-2'>
                        <Button color='primary' block onClick={onClickUpload} disabled={state.loadingUpload}>
                            {state.loadingUpload && <>
                                <Spinner color='primary' size='sm' />
                                <span className='ms-50'>Loading...</span>
                            </>}
                            {!state.loadingUpload && <span>Upload</span>}
                        </Button>
                    </div>
                </td>
            </tr>
        </tbody>
    </Table>
}
export default UploaderUploadForm