import { useEffect, useState, useRef } from "react"
import { Alert } from "reactstrap"

const BoxAlert = ({ visible, type, children }) => {
    const [state, setState] = useState({
        initialValue: 6,
        timer: null,
        timerValue: 6
    })

    const clear = () => {
        if (state.timer !== null && state.timerValue <= 0) {
            clearInterval(state.timer)
        }
        setState({
            ...state,
            timer: null,
            timerValue: state.initialValue
        })
    }

    useEffect(() => {
        if (visible === false) {
            clear()
        } else {
            if (state.timer === null) {
                let value = state.initialValue
                const timer = setInterval(() => {
                    value--
                    if (value <= 0) {
                        clearInterval(timer)
                        clear()
                    } else {
                        setState({
                            ...state,
                            timerValue: value - 1
                        })
                    }
                }, 1000)
                setState({
                    ...state,
                    timer
                })
            }
        }
    }, [visible])

    useEffect(() => {
        return clear
    }, [])

    return <>
        { state.timerValue > 0 && state.timerValue < state.initialValue && <Alert color={type} className="box-alert">
            <h4 className='alert-heading'>
                <div>{children}</div>
                <div>{state.timerValue}</div>
            </h4>
        </Alert> }
    </>
}

export default BoxAlert