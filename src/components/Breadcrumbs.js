/**
 * Created by elgoo on 11/02/2017.
 */
import React, {Component} from 'react';
import _ from "lodash";

export default class Breadcrumbs extends Component {

    render() {
        return <div className="breadcrumbs">{this.props.hoverTrail.join(" > ")}</div>
    }
}