/**
 * Created by elgoo on 12/02/2017.
 */
import React, {Component} from 'react';

export default class Transformation extends Component {
    render(){
        return (
            <li className="transformation">
                <p>{this.props.transformation.transformationType}</p><button>{function(){return this.props.transformation.enabled ? "On" : "Off"}}</button>
                <p>{this.props.transformation.trail.join(" > ")}</p>
            </li>
        )
    }
}