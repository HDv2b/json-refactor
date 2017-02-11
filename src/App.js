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
                        <span>{key}: {function(){
                            switch(typeof(branch[key])){
                                case "object":
                                    return <span>{"{"}<JsonBranch branch={branch[key]} />{"}"}</span>;
                                case "array":
                                    return <span>{"["}<JsonBranch branch={branch[key]} />{"]"}</span>;
                                default:
                                    return <span>{branch[key]}</span>
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
