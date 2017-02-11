/**
 * Created by elgoo on 11/02/2017.
 */
import React, {Component} from 'react';
import _ from "lodash";
import {openCurly, closeCurly} from "../common";

export default class JsonBranch extends Component {
    constructor() {
        super();
        this.state = {
            visible: true
        }
    }

    handleHover(e) {
        console.log("hovering", this, e);
        this.setState({
            hoverTrail: e
        })
    }

    handleClick(e) {
        console.log("clicked", this, e);
        this.setState({
            activeTrail: e
        })
    }

    toggleVisibility() {
        console.log("toggle");
        console.log(!this.state.visible);
        this.setState({visible: !this.state.visible})
    }

    displayVisibility() {
        return this.state.visible ? "+" : "-";
    }

    renderValue(branch, key) {
        switch (true) {
            case Array.isArray(branch[key]):
                return <span className="json-array">
                                        <span className="json-bracket">{"["}</span>
                                        <JsonBranch branch={branch[key]}
                                                    onClick={this.props.onClick}
                                                    onMouseOver={this.props.onMouseOver}/>
                                        <span className="json-bracket">{"]"}</span>
                                    </span>;
            case typeof(branch[key]) === "object":
                return <span className="json-object">
                                        <span className="json-bracket">{openCurly()}</span>
                                        <JsonBranch branch={branch[key]}
                                                    onClick={this.props.onClick}
                                                    onMouseOver={this.props.onMouseOver}/>
                                        <span className="json-bracket">{closeCurly()}</span>
                                    </span>;
            case typeof(branch[key]) === "number":
                return <span className="json-number">{branch[key]}</span>;
            default:
                return <span className="json-string">"{branch[key]}"</span>
        }
    }

    render() {
        const branch = this.props.branch;

        let keys = Object.keys(branch);

        let elements = this.state.visible
            ? _.map(keys, key =>
                <li key={key}>
                    <span>
                        <span className="json-key">"{key}"</span>
                        <span className="json-punctuation">:</span>
                        {this.renderValue(branch, key)}
                    </span>
                </li>
            )
            : <span/>;

        return (
            <span>
                <button onClick={this.toggleVisibility.bind(this)}>{this.displayVisibility()}</button>
                <ul className="json-branch">
                    {elements}
                </ul>
            </span>
        )
    }
}