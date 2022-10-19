import { findDOMNode } from "react-dom"
import React, { useState, useRef } from "react"

import { Button, Card, CardBody, Col, Row, Table } from "reactstrap"

import ReactPlayer from "react-player"
import screenfull from "screenfull"
import { Maximize, Pause, Play, Trash } from "react-feather"

function VideoPlayer(props) {
  const { videosrc, handleDeleteVideo } = props
  // -------------------------
  const videoRef = useRef(null)
  const [url, setUrl] = useState(videosrc)
  const [playing, setPlaying] = useState(false)
  console.log(setUrl)
  // -------------------------
  const handlePlay = () => setPlaying(true)
  const handlePause = () => setPlaying(false)
  const handlePlayPause = () => setPlaying(!playing)

  const handleFullscreen = () => {
    screenfull.request(findDOMNode(videoRef.current))
  }
  // -------------------------
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <ReactPlayer
              ref={videoRef}
              url={url}
              className="react-player-video"
              width="100%"
              playing={playing}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          </Col>
        </Row>
      </CardBody>
      <Table borderless>
        <tbody>
          <tr>
            <td className="text-center">
              <Button
                size="sm"
                color="primary"
                outline
                onClick={handlePlayPause}
                className="btn btn-icon my-25 me-50"
              >
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </Button>
              <Button
                size="sm"
                color="primary"
                outline
                onClick={handleFullscreen}
                className="btn btn-icon my-25"
              >
                <Maximize size={15} />
              </Button>
              {handleDeleteVideo && (
                <Button
                  size="sm"
                  color="primary"
                  outline
                  onClick={() => handleDeleteVideo()}
                  className="btn btn-icon my-25"
                >
                  <Trash size={15} />
                </Button>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </Card>
  )
}

export default VideoPlayer
