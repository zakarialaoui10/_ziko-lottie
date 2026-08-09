'use client'
import {tags} from 'ziko/dom'
import { Random } from 'ziko/math'
const { span } = tags
const Interactive = () => span('Interactive')
            .style({color : "red"})
            .onPtrDown(e=>e.target.style({color : Random.color.hex()}))
            // .useClient()

export default Interactive