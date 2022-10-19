import { useEffect, useState } from "react"

const TagsInput = ({ defaultValues, onChangeValues }) => {
    const [input, setInput] = useState('')
    const [tags, setTags] = useState([])
    const [isKeyReleased, setIsKeyReleased] = useState(false)

    const onChange = (e) => {
        const { value } = e.target
        setInput(value)
    }

    const onKeyDown = (e) => {
        const { key } = e
        const trimmedInput = input.trim()
        
        if (key === ',' && trimmedInput.length && !tags.includes(trimmedInput)) {
            e.preventDefault()
            setTags(prevState => {
                const newTags = [...prevState, trimmedInput]
                onChangeValues(newTags)
                return newTags
            })
            setInput('')
        }
        
        if (key === 'Backspace' && !input.length && tags.length && isKeyReleased) {
            const tagsCopy = [...tags]
            const poppedTag = tagsCopy.pop()
            e.preventDefault()
            setTags(tagsCopy)
            onChangeValues(tagsCopy)
            setInput(poppedTag)
        }
        
        setIsKeyReleased(false)
    }
        
    const onKeyUp = () => {
        setIsKeyReleased(true)
    }

    const deleteTag = (index) => {
        setTags(prevState => {
            const newTags = prevState.filter((tag, i) => i !== index)
            onChangeValues(newTags)
            return newTags
        })
    }

    useEffect(() => {
        if (defaultValues !== undefined) {
            setTags(defaultValues)
        }
    }, [defaultValues])

    return (
        <div className="container-tags">
            {tags.map((tag, index) => (
                <div className="tag" key={'tag' + index}>
                    {tag}
                    <button onClick={() => deleteTag(index)}>x</button>
                </div>
            ))}
            <input
                value={input}
                placeholder="Enter values separated by a comma"
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onChange={onChange}
            />
        </div>
    )
}

export default TagsInput