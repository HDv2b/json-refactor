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
            jsonInput: {},
            hoverTrail: [],
            activeTrail: []
        };
    }

    initJson(e) {
        try{
            this.setState({jsonInput: JSON.parse(e.target.value)});
        } catch(e) {
            console.log("invalid json");
        }
    }

    setHoverTrail(data){
        console.log(data);
        this.setState({hoverTrail: data});
    };

    setActiveTrail(data){

    };

    render() {
        return (
            <div>
                <textarea name="" id="input" cols="30" rows="10" onChange={this.initJson.bind(this)}/>
                <Breadcrumbs activeTrail={this.state.activeTrail} hoverTrail={this.state.hoverTrail}/>
                <div id="json-parsed">
                    <JsonBranch branch={this.state.jsonInput} setHoverTrail={this.setHoverTrail.bind(this)} trail={[]}/>
                </div>
                <textarea name="" id="output" cols="30" rows="10"/>
            </div>
        );
    }
}

export default App;
