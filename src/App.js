/**
 * Created by Hussein on 10/02/2017.
 */
import React, {Component} from 'react';
import _ from "lodash";
import Breadcrumbs from "./components/Breadcrumbs";
import JsonBranch from './components/JsonBranch';

class App extends Component {
    constructor() {
        super();
        this.state = {
            jsonInput: {}
        };
    }

    initJson(e) {
        this.setState({jsonInput: JSON.parse(e.target.value)});
    }

    render() {
        return (
            <div>
                <textarea name="" id="input" cols="30" rows="10" onChange={this.initJson.bind(this)}/>
                <Breadcrumbs activeTrail={this.state.activeTrail} hoverTrail={this.state.hoverTrail}/>
                <div id="json-parsed">
                    <JsonBranch branch={this.state.jsonInput}
                                onClick={this.handleClick}
                                onMouseOver={this.handleHover}
                    />
                </div>
                <textarea name="" id="output" cols="30" rows="10"/>
            </div>
        );
    }
}

export default App;
