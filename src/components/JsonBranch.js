/**
 * Created by elgoo on 11/02/2017.
 */
import React, {Component} from 'react';
import _ from "lodash";
import {openCurly, closeCurly} from "../common";

export default class JsonBranch extends Component {
    componentWillMount() {
        this.setState({visible: true});
    }

    handleHover(e) {
        e.stopPropagation();
        this.props.setHoverTrail(this.props.trail);
    }

    handleClick(e) {
    }

    toggleVisibility() {
        this.setState({visible: !this.state.visible})
    }

    displayVisibility() {
        return this.state.visible ? "-" : "+";
    }

    renderValue(branch, key) {
        switch (true) {
            case Array.isArray(branch[key]):
                return <span className="json-array">
                            <span className="json-bracket">{"["}</span>
                            <JsonBranch branch={branch[key]} setHoverTrail={this.props.setHoverTrail}/>
                            <span className="json-bracket">{"]"}</span>
                        </span>;
            case typeof(branch[key]) === "object":
                return <span className="json-object">
                            <span className="json-bracket">{openCurly()}</span>
                            <JsonBranch branch={branch[key]} setHoverTrail={this.props.setHoverTrail}/>
                            <span className="json-bracket">{closeCurly()}</span>
                        </span>;
            case typeof(branch[key]) === "number":
                return <span className="json-number">{branch[key]}</span>;
            default:
                return <span className="json-string">"{branch[key]}"</span>
        }
    }

    getArray(branch, keys) {
        // todo: this is an array, so can swap out lodash for native
        let elements = _.map(keys, key => {
            // only show comma if not the last element
            let comma = keys.slice(-1)[0] !== key ? <span className="json-punctuation">,</span> : false;

            return (
                <li key={key}><JsonBranch branch={branch[key]} key={key}/>{comma}</li>
            )
        });
        return <ul>{elements}</ul>;
    }

    getObject(branch, keys) {
        let elements = _.map(keys, key => {
            let comma = keys.slice(-1)[0] !== key ? <span className="json-punctuation">,</span> : false;
            return (
                <li key={key}>
                    <span className="json-key">"{key}"</span><span className="json-punctuation">:</span> <JsonBranch branch={branch[key]} key={key}/>{comma}
                </li>
            )
        });
        return <ul>{elements}</ul>;
    }

    render() {
        const branch = this.props.branch;
        let keys = Object.keys(branch);

        let elements = _.map(keys, key => {
                return (



                    {
                        /*<li key={key}
                         onClick={this.handleClick.bind(this)}
                         onMouseOver={this.handleHover.bind(this)}>
                         <span>
                         <span className="json-key">"{key}"</span>
                         <span className="json-punctuation">: </span>
                         {this.renderValue(branch, key)}
                         </span>
                         </li>*/
                    }
                )
            }
        );

        switch (Object.prototype.toString.call(branch)) {
            case "[object Array]":
                return <span className="json-array">
                            <span className="json-bracket">{"["}</span>
                            {this.getArray(branch, keys)}
                            <span className="json-bracket">{"]"}</span>
                        </span>;
            case "[object Object]":
                return <span className="json-object">
                            <span className="json-bracket">{openCurly()}</span>
                            {this.getObject(branch, keys)}
                            <span className="json-bracket">{closeCurly()}</span>
                        </span>;
            case "[object Number]":
                return <span className="json-number">{branch}</span>;
            case "[object String]":
                return <span className="json-string">"{branch}"</span>;
            case "[object Boolean]":
                return <span className="json-boolean">{JSON.stringify(branch)}</span>;
            case "[object Null]":
                return <span className="json-null">{branch}</span>;
        }

        let classNames = ["json-branch"];

        if (!this.state.visible) {
            classNames.push("hidden");
        }

        return (
            <span>
                <button className="toggle"
                        onClick={this.toggleVisibility.bind(this)}>{this.displayVisibility()}</button>
                <ul className={classNames.join(" ")}>
                    {elements}
                </ul>
            </span>
        )
    }
}