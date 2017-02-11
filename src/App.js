/**
 * Created by Hussein on 10/02/2017.
 */
import React, { Component } from 'react';
import _ from "lodash";

class JsonBranch extends Component {
    render() {
        const branch = this.props.branch;

        let keys = Object.keys(branch);

        return (
            <ul className="json-branch">
                {_.map(keys,key =>
                    <li key={key}>
                        <span>
                            <span className="json-key">"{key}"</span><span className="json-punctuation">:</span> {function(){
                            //switch(typeof(branch[key])){
                            switch(true){
                                case Array.isArray(branch[key]):
                                    return <span className="json-array">
                                        <span className="json-bracket">{"["}</span>
                                        <JsonBranch branch={branch[key]} />
                                        <span className="json-bracket">{"]"}</span>
                                    </span>;
                                case typeof(branch[key]) === "object":
                                    return <span className="json-object">
                                        <span className="json-bracket">{"{"}</span>
                                        <JsonBranch branch={branch[key]} />
                                        <span className="json-bracket">{"}"}</span>
                                    </span>;
                                case typeof(branch[key]) === "number":
                                    return <span className="json-number">{branch[key]}</span>;
                                default:
                                    return <span className="json-string">"{branch[key]}"</span>
                        }}()}</span>
                    </li>
                )}
            </ul>
        )
    }
}

class App extends Component {
    constructor(){
        super();
        this.state =  {jsonInput : {}};
    }

    initJson(e){
        this.setState({jsonInput : JSON.parse(e.target.value)});
    }

    render() {

        return (
            <div>
                <textarea name="" id="input" cols="30" rows="10" onChange={this.initJson.bind(this)}></textarea>
                <div id="json-parsed">
                    <JsonBranch branch={this.state.jsonInput} />
                </div>
                <textarea name="" id="output" cols="30" rows="10"></textarea>
            </div>
        );
    }
}

export default App;
