import { Spinner } from "reactstrap"

const MessageLoader = ({ loading }) => {
    return <>
        {loading === true && <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
            <Spinner color='primary' style={{position: "absolute"}} />
        </div>}
    </>
}

export default MessageLoader