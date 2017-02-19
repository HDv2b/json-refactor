/**
 * Created by elgoo on 12/02/2017.
 */
import React, {Component} from 'react';

export default class Transformation extends Component {

    getTransformContents() {
        switch (this.props.transformation.transformationType){
            case "delete":
                return (
                    <span>[Delete] {this.props.transformation.trail.join(" > ")}</span>
                );
            case "rename":
                return (
                    <span>[Rename] {this.props.transformation.trail.join(" > ")} ---> "{this.props.transformation.newName}"</span>
                );
            case "hashify":
                return (
                    <span>[Hashify] {this.props.transformation.trail.join(" > ")}</span>
                );
        }
    }

    render() {
        return <li className="transformation">
            {/*<input type="checkbox" checked={this.props.transformation.isActive}/>*/}
            {this.getTransformContents()}
            </li>
    }
}