/**
 * Created by Hussein on 10/02/2017.
 */
import React, {Component} from 'react';
import _ from "lodash";
import Breadcrumbs from "./components/Breadcrumbs";
import JsonBranch from './components/JsonBranch';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
window.Perf = require('react-addons-perf');

class App extends Component {
    constructor() {
        super();
        this.state = {
            jsonInput: {},
            hoverTrail: [],
            activeTrail: [],
            transformations: []
        };
    }

    initJson(e) {
        try {
            this.setState({jsonInput: JSON.parse(e.target.value)});
        } catch (e) {
            console.log("invalid json");
        }
    }

    setHoverTrail(data) {
        this.setState({hoverTrail: data});
    };

    setActiveTrail(data) {

    };

    setTab(name) {
        this.setState({tab: name});
    }

    render() {
        return (
            <Tabs
                onSelect={this.handleSelect}
                selectedIndex={2}>
                <TabList>
                    <Tab className="tab-header">Input</Tab>
                    <Tab className="tab-header">Edit</Tab>
                    <Tab className="tab-header">Output</Tab>
                </TabList>

                <TabPanel>
                    <textarea name="" id="input" cols="30" rows="10" onChange={this.initJson.bind(this)}/>
                </TabPanel>

                <TabPanel>
                    <Breadcrumbs className="ide-breadcrumbs" activeTrail={this.state.activeTrail}
                                 hoverTrail={this.state.hoverTrail}/>
                    <div id="json-parsed" className="ide-json">
                        <JsonBranch branch={this.state.jsonInput}
                                    setHoverTrail={this.setHoverTrail.bind(this)}
                                    depth={0}
                                    hoverTrail={this.state.hoverTrail}
                                    trail={[]}
                        />
                    </div>
                    <div className="ide-transformations">
                        <h1>Transformations</h1>
                        <ul>

                        </ul>
                    </div>
                </TabPanel>

                <TabPanel>
                    <textarea name="" id="output" cols="30" rows="10"/>
                </TabPanel>
            </Tabs>
        );
    }
}

export default App;
