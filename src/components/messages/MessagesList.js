import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import useService from '../../hooks/service'
import { prependMessages, setMessagePage, setMessageState } from '../../redux/messageSlice'
import MessageLoader from './MessageLoader'

const MessagesList = ({ defaultInfo }) => {
    const dispatch = useDispatch()
    const {messageChats} = useService()
    const scrollableNodeRef = React.createRef()
    const isFetching = useRef(false)
    const perPage = useSelector(state => state.message.perPage)
    const page = useSelector(state => state.message.page)
    const totalPages = useSelector(state => state.message.totalPages)
    const messagesList = useSelector(state => state.message.messages)
    const [loading, setLoading] = useState(false)

    const fetchMessages = async (newPage, messageData) => {
        if (isFetching.current === true) {
            return
        }
        setLoading(true)
        isFetching.current = true
        try {
            const msgs = await messageChats.fetchList({
                message: messageData._id,
                page: newPage,
                perPage
            })
            const data = {
                page: newPage,
                messages: [...(newPage === 1 ? [] : messagesList)],
                defaultInfo: messageData
            }
            if (msgs.data.result.items !== undefined) {
                const allPages = Math.ceil(msgs.data.result.totalRows / perPage)
                data.totalPages = allPages
                data.messages = [...([...msgs.data.result.items].reverse()), ...data.messages]
            } else {
                data.messages = [messageData]
            }
            dispatch(setMessageState({...data}))
        } catch (e) {}
        isFetching.current = false
        setLoading(false)
    }

    useEffect(async () => {
        if (defaultInfo !== undefined && defaultInfo !== null) {
            await fetchMessages(page, defaultInfo)
        }
    }, [defaultInfo])

    useEffect(() => {
        if (page < 2) {
            scrollableNodeRef.current.scrollTop = scrollableNodeRef.current.scrollHeight - scrollableNodeRef.current.clientHeight
        } 
        if (page > 1 && page < totalPages) {
            scrollableNodeRef.current.scrollTop = 100
        }
    }, [messagesList])

    const onScroll = async event => {
        if (event.target.scrollTop <= 0) {
            if (defaultInfo !== null && totalPages > page && totalPages > 1) {
                const newPage = page + 1
                await fetchMessages(newPage, defaultInfo)
            }
        }
    }

    useEffect(() => {
        if (scrollableNodeRef !== null && scrollableNodeRef.current !== null) {
            try {
                scrollableNodeRef.current.removeEventListener('scroll', onScroll)
                scrollableNodeRef.current.addEventListener('scroll', onScroll)
            } catch (e) {}
        }
        return () => {
            if (scrollableNodeRef !== null && scrollableNodeRef.current !== null) {
                scrollableNodeRef.current.removeEventListener('scroll', onScroll)
            }
        }
    }, [onScroll])

    return <div style={{ height: 610, position: "relative", marginBottom: "40px" }}>
        <MessageLoader loading={loading} />
        <SimpleBar key={page} style={{ height: 610 }} scrollableNodeProps={{ ref: scrollableNodeRef }} autoHide={false}>
            <div className='chat-messages'>
                {messagesList.map(message => {
                    return <div className={message.senderType === "user" ? "chat-message right" : "chat-message left"} key={message._id}>
                        <div className='chat-message-content' dangerouslySetInnerHTML={{__html: message.text}}></div>
                    </div>
                })}
            </div>
        </SimpleBar>
    </div>
}

export default MessagesList