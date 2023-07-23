import React, { Component, Fragment, createRef } from 'react'
import interact from 'interactjs'
import Timeline, {
    TimelineMarkers,
    TodayMarker,
    CustomMarker,
    CursorMarker
} from 'react-calendar-timeline'
import PropTypes from 'prop-types'
import { coordinateToTimeRatio } from '../../helpers/calendar'
export function getSumOffset(node) {
    if (node === document.body || node === null) {
        return { offsetLeft: 0, offsetTop: 0 }
    } else {
        const parent = getSumOffset(node.offsetParent)
        return ({
            offsetLeft: node.offsetLeft + parent.offsetLeft,
            offsetTop: node.offsetTop + parent.offsetTop
        })
    }
}
export function getSumScroll(node) {
    if (node === document.body || node === null) {
        return { scrollLeft: 0, scrollTop: 0 }
    } else {
        const parent = getSumScroll(node.parentNode)
        return ({
            scrollLeft: node.scrollLeft + parent.scrollLeft,
            scrollTop: node.scrollTop + parent.scrollTop
        })
    }
}
export default class Draggable extends Component {
    static propTypes = {
        handleItemDrop: PropTypes.func,
        timelineRef: PropTypes.object,
        scrollRef: PropTypes.shape({
            current: PropTypes.object,
        }),
        children: PropTypes.node,
        data: PropTypes.object,
        id: PropTypes.string,
    }

    handleItemDrop = e => {
        const {
            props: { timelineRef, scrollRef: { current: scrollRef }, data },
        } = this


        const {
            canvasTimeStart,
            dragTime,
            visibleTimeStart,
            visibleTimeEnd,
            groupTops,
            groupHeights,
            groups,
            width,
        } = timelineRef.current.state
        const canvasWidth = width * 3
        const zoom = visibleTimeEnd - visibleTimeStart
        const canvasTimeEnd = zoom * 3 + canvasTimeStart
        const ratio = coordinateToTimeRatio(
            canvasTimeStart,
            canvasTimeEnd,
            canvasWidth,
        )
        // console.log(timelineRef.current.state)
        // console.log("canvasTimeStart", canvasTimeStart)
        const { offsetLeft, offsetTop } = getSumOffset(scrollRef)
        const { scrollLeft, scrollTop } = getSumScroll(scrollRef)
        // const { pageX, pageY } = e
        const { pageX, pageY, rect } = e
        // const x = pageX - offsetLeft + scrollLeft
        const x = rect.left - offsetLeft + scrollLeft
        const y = pageY - offsetTop + scrollTop

        const start = x * ratio + canvasTimeStart
        console.log("x", x)
        // console.log("ratio", ratio)
        // console.log("canvasTimeStart", canvasTimeStart)
        // console.log("offsetLeft", offsetLeft)
        // console.log("offsetTop", offsetTop)
        let groupKey = ''
        for (const key of Object.keys(groupTops)) {
            const groupTop = groupTops[key]
            if (y > groupTop) {
                var index = groupTops.findIndex(p => p == key);
                // console.log("key", key)
                // console.log("index", index)
                groupKey = key
            } else {
                break
            }
        }

        if (groupKey === '' || pageX < offsetLeft || pageX > offsetLeft + width) {
            return
        }
        this.props.handleItemDrop({ data, start, groupKey: groups[groupKey].driverId })
    }

    componentDidMount = () => {
        let x, y

        this.interactable = interact(this.item.current)
            .draggable({
                enabled: true,
                inertia: false,
                restrict: {
                    restrictEnabled: false,
                },
                autoScroll: false,
            })
            .on('dragstart', e => {
                ({ pageX: x, pageY: y } = e)
                const { pageX, pageY } = e
                e.target.style.zIndex = '100000'
                e.target.style.position = 'absolute'
                e.target.style.transform = `translate(${pageX - x - document.getElementById("draggable").scrollLeft}px, ${pageY - y - document.getElementById("draggable").scrollTop}px)`
            })
            .on('dragmove', e => {
                const { pageX, pageY } = e
                e.target.style.transform = `translate(${pageX - x - document.getElementById("draggable").scrollLeft}px, ${pageY - y - document.getElementById("draggable").scrollTop}px)`
            })
            .on('dragend', e => {
                e.target.style.transform = ''
                e.target.style.zIndex = ''
                e.target.style.position = ''
                this.handleItemDrop(e)
            })
    }
    componentWillUnmount() {
        this.interactable.unset()
    }

    item = createRef()

    //style={{ zIndex: '100000',position:'absolute' }}
    render() {
        return <div ref={this.item} id={this.props.id}>
            {this.props.children}
        </div>
    }
}
