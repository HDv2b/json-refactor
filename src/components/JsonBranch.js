/**
 * Created by elgoo on 11/02/2017.
 */
import React, {Component} from 'react';
import _ from "lodash";
import {openCurly, closeCurly} from "../common";

class JsonKey extends Component {
    handleHover(e) {
        e.stopPropagation();
        let trail = this.props.trail;
        this.props.setHoverTrail(trail);
    }

    render() {
        const keyName = this.props.keyName;

        let classNames = ["json-key"];

        let hoverTrail = this.props.hoverTrail;
        let depth = this.props.depth;
        let trail = this.props.trail;

        let hovered = true;
        for(let t in trail){
            if(trail[t] !== hoverTrail[t]){
                hovered = false;
                break;
            }
        }

        if(hovered){
            classNames.push("hovered");
        }

        return (
            <span className={classNames.join(" ")}
                  onMouseOver={this.handleHover.bind(this)}>"{keyName}"</span>
        )
    }
}

export default class JsonBranch extends Component {
    componentWillMount() {
        this.setState({visible: true});
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

            let trail = this.props.trail;

            return (
                <li key={key}>
                    <JsonBranch setHoverTrail={this.props.setHoverTrail}
                                hoverTrail={this.props.hoverTrail}
                                trail={trail}
                                branch={branch[key]}
                                depth={this.props.depth}
                                key={key}/>
                    {comma}
                </li>
            )
        });
        return <ul>{elements}</ul>;
    }

    getObject(branch, keys) {
        let elements = _.map(keys, key => {
            let comma = keys.slice(-1)[0] !== key ? <span className="json-punctuation">,</span> : false;
            let trail = this.props.trail.concat(key);
            return (
                <li key={key}>
                    <JsonKey keyName={key}
                             setHoverTrail={this.props.setHoverTrail}
                             hoverTrail={this.props.hoverTrail}
                             depth={this.props.depth}
                             trail={trail}/>
                    <span className="json-punctuation">:</span>&nbsp;
                    <JsonBranch setHoverTrail={this.props.setHoverTrail}
                                hoverTrail={this.props.hoverTrail}
                                trail={trail}
                                depth={this.props.depth+1}
                                branch={branch[key]}
                                key={key}/>
                    {comma}
                </li>
            )
        });
        return <ul>{elements}</ul>;
    }

    toggleButton() {
        return <button className="toggle" onClick={this.toggleVisibility.bind(this)}>{this.displayVisibility()}</button>
    }

    getPair(branch, keys) {
        switch (Object.prototype.toString.call(branch)) {
            case "[object Array]":
                return <span className="json-array">
                            {this.toggleButton()}
                    <span className="json-bracket">{"["}</span>
                    {this.getArray(branch, keys)}
                    <span className="json-bracket">{"]"}</span>
                        </span>;
            case "[object Object]":
                return <span className="json-object">
                            {this.toggleButton()}
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
    }

    render() {
        const branch = this.props.branch;
        let keys = Object.keys(branch);

        let classNames = ["json-branch"];

        if (!this.state.visible) {
            classNames.push("hidden");
        }

        let pair = this.getPair(branch, keys);

        return (
            <span className={classNames.join(" ")}>
                    {pair}
            </span>
        )
    }
}