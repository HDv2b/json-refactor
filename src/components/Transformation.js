/**
 * Created by elgoo on 12/02/2017.
 */
import React, {Component} from 'react';

export default class Transformation extends Component {
    render() {
        switch (this.props.transformation.transformationType){
            case "delete":
                return (
                    <li className="transformation">
                        <p>[Delete] {this.props.transformation.trail.join(" > ")}</p>
                    </li>
                );
            case "rename":
                return (
                    <li className="transformation">
                        <p>[Rename] {this.props.transformation.trail.join(" > ")} ---> "{this.props.transformation.newName}"</p>
                    </li>
                );
        }
    }
}